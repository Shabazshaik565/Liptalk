import { useState, useEffect, useCallback } from 'react';
import { webrtcService, WebRTCConnectionState } from '../services/webrtc.service';
import { socketService } from '../services/socket.service';

export interface UseWebRTCOptions {
  peerId: string;
  isInitiator: boolean;
  callType: 'VOICE' | 'VIDEO';
  onConnected?: () => void;
  onDisconnected?: () => void;
}

export function useWebRTC({
  peerId,
  isInitiator,
  callType,
  onConnected,
  onDisconnected,
}: UseWebRTCOptions) {
  const [localStream, setLocalStream] = useState<any>(null);
  const [remoteStream, setRemoteStream] = useState<any>(null);
  const [connectionState, setConnectionState] = useState<WebRTCConnectionState>('new');
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(callType === 'VOICE');

  useEffect(() => {
    let isMounted = true;

    // Listen to incoming call_signal from socket
    socketService.onCallSignal((payload: any) => {
      if (payload && payload.signal) {
        webrtcService.handleSignalingMessage(payload.signal);
      }
    });

    // Subscribe to WebRTC events
    const unsubLocal = webrtcService.onLocalStream((stream) => {
      if (isMounted) setLocalStream(stream);
    });

    const unsubRemote = webrtcService.onRemoteStream((stream) => {
      if (isMounted) setRemoteStream(stream);
    });

    const unsubState = webrtcService.onConnectionStateChange((state) => {
      if (isMounted) {
        setConnectionState(state);
        if (state === 'connected') {
          onConnected?.();
        } else if (state === 'disconnected' || state === 'failed') {
          onDisconnected?.();
        }
      }
    });

    // Initialize call
    webrtcService
      .initializeCall({
        peerId,
        isInitiator,
        callType,
      })
      .then(({ localStream: stream }) => {
        if (isMounted && stream) {
          setLocalStream(stream);
        }
      })
      .catch((err) => {
        console.error('Failed to initialize WebRTC call:', err);
      });

    return () => {
      isMounted = false;
      unsubLocal();
      unsubRemote();
      unsubState();
      webrtcService.cleanup();
    };
  }, [peerId, isInitiator, callType]);

  const toggleMute = useCallback(() => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    webrtcService.toggleMute(nextMuted);
    return nextMuted;
  }, [isMuted]);

  const toggleCamera = useCallback(() => {
    const nextOff = !isCameraOff;
    setIsCameraOff(nextOff);
    webrtcService.toggleVideo(nextOff);
    return nextOff;
  }, [isCameraOff]);

  const switchCamera = useCallback(async () => {
    await webrtcService.switchCamera();
  }, []);

  return {
    localStream,
    remoteStream,
    connectionState,
    isMuted,
    isCameraOff,
    toggleMute,
    toggleCamera,
    switchCamera,
  };
}
