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
import { Phone, PhoneOff, Video, ShieldCheck, Sparkles } from 'lucide-react-native';
import { socketService } from '../../src/services/socket.service';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../../src/constants/theme';

export default function IncomingCallScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    callId: string;
    callerName: string;
    callerAvatar?: string;
    callType?: string;
    callerHeadline?: string;
  }>();

  const callId = params.callId || 'call_01';
  const callerName = params.callerName || 'Vikram Singh';
  const callerAvatar = params.callerAvatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200';
  const callType = params.callType || 'VOICE';
  const callerHeadline = params.callerHeadline || 'Founder & CEO @ FinFlow Logistics Tech';

  const handleAccept = () => {
    socketService.acceptCall({
      callId,
      userId: 'usr_curr_01',
      callerId: 'usr_vikram_01',
    });
    router.replace({
      pathname: '/call/active' as any,
      params: {
        callId,
        peerName: callerName,
        peerAvatar: callerAvatar,
        callType,
        isIncoming: 'true',
      },
    });
  };

  const handleDecline = () => {
    socketService.declineCall({
      callId,
      callerId: 'usr_vikram_01',
      reason: 'DECLINED_BY_USER',
    });
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Glow background circles */}
      <View style={styles.glowCircle} />

      {/* Top verified badge */}
      <View style={styles.topBadge}>
        <ShieldCheck size={14} color={COLORS.accent} />
        <Text style={styles.topBadgeText}>VERIFIED ENCRYPTED SIGNALING</Text>
      </View>

      {/* Caller Info */}
      <View style={styles.callerContainer}>
        <View style={styles.avatarWrapper}>
          <Image source={{ uri: callerAvatar }} style={styles.avatar} />
          <View style={styles.callTypeIconWrap}>
            {callType === 'VIDEO' ? (
              <Video size={16} color="#FFF" />
            ) : (
              <Phone size={16} color="#FFF" />
            )}
          </View>
        </View>

        <Text style={styles.callerName}>{callerName}</Text>
        <Text style={styles.callerHeadline}>{callerHeadline}</Text>

        <View style={styles.ringingStatusWrap}>
          <Sparkles size={13} color={COLORS.primaryLight} />
          <Text style={styles.ringingText}>Incoming {callType.toLowerCase()} call...</Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={[styles.actionButton, styles.declineBtn]}
          onPress={handleDecline}
          activeOpacity={0.8}
        >
          <PhoneOff size={28} color="#FFFFFF" />
          <Text style={styles.actionLabel}>Decline</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.acceptBtn]}
          onPress={handleAccept}
          activeOpacity={0.8}
        >
          <Phone size={28} color="#FFFFFF" />
          <Text style={styles.actionLabel}>Accept</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#090514',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.xl * 2,
    paddingHorizontal: SPACING.lg,
  },
  glowCircle: {
    position: 'absolute',
    top: '25%',
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: 'rgba(124, 58, 237, 0.12)',
  },
  topBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  topBadgeText: {
    color: COLORS.accent,
    fontSize: 10.5,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  callerContainer: {
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: SPACING.lg,
  },
  avatar: {
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 3,
    borderColor: COLORS.primaryLight,
  },
  callTypeIconWrap: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    backgroundColor: COLORS.primary,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#090514',
  },
  callerName: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '900',
    marginBottom: 6,
    textAlign: 'center',
  },
  callerHeadline: {
    color: COLORS.textDim,
    fontSize: 13,
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  ringingStatusWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(124, 58, 237, 0.2)',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: RADIUS.full,
  },
  ringingText: {
    color: COLORS.primaryLight,
    fontSize: 12,
    fontWeight: '700',
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: SPACING.xl,
  },
  actionButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 72,
    height: 72,
    borderRadius: 36,
    ...SHADOWS.md,
  },
  declineBtn: {
    backgroundColor: COLORS.danger,
  },
  acceptBtn: {
    backgroundColor: COLORS.accent,
  },
  actionLabel: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
    marginTop: 4,
    position: 'absolute',
    bottom: -22,
  },
});
