import { Platform } from 'react-native';
import { socketService } from './socket.service';

// Dynamically import react-native-webrtc on native platforms
let webrtcModule: any = null;
if (Platform.OS !== 'web') {
  try {
    webrtcModule = require('react-native-webrtc');
  } catch (err) {
    console.warn('react-native-webrtc native module not available, fallback to mock/web', err);
  }
}

export interface RTCIceServerConfig {
  urls: string | string[];
  username?: string;
  credential?: string;
}

export const DEFAULT_ICE_SERVERS: RTCIceServerConfig[] = [
  { urls: ['stun:stun.l.google.com:19302', 'stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'] },
  {
    urls: 'turn:turn.liptalk.app:3478',
    username: 'liptalk',
    credential: 'liptalk_turn_secret_2026',
  },
];

export type WebRTCConnectionState = 'new' | 'connecting' | 'connected' | 'disconnected' | 'failed' | 'closed';

class WebRTCService {
  private pc: any = null;
  private localStream: any = null;
  private remoteStream: any = null;
  private peerId: string | null = null;
  private isInitiator: boolean = false;
  private callType: 'VOICE' | 'VIDEO' = 'VOICE';
  private iceCandidateQueue: any[] = [];
  private isRemoteDescriptionSet: boolean = false;

  // Event callbacks
  private onLocalStreamCallbacks: Set<(stream: any) => void> = new Set();
  private onRemoteStreamCallbacks: Set<(stream: any) => void> = new Set();
  private onConnectionStateCallbacks: Set<(state: WebRTCConnectionState) => void> = new Set();

  private getPeerConnectionClass(): any {
    if (Platform.OS === 'web') {
      return (window as any).RTCPeerConnection;
    }
    return webrtcModule?.RTCPeerConnection;
  }

  private getSessionDescriptionClass(): any {
    if (Platform.OS === 'web') {
      return (window as any).RTCSessionDescription;
    }
    return webrtcModule?.RTCSessionDescription;
  }

  private getIceCandidateClass(): any {
    if (Platform.OS === 'web') {
      return (window as any).RTCIceCandidate;
    }
    return webrtcModule?.RTCIceCandidate;
  }

  private getMediaDevices(): any {
    if (Platform.OS === 'web') {
      return navigator.mediaDevices;
    }
    return webrtcModule?.mediaDevices;
  }

  /**
   * Initialize a 1-to-1 WebRTC call session
   */
  async initializeCall(params: {
    peerId: string;
    isInitiator: boolean;
    callType: 'VOICE' | 'VIDEO';
    iceServers?: RTCIceServerConfig[];
  }): Promise<{ localStream: any }> {
    this.cleanup();

    this.peerId = params.peerId;
    this.isInitiator = params.isInitiator;
    this.callType = params.callType;
    this.iceCandidateQueue = [];
    this.isRemoteDescriptionSet = false;

    const PeerConnection = this.getPeerConnectionClass();
    const mediaDev = this.getMediaDevices();

    if (!PeerConnection || !mediaDev) {
      console.warn('WebRTC is not supported in this environment');
      return { localStream: null };
    }

    // 1. Capture local audio/video media
    try {
      const constraints = {
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
        video:
          params.callType === 'VIDEO'
            ? {
                facingMode: 'user',
                width: { ideal: 1280 },
                height: { ideal: 720 },
                frameRate: { ideal: 30 },
              }
            : false,
      };

      this.localStream = await mediaDev.getUserMedia(constraints);
      this.notifyLocalStream(this.localStream);
    } catch (err) {
      console.warn('Failed to obtain user media, continuing audio-only or empty stream:', err);
    }

    // 2. Create RTCPeerConnection
    const config = {
      iceServers: params.iceServers || DEFAULT_ICE_SERVERS,
      sdpSemantics: 'unified-plan',
      bundlePolicy: 'max-bundle',
    };

    this.pc = new PeerConnection(config);

    // 3. Attach local tracks to peer connection
    if (this.localStream) {
      this.localStream.getTracks().forEach((track: any) => {
        try {
          this.pc.addTrack(track, this.localStream);
        } catch (e) {
          // Fallback for older addStream API if addTrack not available
          if (typeof this.pc.addStream === 'function') {
            this.pc.addStream(this.localStream);
          }
        }
      });
    }

    // 4. Handle ICE Candidates
    this.pc.onicecandidate = (event: any) => {
      if (event.candidate && this.peerId) {
        const candidatePayload =
          typeof event.candidate.toJSON === 'function'
            ? event.candidate.toJSON()
            : {
                candidate: event.candidate.candidate,
                sdpMid: event.candidate.sdpMid,
                sdpMLineIndex: event.candidate.sdpMLineIndex,
                usernameFragment: event.candidate.usernameFragment,
              };

        socketService.sendCallSignal({
          targetUserId: this.peerId,
          signal: {
            type: 'candidate',
            candidate: candidatePayload,
          },
        });
      }
    };

    // 5. Handle Remote Tracks / Stream
    this.pc.ontrack = (event: any) => {
      if (event.streams && event.streams[0]) {
        this.remoteStream = event.streams[0];
        this.notifyRemoteStream(this.remoteStream);
      } else if (event.track) {
        if (!this.remoteStream) {
          if (Platform.OS === 'web') {
            this.remoteStream = new (window as any).MediaStream();
          } else if (webrtcModule?.MediaStream) {
            this.remoteStream = new webrtcModule.MediaStream();
          }
        }
        if (this.remoteStream) {
          this.remoteStream.addTrack(event.track);
          this.notifyRemoteStream(this.remoteStream);
        }
      }
    };

    // Also support onaddstream for compatibility
    this.pc.onaddstream = (event: any) => {
      if (event.stream) {
        this.remoteStream = event.stream;
        this.notifyRemoteStream(this.remoteStream);
      }
    };

    // 6. Monitor Connection State
    const updateState = () => {
      const state = this.pc?.connectionState || this.pc?.iceConnectionState || 'connecting';
      this.notifyConnectionState(state);
    };

    this.pc.onconnectionstatechange = updateState;
    this.pc.oniceconnectionstatechange = updateState;

    // 7. If Initiator, create and dispatch SDP Offer
    if (this.isInitiator) {
      await this.createAndSendOffer();
    }

    return { localStream: this.localStream };
  }

