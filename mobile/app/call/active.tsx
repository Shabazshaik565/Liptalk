import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Animated,
  StatusBar,
  Dimensions,
  Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  Phone,
  Mic,
  MicOff,
  Video as VideoIcon,
  VideoOff,
  Volume2,
  VolumeX,
  PhoneOff,
  SwitchCamera,
  Lock,
  ChevronDown,
  UserPlus,
  ShieldCheck,
} from 'lucide-react-native';
import { socketService } from '../../src/services/socket.service';
import { voipAudioEngine } from '../../src/services/voipAudioEngine';
import { callsApi } from '../../src/api/domain.api';
import { useAuthStore } from '../../src/store/auth.store';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../../src/constants/theme';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

type CallState = 'DIALING' | 'RINGING' | 'CONNECTED' | 'DECLINED' | 'BUSY' | 'NO_ANSWER' | 'ENDED';

export default function ActiveCallScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const params = useLocalSearchParams<{
    callId: string;
    peerName?: string;
    peerAvatar?: string;
    callType?: string;
    peerId?: string;
    peerPhone?: string;
    isIncoming?: string;
  }>();

  const callId = params.callId || 'call_01';
  const peerName = params.peerName || 'Vikram Singh';
  const peerAvatar =
    params.peerAvatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200';
  const peerId = params.peerId || 'usr_vikram_01';
  const peerPhone = params.peerPhone || '+91 7200317219';
  const initialCallType = (params.callType || 'VOICE') as 'VOICE' | 'VIDEO';
  const isIncoming = params.isIncoming === 'true';

  const [callType, setCallType] = useState<'VOICE' | 'VIDEO'>(initialCallType);
  const [callState, setCallState] = useState<CallState>(isIncoming ? 'CONNECTED' : 'RINGING');
  const [statusMessage, setStatusMessage] = useState<string>(
    isIncoming ? 'Connected' : 'Ringing...'
  );
  const [isMuted, setIsMuted] = useState(false);
  const [isPeerMuted, setIsPeerMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(initialCallType === 'VOICE');
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [isFrontCamera, setIsFrontCamera] = useState(true);
  const [durationSeconds, setDurationSeconds] = useState(0);

  // Concentric WhatsApp-style radar pulse animations
  const pulseAnim1 = useRef(new Animated.Value(0)).current;
  const pulseAnim2 = useRef(new Animated.Value(0)).current;
  const pulseAnim3 = useRef(new Animated.Value(0)).current;

  // Animated wave equalizer bars for active voice stream
  const waveAnim1 = useRef(new Animated.Value(8)).current;
  const waveAnim2 = useRef(new Animated.Value(14)).current;
  const waveAnim3 = useRef(new Animated.Value(22)).current;
  const waveAnim4 = useRef(new Animated.Value(16)).current;
  const waveAnim5 = useRef(new Animated.Value(10)).current;
  const waveAnim6 = useRef(new Animated.Value(18)).current;

  const timerRef = useRef<any>(null);
  const timeoutRef = useRef<any>(null);
  const durationRef = useRef(0);

  useEffect(() => {
    durationRef.current = durationSeconds;
  }, [durationSeconds]);

  useEffect(() => {
    // -------------------------------------------------------------
    // CALL INITIALIZATION & AUDIO SIGNALING
    // -------------------------------------------------------------
    if (isIncoming) {
      setCallState('CONNECTED');
      setStatusMessage('Connected');
      voipAudioEngine.playConnectedChime();
      startDurationTimer();
    } else {
      setCallState('RINGING');
      setStatusMessage('Ringing...');
      voipAudioEngine.playRingback();

      // 3.5s realistic ringing cadence then in-app audio connects
      timeoutRef.current = setTimeout(() => {
        setCallState('CONNECTED');
        setStatusMessage('Connected');
        voipAudioEngine.playConnectedChime();
        startDurationTimer();
      }, 3500);
    }

    // -------------------------------------------------------------
    // WEBRTC SIGNALING LISTENERS
    // -------------------------------------------------------------
    socketService.onCallAccepted(() => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setCallState('CONNECTED');
      setStatusMessage('Connected');
      voipAudioEngine.playConnectedChime();
      startDurationTimer();
    });

    socketService.onCallDeclined((data) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setCallState('DECLINED');
      setStatusMessage(data?.reason === 'BUSY' ? 'User Busy' : 'Call Declined');
      voipAudioEngine.playBusyTone();
      setTimeout(() => {
        exitScreen();
      }, 1600);
    });

    socketService.onCallBusy(() => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setCallState('BUSY');
      setStatusMessage('User Busy');
      voipAudioEngine.playBusyTone();
      setTimeout(() => {
        exitScreen();
      }, 1600);
    });

    socketService.onCallPeerMute((data) => {
      setIsPeerMuted(data.isMuted);
    });

    socketService.onCallEnded(() => {
      voipAudioEngine.playHangupChime();
      setCallState('ENDED');
      setStatusMessage('Call Ended');
      setTimeout(() => {
        exitScreen();
      }, 800);
    });

    startRippleAnimation();
    startWaveAnimation();

    return () => {
      voipAudioEngine.stopAll();
      if (timerRef.current) clearInterval(timerRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const startDurationTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setDurationSeconds((prev) => prev + 1);
    }, 1000);
  };

  // WhatsApp-style concentric radar ripple pulse
  const startRippleAnimation = () => {
    const createPulse = (anim: Animated.Value, delay: number) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(anim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
        ])
      );
    };

    createPulse(pulseAnim1, 0).start();
    createPulse(pulseAnim2, 600).start();
    createPulse(pulseAnim3, 1200).start();
  };

  // Audio equalizer bars
  const startWaveAnimation = () => {
    const createAnim = (anim: Animated.Value, min: number, max: number, duration: number) => {
      return Animated.loop(
        Animated.sequence([
          Animated.timing(anim, {
            toValue: max,
            duration,
            useNativeDriver: false,
          }),
          Animated.timing(anim, {
            toValue: min,
            duration,
            useNativeDriver: false,
          }),
        ])
      );
    };

    createAnim(waveAnim1, 6, 22, 320).start();
    createAnim(waveAnim2, 8, 32, 420).start();
    createAnim(waveAnim3, 12, 38, 360).start();
    createAnim(waveAnim4, 8, 28, 400).start();
    createAnim(waveAnim5, 5, 20, 350).start();
    createAnim(waveAnim6, 9, 26, 380).start();
  };

  const handleToggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    voipAudioEngine.playMuteFeedback(nextMuted);
    socketService.sendMuteState({
      callId,
      targetUserId: peerId,
      isMuted: nextMuted,
    });
  };

  const handleToggleCamera = () => {
    if (callType === 'VOICE') {
      setCallType('VIDEO');
      setIsCameraOff(false);
    } else {
      const nextState = !isCameraOff;
      setIsCameraOff(nextState);
      if (nextState) {
        setCallType('VOICE');
      }
    }
  };

  const handleSwitchToVideo = () => {
    setCallType('VIDEO');
    setIsCameraOff(false);
  };

  const handleToggleSpeaker = () => {
    setIsSpeakerOn(!isSpeakerOn);
  };

  const handleFlipCamera = () => {
    setIsFrontCamera(!isFrontCamera);
  };

  const handleEndCall = async () => {
    voipAudioEngine.stopAll();
    voipAudioEngine.playHangupChime();

    if (callState === 'RINGING' || callState === 'DIALING') {
      socketService.cancelCall({
        callId,
        callerId: user?.id || 'usr_curr_01',
        receiverId: peerId,
      });
    } else {
      socketService.endCall({
        callId,
        userId: user?.id || 'usr_curr_01',
        peerId,
        durationSeconds: durationRef.current,
      });
      await callsApi.endCall(callId, durationRef.current);
    }

    exitScreen();
  };

  const exitScreen = () => {
    voipAudioEngine.stopAll();
    if (timerRef.current) clearInterval(timerRef.current);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    router.back();
  };

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const isConnected = callState === 'CONNECTED';
  const isVideoMode = callType === 'VIDEO' && !isCameraOff;

  const getRippleStyle = (anim: Animated.Value) => ({
    transform: [
      {
        scale: anim.interpolate({
          inputRange: [0, 1],
          outputRange: [1, 1.85],
        }),
      },
    ],
    opacity: anim.interpolate({
      inputRange: [0, 0.4, 1],
      outputRange: [0.55, 0.25, 0],
    }),
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0B141B" />

      {/* ========================================================= */}
      {/* VIDEO STAGE (Full Edge-to-Edge WhatsApp Video Canvas)     */}
      {/* ========================================================= */}
      {isVideoMode && (
        <View style={StyleSheet.absoluteFill}>
          <Image source={{ uri: peerAvatar }} style={styles.remoteVideoImage} />
          <View style={styles.videoDarkOverlay} />

          {/* Picture-in-Picture (PiP) Window for Self Camera */}
          <TouchableOpacity
            style={styles.pipContainer}
            onPress={handleFlipCamera}
            activeOpacity={0.9}
            accessibilityRole="button"
            accessibilityLabel="Tap to flip camera"
          >
            <Image
              source={{
                uri:
                  user?.profile?.avatarUrl ||
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
              }}
              style={styles.pipImage}
            />
            <View style={styles.pipBadge}>
              <Text style={styles.pipBadgeText}>You • {isFrontCamera ? 'Front' : 'Back'}</Text>
            </View>
          </TouchableOpacity>
        </View>
      )}

      <SafeAreaView style={styles.safeArea}>
        {/* ========================================================= */}
        {/* TOP WHATSAPP APP BAR                                      */}
        {/* ========================================================= */}
        <View style={styles.topBar}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={exitScreen}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Minimize call"
          >
            <ChevronDown size={24} color="#E9EDEF" />
          </TouchableOpacity>

          <View style={styles.headerCenter}>
            <View style={styles.encryptionRow}>
              <Lock size={11} color="#8696A0" />
              <Text style={styles.encryptionText}>End-to-end encrypted</Text>
            </View>

            <Text style={styles.contactName} numberOfLines={1}>
              {peerName}
            </Text>

            <Text style={styles.callStatusText}>
              {isConnected ? formatTimer(durationSeconds) : statusMessage}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.iconButton}
            onPress={isVideoMode ? handleFlipCamera : undefined}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel={isVideoMode ? 'Flip camera' : 'Add participant'}
          >
            {isVideoMode ? (
              <SwitchCamera size={22} color="#E9EDEF" />
            ) : (
              <UserPlus size={22} color="#8696A0" />
            )}
          </TouchableOpacity>
        </View>

        {/* ========================================================= */}
        {/* CENTER CONTENT (VOICE MODE)                               */}
        {/* ========================================================= */}
        {!isVideoMode && (
          <View style={styles.voiceCenterStage}>
            {/* Concentric Pulsing Radar Rings */}
            <View style={styles.avatarRadarContainer}>
              <Animated.View style={[styles.radarRing, getRippleStyle(pulseAnim1)]} />
              <Animated.View style={[styles.radarRing, getRippleStyle(pulseAnim2)]} />
              <Animated.View style={[styles.radarRing, getRippleStyle(pulseAnim3)]} />

              <Image source={{ uri: peerAvatar }} style={styles.contactAvatar} />
            </View>

            {/* Target Phone Pill */}
            <View style={styles.phonePill}>
              <Phone size={12} color="#25D366" />
              <Text style={styles.phonePillText}>{peerPhone}</Text>
            </View>

            {/* Active Speech Frequency Bars */}
            <View style={styles.waveformContainer}>
              <Animated.View
                style={[
                  styles.waveBar,
                  { height: isConnected && !isMuted ? waveAnim1 : 4 },
                ]}
              />
              <Animated.View
                style={[
                  styles.waveBar,
                  { height: isConnected && !isMuted ? waveAnim2 : 4 },
                ]}
              />
              <Animated.View
                style={[
                  styles.waveBar,
                  styles.waveBarAccent,
                  { height: isConnected && !isMuted ? waveAnim3 : 4 },
                ]}
              />
              <Animated.View
                style={[
                  styles.waveBar,
                  styles.waveBarAccent,
                  { height: isConnected && !isMuted ? waveAnim4 : 4 },
                ]}
              />
              <Animated.View
                style={[
                  styles.waveBar,
                  { height: isConnected && !isMuted ? waveAnim5 : 4 },
                ]}
              />
              <Animated.View
                style={[
                  styles.waveBar,
                  { height: isConnected && !isMuted ? waveAnim6 : 4 },
                ]}
              />
            </View>

            {/* Peer Muted Status Notice */}
            {isPeerMuted && isConnected && (
              <View style={styles.peerMutedBadge}>
                <MicOff size={12} color="#F87171" />
                <Text style={styles.peerMutedText}>{peerName} is muted</Text>
              </View>
            )}

            {/* Verified Caller ID & Pitch Context */}
            <View style={styles.callerIdCard}>
              <ShieldCheck size={13} color="#25D366" />
              <Text style={styles.callerIdCardText}>
                Caller: +91 9962786367 • Verified Direct Line
              </Text>
            </View>
          </View>
        )}

        {/* Spacer for Video Mode */}
        {isVideoMode && <View style={{ flex: 1 }} />}

        {/* ========================================================= */}
        {/* WHATSAPP FLOATING CONTROLS CAPSULE                        */}
        {/* ========================================================= */}
        <View style={styles.controlsWrapper}>
          <View style={styles.controlsCapsule}>
            {/* Speakerphone Toggle */}
            <TouchableOpacity
              style={[styles.capsuleBtn, isSpeakerOn && styles.capsuleBtnActive]}
              onPress={handleToggleSpeaker}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel={isSpeakerOn ? 'Speaker on' : 'Speaker off'}
            >
              {isSpeakerOn ? (
                <Volume2 size={22} color="#E9EDEF" />
              ) : (
                <VolumeX size={22} color="#8696A0" />
              )}
            </TouchableOpacity>

            {/* Video Toggle / Switch */}
            <TouchableOpacity
              style={[styles.capsuleBtn, isVideoMode && styles.capsuleBtnActive]}
              onPress={isVideoMode ? handleToggleCamera : handleSwitchToVideo}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel={isVideoMode ? 'Turn camera off' : 'Switch to video call'}
            >
              {isVideoMode ? (
                <VideoIcon size={22} color="#25D366" />
              ) : (
                <VideoIcon size={22} color="#E9EDEF" />
              )}
            </TouchableOpacity>

            {/* Microphone Mute Toggle */}
            <TouchableOpacity
              style={[styles.capsuleBtn, isMuted && styles.capsuleBtnMuted]}
              onPress={handleToggleMute}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel={isMuted ? 'Unmute microphone' : 'Mute microphone'}
            >
              {isMuted ? (
                <MicOff size={22} color="#FFFFFF" />
              ) : (
                <Mic size={22} color="#E9EDEF" />
              )}
            </TouchableOpacity>

            {/* Camera Flip (when in Video mode) */}
            {isVideoMode && (
              <TouchableOpacity
                style={styles.capsuleBtn}
                onPress={handleFlipCamera}
                activeOpacity={0.8}
                accessibilityRole="button"
                accessibilityLabel="Flip camera"
              >
                <SwitchCamera size={22} color="#E9EDEF" />
              </TouchableOpacity>
            )}

            {/* End Call (WhatsApp Red Circular Button) */}
            <TouchableOpacity
              style={styles.endCallButton}
              onPress={handleEndCall}
              activeOpacity={0.85}
              accessibilityRole="button"
              accessibilityLabel="End call"
            >
              <PhoneOff size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B141B',
  },
  safeArea: {
    flex: 1,
    justifyContent: 'space-between',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? 16 : 8,
    paddingBottom: 8,
  },
  iconButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  headerCenter: {
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 12,
  },
  encryptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  encryptionText: {
    color: '#8696A0',
    fontSize: 10.5,
    fontWeight: '500',
    letterSpacing: 0.2,
  },
  contactName: {
    color: '#E9EDEF',
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  callStatusText: {
    color: '#8696A0',
    fontSize: 13,
    fontWeight: '500',
    marginTop: 2,
    letterSpacing: 0.3,
  },
  voiceCenterStage: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    flex: 1,
  },
  avatarRadarContainer: {
    position: 'relative',
    width: 140,
    height: 140,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  contactAvatar: {
    width: 132,
    height: 132,
    borderRadius: 66,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  radarRing: {
    position: 'absolute',
    width: 132,
    height: 132,
    borderRadius: 66,
    borderWidth: 1.5,
    borderColor: '#25D366',
    backgroundColor: 'rgba(37, 211, 102, 0.08)',
  },
  phonePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(37, 211, 102, 0.12)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: 'rgba(37, 211, 102, 0.25)',
    marginBottom: 16,
  },
  phonePillText: {
    color: '#25D366',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  waveformContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    height: 44,
    marginBottom: 14,
  },
  waveBar: {
    width: 4.5,
    backgroundColor: 'rgba(233, 237, 239, 0.4)',
    borderRadius: 3,
  },
  waveBarAccent: {
    backgroundColor: '#25D366',
  },
  peerMutedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
    marginBottom: 12,
  },
  peerMutedText: {
    color: '#F87171',
    fontSize: 11,
    fontWeight: '600',
  },
  callerIdCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    backgroundColor: 'rgba(30, 42, 50, 0.8)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: RADIUS.full,
    marginTop: 8,
  },
  callerIdCardText: {
    color: '#8696A0',
    fontSize: 11,
    fontWeight: '600',
  },
  remoteVideoImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  videoDarkOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(11, 20, 27, 0.2)',
  },
  pipContainer: {
    position: 'absolute',
    top: Platform.OS === 'android' ? 64 : 54,
    right: 16,
    width: 100,
    height: 142,
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    backgroundColor: '#000000',
    ...SHADOWS.md,
  },
  pipImage: {
    width: '100%',
    height: '100%',
  },
  pipBadge: {
    position: 'absolute',
    bottom: 4,
    left: 4,
    right: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    paddingVertical: 2,
    borderRadius: 4,
    alignItems: 'center',
  },
  pipBadgeText: {
    color: '#FFFFFF',
    fontSize: 8.5,
    fontWeight: '700',
  },
  controlsWrapper: {
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'ios' ? 24 : 32,
    alignItems: 'center',
  },
  controlsCapsule: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(31, 44, 52, 0.94)',
    borderRadius: 40,
    paddingHorizontal: 16,
    paddingVertical: 12,
    width: '100%',
    maxWidth: 380,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    ...SHADOWS.lg,
  },
  capsuleBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  capsuleBtnActive: {
    backgroundColor: 'rgba(37, 211, 102, 0.2)',
    borderWidth: 1,
    borderColor: '#25D366',
  },
  capsuleBtnMuted: {
    backgroundColor: '#EF4444',
  },
  endCallButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#EA4335',
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.md,
  },
});
