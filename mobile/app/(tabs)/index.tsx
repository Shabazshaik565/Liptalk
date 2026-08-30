import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import {
  Sparkles,
  Briefcase,
  TrendingUp,
  PlusCircle,
  Users,
  Compass,
  Zap,
  ShieldCheck,
  Award,
  ShoppingBag,
  Coins,
  Crown,
  Bookmark,
  Search,
  Bot,
  Radio,
  ArrowRight,
} from 'lucide-react-native';
import { Header } from '../../src/components/common/Header';
import { SectionHeader } from '../../src/components/common/SectionHeader';
import { EmptyState } from '../../src/components/common/EmptyState';
import { CardSkeleton } from '../../src/components/common/SkeletonLoader';
import { MatchCard } from '../../src/components/match/MatchCard';
import { OpportunityCard } from '../../src/components/opportunity/OpportunityCard';
import { PartnerCard } from '../../src/components/partner/PartnerCard';
import { AskLipTalkSheet } from '../../src/components/ai/AskLipTalkSheet';
import { matchesApi, opportunitiesApi, partnersApi, liveRoomsApi } from '../../src/api/domain.api';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../../src/constants/theme';
import { useAuthStore } from '../../src/store/auth.store';

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [refreshing, setRefreshing] = useState(false);
  const [assistantVisible, setAssistantVisible] = useState(false);

  const { data: liveRooms = [], isLoading: loadingRooms, refetch: refetchRooms } = useQuery({
    queryKey: ['live-rooms-discover'],
    queryFn: () => liveRoomsApi.getRooms(),
  });

  const { data: matches, isLoading: loadingMatches, refetch: refetchMatches } = useQuery({
    queryKey: ['matches'],
    queryFn: matchesApi.getMatches,
  });

  const { data: opportunities, isLoading: loadingOpps, refetch: refetchOpportunities } = useQuery({
    queryKey: ['opportunities'],
    queryFn: () => opportunitiesApi.getOpportunities(),
  });

  const { data: partners, isLoading: loadingPartners, refetch: refetchPartners } = useQuery({
    queryKey: ['partners'],
    queryFn: partnersApi.getPartners,
  });

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([refetchRooms(), refetchMatches(), refetchOpportunities(), refetchPartners()]);
    setRefreshing(false);
  };

  const highMatchCount = (matches || []).filter((m) => m.matchScore >= 85).length;

  const defaultRooms = [
    {
      id: 'room_1',
      title: 'Scaling Your Business Globally',
      host: { name: 'Arjun Mehta', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100' },
      category: 'Business & Growth',
      audienceCount: 256,
      status: 'LIVE',
    },
    {
      id: 'room_2',
      title: 'Fintech & B2B Escrow in India',
      host: { name: 'Priya Sharma', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100' },
      category: 'Fintech',
      audienceCount: 184,
      status: 'LIVE',
    },
    {
      id: 'room_3',
      title: 'Public Speaking & Personal Brand Masterclass',
      host: { name: 'Vikram Malhotra', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100' },
      category: 'Personal Growth',
      audienceCount: 142,
      status: 'LIVE',
    },
  ];

  const displayRooms = liveRooms.length > 0 ? liveRooms : defaultRooms;

  return (
    <View style={styles.container}>
      <Header onAskAi={() => setAssistantVisible(true)} />

      <ScrollView
        style={styles.scrollView}
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
        {/* Ask LipTalk Intelligent Search Trigger */}
        <TouchableOpacity
          style={styles.aiSearchBar}
          onPress={() => router.push('/search' as any)}
          activeOpacity={0.85}
        >
          <Search size={16} color={COLORS.primaryLight} />
          <Text style={styles.aiSearchPlaceholder}>
            Search anything (e.g. React Native developers, B2B leads, Audio Rooms)...
          </Text>
          <View style={styles.aiSearchBadge}>
            <Sparkles size={11} color={COLORS.accent} />
            <Text style={styles.aiSearchBadgeText}>AI</Text>
          </View>
        </TouchableOpacity>

        {/* Section 1: Live Now Audio Stages */}
        <SectionHeader
          title="Live Audio Stages"
          subtitle="Real-time discussions, pitch stages & masterclasses"
          icon={<Radio size={18} color={COLORS.danger} />}
          actionText="Explore All"
          onAction={() => router.push('/live' as any)}
        />

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.liveRoomsScroll}
        >
          {displayRooms.map((room) => (
            <TouchableOpacity
              key={room.id}
              style={styles.liveRoomCard}
              onPress={() => router.push(`/live/${room.id}` as any)}
              activeOpacity={0.85}
            >
              <View style={styles.liveRoomHeader}>
                <View style={styles.livePill}>
                  <View style={styles.livePulseDot} />
                  <Text style={styles.livePillText}>LIVE</Text>
                </View>
                <View style={styles.listenerBadge}>
                  <Users size={12} color={COLORS.textSecondary} />
                  <Text style={styles.listenerCount}>{room.audienceCount || 132} listening</Text>
                </View>
              </View>

              <Text style={styles.liveRoomTitle} numberOfLines={2}>
                {room.title}
              </Text>

              <View style={styles.liveRoomFooter}>
                <Image
                  source={{ uri: room.host?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100' }}
                  style={styles.hostAvatar}
                />
                <View style={{ flex: 1 }}>
                  <Text style={styles.hostName} numberOfLines={1}>
                    {room.host?.name || 'Arjun Mehta'}
                  </Text>
                  <Text style={styles.roomCategory}>{room.category || 'Live Room'}</Text>
                </View>

                <View style={styles.joinStageBtn}>
                  <Text style={styles.joinStageText}>Join</Text>
                  <ArrowRight size={12} color="#FFF" />
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Section 2: Recommended Synergy Matches */}
        <SectionHeader
          title="Intelligent Synergy Matches"
          subtitle="Direct 1-to-1 alignments with your published needs & offers"
          icon={<Sparkles size={18} color={COLORS.accent} />}
          badgeCount={matches?.length}
          actionText="View All"
          onAction={() => router.push('/(tabs)/network' as any)}
          style={{ marginTop: SPACING.md }}
        />

        {loadingMatches ? (
          <>
            <CardSkeleton />
            <CardSkeleton />
          </>
        ) : matches && matches.length > 0 ? (
          matches.map((match) => <MatchCard key={match.id} match={match} />)
        ) : (
          <EmptyState
            icon={<Sparkles size={24} color={COLORS.accent} />}
            title="Discover Your First Match"
            description="Add your active requirements and service capabilities to unlock instant business recommendations."
            actionTitle="Post a Need"
            onAction={() => router.push('/opportunities/create' as any)}
          />
        )}

        {/* Section 2: Opportunities For You */}
        <SectionHeader
          title="Open Project Requirements"
          subtitle="Direct client inquiries and contracts seeking your services"
          icon={<Briefcase size={18} color={COLORS.primaryLight} />}
          badgeCount={opportunities?.length}
          actionText="Browse All"
          onAction={() => router.push('/(tabs)/opportunities' as any)}
          style={{ marginTop: SPACING.lg }}
        />

        {loadingOpps ? (
          <CardSkeleton />
        ) : opportunities && opportunities.length > 0 ? (
          opportunities.map((opp) => (
            <OpportunityCard key={opp.id} opportunity={opp} />
          ))
        ) : (
          <EmptyState
            icon={<Briefcase size={24} color={COLORS.primaryLight} />}
            title="No Open Requirements"
            description="Check back later or broadcast your own project opportunity to the network."
            actionTitle="Post Opportunity"
            onAction={() => router.push('/opportunities/create' as any)}
          />
        )}

        {/* Section 3: Verified Partner Perks */}
        <SectionHeader
          title="Ecosystem Partner Perks"
          subtitle="Corporate credits, logistics & tools negotiated for members"
          icon={<ShieldCheck size={18} color={COLORS.warning} />}
          actionText="Directory"
          onAction={() => router.push('/(tabs)/partners' as any)}
          style={{ marginTop: SPACING.lg }}
        />

        {loadingPartners ? (
          <CardSkeleton />
        ) : (
          partners &&
          partners.slice(0, 2).map((p) => <PartnerCard key={p.id} partner={p} />)
        )}
      </ScrollView>

      {/* Slide-Up AI Assistant Sheet (Triggered from Top Header / Search) */}
      <AskLipTalkSheet
        visible={assistantVisible}
        onClose={() => setAssistantVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgDark,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.lg,
    paddingBottom: SPACING.tabBarClearance,
  },
  aiSearchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.xl,
    paddingHorizontal: SPACING.md,
    paddingVertical: 11,
    borderWidth: 1,
    borderColor: COLORS.primaryDark,
    marginBottom: SPACING.lg,
    gap: SPACING.sm,
    ...SHADOWS.sm,
  },
  aiSearchPlaceholder: {
    color: COLORS.textDim,
    fontSize: 12.5,
    flex: 1,
  },
  aiSearchBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: RADIUS.sm,
  },
  aiSearchBadgeText: {
    color: COLORS.accent,
    fontSize: 9.5,
    fontWeight: '900',
  },
  liveRoomsScroll: {
    paddingBottom: SPACING.sm,
    gap: SPACING.md,
    marginBottom: SPACING.md,
  },
  liveRoomCard: {
    width: 255,
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.xl,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
  },
  liveRoomHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  livePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  livePulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.danger,
  },
  livePillText: {
    color: COLORS.danger,
    fontSize: 9.5,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  listenerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  listenerCount: {
    color: COLORS.textMuted,
    fontSize: 11,
    fontWeight: '600',
  },
  liveRoomTitle: {
    color: COLORS.textPrimary,
    fontSize: 13.5,
    fontWeight: '800',
    lineHeight: 18,
    minHeight: 36,
    marginBottom: SPACING.md,
  },
  liveRoomFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  hostAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: COLORS.primaryLight,
  },
  hostName: {
    color: COLORS.textPrimary,
    fontSize: 11.5,
    fontWeight: '700',
  },
  roomCategory: {
    color: COLORS.textDim,
    fontSize: 9.5,
    marginTop: 1,
  },
  joinStageBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: RADIUS.md,
    ...SHADOWS.glowPrimary,
  },
  joinStageText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '800',
  },
});
