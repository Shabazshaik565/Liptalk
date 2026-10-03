import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Platform,
  Modal,
  TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import {
  Phone,
  Video,
  PhoneIncoming,
  PhoneOutgoing,
  PhoneMissed,
  ChevronLeft,
  Search,
  Plus,
  ShieldCheck,
  X,
  Sparkles,
} from 'lucide-react-native';
import { callsApi } from '../../src/api/domain.api';
import { socketService } from '../../src/services/socket.service';
import { useAuthStore } from '../../src/store/auth.store';
import { CURRENT_USER, VIKRAM_USER } from '../../src/api/mockData';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../../src/constants/theme';
import { CallSession } from '../../src/types';

export default function CallHistoryScreen() {
  const router = useRouter();
  const { user, setAuth } = useAuthStore();
  const [filter, setFilter] = useState<'ALL' | 'MISSED'>('ALL');
  const [showDialModal, setShowDialModal] = useState(false);
  const [dialNumber, setDialNumber] = useState('');

  const isAlex = user?.id !== 'usr_vikram_01';
  const targetPeer = isAlex ? VIKRAM_USER : CURRENT_USER;

  const handleSwitchAccount = async () => {
    if (isAlex) {
      await setAuth(VIKRAM_USER, 'demo_token_vikram_singh');
    } else {
      await setAuth(CURRENT_USER, 'demo_token_alex_morgan');
    }
  };

  const { data: callHistory = [], isLoading, refetch } = useQuery({
    queryKey: ['callHistory'],
    queryFn: () => callsApi.getHistory(),
  });

  const filteredHistory = callHistory.filter((call) => {
    if (filter === 'MISSED') {
      return call.status === 'MISSED' || call.status === 'REJECTED';
    }
    return true;
  });

  const handleStartCall = (peer: any, type: 'VOICE' | 'VIDEO') => {
    setShowDialModal(false);
    const newCallId = 'call_' + Date.now();
    const currentUserId = user?.id || 'usr_curr_01';

    socketService.initiateCall({
      callerId: currentUserId,
      callerName: user?.profile?.fullName || 'Alex Morgan',
      callerAvatar: user?.profile?.avatarUrl,
      receiverId: peer.id,
      callType: type,
    });

    router.push({
      pathname: '/call/active' as any,
      params: {
        callId: newCallId,
        peerId: peer.id,
        peerName: peer.profile?.fullName || peer.name || 'Business Partner',
        peerAvatar: peer.profile?.avatarUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
        peerPhone: peer.phoneNumber || peer.phone || '+91 7200317219',
        callType: type,
        isIncoming: 'false',
      },
    });
  };

  const renderCallIcon = (call: CallSession, isCaller: boolean) => {
    if (call.status === 'MISSED' || call.status === 'REJECTED') {
      return <PhoneMissed size={14} color="#F87171" />;
    }
    if (isCaller) {
      return <PhoneOutgoing size={14} color="#38BDF8" />;
    }
    return <PhoneIncoming size={14} color="#25D366" />;
  };

  const formatDuration = (secs: number) => {
    if (!secs || secs === 0) return 'Missed';
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}m ${s}s`;
  };

  const renderItem = ({ item }: { item: CallSession }) => {
    const currentUserId = user?.id || 'usr_curr_01';
    const isCaller = item.caller?.id === currentUserId;
    const peer = isCaller ? item.receiver : item.caller;
    const peerName = peer?.profile?.fullName || 'Business Connection';
    const peerAvatar =
      peer?.profile?.avatarUrl ||
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200';
    const isMissed = item.status === 'MISSED' || item.status === 'REJECTED';

    return (
      <View style={styles.callRow}>
        <View style={styles.avatarWrapper}>
          <Image source={{ uri: peerAvatar }} style={styles.avatar} />
          <View style={styles.typeBadge}>
            {item.callType === 'VIDEO' ? (
              <Video size={10} color="#FFFFFF" />
            ) : (
              <Phone size={10} color="#FFFFFF" />
            )}
          </View>
        </View>

        <View style={styles.infoCol}>
          <Text style={[styles.peerName, isMissed && styles.peerNameMissed]} numberOfLines={1}>
            {peerName}
          </Text>
          <View style={styles.metaRow}>
            {renderCallIcon(item, isCaller)}
            <Text style={styles.timeText}>
              {new Date(item.createdAt).toLocaleDateString([], {
                month: 'short',
                day: 'numeric',
              })}
              {' • '}
              {item.status === 'ACTIVE' || item.status === 'ENDED'
                ? formatDuration(item.durationSeconds)
                : 'Unanswered'}
            </Text>
          </View>
        </View>

        <View style={styles.actionsCol}>
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => handleStartCall(peer, item.callType)}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel={`Call ${peerName}`}
          >
            {item.callType === 'VIDEO' ? (
              <Video size={20} color="#25D366" />
            ) : (
              <Phone size={20} color="#25D366" />
            )}
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#0B141B" />

      {/* Top App Bar */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <ChevronLeft size={24} color="#E9EDEF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Calls</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.headerIconBtn}
            onPress={() => {}}
            accessibilityRole="button"
            accessibilityLabel="Search calls"
          >
            <Search size={20} color="#E9EDEF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Account Profile Status & Fast Switcher */}
      <View style={styles.accountBar}>
        <View style={styles.accountInfo}>
          <Text style={styles.accountLabel}>Active Line</Text>
          <Text style={styles.accountPhone} numberOfLines={1}>
            {user?.profile?.fullName || (isAlex ? 'Alex Morgan' : 'Vikram Singh')} • {user?.phoneNumber || (isAlex ? '+91 9962786367' : '+91 7200317219')}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.switchAccountBtn}
          onPress={handleSwitchAccount}
          activeOpacity={0.8}
        >
          <Sparkles size={12} color="#25D366" />
          <Text style={styles.switchAccountText}>
            Switch to {isAlex ? 'Vikram' : 'Alex'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* WhatsApp Filter Pill Switcher */}
      <View style={styles.filterBar}>
        <TouchableOpacity
          style={[styles.filterPill, filter === 'ALL' && styles.filterPillActive]}
          onPress={() => setFilter('ALL')}
        >
          <Text style={[styles.filterPillText, filter === 'ALL' && styles.filterPillTextActive]}>
            All
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterPill, filter === 'MISSED' && styles.filterPillActive]}
          onPress={() => setFilter('MISSED')}
        >
          <Text style={[styles.filterPillText, filter === 'MISSED' && styles.filterPillTextActive]}>
            Missed
          </Text>
        </TouchableOpacity>
      </View>

      {/* Verified Telephony Security Banner */}
      <View style={styles.securityBanner}>
        <ShieldCheck size={13} color="#25D366" />
        <Text style={styles.securityText}>
          All LipTalk voice and video calls are direct and end-to-end encrypted.
        </Text>
      </View>

      {/* Call Log List */}
      <FlatList
        data={filteredHistory}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        refreshing={isLoading}
        onRefresh={refetch}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Phone size={36} color="#8696A0" />
            <Text style={styles.emptyTitle}>No recent calls</Text>
            <Text style={styles.emptySubtitle}>
              Stay connected with verified partners, clients, and collaborators.
            </Text>
          </View>
        }
      />

      {/* WhatsApp Floating Action Button to initiate new call */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setShowDialModal(true)}
        activeOpacity={0.85}
        accessibilityRole="button"
        accessibilityLabel="Start new call"
      >
        <Phone size={24} color="#0B141B" />
      </TouchableOpacity>

      {/* Dial Pad & Direct Contact Call Modal */}
      <Modal
        visible={showDialModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowDialModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Start Real Call</Text>
              <TouchableOpacity
                onPress={() => setShowDialModal(false)}
                style={styles.modalCloseBtn}
              >
                <X size={20} color="#8696A0" />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalSubtitle}>
              Call between your two real registered numbers with WebRTC audio & video:
            </Text>

            {/* Target Registered Number Card */}
            <View style={styles.targetCard}>
              <Image
                source={{
                  uri:
                    targetPeer.profile?.avatarUrl ||
                    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
                }}
                style={styles.targetAvatar}
              />
              <View style={styles.targetInfo}>
                <Text style={styles.targetName}>{targetPeer.profile?.fullName}</Text>
                <Text style={styles.targetPhone}>{targetPeer.phoneNumber}</Text>
                <Text style={styles.targetHeadline} numberOfLines={1}>
                  {targetPeer.profile?.headline || targetPeer.business?.businessName}
                </Text>
              </View>
            </View>

            {/* Direct Call Actions */}
            <View style={styles.modalActionsRow}>
              <TouchableOpacity
                style={[styles.callActionBtn, styles.voiceCallBtn]}
                onPress={() => handleStartCall(targetPeer, 'VOICE')}
                activeOpacity={0.8}
              >
                <Phone size={18} color="#FFFFFF" />
                <Text style={styles.callActionBtnText}>Voice Call</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.callActionBtn, styles.videoCallBtn]}
                onPress={() => handleStartCall(targetPeer, 'VIDEO')}
                activeOpacity={0.8}
              >
                <Video size={18} color="#FFFFFF" />
                <Text style={styles.callActionBtnText}>Video Call</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0B141B',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? 14 : 6,
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  backBtn: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#E9EDEF',
    letterSpacing: 0.3,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerIconBtn: {
    padding: 6,
  },
  filterBar: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
  },
  filterPill: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
  },
  filterPillActive: {
    backgroundColor: '#25D366',
  },
  filterPillText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#8696A0',
  },
  filterPillTextActive: {
    color: '#0B141B',
  },
  securityBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(37, 211, 102, 0.08)',
    marginHorizontal: 16,
    marginBottom: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: 'rgba(37, 211, 102, 0.2)',
  },
  securityText: {
    fontSize: 11,
    color: '#E9EDEF',
    flex: 1,
  },
  listContent: {
    paddingBottom: 24,
  },
  callRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  avatarWrapper: {
    position: 'relative',
    marginRight: 14,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  typeBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: '#25D366',
    borderRadius: 8,
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoCol: {
    flex: 1,
  },
  peerName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#E9EDEF',
    marginBottom: 3,
  },
  peerNameMissed: {
    color: '#F87171',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  timeText: {
    fontSize: 12.5,
    color: '#8696A0',
  },
  actionsCol: {
    marginLeft: 12,
  },
  actionBtn: {
    padding: 8,
    borderRadius: RADIUS.full,
    backgroundColor: 'rgba(37, 211, 102, 0.1)',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    paddingHorizontal: 32,
    gap: 10,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#E9EDEF',
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#8696A0',
    textAlign: 'center',
    lineHeight: 18,
  },
  accountBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    marginHorizontal: 16,
    marginTop: 10,
    marginBottom: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  accountInfo: {
    flex: 1,
  },
  accountLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#8696A0',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  accountPhone: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#E9EDEF',
    marginTop: 1,
  },
  switchAccountBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: RADIUS.sm,
    backgroundColor: 'rgba(37, 211, 102, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(37, 211, 102, 0.3)',
  },
  switchAccountText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#25D366',
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#25D366',
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.lg,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#111B21',
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    borderTopWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#E9EDEF',
  },
  modalCloseBtn: {
    padding: 6,
  },
  modalSubtitle: {
    fontSize: 12.5,
    color: '#8696A0',
    marginBottom: 16,
    lineHeight: 18,
  },
  targetCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: RADIUS.lg,
    padding: 14,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  targetAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    marginRight: 14,
  },
  targetInfo: {
    flex: 1,
  },
  targetName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#E9EDEF',
  },
  targetPhone: {
    fontSize: 13,
    fontWeight: '600',
    color: '#25D366',
    marginTop: 2,
  },
  targetHeadline: {
    fontSize: 11.5,
    color: '#8696A0',
    marginTop: 2,
  },
  modalActionsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  callActionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: RADIUS.md,
    gap: 8,
  },
  voiceCallBtn: {
    backgroundColor: '#00A884',
  },
  videoCallBtn: {
    backgroundColor: '#25D366',
  },
  callActionBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
