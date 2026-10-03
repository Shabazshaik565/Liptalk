import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  RefreshControl,
  Linking,
  Modal,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import {
  Search,
  UserCheck,
  MessageSquare,
  Check,
  UserPlus,
  MapPin,
  Sparkles,
  ShieldCheck,
  Phone,
  Video,
} from 'lucide-react-native';
import { Header } from '../../src/components/common/Header';
import { Input } from '../../src/components/common/Input';
import { Badge } from '../../src/components/common/Badge';
import { Button } from '../../src/components/common/Button';
import { PillTabs, PillTabItem } from '../../src/components/common/PillTabs';
import { EmptyState } from '../../src/components/common/EmptyState';
import { CardSkeleton } from '../../src/components/common/SkeletonLoader';
import { usersApi } from '../../src/api/domain.api';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../../src/constants/theme';
import { socketService } from '../../src/services/socket.service';
import { useAuthStore } from '../../src/store/auth.store';

type FilterType = 'ALL' | 'BUSINESSES' | 'INDIVIDUALS' | 'CONNECTED';

const FALLBACK_MEMBERS = [
  {
    id: 'net_01',
    name: 'GrowthPulse Media',
    avatarUrl: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=150',
    role: 'BUSINESS' as const,
    category: 'Digital Marketing & Growth',
    headline: 'B2B Performance Marketing & Multi-Channel Lead Acquisition',
    city: 'Bangalore',
    offers: 'B2B Lead Gen, LinkedIn Ads',
    needs: 'React Native Dev Team',
    synergyMatch: 94,
  },
  {
    id: 'net_02',
    name: 'FinFlow Logistics Tech',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    role: 'BUSINESS' as const,
    category: 'IT & Software Development',
    headline: 'Fleet Telematics, Driver Dispatch & Route AI Software',
    city: 'Bangalore',
    phone: '+91 7200317219',
    offers: 'Fleet SaaS, Telematics API',
    needs: 'Cross-Platform Mobile App',
    synergyMatch: 96,
  },
  {
    id: 'net_03',
    name: 'LexTech Advisors LLP',
    avatarUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=150',
    role: 'BUSINESS' as const,
    category: 'Legal & Corporate Compliance',
    headline: 'Technology Law, Startup IP, SaaS Contracts & MSAs',
    city: 'Bangalore',
    offers: 'Corporate Retainer, MSA Contracts',
    needs: 'Accounting Software Advisory',
    synergyMatch: 89,
  },
  {
    id: 'net_04',
    name: 'Rohit Sharma',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    role: 'INDIVIDUAL' as const,
    category: 'Digital Marketing & Growth',
    headline: 'Senior Growth Strategist & Paid Ads Consultant',
    city: 'Bangalore',
    offers: 'Performance Ads & Meta/Google Funnels',
    needs: 'UI/UX Designer',
    synergyMatch: 86,
  },
  {
    id: 'net_05',
    name: 'Priya Nair',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150',
    role: 'INDIVIDUAL' as const,
    category: 'UI/UX & Product Design',
    headline: 'Principal Design Lead & Figma Design System Architect',
    city: 'Mumbai',
    offers: 'Mobile UI/UX, Design Systems',
    needs: 'Backend API Engineering',
    synergyMatch: 91,
  },
];