  /**
   * Create and send SDP Offer
   */
  private async createAndSendOffer() {
    if (!this.pc || !this.peerId) return;

    try {
      const offerOptions = {
        offerToReceiveAudio: true,
        offerToReceiveVideo: this.callType === 'VIDEO',
      };

      const offer = await this.pc.createOffer(offerOptions);
      await this.pc.setLocalDescription(offer);

      socketService.sendCallSignal({
        targetUserId: this.peerId,
        signal: {
          type: 'offer',
          sdp: offer.sdp,
        },
      });
    } catch (err) {
      console.error('Error creating SDP Offer:', err);
    }
  }

  /**
   * Handle incoming WebRTC signaling message
   */
  async handleSignalingMessage(signal: any) {
    if (!signal || !this.pc) return;

    const SessionDescription = this.getSessionDescriptionClass();
    const IceCandidate = this.getIceCandidateClass();

    try {
      if (signal.type === 'offer' && SessionDescription) {
        // Only accept remote offer if in stable state or handling remote offer update
        if (this.pc.signalingState !== 'stable') {
          if (this.pc.signalingState === 'have-local-offer' && this.isInitiator) {
            // Glare tie-breaker: keep local initiator offer
            return;
          }
          try {
            await this.pc.setLocalDescription({ type: 'rollback' });
          } catch (_) {}
        }

        const desc = new SessionDescription({
          type: 'offer',
          sdp: signal.sdp,
        });

        await this.pc.setRemoteDescription(desc);
        this.isRemoteDescriptionSet = true;
        await this.flushQueuedIceCandidates();

        // Create and send SDP Answer
        const answer = await this.pc.createAnswer();
        await this.pc.setLocalDescription(answer);

        if (this.peerId) {
          socketService.sendCallSignal({
            targetUserId: this.peerId,
            signal: {
              type: 'answer',
              sdp: answer.sdp,
            },
          });
        }
      } else if (signal.type === 'answer' && SessionDescription) {
        // Validate that peer connection is actively waiting for an answer
        if (this.pc.signalingState !== 'have-local-offer') {
          // Already in stable state or duplicate answer packet received; safely ignore
          return;
        }

        const desc = new SessionDescription({
          type: 'answer',
          sdp: signal.sdp,
        });

        await this.pc.setRemoteDescription(desc);
        this.isRemoteDescriptionSet = true;
        await this.flushQueuedIceCandidates();
      } else if (signal.type === 'candidate' && IceCandidate && signal.candidate) {
        const candidate = new IceCandidate(signal.candidate);
        if (this.isRemoteDescriptionSet && this.pc.remoteDescription) {
          try {
            await this.pc.addIceCandidate(candidate);
          } catch (e) {
            // Duplicate/stale ICE candidate safely ignored
          }
        } else {
          this.iceCandidateQueue.push(candidate);
        }
      }
    } catch (err) {
      console.warn('Handled WebRTC signaling state transition:', err);
    }
  }

  /**
   * Drain queued ICE candidates once remote description is set
   */
  private async flushQueuedIceCandidates() {
    if (!this.pc) return;
    while (this.iceCandidateQueue.length > 0) {
      const candidate = this.iceCandidateQueue.shift();
      try {
        await this.pc.addIceCandidate(candidate);
      } catch (err) {
        console.warn('Failed to add queued ICE candidate:', err);
      }
    }
  }

