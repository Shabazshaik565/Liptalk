import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Users,
  Plus,
  Search,
  Sparkles,
  Calendar,
  Layers,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react-native';
import { Header } from '../../src/components/common/Header';
import { Input } from '../../src/components/common/Input';
import { Button } from '../../src/components/common/Button';
import { PillTabs, PillTabItem } from '../../src/components/common/PillTabs';
import { CommunityCard } from '../../src/components/community/CommunityCard';
import { EventCard } from '../../src/components/community/EventCard';
import { CardSkeleton } from '../../src/components/common/SkeletonLoader';
import { EmptyState } from '../../src/components/common/EmptyState';
import { communitiesApi, eventsApi } from '../../src/api/domain.api';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../../src/constants/theme';

type CommunityFilter = 'ALL' | 'TECH' | 'MARKETING' | 'DESIGN' | 'EVENTS';

export default function CommunitiesScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<CommunityFilter>('ALL');
  const [refreshing, setRefreshing] = useState(false);

  const { data: communities = [], isLoading: loadingComms, refetch: refetchComms } = useQuery({
    queryKey: ['communities', search, selectedFilter],
    queryFn: () =>
      communitiesApi.getCommunities({
        search: search || undefined,
        category:
          selectedFilter === 'TECH'
            ? 'IT'
            : selectedFilter === 'MARKETING'
            ? 'Marketing'
            : selectedFilter === 'DESIGN'
            ? 'Design'
            : undefined,
      }),
  });

  const { data: recommended = [] } = useQuery({
    queryKey: ['communities_recommended'],
    queryFn: () => communitiesApi.getRecommended(),
  });

  const { data: events = [], refetch: refetchEvents } = useQuery({
    queryKey: ['events'],
    queryFn: () => eventsApi.getEvents(),
  });

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([refetchComms(), refetchEvents()]);
    setRefreshing(false);
  };

  const handleJoinToggle = async (communityId: string) => {
    await communitiesApi.joinCommunity(communityId);
    queryClient.invalidateQueries({ queryKey: ['communities'] });
    queryClient.invalidateQueries({ queryKey: ['communities_recommended'] });
  };

  const handleRegisterEvent = async (eventId: string) => {
    await eventsApi.registerEvent(eventId);
    queryClient.invalidateQueries({ queryKey: ['events'] });
  };

  const filterTabs: PillTabItem<CommunityFilter>[] = [
    { id: 'ALL', label: 'All Hubs', count: communities?.length || 0 },
    { id: 'TECH', label: 'Tech & SaaS' },
    { id: 'MARKETING', label: 'Growth & Ads' },
    { id: 'DESIGN', label: 'UI/UX Design' },
    { id: 'EVENTS', label: 'Mixers & Events', count: events?.length || 0 },
  ];

  return (
    <View style={styles.container}>
      <Header title="COMMUNITY HUBS" subtitle="VERIFIED PROFESSIONAL GUILDS" />

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
        {/* Top Banner with Create Guild CTA */}
        <View style={styles.topBanner}>
          <View style={{ flex: 1 }}>
            <View style={styles.badgeRow}>
              <Users size={13} color={COLORS.primaryLight} />
              <Text style={styles.badgeRowText}>COLLABORATIVE GUILDS</Text>
            </View>
            <Text style={styles.bannerTitle}>Join Niche Ecosystems</Text>
            <Text style={styles.bannerSub}>
              Engage in technical discussions, attend mixers, and source opportunities.
            </Text>
          </View>
          <Button
            title="Create Guild"
            variant="primary"
            size="sm"
            icon={<Plus size={14} color="#FFF" />}
            onPress={() => router.push('/communities/create' as any)}
          />
        </View>

        {/* Search */}
        <Input
          value={search}
          onChangeText={setSearch}
          placeholder="Search by topic, industry, skill, or founder..."
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

        {/* EVENTS TAB ONLY VIEW */}
        {selectedFilter === 'EVENTS' ? (
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeadingRow}>
              <Calendar size={16} color={COLORS.accent} />
              <Text style={styles.sectionTitle}>Upcoming Mixers & Masterclasses</Text>
            </View>
            {events.map((e) => (
              <EventCard key={e.id} event={e} onRegisterToggle={handleRegisterEvent} />
            ))}
          </View>
        ) : (
          <>
            {/* RECOMMENDED FOR YOU (Based on Needs/Offers) */}
            {!search && selectedFilter === 'ALL' && recommended.length > 0 && (
              <View style={styles.sectionContainer}>
                <View style={styles.sectionHeadingRow}>
                  <Sparkles size={16} color={COLORS.accent} />
                  <Text style={styles.sectionTitle}>Guilds Recommended for You</Text>
                </View>
                <Text style={styles.sectionSub}>
                  Matched with your active services, technical stack, and business needs.
                </Text>
                {recommended.slice(0, 2).map((comm) => (
                  <CommunityCard
                    key={comm.id}
                    community={comm}
                    onJoinToggle={handleJoinToggle}
                  />
                ))}
              </View>
            )}

            {/* ALL GUILDS LIST */}
            <View style={styles.sectionContainer}>
              <View style={styles.sectionHeadingRow}>
                <Layers size={16} color={COLORS.primaryLight} />
                <Text style={styles.sectionTitle}>
                  {selectedFilter === 'ALL' ? 'Explore Verified Hubs' : 'Filtered Communities'} (
                  {communities.length})
                </Text>
              </View>

              {loadingComms ? (
                <>
                  <CardSkeleton />
                  <CardSkeleton />
                </>
              ) : communities.length > 0 ? (
                communities.map((comm) => (
                  <CommunityCard
                    key={comm.id}
                    community={comm}
                    onJoinToggle={handleJoinToggle}
                  />
                ))
              ) : (
                <EmptyState
                  icon={<Users size={24} color={COLORS.primaryLight} />}
                  title="No Communities Found"
                  description="Try adjusting your keywords or browse all available hubs."
                  actionTitle="Clear Search"
                  onAction={() => setSearch('')}
                />
              )}
            </View>
          </>
        )}
      </ScrollView>
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
  topBanner: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: SPACING.sm,
    ...SHADOWS.sm,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 2,
  },
  badgeRowText: {
    color: COLORS.primaryLight,
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  bannerTitle: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: '900',
  },
  bannerSub: {
    color: COLORS.textMuted,
    fontSize: 12,
    marginTop: 2,
    lineHeight: 16,
  },
  sectionContainer: {
    marginTop: SPACING.md,
  },
  sectionHeadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  sectionTitle: {
    color: COLORS.textPrimary,
    fontSize: 15,
    fontWeight: '800',
  },
  sectionSub: {
    color: COLORS.textDim,
    fontSize: 11.5,
    marginBottom: SPACING.md,
  },
});