export default function NetworkScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('ALL');
  const [refreshing, setRefreshing] = useState(false);
  const [callingMember, setCallingMember] = useState<any | null>(null);

  const [connectionsState, setConnectionsState] = useState<Record<string, boolean>>({
    net_01: true,
  });

  const { data: serverUsers = [], isLoading, refetch } = useQuery({
    queryKey: ['network_users', searchQuery, selectedFilter],
    queryFn: () =>
      usersApi.getUsers({
        search: searchQuery || undefined,
        role:
          selectedFilter === 'BUSINESSES'
            ? 'BUSINESS'
            : selectedFilter === 'INDIVIDUALS'
            ? 'INDIVIDUAL'
            : undefined,
      }),
  });

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handleStartVoipCall = (member: any, type: 'VOICE' | 'VIDEO' = 'VOICE') => {
    const newCallId = 'call_' + Date.now();
    socketService.initiateCall({
      callerId: user?.id || 'usr_curr_01',
      callerName: user?.profile?.fullName || 'Alex Morgan',
      callerAvatar: user?.profile?.avatarUrl,
      receiverId: member.id,
      callType: type,
    });
    setCallingMember(null);
    router.push({
      pathname: '/call/active' as any,
      params: {
        callId: newCallId,
        peerName: member.name,
        peerAvatar: member.avatarUrl,
        callType: type,
        peerId: member.id,
        peerPhone: member.phone || '+91 7200317219',
        isIncoming: 'false',
      },
    });
  };

  const handleStartCellularCall = (member: any) => {
    handleStartVoipCall(member, 'VOICE');
  };

  // Merge server users or use fallback
  const rawList = serverUsers.length > 0
    ? serverUsers.map((u: any) => {
        const isBiz = u.role === 'BUSINESS' && u.businesses && u.businesses[0];
        return {
          id: u.id,
          name: isBiz
            ? u.businesses[0].businessName
            : u.profile?.fullName || `${u.profile?.firstName || ''} ${u.profile?.lastName || ''}`.trim() || 'Lip Talk Member',
          avatarUrl: isBiz
            ? u.businesses[0].logoUrl
            : u.profile?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
          role: u.role || 'INDIVIDUAL',
          category: isBiz ? u.businesses[0].categoryName : u.profile?.skills?.[0] || 'Professional',
          headline: isBiz ? u.businesses[0].description : u.profile?.headline || 'Verified Member',
          city: u.profile?.city || 'Bangalore',
          phone:
            u.phoneNumber ||
            u.profile?.phoneNumber ||
            (u.id === 'usr_vikram_singh' || u.id === 'net_02' ? '+91 7200317219' : undefined),
          offers: (u.offers || []).map((o: any) => o.title).join(', ') || 'Custom Services',
          needs: (u.needs || []).map((n: any) => n.title).join(', ') || 'Strategic Partners',
          synergyMatch: 92,
        };
      })
    : FALLBACK_MEMBERS;

  const filterTabs: PillTabItem<FilterType>[] = [
    { id: 'ALL', label: 'All Members', count: rawList.length },
    { id: 'BUSINESSES', label: 'Businesses', count: rawList.filter((m: any) => m.role === 'BUSINESS').length },
    { id: 'INDIVIDUALS', label: 'Professionals', count: rawList.filter((m: any) => m.role === 'INDIVIDUAL').length },
    { id: 'CONNECTED', label: 'My Network', count: Object.values(connectionsState).filter(Boolean).length },
  ];

  const filteredMembers = rawList.filter((m: any) => {
    if (selectedFilter === 'BUSINESSES' && m.role !== 'BUSINESS') return false;
    if (selectedFilter === 'INDIVIDUALS' && m.role !== 'INDIVIDUAL') return false;
    if (selectedFilter === 'CONNECTED' && !connectionsState[m.id]) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        m.name.toLowerCase().includes(q) ||
        m.category.toLowerCase().includes(q) ||
        m.offers.toLowerCase().includes(q) ||
        m.needs.toLowerCase().includes(q) ||
        m.headline.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const toggleConnect = (id: string) => {
    setConnectionsState((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <View style={styles.container}>
      <Header title="NETWORK DISCOVERY" subtitle="VERIFIED PROFILES & ENTITIES" />

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.primary}
            colors={[COLORS.primary, COLORS.accent]}
          />
        }
      >
        {/* Search Bar */}
        <Input
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search by skill, need, offer, category, or founder..."
          icon={<Search size={18} color={COLORS.textDim} />}
          containerStyle={{ marginBottom: SPACING.sm }}
        />

        {/* Filter Pills */}
        <PillTabs
          tabs={filterTabs}
          activeTab={selectedFilter}
          onTabChange={setSelectedFilter}
          scrollable
        />

        {/* Member Cards List */}
        <View style={styles.listContainer}>
          {isLoading ? (
            <>
              <CardSkeleton />
              <CardSkeleton />
            </>
          ) : filteredMembers.length > 0 ? (
            filteredMembers.map((m: any) => {
              const isConnected = connectionsState[m.id];
              return (
                <View key={m.id} style={styles.memberCard}>
                  {/* Top Bar with Avatar, Name, and Synergy Badge */}
                  <View style={styles.memberTop}>
                    <Image source={{ uri: m.avatarUrl }} style={styles.avatar} />
                    <View style={styles.nameCol}>
                      <View style={styles.nameRow}>
                        <Text style={styles.name} numberOfLines={1}>
                          {m.name}
                        </Text>
                        <Badge
                          label={m.role}
                          variant={m.role === 'BUSINESS' ? 'primary' : 'neutral'}
                          size="sm"
                        />
                      </View>
                      <View style={styles.cityRow}>
                        <MapPin size={11} color={COLORS.textDim} />
                        <Text style={styles.cityText}>
                          {m.city} • {m.category}
                        </Text>
                      </View>
                    </View>

                    {m.synergyMatch && (
                      <View style={styles.synergyMatchPill}>
                        <Sparkles size={11} color={COLORS.accent} />
                        <Text style={styles.synergyMatchText}>{m.synergyMatch}%</Text>
                      </View>
                    )}
                  </View>

                  {/* Headline */}
                  <Text style={styles.headline} numberOfLines={2}>
                    {m.headline}
                  </Text>

                  {/* Offers & Needs Synergy Grid */}
                  <View style={styles.synergyGrid}>
                    <View style={styles.synergyRow}>
                      <Text style={styles.synergyOfferLabel}>OFFERS</Text>
                      <Text style={styles.synergyVal} numberOfLines={1}>
                        {m.offers}
                      </Text>
                    </View>
                    <View style={styles.synergyRow}>
                      <Text style={styles.synergyNeedLabel}>NEEDS</Text>
                      <Text style={styles.synergyVal} numberOfLines={1}>
                        {m.needs}
                      </Text>
                    </View>
                  </View>

                  {/* Direct Real Phone Line Chip */}
                  {m.phone && (
                    <TouchableOpacity
                      style={styles.memberPhonePill}
                      onPress={() => handleStartCellularCall(m)}
                      onLongPress={() => setCallingMember(m)}
                      activeOpacity={0.8}
                      accessibilityRole="button"
                      accessibilityLabel={`Direct real phone call to ${m.name} at ${m.phone}`}
                    >
                      <Phone size={12} color={COLORS.accent} />
                      <Text style={styles.memberPhoneText}>{m.phone}</Text>
                      <View style={styles.directTag}>
                        <Text style={styles.directTagText}>REAL CALL</Text>
                      </View>
                    </TouchableOpacity>
                  )}

                  {/* Action Buttons */}
                  <View style={styles.cardActions}>
                    <Button
                      title={isConnected ? 'Connected' : 'Connect'}
                      variant={isConnected ? 'glass' : 'primary'}
                      size="sm"
                      icon={
                        isConnected ? (
                          <Check size={14} color={COLORS.accent} />
                        ) : (
                          <UserPlus size={14} color="#FFF" />
                        )
                      }
                      onPress={() => toggleConnect(m.id)}
                      style={{ flex: 1 }}
                    />
                    <Button
                      title="Message"
                      variant="glass"
                      size="sm"
                      icon={<MessageSquare size={14} color={COLORS.purpleLight} />}
                      onPress={() => router.push('/chat/conv_01' as any)}
                      style={{ flex: 1 }}
                    />
                    <Button
                      title="Call"
                      variant="glass"
                      size="sm"
                      icon={<Phone size={14} color={COLORS.accent} />}
                      onPress={() => handleStartCellularCall(m)}
                      style={{ minWidth: 68 }}
                    />
                  </View>
                </View>
              );
            })
          ) : (
            <EmptyState
              icon={<UserCheck size={24} color={COLORS.primaryLight} />}
              title="No Members Found"
              description="No members match your current filter or search criteria. Try adjusting your keywords."
              actionTitle="Clear Filters"
              onAction={() => {
                setSearchQuery('');
                setSelectedFilter('ALL');
              }}
            />
          )}
        </View>
      </ScrollView>

      {/* Network Member Call Options Modal */}
      <Modal
        visible={!!callingMember}
        transparent
        animationType="fade"
        onRequestClose={() => setCallingMember(null)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setCallingMember(null)}
        >
          {callingMember && (
            <View style={styles.modalCard} onStartShouldSetResponder={() => true}>
              <View style={styles.modalHeader}>
                <Image source={{ uri: callingMember.avatarUrl }} style={styles.modalAvatar} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.modalTitle}>{callingMember.name}</Text>
                  <Text style={styles.modalSub}>
                    {callingMember.phone || '+91 7200317219'} • {callingMember.category}
                  </Text>
                </View>
              </View>

              <View style={styles.modalDivider} />

              {/* Option 1: Direct Real Phone Call (Cellular) - Works without App */}
              <TouchableOpacity
                style={[styles.modalOption, styles.modalOptionPrimary]}
                onPress={() => handleStartCellularCall(callingMember)}
                activeOpacity={0.7}
              >
                <View style={[styles.modalOptionIcon, { backgroundColor: 'rgba(16, 185, 129, 0.2)' }]}>
                  <Phone size={19} color={COLORS.accent} />
                </View>
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Text style={[styles.modalOptionTitle, { color: COLORS.accent }]}>
                      In-App Direct Phone Call
                    </Text>
                    <View style={styles.cellularTag}>
                      <Text style={styles.cellularTagText}>100% IN-APP</Text>
                    </View>
                  </View>
                  <Text style={styles.modalOptionSub}>
                    Call {callingMember.phone || '+91 7200317219'} inside LipTalk • Zero external redirect
                  </Text>
                </View>
              </TouchableOpacity>

              {/* Option 2: In-App VoIP Voice Call */}
              <TouchableOpacity
                style={styles.modalOption}
                onPress={() => handleStartVoipCall(callingMember, 'VOICE')}
                activeOpacity={0.7}
              >
                <View style={[styles.modalOptionIcon, { backgroundColor: 'rgba(59, 130, 246, 0.15)' }]}>
                  <Phone size={18} color={COLORS.primaryLight} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.modalOptionTitle}>LipTalk HD In-App VoIP Call</Text>
                  <Text style={styles.modalOptionSub}>Encrypted voice calling over IP network (App required)</Text>
                </View>
              </TouchableOpacity>

              {/* Option 3: In-App VoIP Video Call */}
              <TouchableOpacity
                style={styles.modalOption}
                onPress={() => handleStartVoipCall(callingMember, 'VIDEO')}
                activeOpacity={0.7}
              >
                <View style={[styles.modalOptionIcon, { backgroundColor: 'rgba(168, 85, 247, 0.15)' }]}>
                  <Video size={18} color="#C084FC" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.modalOptionTitle}>LipTalk HD Video Call</Text>
                  <Text style={styles.modalOptionSub}>Face-to-face encrypted video conference</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setCallingMember(null)}
                activeOpacity={0.8}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          )}
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgDark,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.lg,
    paddingBottom: SPACING.tabBarClearance,
  },
  listContainer: {
    gap: SPACING.md,
  },
  memberCard: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
  },
  memberTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    marginBottom: SPACING.xs,
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: COLORS.bgElevated,
    borderWidth: 1.5,
    borderColor: COLORS.borderLight,
  },
  nameCol: {
    flex: 1,
    paddingRight: SPACING.xs,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  name: {
    color: COLORS.textPrimary,
    fontSize: 15,
    fontWeight: '800',
    flexShrink: 1,
  },
  cityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 2,
  },
  cityText: {
    color: COLORS.textDim,
    fontSize: 11,
    fontWeight: '500',
  },
  synergyMatchPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  synergyMatchText: {
    color: COLORS.accent,
    fontSize: 11,
    fontWeight: '900',
  },
  headline: {
    color: COLORS.textSecondary,
    fontSize: 13,
    lineHeight: 18,
    marginVertical: SPACING.xs,
  },
  synergyGrid: {
    backgroundColor: COLORS.bgInput,
    borderRadius: RADIUS.md,
    padding: SPACING.sm,
    marginVertical: SPACING.sm,
    gap: 6,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  synergyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  synergyOfferLabel: {
    color: COLORS.accent,
    fontSize: 9,
    fontWeight: '900',
    width: 52,
    letterSpacing: 0.5,
  },
  synergyNeedLabel: {
    color: COLORS.primaryLight,
    fontSize: 9,
    fontWeight: '900',
    width: 52,
    letterSpacing: 0.5,
  },
  synergyVal: {
    color: COLORS.textPrimary,
    fontSize: 12,
    fontWeight: '600',
    flex: 1,
  },
  cardActions: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginTop: SPACING.xs,
  },
  memberPhonePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(16, 185, 129, 0.08)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.25)',
    marginVertical: SPACING.xs,
    alignSelf: 'flex-start',
  },
  memberPhoneText: {
    color: COLORS.accent,
    fontSize: 12,
    fontWeight: '700',
  },
  directTag: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 3,
  },
  directTagText: {
    color: COLORS.accent,
    fontSize: 8.5,
    fontWeight: '800',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.72)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: COLORS.bgCard,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 20,
    ...SHADOWS.lg,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  modalAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: COLORS.accent,
  },
  modalTitle: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: '800',
  },
  modalSub: {
    color: COLORS.textDim,
    fontSize: 12,
    marginTop: 2,
    fontWeight: '600',
  },
  modalDivider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 14,
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: COLORS.bgElevated,
    padding: 12,
    borderRadius: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  modalOptionPrimary: {
    borderColor: 'rgba(16, 185, 129, 0.4)',
    backgroundColor: 'rgba(16, 185, 129, 0.08)',
  },
  modalOptionIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalOptionTitle: {
    color: COLORS.textPrimary,
    fontSize: 13.5,
    fontWeight: '700',
  },
  modalOptionSub: {
    color: COLORS.textDim,
    fontSize: 11,
    marginTop: 2,
  },
  cellularTag: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  cellularTagText: {
    color: COLORS.accent,
    fontSize: 9,
    fontWeight: '800',
  },
  modalCancelBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    marginTop: 4,
  },
  modalCancelText: {
    color: COLORS.textDim,
    fontSize: 13,
    fontWeight: '700',
  },
});
