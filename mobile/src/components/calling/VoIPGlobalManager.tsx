import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Animated,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Phone, PhoneOff, Video, Sparkles } from 'lucide-react-native';
import { socketService } from '../../services/socket.service';
import { voipAudioEngine } from '../../services/voipAudioEngine';
import { useAuthStore } from '../../store/auth.store';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../../constants/theme';

interface IncomingCallPayload {
  callId: string;
  callerId: string;
  callerName: string;
  callerAvatar?: string;
  callerHeadline?: string;
  callerPhone?: string;
  callType: 'VOICE' | 'VIDEO';
  channelId?: string;
}

export const VoIPGlobalManager: React.FC = () => {
  const router = useRouter();
  const { user } = useAuthStore();
  const [incomingCall, setIncomingCall] = useState<IncomingCallPayload | null>(null);

  const slideAnim = useRef(new Animated.Value(-120)).current;
  const timeoutRef = useRef<any>(null);

  useEffect(() => {
    socketService.connect().then(() => {
      // Listen for incoming call event
      socketService.onIncomingCall((data: IncomingCallPayload) => {
        // Prevent receiving self-calls
        if (user?.id && data.callerId === user.id) return;

        setIncomingCall(data);
        voipAudioEngine.playRingtone();

        // Slide down the banner
        Animated.spring(slideAnim, {
          toValue: Platform.OS === 'ios' ? 50 : 20,
          useNativeDriver: true,
          tension: 40,
          friction: 7,
        }).start();

        // 30-second ringing timeout
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
          handleDecline(data.callId, data.callerId, 'MISSED');
        }, 30000);
      });

      // If caller cancels while ringing
      socketService.onCallCancelled((data: { callId: string }) => {
        if (incomingCall && incomingCall.callId === data.callId) {
          dismissBanner();
        }
      });

      socketService.onCallEnded(() => {
        dismissBanner();
      });
    });

    return () => {
      voipAudioEngine.stopAll();
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [user?.id, incomingCall]);

  const dismissBanner = () => {
    voipAudioEngine.stopAll();
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    Animated.timing(slideAnim, {
      toValue: -150,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      setIncomingCall(null);
    });
  };

  const handleAccept = () => {
    if (!incomingCall) return;
    const call = incomingCall;
    dismissBanner();

    socketService.acceptCall({
      callId: call.callId,
      userId: user?.id || 'usr_curr_01',
      callerId: call.callerId,
    });

    router.push({
      pathname: '/call/active' as any,
      params: {
        callId: call.callId,
        peerId: call.callerId,
        peerName: call.callerName,
        peerAvatar: call.callerAvatar,
        peerPhone: call.callerPhone || '+91 7200317219',
        callType: call.callType,
        isIncoming: 'true',
      },
    });
  };

  const handleDecline = (callId?: string, callerId?: string, reason = 'DECLINED_BY_USER') => {
    const cId = callId || incomingCall?.callId;
    const clrId = callerId || incomingCall?.callerId;
    if (cId && clrId) {
      socketService.declineCall({
        callId: cId,
        callerId: clrId,
        reason,
      });
    }
    dismissBanner();
  };

  const handleOpenFullscreen = () => {
    if (!incomingCall) return;
    const call = incomingCall;
    router.push({
      pathname: '/call/incoming' as any,
      params: {
        callId: call.callId,
        callerId: call.callerId,
        callerName: call.callerName,
        callerAvatar: call.callerAvatar,
        callerHeadline: call.callerHeadline,
        callerPhone: call.callerPhone || '+91 7200317219',
        callType: call.callType,
      },
    });
  };

  if (!incomingCall) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <TouchableOpacity
        style={styles.card}
        onPress={handleOpenFullscreen}
        activeOpacity={0.9}
        accessibilityRole="button"
        accessibilityLabel="Incoming call banner"
      >
        <View style={styles.avatarWrap}>
          <Image
            source={{
              uri:
                incomingCall.callerAvatar ||
                'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
            }}
            style={styles.avatar}
          />
          <View style={styles.typeBadge}>
            {incomingCall.callType === 'VIDEO' ? (
              <Video size={10} color="#FFF" />
            ) : (
              <Phone size={10} color="#FFF" />
            )}
          </View>
        </View>

        <View style={styles.infoCol}>
          <Text style={styles.name} numberOfLines={1}>
            {incomingCall.callerName}
          </Text>
          <View style={styles.statusRow}>
            <Sparkles size={11} color={COLORS.accent} />
            <Text style={styles.statusText}>
              Incoming {incomingCall.callType.toLowerCase()} call...
            </Text>
          </View>
        </View>

        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={[styles.btn, styles.declineBtn]}
            onPress={(e) => {
              e.stopPropagation();
              handleDecline();
            }}
            accessibilityRole="button"
            accessibilityLabel="Decline call"
          >
            <PhoneOff size={16} color="#FFF" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.btn, styles.acceptBtn]}
            onPress={(e) => {
              e.stopPropagation();
              handleAccept();
            }}
            accessibilityRole="button"
            accessibilityLabel="Accept call"
          >
            <Phone size={16} color="#FFF" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: SPACING.md,
    right: SPACING.md,
    zIndex: 99999,
  },
  card: {
    backgroundColor: '#1F2C34',
    borderRadius: RADIUS.xl,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm + 2,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    gap: SPACING.sm,
    ...SHADOWS.lg,
  },
  avatarWrap: {
    position: 'relative',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  typeBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: '#25D366',
    borderRadius: 10,
    width: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoCol: {
    flex: 1,
  },
  name: {
    color: '#E9EDEF',
    fontSize: 14,
    fontWeight: '700',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  statusText: {
    color: '#25D366',
    fontSize: 11,
    fontWeight: '600',
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  btn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  declineBtn: {
    backgroundColor: '#EA4335',
  },
  acceptBtn: {
    backgroundColor: '#25D366',
  },
});
