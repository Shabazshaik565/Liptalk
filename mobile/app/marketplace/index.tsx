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
  ShoppingBag,
  Search,
  Plus,
  ArrowLeft,
  Sparkles,
  Layers,
  Bookmark,
} from 'lucide-react-native';
import { Input } from '../../src/components/common/Input';
import { Button } from '../../src/components/common/Button';
import { PillTabs, PillTabItem } from '../../src/components/common/PillTabs';
import { MarketplaceListingCard } from '../../src/components/marketplace/MarketplaceListingCard';
import { CardSkeleton } from '../../src/components/common/SkeletonLoader';
import { EmptyState } from '../../src/components/common/EmptyState';
import { marketplaceApi, savedApi } from '../../src/api/domain.api';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../../src/constants/theme';

type MarketplaceCategoryFilter = 'ALL' | 'IT' | 'MARKETING' | 'DESIGN' | 'LEGAL';

export default function MarketplaceScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [search, setSearch] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<MarketplaceCategoryFilter>('ALL');
  const [refreshing, setRefreshing] = useState(false);

  const { data: listings = [], isLoading, refetch } = useQuery({
    queryKey: ['marketplace_listings', search, selectedFilter],
    queryFn: () =>
      marketplaceApi.getListings({
        search: search || undefined,
        category:
          selectedFilter === 'IT'
            ? 'IT'
            : selectedFilter === 'MARKETING'
            ? 'Marketing'
            : selectedFilter === 'DESIGN'
            ? 'Design'
            : selectedFilter === 'LEGAL'
            ? 'Legal'
            : undefined,
      }),
  });

  const { data: recommended = [] } = useQuery({
    queryKey: ['marketplace_recommended'],
    queryFn: () => marketplaceApi.getRecommended(),
  });

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handleSaveToggle = async (listingId: string) => {
    await savedApi.toggleSave('LISTING', listingId);
    queryClient.invalidateQueries({ queryKey: ['marketplace_listings'] });
    queryClient.invalidateQueries({ queryKey: ['marketplace_recommended'] });
  };

  const filterTabs: PillTabItem<MarketplaceCategoryFilter>[] = [
    { id: 'ALL', label: 'All Services', count: listings.length },
    { id: 'IT', label: 'Tech & Cloud' },
    { id: 'MARKETING', label: 'B2B Growth & Ads' },
    { id: 'DESIGN', label: 'Product & UX' },
    { id: 'LEGAL', label: 'Legal & Retainers' },
  ];

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={styles.topNav}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={20} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.topNavTitle}>MARKETPLACE</Text>
        <TouchableOpacity
          onPress={() => router.push('/saved' as any)}
          style={styles.backBtn}
        >
          <Bookmark size={18} color="#FFF" />
        </TouchableOpacity>
      </View>

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
        {/* Banner with List Service CTA */}
        <View style={styles.banner}>
          <View style={{ flex: 1 }}>
            <View style={styles.badgeRow}>
              <ShoppingBag size={12} color={COLORS.primaryLight} />
              <Text style={styles.badgeText}>VERIFIED B2B DIRECTORY</Text>
            </View>
            <Text style={styles.bannerTitle}>Professional Marketplace</Text>
            <Text style={styles.bannerSub}>
              Discover vetted tech agencies, growth studios, and specialist retainers.
            </Text>
          </View>
          <Button
            title="List Service"
            variant="primary"
            size="sm"
            icon={<Plus size={14} color="#FFF" />}
            onPress={() => router.push('/marketplace/create' as any)}
          />
        </View>

        {/* Search */}
        <Input
          value={search}
          onChangeText={setSearch}
          placeholder="Search by skill, agency, stack, or deliverable..."
          icon={<Search size={18} color={COLORS.textDim} />}
          containerStyle={{ marginBottom: SPACING.sm }}
        />

        {/* Categories */}
        <PillTabs
          tabs={filterTabs}
          activeTab={selectedFilter}
          onTabChange={setSelectedFilter}
          scrollable
        />

        {/* RECOMMENDED FOR YOU (Synergy with active user Needs) */}
        {!search && selectedFilter === 'ALL' && recommended.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Sparkles size={16} color={COLORS.accent} />
              <Text style={styles.sectionTitle}>Matching Your Active Needs</Text>
            </View>
            <Text style={styles.sectionSub}>
              Top-rated providers specialized in solving your published business demands.
            </Text>
            {recommended.slice(0, 2).map((item) => (
              <MarketplaceListingCard
                key={item.id}
                listing={item}
                onSaveToggle={handleSaveToggle}
              />
            ))}
          </View>
        )}

        {/* ALL LISTINGS */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Layers size={16} color={COLORS.primaryLight} />
            <Text style={styles.sectionTitle}>
              {selectedFilter === 'ALL' ? 'Explore Offerings' : 'Filtered Services'} (
              {listings.length})
            </Text>
          </View>

          {isLoading ? (
            <>
              <CardSkeleton />
              <CardSkeleton />
            </>
          ) : listings.length > 0 ? (
            listings.map((item) => (
              <MarketplaceListingCard
                key={item.id}
                listing={item}
                onSaveToggle={handleSaveToggle}
              />
            ))
          ) : (
            <EmptyState
              icon={<ShoppingBag size={24} color={COLORS.primaryLight} />}
              title="No Offerings Found"
              description="Try adjusting your keywords or category filters."
              actionTitle="Clear Search"
              onAction={() => setSearch('')}
            />
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgDark,
  },
  topNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingTop: 48,
    paddingBottom: SPACING.sm,
    backgroundColor: COLORS.bgDark,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.bgCard,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topNavTitle: {
    color: COLORS.textPrimary,
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.lg,
    paddingBottom: SPACING.tabBarClearance,
  },
  banner: {
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
  badgeText: {
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
  section: {
    marginTop: SPACING.md,
  },
  sectionHeader: {
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
