import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
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
} from 'lucide-react-native';
import { Header } from '../../src/components/common/Header';
import { SectionHeader } from '../../src/components/common/SectionHeader';
import { StatCard } from '../../src/components/common/StatCard';
import { EmptyState } from '../../src/components/common/EmptyState';
import { CardSkeleton } from '../../src/components/common/SkeletonLoader';
import { MatchCard } from '../../src/components/match/MatchCard';
import { OpportunityCard } from '../../src/components/opportunity/OpportunityCard';
import { PartnerCard } from '../../src/components/partner/PartnerCard';
import { AskLipTalkSheet } from '../../src/components/ai/AskLipTalkSheet';
import { matchesApi, opportunitiesApi, partnersApi, leadsApi, recommendationsApi } from '../../src/api/domain.api';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../../src/constants/theme';
import { useAuthStore } from '../../src/store/auth.store';

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [refreshing, setRefreshing] = useState(false);
  const [assistantVisible, setAssistantVisible] = useState(false);

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

  const { data: leads } = useQuery({
    queryKey: ['leads'],
    queryFn: leadsApi.getLeads,
  });

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([refetchMatches(), refetchOpportunities(), refetchPartners()]);
    setRefreshing(false);
  };

  const highMatchCount = (matches || []).filter((m) => m.matchScore >= 85).length;

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
            Search anything (e.g. React Native developers, B2B leads)...
          </Text>
          <View style={styles.aiSearchBadge}>
            <Sparkles size={11} color={COLORS.accent} />
            <Text style={styles.aiSearchBadgeText}>AI</Text>
          </View>
        </TouchableOpacity>

        {/* Premium Purple Hero Banner */}
        <View style={styles.heroBanner}>
          <View style={styles.heroContent}>
            <View style={styles.heroTagRow}>
              <View style={styles.livePulseDot} />
              <Text style={styles.heroTagText}>OPPORTUNITY ENGINE ACTIVE</Text>
            </View>

            <Text style={styles.heroGreeting}>
              Welcome back, {user?.profile?.firstName || 'Alex'}
            </Text>

            <Text style={styles.heroSub}>
              You have <Text style={styles.heroHighlight}>{highMatchCount || 3} high-confidence matches</Text> directly aligned with your published needs & services today.
            </Text>

            <View style={styles.heroActionRow}>
              <TouchableOpacity
                style={styles.heroPrimaryBtn}
                onPress={() => router.push('/opportunities/create' as any)}
                activeOpacity={0.82}
              >
                <PlusCircle size={15} color="#FFF" />
                <Text style={styles.heroPrimaryBtnText}>Post Requirement</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.heroSecondaryBtn}
                onPress={() => router.push('/(tabs)/network' as any)}
                activeOpacity={0.82}
              >
                <Compass size={15} color={COLORS.purpleLight} />
                <Text style={styles.heroSecondaryBtnText}>Explore Network</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Growth & Activity Pulse Grid */}
        <View style={styles.metricsRow}>
          <StatCard
            label="CRM Pipeline"
            value={`${leads?.length || 3} Deals`}
            subtitle="₹7.3L in discussion"
            icon={<TrendingUp size={18} color="#34D399" />}
            iconBg="rgba(16, 185, 129, 0.14)"
            trend="+12%"
            onPress={() => router.push('/leads' as any)}
          />

          <StatCard
            label="Open Demands"
            value={`${opportunities?.length || 3} Active`}
            subtitle="Matching your stack"
            icon={<Briefcase size={18} color="#A78BFA" />}
            iconBg={COLORS.purpleSoft}
            onPress={() => router.push('/(tabs)/opportunities' as any)}
          />

          <StatCard
            label="Connections"
            value="64"
            subtitle="Verified ecosystem"
            icon={<Users size={18} color="#FBBF24" />}
            iconBg="rgba(245, 158, 11, 0.14)"
            onPress={() => router.push('/(tabs)/network' as any)}
          />
        </View>

        {/* Commercial Ecosystem Quick Hub */}
        <View style={styles.ecosystemRow}>
          <TouchableOpacity
            style={styles.ecosystemBtn}
            onPress={() => router.push('/live' as any)}
            activeOpacity={0.8}
          >
            <View style={[styles.ecosystemIcon, { backgroundColor: 'rgba(239, 68, 68, 0.15)' }]}>
              <Radio size={16} color={COLORS.danger} />
            </View>
            <Text style={styles.ecosystemText}>Live Stages</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.ecosystemBtn}
            onPress={() => router.push('/marketplace' as any)}
            activeOpacity={0.8}
          >
            <View style={[styles.ecosystemIcon, { backgroundColor: 'rgba(139, 92, 246, 0.15)' }]}>
              <ShoppingBag size={16} color={COLORS.primaryLight} />
            </View>
            <Text style={styles.ecosystemText}>Marketplace</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.ecosystemBtn}
            onPress={() => router.push('/rewards' as any)}
            activeOpacity={0.8}
          >
            <View style={[styles.ecosystemIcon, { backgroundColor: 'rgba(16, 185, 129, 0.15)' }]}>
              <Coins size={16} color={COLORS.accent} />
            </View>
            <Text style={styles.ecosystemText}>Rewards</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.ecosystemBtn}
            onPress={() => router.push('/creator' as any)}
            activeOpacity={0.8}
          >
            <View style={[styles.ecosystemIcon, { backgroundColor: 'rgba(124, 58, 237, 0.15)' }]}>
              <Sparkles size={16} color={COLORS.primaryLight} />
            </View>
            <Text style={styles.ecosystemText}>Creator</Text>
          </TouchableOpacity>
        </View>

        {/* Section 1: Recommended Matches (Primary Feature) */}
        <SectionHeader
          title="Intelligent Synergy Matches"
          subtitle="Direct 1-to-1 alignments with your published needs & offers"
          icon={<Sparkles size={18} color={COLORS.accent} />}
          badgeCount={matches?.length}
          actionText="View All"
          onAction={() => router.push('/(tabs)/network' as any)}
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
  heroBanner: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.lg,
    ...SHADOWS.md,
  },
  heroContent: {
    width: '100%',
  },
  heroTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: SPACING.xs,
  },
  livePulseDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: COLORS.accent,
  },
  heroTagText: {
    color: COLORS.primaryLight,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
  heroGreeting: {
    color: COLORS.textPrimary,
    fontSize: 21,
    fontWeight: '900',
    marginTop: 2,
    letterSpacing: -0.3,
  },
  heroSub: {
    color: COLORS.textSecondary,
    fontSize: 13,
    marginTop: 6,
    lineHeight: 19,
  },
  heroHighlight: {
    color: COLORS.accent,
    fontWeight: '800',
  },
  heroActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginTop: SPACING.md,
  },
  heroPrimaryBtn: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: RADIUS.md,
    ...SHADOWS.glowPrimary,
  },
  heroPrimaryBtnText: {
    color: '#FFFFFF',
    fontSize: 12.5,
    fontWeight: '800',
  },
  heroSecondaryBtn: {
    backgroundColor: COLORS.bgElevated,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  heroSecondaryBtnText: {
    color: COLORS.textPrimary,
    fontSize: 12.5,
    fontWeight: '700',
  },
  metricsRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  ecosystemRow: {
    flexDirection: 'row',
    gap: SPACING.xs,
    marginBottom: SPACING.xl,
  },
  ecosystemBtn: {
    flex: 1,
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.lg,
    paddingVertical: SPACING.sm,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  ecosystemIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  ecosystemText: {
    color: COLORS.textPrimary,
    fontSize: 10.5,
    fontWeight: '800',
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
    marginBottom: SPACING.md,
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
});
