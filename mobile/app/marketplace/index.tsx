import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Image,
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
  Store,
  Building2,
  ArrowLeftRight,
} from 'lucide-react-native';
import { Input } from '../../src/components/common/Input';
import { Button } from '../../src/components/common/Button';
import { PillTabs, PillTabItem } from '../../src/components/common/PillTabs';
import { MarketplaceListingCard } from '../../src/components/marketplace/MarketplaceListingCard';
import { CardSkeleton } from '../../src/components/common/SkeletonLoader';
import { EmptyState } from '../../src/components/common/EmptyState';
import { marketplaceApi, savedApi } from '../../src/api/domain.api';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../../src/constants/theme';

type MarketplaceCategoryFilter = 'ALL' | 'GT' | 'MT' | 'IT' | 'MARKETING' | 'DESIGN' | 'LEGAL';

export default function MarketplaceScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [search, setSearch] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<MarketplaceCategoryFilter>('ALL');
  const [tradeMode, setTradeMode] = useState<'ALL' | 'GT' | 'MT'>('ALL');
  const [showArtwork, setShowArtwork] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const { data: listings = [], isLoading, refetch } = useQuery({
    queryKey: ['marketplace_listings', search, selectedFilter],
    queryFn: () =>
      marketplaceApi.getListings({
        search: search || undefined,
        category:
          selectedFilter === 'GT'
            ? 'General Trade'
            : selectedFilter === 'MT'
            ? 'Modern Trade'
            : selectedFilter === 'IT'
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
    { id: 'GT', label: 'GT Kirana Wholesale' },
    { id: 'MT', label: 'MT Supermarket Chains' },
    { id: 'IT', label: 'Tech & Cloud' },
    { id: 'MARKETING', label: 'Growth & Ads' },
    { id: 'DESIGN', label: 'Design & UX' },
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

        {/* Unified Trade Arena: Left GT (Kirana) ⇄ Right MT (Supermarket) */}
        <View style={styles.tradeArenaCard}>
          <View style={styles.arenaTopBar}>
            <View style={styles.mascotBadge}>
              <Image
                source={require('../../assets/mascot/mascot_default.png')}
                style={styles.arenaMascot}
                resizeMode="contain"
              />
              <View>
                <Text style={styles.arenaMascotTitle}>LIPTALK COMMERCE PLATFORM</Text>
                <Text style={styles.arenaMascotSub}>Unified Market Sharing Architecture</Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.artworkToggleBtn}
              onPress={() => setShowArtwork(!showArtwork)}
              activeOpacity={0.8}
            >
              <Sparkles size={12} color="#FBBF24" />
              <Text style={styles.artworkToggleText}>
                {showArtwork ? 'Hide Board' : 'View Cartoon Board'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* DUAL SPLIT CARDS (LEFT GT vs RIGHT MT) */}
          <View style={styles.dualGrid}>
            {/* LEFT SIDE: GT (General Trade - Kirana) */}
            <TouchableOpacity
              style={[
                styles.gtCard,
                tradeMode === 'GT' && styles.gtCardSelected,
              ]}
              onPress={() => {
                const nextMode = tradeMode === 'GT' ? 'ALL' : 'GT';
                setTradeMode(nextMode);
                setSelectedFilter(nextMode === 'GT' ? 'GT' : 'ALL');
              }}
              activeOpacity={0.85}
            >
              <View style={styles.gtBubbleHeader}>
                <View style={styles.gtIconWrap}>
                  <Store size={15} color="#D97706" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.gtTagLabel}>GT</Text>
                  <Text style={styles.gtTagSub}>GENERAL TRADE</Text>
                </View>
              </View>

              <View style={styles.kiranaPill}>
                <Text style={styles.kiranaPillText}>KIRANA STORES</Text>
              </View>

              <View style={styles.perksWrap}>
                <Text style={styles.gtPerkItem}>• 500+ Local Kirana Hubs</Text>
                <Text style={styles.gtPerkItem}>• Direct Mill FMCG Wholesale</Text>
                <Text style={styles.gtPerkItem}>• Next-Morning Credit Supply</Text>
              </View>

              <View style={[styles.tradeSelectBtn, styles.gtBtn]}>
                <Text style={styles.gtBtnText}>
                  {tradeMode === 'GT' ? 'Active GT Filter' : 'Filter GT Kirana'}
                </Text>
              </View>
            </TouchableOpacity>

            {/* RIGHT SIDE: MT (Modern Trade - Supermarket) */}
            <TouchableOpacity
              style={[
                styles.mtCard,
                tradeMode === 'MT' && styles.mtCardSelected,
              ]}
              onPress={() => {
                const nextMode = tradeMode === 'MT' ? 'ALL' : 'MT';
                setTradeMode(nextMode);
                setSelectedFilter(nextMode === 'MT' ? 'MT' : 'ALL');
              }}
              activeOpacity={0.85}
            >
              <View style={styles.mtBubbleHeader}>
                <View style={styles.mtIconWrap}>
                  <Building2 size={15} color="#2563EB" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.mtTagLabel}>MT</Text>
                  <Text style={styles.mtTagSub}>MODERN TRADE</Text>
                </View>
              </View>

              <View style={styles.supermarketPill}>
                <Text style={styles.supermarketPillText}>SUPERMARKETS</Text>
              </View>

              <View style={styles.perksWrap}>
                <Text style={styles.mtPerkItem}>• 120+ Retail Hypermarkets</Text>
                <Text style={styles.mtPerkItem}>• Prime Aisle Merchandising</Text>
                <Text style={styles.mtPerkItem}>• EDI Central Logistics</Text>
              </View>

              <View style={[styles.tradeSelectBtn, styles.mtBtn]}>
                <Text style={styles.mtBtnText}>
                  {tradeMode === 'MT' ? 'Active MT Filter' : 'Filter MT Retail'}
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* CENTER BRIDGE STRIP */}
          <TouchableOpacity
            style={styles.bridgeStrip}
            onPress={() => {
              setTradeMode('ALL');
              setSelectedFilter('ALL');
            }}
            activeOpacity={0.8}
          >
            <View style={styles.bridgeIconCircle}>
              <ArrowLeftRight size={13} color="#FFF" />
            </View>
            <Text style={styles.bridgeStripText}>
              UNIFIED PLATFORM ACCESS — SHARING THE B2B MARKET
            </Text>
          </TouchableOpacity>

          {/* OPTIONAL EXPANDABLE FULL ARTWORK BOARD */}
          {showArtwork && (
            <View style={styles.tradeArtworkWrap}>
              <Image
                source={require('../../assets/marketplace/gt_vs_mt.jpg')}
                style={styles.tradeArtworkImg}
                resizeMode="contain"
              />
            </View>
          )}
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
  tradeArenaCard: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.xl,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
    marginBottom: SPACING.md,
    ...SHADOWS.md,
  },
  arenaTopBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
    paddingBottom: SPACING.xs,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  mascotBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    flex: 1,
  },
  arenaMascot: {
    width: 28,
    height: 28,
  },
  arenaMascotTitle: {
    color: COLORS.textPrimary,
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.6,
  },
  arenaMascotSub: {
    color: COLORS.textDim,
    fontSize: 9.5,
  },
  artworkToggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(245, 158, 11, 0.12)',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.25)',
  },
  artworkToggleText: {
    color: '#FBBF24',
    fontSize: 10,
    fontWeight: '700',
  },
  dualGrid: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginVertical: SPACING.xs,
  },
  gtCard: {
    flex: 1,
    backgroundColor: 'rgba(245, 158, 11, 0.06)',
    borderColor: 'rgba(245, 158, 11, 0.3)',
    borderWidth: 1.5,
    borderRadius: RADIUS.lg,
    padding: SPACING.sm,
    justifyContent: 'space-between',
  },
  gtCardSelected: {
    backgroundColor: 'rgba(245, 158, 11, 0.16)',
    borderColor: '#F59E0B',
    ...SHADOWS.glowAccent,
  },
  gtBubbleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    marginBottom: 4,
  },
  gtIconWrap: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gtTagLabel: {
    color: '#FBBF24',
    fontSize: 14,
    fontWeight: '900',
  },
  gtTagSub: {
    color: COLORS.textDim,
    fontSize: 8.5,
    fontWeight: '800',
  },
  kiranaPill: {
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
    borderRadius: RADIUS.full,
    paddingHorizontal: 6,
    paddingVertical: 2,
    alignSelf: 'flex-start',
    marginBottom: 6,
  },
  kiranaPillText: {
    color: '#FDE68A',
    fontSize: 8.5,
    fontWeight: '900',
  },
  perksWrap: {
    gap: 2,
    marginBottom: SPACING.sm,
  },
  gtPerkItem: {
    color: COLORS.textMuted,
    fontSize: 10,
    lineHeight: 14,
  },
  tradeSelectBtn: {
    borderRadius: RADIUS.md,
    paddingVertical: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gtBtn: {
    backgroundColor: 'rgba(245, 158, 11, 0.25)',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.5)',
  },
  gtBtnText: {
    color: '#FBBF24',
    fontSize: 10,
    fontWeight: '800',
  },
  mtCard: {
    flex: 1,
    backgroundColor: 'rgba(59, 130, 246, 0.06)',
    borderColor: 'rgba(59, 130, 246, 0.3)',
    borderWidth: 1.5,
    borderRadius: RADIUS.lg,
    padding: SPACING.sm,
    justifyContent: 'space-between',
  },
  mtCardSelected: {
    backgroundColor: 'rgba(59, 130, 246, 0.16)',
    borderColor: '#3B82F6',
    ...SHADOWS.glowPrimary,
  },
  mtBubbleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    marginBottom: 4,
  },
  mtIconWrap: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mtTagLabel: {
    color: '#60A5FA',
    fontSize: 14,
    fontWeight: '900',
  },
  mtTagSub: {
    color: COLORS.textDim,
    fontSize: 8.5,
    fontWeight: '800',
  },
  supermarketPill: {
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    borderRadius: RADIUS.full,
    paddingHorizontal: 6,
    paddingVertical: 2,
    alignSelf: 'flex-start',
    marginBottom: 6,
  },
  supermarketPillText: {
    color: '#BFDBFE',
    fontSize: 8.5,
    fontWeight: '900',
  },
  mtPerkItem: {
    color: COLORS.textMuted,
    fontSize: 10,
    lineHeight: 14,
  },
  mtBtn: {
    backgroundColor: 'rgba(59, 130, 246, 0.25)',
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.5)',
  },
  mtBtnText: {
    color: '#93C5FD',
    fontSize: 10,
    fontWeight: '800',
  },
  bridgeStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.xs,
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    borderColor: 'rgba(16, 185, 129, 0.3)',
    borderWidth: 1,
    borderRadius: RADIUS.full,
    paddingVertical: 6,
    paddingHorizontal: SPACING.sm,
    marginTop: SPACING.xs,
  },
  bridgeIconCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bridgeStripText: {
    color: '#34D399',
    fontSize: 9.5,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  tradeArtworkWrap: {
    width: '100%',
    height: 260,
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    marginTop: SPACING.sm,
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  tradeArtworkImg: {
    width: '100%',
    height: '100%',
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
