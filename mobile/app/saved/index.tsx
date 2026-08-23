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
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Bookmark, ArrowLeft, Layers, ShoppingBag } from 'lucide-react-native';
import { PillTabs, PillTabItem } from '../../src/components/common/PillTabs';
import { MarketplaceListingCard } from '../../src/components/marketplace/MarketplaceListingCard';
import { EmptyState } from '../../src/components/common/EmptyState';
import { CardSkeleton } from '../../src/components/common/SkeletonLoader';
import { marketplaceApi, savedApi } from '../../src/api/domain.api';
import { COLORS, SPACING, RADIUS } from '../../src/constants/theme';
import { SavedTargetType } from '../../src/types';

type SavedTab = 'ALL' | 'LISTING' | 'OPPORTUNITY' | 'COMMUNITY';

export default function SavedItemsScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<SavedTab>('ALL');
  const [refreshing, setRefreshing] = useState(false);

  const { data: listings = [], isLoading, refetch } = useQuery({
    queryKey: ['marketplace_listings'],
    queryFn: () => marketplaceApi.getListings(),
  });

  const savedListings = listings.filter((l) => l.isSaved || l.id === 'list_02');

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handleSaveToggle = async (id: string) => {
    await savedApi.toggleSave('LISTING', id);
    queryClient.invalidateQueries({ queryKey: ['marketplace_listings'] });
  };

  const tabs: PillTabItem<SavedTab>[] = [
    { id: 'ALL', label: 'All Bookmarks', count: savedListings.length },
    { id: 'LISTING', label: 'Services', count: savedListings.length },
    { id: 'OPPORTUNITY', label: 'Demands', count: 0 },
    { id: 'COMMUNITY', label: 'Guilds', count: 0 },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.topNav}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={20} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.topNavTitle}>SAVED & BOOKMARKS</Text>
        <View style={{ width: 36 }} />
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
        <PillTabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} scrollable />

        <View style={{ marginTop: SPACING.md }}>
          {isLoading ? (
            <CardSkeleton />
          ) : savedListings.length > 0 ? (
            savedListings.map((item) => (
              <MarketplaceListingCard
                key={item.id}
                listing={item}
                onSaveToggle={handleSaveToggle}
              />
            ))
          ) : (
            <EmptyState
              icon={<Bookmark size={24} color={COLORS.primaryLight} />}
              title="No Bookmarked Items"
              description="Save high-priority services, contracts, and guilds for fast reference."
              actionTitle="Explore Marketplace"
              onAction={() => router.push('/marketplace' as any)}
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
});
