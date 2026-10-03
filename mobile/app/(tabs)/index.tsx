import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Image,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Sparkles,
  Briefcase,
  TrendingUp,
  PlusCircle,
  Users,
  Compass,
  Radio,
  ShoppingBag,
  Coins,
  Crown,
  Search,
  ShieldCheck,
  ChevronRight,
  Plus,
  ArrowRight,
  FileText,
  MessageSquare,
  Trash2,
  Edit3,
  Calendar,
  IndianRupee,
  MapPin,
  Lightbulb,
  Building2,
  Layers,
  MessagesSquare,
  Bot,
} from 'lucide-react-native';
import { Header } from '../../src/components/common/Header';
import { SectionHeader } from '../../src/components/common/SectionHeader';
import { EmptyState } from '../../src/components/common/EmptyState';
import { CardSkeleton } from '../../src/components/common/SkeletonLoader';
import { MatchCard } from '../../src/components/match/MatchCard';
import { OpportunityCard } from '../../src/components/opportunity/OpportunityCard';
import { PartnerCard } from '../../src/components/partner/PartnerCard';
import { AskLipTalkSheet } from '../../src/components/ai/AskLipTalkSheet';
import {
  matchesApi,
  opportunitiesApi,
  partnersApi,
  leadsApi,
  liveRoomsApi,
} from '../../src/api/domain.api';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../../src/constants/theme';
import { useAuthStore } from '../../src/store/auth.store';

