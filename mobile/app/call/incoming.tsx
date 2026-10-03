import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Animated,
  StatusBar,
  Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Phone, PhoneOff, Video, Lock, ShieldCheck } from 'lucide-react-native';
import { socketService } from '../../src/services/socket.service';
import { voipAudioEngine } from '../../src/services/voipAudioEngine';
import { useAuthStore } from '../../src/store/auth.store';
import { RADIUS, SHADOWS } from '../../src/constants/theme';

export default function IncomingCallScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const params = useLocalSearchParams<{
    callId: string;
    callerId?: string;
    callerName?: string;
    callerAvatar?: string;
    callType?: string;
    callerHeadline?: string;
    callerPhone?: string;
  }>();

  const callId = params.callId || 'call_01';
  const callerId = params.callerId || 'usr_vikram_01';
  const callerName = params.callerName || 'Vikram Singh';
  const callerAvatar =
    params.callerAvatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200';
  const callerPhone = params.callerPhone || '+91 7200317219';
  const callType = (params.callType || 'VOICE') as 'VOICE' | 'VIDEO';
  const callerHeadline = params.callerHeadline || 'Founder & CEO @ FinFlow Logistics Tech';

  // WhatsApp-style concentric expanding radar rings
  const pulseAnim1 = useRef(new Animated.Value(0)).current;
  const pulseAnim2 = useRef(new Animated.Value(0)).current;
  const pulseAnim3 = useRef(new Animated.Value(0)).current;

  // Subtle button pulse
  const btnPulse = useRef(new Animated.Value(1)).current;

  const timeoutRef = useRef<any>(null);

  useEffect(() => {
    // Start authentic melodic ringtone
    voipAudioEngine.playRingtone();

    // Start triple concentric radar pulse
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

    // Button pulse
    Animated.loop(
      Animated.sequence([
        Animated.timing(btnPulse, {
          toValue: 1.08,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(btnPulse, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // 30-second timeout for missed call
    timeoutRef.current = setTimeout(() => {
      handleDecline('MISSED');
    }, 30000);

    // If caller cancels while ringing
    socketService.onCallCancelled((data: { callId: string }) => {
      if (data.callId === callId) {
        cleanupAndExit();
      }
    });

    socketService.onCallEnded(() => {
      cleanupAndExit();
    });

    return () => {
      voipAudioEngine.stopAll();
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [callId]);

  const cleanupAndExit = () => {
    voipAudioEngine.stopAll();
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    router.back();
  };

  const handleAccept = () => {
    voipAudioEngine.stopAll();
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    socketService.acceptCall({
      callId,
      userId: user?.id || 'usr_curr_01',
      callerId,
    });

    router.replace({
      pathname: '/call/active' as any,
      params: {
        callId,
        peerId: callerId,
        peerName: callerName,
        peerAvatar: callerAvatar,
        peerPhone: callerPhone,
        callType,
        isIncoming: 'true',
      },
    });
  };

  const handleDecline = (reason = 'DECLINED_BY_USER') => {
    voipAudioEngine.stopAll();
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    socketService.declineCall({
      callId,
      callerId,
      reason,
    });
    router.back();
  };

  const getRippleStyle = (anim: Animated.Value) => ({
    transform: [
      {
        scale: anim.interpolate({
          inputRange: [0, 1],
          outputRange: [1, 1.9],
        }),
      },
    ],
    opacity: anim.interpolate({
      inputRange: [0, 0.4, 1],
      outputRange: [0.5, 0.2, 0],
    }),
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0B141B" />

      <SafeAreaView style={styles.safeArea}>
        {/* Top Header */}
        <View style={styles.header}>
          <View style={styles.encryptionBadge}>
            <Lock size={12} color="#8696A0" />
            <Text style={styles.encryptionText}>End-to-end encrypted</Text>
          </View>
          <Text style={styles.callTypeHeading}>
            {callType === 'VIDEO' ? 'Incoming video call' : 'Incoming voice call'}
          </Text>
        </View>

        {/* Center Caller Info & Pulsing Avatar */}
        <View style={styles.centerSection}>
          <View style={styles.avatarWrapper}>
            <Animated.View style={[styles.pulseRing, getRippleStyle(pulseAnim1)]} />
            <Animated.View style={[styles.pulseRing, getRippleStyle(pulseAnim2)]} />
            <Animated.View style={[styles.pulseRing, getRippleStyle(pulseAnim3)]} />

            <Image source={{ uri: callerAvatar }} style={styles.avatar} />

            <View style={styles.typeBadge}>
              {callType === 'VIDEO' ? (
                <Video size={14} color="#FFFFFF" />
              ) : (
                <Phone size={14} color="#FFFFFF" />
              )}
            </View>
          </View>

          <Text style={styles.callerName}>{callerName}</Text>

          <View style={styles.phonePill}>
            <Phone size={11} color="#25D366" />
            <Text style={styles.phonePillText}>{callerPhone}</Text>
          </View>

          <Text style={styles.callerHeadline} numberOfLines={2}>
            {callerHeadline}
          </Text>

          <View style={styles.verifiedCard}>
            <ShieldCheck size={12} color="#25D366" />
            <Text style={styles.verifiedCardText}>
              LipTalk Direct VoIP • Zero Cellular Tolls
            </Text>
          </View>
        </View>

        {/* WhatsApp-Style Action Buttons */}
        <View style={styles.actionsContainer}>
          {/* Decline Button */}
          <View style={styles.actionCol}>
            <TouchableOpacity
              style={[styles.actionButton, styles.declineBtn]}
              onPress={() => handleDecline('DECLINED_BY_USER')}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel="Decline call"
            >
              <PhoneOff size={28} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.actionLabel}>Decline</Text>
          </View>

          {/* Accept Button */}
          <View style={styles.actionCol}>
            <Animated.View style={{ transform: [{ scale: btnPulse }] }}>
              <TouchableOpacity
                style={[styles.actionButton, styles.acceptBtn]}
                onPress={handleAccept}
                activeOpacity={0.8}
                accessibilityRole="button"
                accessibilityLabel="Accept call"
              >
                {callType === 'VIDEO' ? (
                  <Video size={28} color="#FFFFFF" />
                ) : (
                  <Phone size={28} color="#FFFFFF" />
                )}
              </TouchableOpacity>
            </Animated.View>
            <Text style={styles.actionLabel}>Accept</Text>
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
    paddingVertical: Platform.OS === 'android' ? 24 : 16,
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
    paddingTop: 8,
  },
  encryptionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 6,
  },
  encryptionText: {
    color: '#8696A0',
    fontSize: 11,
    fontWeight: '500',
  },
  callTypeHeading: {
    color: '#8696A0',
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  centerSection: {
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  avatarWrapper: {
    position: 'relative',
    width: 140,
    height: 140,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 2.5,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  pulseRing: {
    position: 'absolute',
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 2,
    borderColor: '#25D366',
    backgroundColor: 'rgba(37, 211, 102, 0.08)',
  },
  typeBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    backgroundColor: '#25D366',
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#0B141B',
  },
  callerName: {
    color: '#E9EDEF',
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 6,
    textAlign: 'center',
    letterSpacing: 0.2,
  },
  phonePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(37, 211, 102, 0.12)',
    paddingHorizontal: 12,
    paddingVertical: 4.5,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: 'rgba(37, 211, 102, 0.25)',
    marginBottom: 10,
  },
  phonePillText: {
    color: '#25D366',
    fontSize: 12.5,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  callerHeadline: {
    color: '#8696A0',
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 16,
    maxWidth: 280,
    lineHeight: 18,
  },
  verifiedCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(30, 42, 50, 0.7)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
  },
  verifiedCardText: {
    color: '#8696A0',
    fontSize: 10.5,
    fontWeight: '600',
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: 30,
    paddingBottom: Platform.OS === 'ios' ? 20 : 32,
  },
  actionCol: {
    alignItems: 'center',
    gap: 8,
  },
  actionButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 68,
    height: 68,
    borderRadius: 34,
    ...SHADOWS.lg,
  },
  declineBtn: {
    backgroundColor: '#EA4335',
  },
  acceptBtn: {
    backgroundColor: '#25D366',
  },
  actionLabel: {
    color: '#E9EDEF',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
});