  /**
   * Mute / Unmute local microphone audio track
   */
  toggleMute(isMuted: boolean): boolean {
    if (!this.localStream) return false;
    const audioTracks = this.localStream.getAudioTracks();
    audioTracks.forEach((track: any) => {
      track.enabled = !isMuted;
    });
    return isMuted;
  }

  /**
   * Dynamically acquire and attach camera stream if not already active
   */
  async enableVideoCamera(): Promise<any> {
    const mediaDev = this.getMediaDevices();
    if (!mediaDev) return null;

    try {
      if (!this.localStream) {
        this.localStream = await mediaDev.getUserMedia({
          audio: true,
          video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
        });
      } else {
        const existingVideoTracks = this.localStream.getVideoTracks();
        if (existingVideoTracks.length === 0) {
          const videoOnlyStream = await mediaDev.getUserMedia({
            video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
          });
          const newVideoTrack = videoOnlyStream.getVideoTracks()[0];
          if (newVideoTrack) {
            this.localStream.addTrack(newVideoTrack);
            if (this.pc) {
              try {
                this.pc.addTrack(newVideoTrack, this.localStream);
                if (this.isInitiator) {
                  this.createAndSendOffer();
                }
              } catch (_) {}
            }
          }
        } else {
          existingVideoTracks.forEach((t: any) => {
            t.enabled = true;
          });
        }
      }
      this.callType = 'VIDEO';
      this.notifyLocalStream(this.localStream);
      return this.localStream;
    } catch (err) {
      console.warn('Could not acquire video camera:', err);
      return null;
    }
  }

  /**
   * Enable / Disable local video camera track
   */
  async toggleVideo(isCameraOff: boolean): Promise<boolean> {
    if (!this.localStream) {
      if (!isCameraOff) {
        await this.enableVideoCamera();
      }
      return isCameraOff;
    }

    const videoTracks = this.localStream.getVideoTracks();
    if (videoTracks.length === 0 && !isCameraOff) {
      await this.enableVideoCamera();
      return false;
    }

    videoTracks.forEach((track: any) => {
      track.enabled = !isCameraOff;
    });
    this.notifyLocalStream(this.localStream);
    return isCameraOff;
  }

  /**
   * Flip between front and rear cameras
   */
  async switchCamera(): Promise<void> {
    if (!this.localStream) return;
    const videoTracks = this.localStream.getVideoTracks();
    if (videoTracks.length === 0) return;

    const videoTrack = videoTracks[0];
    if (typeof videoTrack._switchCamera === 'function') {
      videoTrack._switchCamera();
    }
  }

  /**
   * Register listeners for streams and connection states
   */
  onLocalStream(callback: (stream: any) => void): () => void {
    this.onLocalStreamCallbacks.add(callback);
    if (this.localStream) callback(this.localStream);
    return () => this.onLocalStreamCallbacks.delete(callback);
  }

  onRemoteStream(callback: (stream: any) => void): () => void {
    this.onRemoteStreamCallbacks.add(callback);
    if (this.remoteStream) callback(this.remoteStream);
    return () => this.onRemoteStreamCallbacks.delete(callback);
  }

  onConnectionStateChange(callback: (state: WebRTCConnectionState) => void): () => void {
    this.onConnectionStateCallbacks.add(callback);
    return () => this.onConnectionStateCallbacks.delete(callback);
  }

  private notifyLocalStream(stream: any) {
    this.onLocalStreamCallbacks.forEach((cb) => cb(stream));
  }

  private notifyRemoteStream(stream: any) {
    this.onRemoteStreamCallbacks.forEach((cb) => cb(stream));
  }

  private notifyConnectionState(state: WebRTCConnectionState) {
    this.onConnectionStateCallbacks.forEach((cb) => cb(state));
  }

  getLocalStream(): any {
    return this.localStream;
  }

  getRemoteStream(): any {
    return this.remoteStream;
  }

  /**
   * Gracefully terminate active WebRTC session and release hardware
   */
  cleanup(): void {
    if (this.localStream) {
      try {
        this.localStream.getTracks().forEach((track: any) => {
          if (typeof track.stop === 'function') track.stop();
        });
      } catch (_) {}
      this.localStream = null;
    }

    if (this.remoteStream) {
      try {
        this.remoteStream.getTracks().forEach((track: any) => {
          if (typeof track.stop === 'function') track.stop();
        });
      } catch (_) {}
      this.remoteStream = null;
    }

    if (this.pc) {
      try {
        this.pc.close();
      } catch (_) {}
      this.pc = null;
    }

    this.peerId = null;
    this.isInitiator = false;
    this.iceCandidateQueue = [];
    this.isRemoteDescriptionSet = false;
  }
}

export const webrtcService = new WebRTCService();