export default function HomeScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const [refreshing, setRefreshing] = useState(false);
  const [assistantVisible, setAssistantVisible] = useState(false);

  // 1. My Published Posts
  const {
    data: myPosts = [],
    isLoading: loadingMyPosts,
    refetch: refetchMyPosts,
  } = useQuery({
    queryKey: ['my-opportunities-home'],
    queryFn: () => opportunitiesApi.getMyOpportunities(),
  });

  // 2. Active Open Demands
  const {
    data: opportunities = [],
    isLoading: loadingOpps,
    refetch: refetchOpportunities,
  } = useQuery({
    queryKey: ['opportunities-home'],
    queryFn: () => opportunitiesApi.getOpportunities(),
  });

  // 3. CRM Deals & Leads
  const { data: leads = [], refetch: refetchLeads } = useQuery({
    queryKey: ['leads-home'],
    queryFn: leadsApi.getLeads,
  });

  // 4. Synergy Matches
  const {
    data: matches = [],
    isLoading: loadingMatches,
    refetch: refetchMatches,
  } = useQuery({
    queryKey: ['matches-home'],
    queryFn: matchesApi.getMatches,
  });

  // 5. Partners
  const {
    data: partners = [],
    isLoading: loadingPartners,
    refetch: refetchPartners,
  } = useQuery({
    queryKey: ['partners-home'],
    queryFn: partnersApi.getPartners,
  });

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([
      refetchMyPosts(),
      refetchOpportunities(),
      refetchLeads(),
      refetchMatches(),
      refetchPartners(),
    ]);
    setRefreshing(false);
  };

  const handleDeleteMyPost = (id: string, title: string) => {
    Alert.alert(
      'Withdraw Requirement',
      `Are you sure you want to withdraw "${title}"? This will close it to new proposals.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Withdraw',
          style: 'destructive',
          onPress: async () => {
            await opportunitiesApi.deleteOpportunity(id);
            queryClient.invalidateQueries({ queryKey: ['my-opportunities-home'] });
            queryClient.invalidateQueries({ queryKey: ['opportunities-home'] });
          },
        },
      ]
    );
  };

  const userName = user?.profile?.firstName
    ? `${user.profile.firstName} ${user.profile.lastName || ''}`.trim()
    : 'Alex Morgan';

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
        {/* 1. PERSONAL WELCOME & EXECUTIVE STATUS HERO */}
        <View style={styles.welcomeHeroCard}>
          <View style={styles.heroTopRow}>
            <View style={styles.statusPulsePill}>
              <View style={styles.pulseDot} />
              <Text style={styles.statusPulseText}>SYNERGY ENGINE ACTIVE</Text>
            </View>
            <View style={styles.verifiedBadge}>
              <ShieldCheck size={12} color={COLORS.accent} />
              <Text style={styles.verifiedBadgeText}>Tier 1 Verified</Text>
            </View>
          </View>

          <Text style={styles.heroGreeting}>Welcome back, {userName}</Text>
          <Text style={styles.heroRole}>Nexas Digital Solutions • Technology & Product Studio</Text>

          <View style={styles.heroSummaryBox}>
            <Sparkles size={16} color={COLORS.primaryLight} style={{ marginTop: 2 }} />
            <Text style={styles.heroSummaryText}>
              You have <Text style={styles.heroHighlight}>{leads.length || 3} CRM deals</Text> in
              discussion, <Text style={styles.heroHighlight}>{opportunities.length || 5} active demands</Text> matching your stack, and{' '}
              <Text style={styles.heroHighlight}>{myPosts.length || 2} published requirements</Text> receiving proposals.
            </Text>
          </View>

          <View style={styles.heroActionRow}>
            <TouchableOpacity
              style={styles.heroPrimaryBtn}
              onPress={() => router.push('/opportunities/create' as any)}
              activeOpacity={0.82}
            >
              <PlusCircle size={15} color="#FFFFFF" />
              <Text style={styles.heroPrimaryBtnText}>Post Requirement</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.heroSecondaryBtn}
              onPress={() => router.push('/(tabs)/opportunities' as any)}
              activeOpacity={0.82}
            >
              <Search size={15} color={COLORS.textSecondary} />
              <Text style={styles.heroSecondaryBtnText}>Explore Demands</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 2. KEY DASHBOARD METRICS (Spacious & Minimalist 2x2 Grid) */}
        <View style={styles.dashboardGrid}>
          {/* Deals / CRM Pipeline */}
          <TouchableOpacity
            style={styles.metricCard}
            onPress={() => router.push('/leads' as any)}
            activeOpacity={0.85}
          >
            <View style={styles.metricHeader}>
              <View style={[styles.metricIconWrap, { backgroundColor: 'rgba(16, 185, 129, 0.15)' }]}>
                <TrendingUp size={18} color={COLORS.accent} />
              </View>
              <View style={styles.metricTrendBadge}>
                <Text style={styles.metricTrendText}>+12%</Text>
              </View>
            </View>
            <Text style={styles.metricValue}>{leads.length || 3} Deals</Text>
            <Text style={styles.metricTitle}>CRM Pipeline</Text>
            <Text style={styles.metricSub}>₹7.3L in active discussion</Text>
          </TouchableOpacity>

          {/* Active Open Demands */}
          <TouchableOpacity
            style={styles.metricCard}
            onPress={() => router.push('/(tabs)/opportunities' as any)}
            activeOpacity={0.85}
          >
            <View style={styles.metricHeader}>
              <View style={[styles.metricIconWrap, { backgroundColor: 'rgba(139, 92, 246, 0.15)' }]}>
                <Briefcase size={18} color={COLORS.primaryLight} />
              </View>
              <ChevronRight size={14} color={COLORS.textDim} />
            </View>
            <Text style={styles.metricValue}>{opportunities.length || 5} Active</Text>
            <Text style={styles.metricTitle}>Open Demands</Text>
            <Text style={styles.metricSub}>Matching your tech stack</Text>
          </TouchableOpacity>

          {/* Network Connections */}
          <TouchableOpacity
            style={styles.metricCard}
            onPress={() => router.push('/(tabs)/network' as any)}
            activeOpacity={0.85}
          >
            <View style={styles.metricHeader}>
              <View style={[styles.metricIconWrap, { backgroundColor: 'rgba(245, 158, 11, 0.15)' }]}>
                <Users size={18} color="#FBBF24" />
              </View>
              <ChevronRight size={14} color={COLORS.textDim} />
            </View>
            <Text style={styles.metricValue}>64 Network</Text>
            <Text style={styles.metricTitle}>Connections</Text>
            <Text style={styles.metricSub}>Verified founders & CTOs</Text>
          </TouchableOpacity>

          {/* Rewards & Wallet */}
          <TouchableOpacity
            style={styles.metricCard}
            onPress={() => router.push('/rewards' as any)}
            activeOpacity={0.85}
          >
            <View style={styles.metricHeader}>
              <View style={[styles.metricIconWrap, { backgroundColor: 'rgba(168, 85, 247, 0.15)' }]}>
                <Coins size={18} color="#C084FC" />
              </View>
              <ChevronRight size={14} color={COLORS.textDim} />
            </View>
            <Text style={styles.metricValue}>1,250 Coins</Text>
            <Text style={styles.metricTitle}>Wallet & Points</Text>
            <Text style={styles.metricSub}>₹500 redeemable cash</Text>
          </TouchableOpacity>
        </View>

        {/* 3. REDIRECTS TO DIFFERENT TABS & SUBSYSTEMS (Spacious Quick Hub) */}
        <SectionHeader
          title="Quick Navigation Hub"
          subtitle="One-tap access to live stages, marketplace & innovation tools"
        />

        <View style={styles.quickHubGrid}>
          {/* Discover Tab */}
          <TouchableOpacity
            style={styles.hubTile}
            onPress={() => router.push('/(tabs)/discover' as any)}
            activeOpacity={0.82}
          >
            <View style={[styles.hubTileIcon, { backgroundColor: 'rgba(56, 189, 248, 0.15)' }]}>
              <Compass size={18} color="#38BDF8" />
            </View>
            <Text style={styles.hubTileTitle}>Discover</Text>
            <Text style={styles.hubTileSub}>Stages & Trends</Text>
          </TouchableOpacity>

          {/* Live Audio Stages */}
          <TouchableOpacity
            style={styles.hubTile}
            onPress={() => router.push('/live' as any)}
            activeOpacity={0.82}
          >
            <View style={[styles.hubTileIcon, { backgroundColor: 'rgba(239, 68, 68, 0.15)' }]}>
              <Radio size={18} color={COLORS.danger} />
            </View>
            <Text style={styles.hubTileTitle}>Live Stages</Text>
            <Text style={styles.hubTileSub}>Audio Rooms</Text>
          </TouchableOpacity>

          {/* B2B Marketplace */}
          <TouchableOpacity
            style={styles.hubTile}
            onPress={() => router.push('/marketplace' as any)}
            activeOpacity={0.82}
          >
            <View style={[styles.hubTileIcon, { backgroundColor: 'rgba(139, 92, 246, 0.15)' }]}>
              <ShoppingBag size={18} color={COLORS.primaryLight} />
            </View>
            <Text style={styles.hubTileTitle}>Marketplace</Text>
            <Text style={styles.hubTileSub}>B2B Services</Text>
          </TouchableOpacity>

          {/* Rewards & Earnings */}
          <TouchableOpacity
            style={styles.hubTile}
            onPress={() => router.push('/rewards' as any)}
            activeOpacity={0.82}
          >
            <View style={[styles.hubTileIcon, { backgroundColor: 'rgba(16, 185, 129, 0.15)' }]}>
              <Coins size={18} color={COLORS.accent} />
            </View>
            <Text style={styles.hubTileTitle}>Rewards</Text>
            <Text style={styles.hubTileSub}>Earn & Redeem</Text>
          </TouchableOpacity>

          {/* Idea Incubator */}
          <TouchableOpacity
            style={styles.hubTile}
            onPress={() => router.push('/ideas' as any)}
            activeOpacity={0.82}
          >
            <View style={[styles.hubTileIcon, { backgroundColor: 'rgba(245, 158, 11, 0.15)' }]}>
              <Lightbulb size={18} color="#FBBF24" />
            </View>
            <Text style={styles.hubTileTitle}>Incubator</Text>
            <Text style={styles.hubTileSub}>Validate Ideas</Text>
          </TouchableOpacity>

          {/* Guilds / Communities */}
          <TouchableOpacity
            style={styles.hubTile}
            onPress={() => router.push('/(tabs)/communities' as any)}
            activeOpacity={0.82}
          >
            <View style={[styles.hubTileIcon, { backgroundColor: 'rgba(168, 85, 247, 0.15)' }]}>
              <MessagesSquare size={18} color="#C084FC" />
            </View>
            <Text style={styles.hubTileTitle}>Guilds</Text>
            <Text style={styles.hubTileSub}>Communities</Text>
          </TouchableOpacity>
        </View>

        {/* 4. DEDICATED "MY POSTS & REQUIREMENTS" (On Home Page as Requested) */}
        <SectionHeader
          title="My Published Requirements"
          subtitle="Track bids, manage scopes, and review agency proposals"
          badgeCount={myPosts.length}
          actionText="+ Post Need"
          onAction={() => router.push('/opportunities/create' as any)}
          style={{ marginTop: SPACING.xl }}
        />

        {loadingMyPosts ? (
          <CardSkeleton />
        ) : myPosts.length > 0 ? (
          myPosts.map((post) => (
            <View key={post.id} style={styles.myPostCard}>
              <View style={styles.myPostHeader}>
                <View style={styles.categoryBadge}>
                  <Text style={styles.categoryBadgeText}>{post.categoryName}</Text>
                </View>
                <View style={styles.statusPill}>
                  <View style={styles.statusDot} />
                  <Text style={styles.statusPillText}>{post.status || 'OPEN'}</Text>
                </View>
              </View>

              <Text style={styles.myPostTitle}>{post.title}</Text>
              <Text style={styles.myPostDesc} numberOfLines={2}>
                {post.description}
              </Text>

              {post.tags && post.tags.length > 0 && (
                <View style={styles.tagsRow}>
                  {post.tags.map((tag, idx) => (
                    <View key={idx} style={styles.tagChip}>
                      <Text style={styles.tagChipText}>#{tag}</Text>
                    </View>
                  ))}
                </View>
              )}

              <View style={styles.metaRow}>
                {post.budgetAmount && (
                  <View style={styles.metaItem}>
                    <IndianRupee size={13} color={COLORS.accent} />
                    <Text style={styles.metaText}>₹{post.budgetAmount.toLocaleString('en-IN')}</Text>
                  </View>
                )}
                {post.city && (
                  <View style={styles.metaItem}>
                    <MapPin size={13} color={COLORS.textDim} />
                    <Text style={styles.metaText}>{post.city}</Text>
                  </View>
                )}
                {post.deadline && (
                  <View style={styles.metaItem}>
                    <Calendar size={13} color={COLORS.textDim} />
                    <Text style={styles.metaText}>{post.deadline}</Text>
                  </View>
                )}
              </View>

              {/* Proposals Received Highlight */}
              <View style={styles.responsesBanner}>
                <View style={styles.responsesLeft}>
                  <Users size={14} color={COLORS.accent} />
                  <Text style={styles.responsesText}>
                    <Text style={styles.responsesCount}>{post.interestsCount || 0}</Text> Proposals / Pitches Received
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.viewPitchesBtn}
                  onPress={() => router.push('/leads' as any)}
                  activeOpacity={0.8}
                >
                  <MessageSquare size={12} color="#000000" />
                  <Text style={styles.viewPitchesBtnText}>View Inquiries</Text>
                </TouchableOpacity>
              </View>

              {/* Action Controls */}
              <View style={styles.postActionsFooter}>
                <TouchableOpacity
                  style={styles.deletePostBtn}
                  onPress={() => handleDeleteMyPost(post.id, post.title)}
                  activeOpacity={0.8}
                >
                  <Trash2 size={13} color={COLORS.danger} />
                  <Text style={styles.deletePostBtnText}>Withdraw</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.editPostBtn}
                  onPress={() => router.push('/opportunities/create' as any)}
                  activeOpacity={0.8}
                >
                  <Edit3 size={13} color={COLORS.primaryLight} />
                  <Text style={styles.editPostBtnText}>Edit Scope</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        ) : (
          <EmptyState
            icon={<FileText size={24} color={COLORS.primaryLight} />}
            title="No Published Requirements Yet"
            description="Broadcast your business requirement to get matched with verified agencies and specialists across India."
            actionTitle="Post Your First Requirement"
            onAction={() => router.push('/opportunities/create' as any)}
          />
        )}

        {/* 5. ACTIVE OPEN DEMANDS (Live Market Demands) */}
        <SectionHeader
          title="Active Open Demands"
          subtitle="Commercial contracts & client projects matching your capabilities"
          badgeCount={opportunities.length}
          actionText="View All Demands"
          onAction={() => router.push('/(tabs)/opportunities' as any)}
          style={{ marginTop: SPACING.xl }}
        />

        {loadingOpps ? (
          <CardSkeleton />
        ) : opportunities && opportunities.length > 0 ? (
          opportunities.slice(0, 3).map((opp) => (
            <OpportunityCard key={opp.id} opportunity={opp} />
          ))
        ) : (
          <EmptyState
            icon={<Briefcase size={24} color={COLORS.primaryLight} />}
            title="No Open Demands"
            description="Check back shortly or post a new contract demand to the network."
            actionTitle="Post Demand"
            onAction={() => router.push('/opportunities/create' as any)}
          />
        )}

        {/* 6. INTELLIGENT SYNERGY MATCHES */}
        <SectionHeader
          title="Intelligent Synergy Matches"
          subtitle="Direct 1-to-1 alignments with your published capabilities"
          badgeCount={matches.length}
          actionText="View All"
          onAction={() => router.push('/(tabs)/network' as any)}
          style={{ marginTop: SPACING.xl }}
        />

        {loadingMatches ? (
          <CardSkeleton />
        ) : matches && matches.length > 0 ? (
          matches.slice(0, 2).map((match) => <MatchCard key={match.id} match={match} />)
        ) : null}

        {/* 7. VERIFIED PARTNER PERKS */}
        <SectionHeader
          title="Ecosystem Partner Perks"
          subtitle="Corporate credits, cloud tooling & logistics negotiated for members"
          actionText="Directory"
          onAction={() => router.push('/(tabs)/partners' as any)}
          style={{ marginTop: SPACING.xl }}
        />

        {loadingPartners ? (
          <CardSkeleton />
        ) : (
          partners &&
          partners.slice(0, 2).map((p) => <PartnerCard key={p.id} partner={p} />)
        )}
      </ScrollView>

      {/* Slide-Up AI Assistant Sheet */}
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

  // 1. Welcome & Status Hero Card (Spacious & Minimalist)
  welcomeHeroCard: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.xxl,
    padding: SPACING.xl,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.22)',
    marginBottom: SPACING.xl,
    ...SHADOWS.md,
  },
  heroTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  statusPulsePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.25)',
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.accent,
  },
  statusPulseText: {
    color: COLORS.accent,
    fontSize: 9.5,
    fontWeight: '900',
    letterSpacing: 0.6,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: RADIUS.sm,
  },
  verifiedBadgeText: {
    color: COLORS.textMuted,
    fontSize: 10.5,
    fontWeight: '700',
  },
  heroGreeting: {
    color: COLORS.textPrimary,
    fontSize: 22,
    fontWeight: '900',
    marginTop: 4,
    letterSpacing: -0.4,
  },
  heroRole: {
    color: COLORS.textDim,
    fontSize: 12.5,
    marginTop: 2,
    marginBottom: SPACING.md,
  },
  heroSummaryBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: COLORS.bgElevated,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  heroSummaryText: {
    color: COLORS.textSecondary,
    fontSize: 13,
    lineHeight: 19,
    flex: 1,
  },
  heroHighlight: {
    color: COLORS.accent,
    fontWeight: '800',
  },
  heroActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  heroPrimaryBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: RADIUS.md,
    ...SHADOWS.glowPrimary,
  },
  heroPrimaryBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  heroSecondaryBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: COLORS.bgElevated,
    paddingVertical: 12,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  heroSecondaryBtnText: {
    color: COLORS.textPrimary,
    fontSize: 13,
    fontWeight: '700',
  },

  // 2. Dashboard Grid (Roomy 2x2 Layout)
  dashboardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
    marginBottom: SPACING.xl,
  },
  metricCard: {
    width: '47.5%',
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
  },
  metricHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  metricIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  metricTrendBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: RADIUS.xs,
  },
  metricTrendText: {
    color: COLORS.accent,
    fontSize: 10,
    fontWeight: '800',
  },
  metricValue: {
    color: COLORS.textPrimary,
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: -0.3,
  },
  metricTitle: {
    color: COLORS.textSecondary,
    fontSize: 12.5,
    fontWeight: '700',
    marginTop: 2,
  },
  metricSub: {
    color: COLORS.textDim,
    fontSize: 10.5,
    marginTop: 2,
  },

  // 3. Quick Navigation Hub (Roomy 3-column / 2-row Grid)
  quickHubGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  hubTile: {
    width: '31%',
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.lg,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xs,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  hubTileIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  hubTileTitle: {
    color: COLORS.textPrimary,
    fontSize: 11.5,
    fontWeight: '800',
  },
  hubTileSub: {
    color: COLORS.textDim,
    fontSize: 9,
    marginTop: 1,
    textAlign: 'center',
  },

  // 4. My Published Posts (Spacious Roomy Cards)
  myPostCard: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.md,
    ...SHADOWS.sm,
  },
  myPostHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  categoryBadge: {
    backgroundColor: COLORS.purpleSoft,
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: RADIUS.sm,
  },
  categoryBadgeText: {
    color: COLORS.primaryLight,
    fontSize: 11,
    fontWeight: '700',
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.accent,
  },
  statusPillText: {
    color: COLORS.accent,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  myPostTitle: {
    color: COLORS.textPrimary,
    fontSize: 15.5,
    fontWeight: '800',
    lineHeight: 21,
    marginBottom: 4,
  },
  myPostDesc: {
    color: COLORS.textSecondary,
    fontSize: 12.5,
    lineHeight: 18,
    marginBottom: SPACING.sm,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: SPACING.sm,
  },
  tagChip: {
    backgroundColor: COLORS.bgElevated,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: RADIUS.xs,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  tagChipText: {
    color: COLORS.textDim,
    fontSize: 10.5,
    fontWeight: '600',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    paddingVertical: SPACING.xs,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
    marginBottom: SPACING.sm,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    color: COLORS.textPrimary,
    fontSize: 11.5,
    fontWeight: '700',
  },
  responsesBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(16, 185, 129, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.2)',
    borderRadius: RADIUS.lg,
    paddingHorizontal: SPACING.md,
    paddingVertical: 8,
    marginBottom: SPACING.sm,
  },
  responsesLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  responsesText: {
    color: COLORS.textPrimary,
    fontSize: 11.5,
    fontWeight: '600',
  },
  responsesCount: {
    color: COLORS.accent,
    fontWeight: '900',
  },
  viewPitchesBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.accent,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: RADIUS.sm,
  },
  viewPitchesBtnText: {
    color: '#000000',
    fontSize: 10.5,
    fontWeight: '800',
  },
  postActionsFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: SPACING.sm,
    paddingTop: 4,
  },
  deletePostBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: RADIUS.sm,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
  },
  deletePostBtnText: {
    color: COLORS.danger,
    fontSize: 11,
    fontWeight: '700',
  },
  editPostBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.purpleSoft,
  },
  editPostBtnText: {
    color: COLORS.primaryLight,
    fontSize: 11,
    fontWeight: '700',
  },
});
