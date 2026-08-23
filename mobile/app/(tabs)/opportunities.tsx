import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { Plus, Search, Briefcase, Sparkles } from 'lucide-react-native';
import { Header } from '../../src/components/common/Header';
import { OpportunityCard } from '../../src/components/opportunity/OpportunityCard';
import { Input } from '../../src/components/common/Input';
import { Button } from '../../src/components/common/Button';
import { PillTabs, PillTabItem } from '../../src/components/common/PillTabs';
import { EmptyState } from '../../src/components/common/EmptyState';
import { CardSkeleton } from '../../src/components/common/SkeletonLoader';
import { opportunitiesApi } from '../../src/api/domain.api';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../../src/constants/theme';

type OppFilter = 'ALL' | 'TECH' | 'DESIGN' | 'MARKETING';

export default function OpportunitiesScreen() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<OppFilter>('ALL');
  const [refreshing, setRefreshing] = useState(false);

  const { data: opportunities = [], isLoading, refetch } = useQuery({
    queryKey: ['opportunities', search, selectedFilter],
    queryFn: () =>
      opportunitiesApi.getOpportunities({
        search: search || undefined,
        category:
          selectedFilter === 'TECH'
            ? 'IT'
            : selectedFilter === 'DESIGN'
            ? 'Design'
            : selectedFilter === 'MARKETING'
            ? 'Marketing'
            : undefined,
      }),
  });

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const filterTabs: PillTabItem<OppFilter>[] = [
    { id: 'ALL', label: 'All Projects', count: opportunities?.length || 0 },
    { id: 'TECH', label: 'IT & Software' },
    { id: 'DESIGN', label: 'Design & UX' },
    { id: 'MARKETING', label: 'Marketing' },
  ];

  const filtered = (opportunities || []).filter((o) => {
    if (selectedFilter === 'TECH' && !o.categoryName.toLowerCase().includes('it') && !o.categoryName.toLowerCase().includes('software')) return false;
    if (selectedFilter === 'DESIGN' && !o.categoryName.toLowerCase().includes('design')) return false;
    if (selectedFilter === 'MARKETING' && !o.categoryName.toLowerCase().includes('marketing')) return false;
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      o.title.toLowerCase().includes(q) ||
      o.description.toLowerCase().includes(q) ||
      o.tags.some((t) => t.toLowerCase().includes(q))
    );
  });

  return (
    <View style={styles.container}>
      <Header title="OPPORTUNITIES" subtitle="OPEN CLIENT CONTRACTS & DEMANDS" />

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
        {/* Top Banner with Post Requirement CTA */}
        <View style={styles.topBanner}>
          <View style={{ flex: 1 }}>
            <View style={styles.badgeRow}>
              <Sparkles size={13} color={COLORS.primaryLight} />
              <Text style={styles.badgeRowText}>PUBLIC REQUIREMENT BOARD</Text>
            </View>
            <Text style={styles.heading}>Post a Business Need</Text>
            <Text style={styles.subheading}>
              Broadcast requirements to verified agencies and specialized freelancers.
            </Text>
          </View>
          <Button
            title="Post Need"
            variant="primary"
            size="sm"
            icon={<Plus size={14} color="#FFF" />}
            onPress={() => router.push('/opportunities/create' as any)}
          />
        </View>

        {/* Search */}
        <Input
          value={search}
          onChangeText={setSearch}
          placeholder="Filter by skill, budget, tech stack, or city..."
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

        {/* List */}
        {isLoading ? (
          <>
            <CardSkeleton />
            <CardSkeleton />
          </>
        ) : filtered.length > 0 ? (
          filtered.map((opp) => (
            <OpportunityCard key={opp.id} opportunity={opp} />
          ))
        ) : (
          <EmptyState
            icon={<Briefcase size={24} color={COLORS.primaryLight} />}
            title="No Opportunities Found"
            description="Try changing your search keywords or clear category filters."
            actionTitle="Clear Filter"
            onAction={() => {
              setSearch('');
              setSelectedFilter('ALL');
            }}
          />
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
  heading: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: '900',
  },
  subheading: {
    color: COLORS.textMuted,
    fontSize: 12,
    marginTop: 2,
    lineHeight: 16,
  },
});
