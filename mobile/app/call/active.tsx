import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  Mic,
  MicOff,
  Video as VideoIcon,
  VideoOff,
  Volume2,
  VolumeX,
  PhoneOff,
  SwitchCamera,
  ShieldCheck,
} from 'lucide-react-native';
import { socketService } from '../../src/services/socket.service';
import { callsApi } from '../../src/api/domain.api';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../../src/constants/theme';

export default function ActiveCallScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    callId: string;
    peerName?: string;
    peerAvatar?: string;
    callType?: string;
    peerId?: string;
  }>();

  const callId = params.callId || 'call_01';
  const peerName = params.peerName || 'Vikram Singh';
  const peerAvatar = params.peerAvatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200';
  const peerId = params.peerId || 'usr_vikram_01';
  const initialCallType = params.callType || 'VOICE';

  const [callType, setCallType] = useState<'VOICE' | 'VIDEO'>(initialCallType as any);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(initialCallType === 'VOICE');
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [durationSeconds, setDurationSeconds] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setDurationSeconds((prev) => prev + 1);
    }, 1000);

    socketService.onCallEnded(() => {
      router.back();
    });

    return () => clearInterval(timer);
  }, []);

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleEndCall = async () => {
    socketService.endCall({
      callId,
      userId: 'usr_curr_01',
      peerId,
      durationSeconds,
    });
    await callsApi.endCall(callId, durationSeconds);
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Header info */}
      <View style={styles.header}>
        <View style={styles.securityBadge}>
          <ShieldCheck size={13} color={COLORS.accent} />
          <Text style={styles.securityBadgeText}>ENCRYPTED 1:1 CALL</Text>
        </View>
        <Text style={styles.timerText}>{formatTimer(durationSeconds)}</Text>
      </View>

      {/* Main Viewport */}
      {callType === 'VIDEO' && !isCameraOff ? (
        <View style={styles.videoStage}>
          <Image source={{ uri: peerAvatar }} style={styles.videoStreamImage} />
          <View style={styles.videoOverlay}>
            <Text style={styles.videoPeerName}>{peerName}</Text>
            <Text style={styles.videoPeerStatus}>HD 60fps • WebRTC Peer Connected</Text>
          </View>

          {/* Self View Picture-in-Picture */}
          <View style={styles.selfPip}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150' }}
              style={styles.selfPipImage}
            />
            <Text style={styles.selfPipLabel}>You</Text>
          </View>
        </View>
      ) : (
        <View style={styles.audioStage}>
          <View style={styles.avatarWrapper}>
            <Image source={{ uri: peerAvatar }} style={styles.avatar} />
            <View style={styles.pulseRing} />
          </View>
          <Text style={styles.peerName}>{peerName}</Text>
          <Text style={styles.connectionStatus}>Audio Connected • 16kHz High-Fidelity</Text>

          {/* Simulated Waveform Bar */}
          <View style={styles.waveformContainer}>
            <View style={[styles.waveBar, { height: 18 }]} />
            <View style={[styles.waveBar, { height: 32 }]} />
            <View style={[styles.waveBar, { height: 24 }]} />
            <View style={[styles.waveBar, { height: 40 }]} />
            <View style={[styles.waveBar, { height: 16 }]} />
            <View style={[styles.waveBar, { height: 28 }]} />
          </View>
        </View>
      )}

      {/* Bottom Controls Bar */}
      <View style={styles.controlsBar}>
        <TouchableOpacity
          style={[styles.controlBtn, isMuted && styles.controlBtnActive]}
          onPress={() => setIsMuted(!isMuted)}
          activeOpacity={0.8}
        >
          {isMuted ? <MicOff size={22} color="#FFF" /> : <Mic size={22} color="#FFF" />}
          <Text style={styles.controlLabel}>{isMuted ? 'Unmute' : 'Mute'}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.controlBtn, isCameraOff && styles.controlBtnActive]}
          onPress={() => {
            if (callType === 'VOICE') setCallType('VIDEO');
            setIsCameraOff(!isCameraOff);
          }}
          activeOpacity={0.8}
        >
          {isCameraOff ? (
            <VideoOff size={22} color="#FFF" />
          ) : (
            <VideoIcon size={22} color="#FFF" />
          )}
          <Text style={styles.controlLabel}>{isCameraOff ? 'Camera On' : 'Camera Off'}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.controlBtn, !isSpeakerOn && styles.controlBtnActive]}
          onPress={() => setIsSpeakerOn(!isSpeakerOn)}
          activeOpacity={0.8}
        >
          {isSpeakerOn ? <Volume2 size={22} color="#FFF" /> : <VolumeX size={22} color="#FFF" />}
          <Text style={styles.controlLabel}>Speaker</Text>
        </TouchableOpacity>

        {callType === 'VIDEO' && !isCameraOff && (
          <TouchableOpacity style={styles.controlBtn} activeOpacity={0.8}>
            <SwitchCamera size={22} color="#FFF" />
            <Text style={styles.controlLabel}>Flip</Text>
          </TouchableOpacity>
        )}

        {/* End Call Button */}
        <TouchableOpacity
          style={styles.endCallBtn}
          onPress={handleEndCall}
          activeOpacity={0.8}
        >
          <PhoneOff size={24} color="#FFF" />
          <Text style={styles.controlLabel}>End</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#090514',
    justifyContent: 'space-between',
    paddingVertical: SPACING.md,
  },
  header: {
    alignItems: 'center',
    paddingTop: SPACING.md,
    gap: 8,
  },
  securityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  securityBadgeText: {
    color: COLORS.accent,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  timerText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  audioStage: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.xl,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: SPACING.xl,
  },
  avatar: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 3,
    borderColor: COLORS.primaryLight,
  },
  pulseRing: {
    position: 'absolute',
    top: -10,
    left: -10,
    right: -10,
    bottom: -10,
    borderRadius: 80,
    borderWidth: 1.5,
    borderColor: 'rgba(139, 92, 246, 0.3)',
  },
  peerName: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '900',
    marginBottom: 6,
    textAlign: 'center',
  },
  connectionStatus: {
    color: COLORS.textDim,
    fontSize: 12.5,
    marginBottom: SPACING.xl,
  },
  waveformContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    height: 44,
  },
  waveBar: {
    width: 4,
    backgroundColor: COLORS.primaryLight,
    borderRadius: 2,
  },
  videoStage: {
    flex: 1,
    marginHorizontal: SPACING.md,
    borderRadius: RADIUS.xl,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: COLORS.bgCard,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  videoStreamImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  videoOverlay: {
    position: 'absolute',
    bottom: SPACING.md,
    left: SPACING.md,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADIUS.md,
  },
  videoPeerName: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '800',
  },
  videoPeerStatus: {
    color: COLORS.accent,
    fontSize: 10,
    fontWeight: '600',
  },
  selfPip: {
    position: 'absolute',
    top: SPACING.md,
    right: SPACING.md,
    width: 90,
    height: 130,
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: COLORS.primaryLight,
    backgroundColor: '#000',
  },
  selfPipImage: {
    width: '100%',
    height: '100%',
  },
  selfPipLabel: {
    position: 'absolute',
    bottom: 4,
    right: 6,
    color: '#FFF',
    fontSize: 9,
    fontWeight: '700',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 4,
    borderRadius: 3,
  },
  controlsBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(23, 15, 41, 0.95)',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.sm,
    borderRadius: RADIUS.full,
    marginHorizontal: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  controlBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: COLORS.bgCard,
  },
  controlBtnActive: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    borderWidth: 1,
    borderColor: COLORS.danger,
  },
  endCallBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: COLORS.danger,
  },
  controlLabel: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '700',
    marginTop: 2,
  },
});
