import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import {
  Search,
  ArrowLeft,
  Sparkles,
  Users,
  ShoppingBag,
  Briefcase,
  Layers,
  ChevronRight,
} from 'lucide-react-native';
import { Input } from '../../src/components/common/Input';
import { Badge } from '../../src/components/common/Badge';
import { PillTabs, PillTabItem } from '../../src/components/common/PillTabs';
import { EmptyState } from '../../src/components/common/EmptyState';
import { CardSkeleton } from '../../src/components/common/SkeletonLoader';
import { aiApi } from '../../src/api/domain.api';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../../src/constants/theme';

type SearchTab = 'ALL' | 'PEOPLE' | 'SERVICES' | 'OPPORTUNITIES' | 'COMMUNITIES';

export default function SemanticSearchScreen() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState<SearchTab>('ALL');

  const { data: results, isLoading } = useQuery({
    queryKey: ['semantic_search', query],
    queryFn: () => aiApi.searchSemantic(query),
    enabled: query.length >= 2,
  });

  const tabs: PillTabItem<SearchTab>[] = [
    { id: 'ALL', label: 'All Results' },
    { id: 'PEOPLE', label: 'People', count: results?.people?.length || 0 },
    { id: 'SERVICES', label: 'Services', count: results?.services?.length || 0 },
    { id: 'OPPORTUNITIES', label: 'Demands', count: results?.opportunities?.length || 0 },
    { id: 'COMMUNITIES', label: 'Guilds', count: results?.communities?.length || 0 },
  ];

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={styles.topNav}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={20} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.topNavTitle}>INTELLIGENT SEARCH</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Search Input Bar */}
        <Input
          value={query}
          onChangeText={setQuery}
          placeholder="e.g. Need someone to build an ecommerce mobile app..."
          icon={<Search size={18} color={COLORS.textDim} />}
          containerStyle={{ marginBottom: SPACING.md }}
        />

        {/* Filter Tabs */}
        {query.length >= 2 && (
          <PillTabs
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            scrollable
          />
        )}

        {/* Loading Skeleton */}
        {isLoading && (
          <View style={{ marginTop: SPACING.md }}>
            <CardSkeleton />
            <CardSkeleton />
          </View>
        )}

        {/* Empty Search Prompt */}
        {!query && (
          <View style={styles.promptCard}>
            <Sparkles size={22} color={COLORS.accent} />
            <Text style={styles.promptTitle}>Natural Language Discovery</Text>
            <Text style={styles.promptSub}>
              Type what you need in plain English. LipTalk AI matches across verified founders, service offerings, business contracts, and community guilds.
            </Text>

            <View style={styles.exampleTags}>
              {[
                'React Native developer in Bangalore',
                'B2B growth agency for SaaS',
                'Figma UI/UX design audit',
                'Angel investor & founder mixers',
              ].map((ex, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={styles.exampleChip}
                  onPress={() => setQuery(ex)}
                >
                  <Text style={styles.exampleChipText}>{ex}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* RESULTS: PEOPLE */}
        {results && (activeTab === 'ALL' || activeTab === 'PEOPLE') && results.people.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Users size={16} color={COLORS.primaryLight} />
              <Text style={styles.sectionTitle}>People & Founders ({results.people.length})</Text>
            </View>

            {results.people.map(({ user, score }) => (
              <TouchableOpacity
                key={user.id}
                style={styles.resultCard}
                onPress={() => router.push('/(tabs)/network' as any)}
              >
                <View style={{ flex: 1 }}>
                  <View style={styles.titleRow}>
                    <Text style={styles.itemTitle}>
                      {user.business?.businessName || user.profile?.fullName || 'Verified Member'}
                    </Text>
                    <Badge label={`${score}% Match`} variant="success" size="sm" />
                  </View>
                  <Text style={styles.itemSub}>{user.profile?.headline || 'Tech Professional'}</Text>
                  <Text style={styles.itemTags}>
                    {(user.profile?.skills || []).slice(0, 3).join(' • ')}
                  </Text>
                </View>
                <ChevronRight size={16} color={COLORS.textDim} />
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* RESULTS: SERVICES */}
        {results && (activeTab === 'ALL' || activeTab === 'SERVICES') && results.services.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <ShoppingBag size={16} color={COLORS.accent} />
              <Text style={styles.sectionTitle}>Marketplace Services ({results.services.length})</Text>
            </View>

            {results.services.map(({ listing, score }) => (
              <TouchableOpacity
                key={listing.id}
                style={styles.resultCard}
                onPress={() => router.push(`/marketplace/${listing.id}` as any)}
              >
                <View style={{ flex: 1 }}>
                  <View style={styles.titleRow}>
                    <Text style={styles.itemTitle}>{listing.title}</Text>
                    <Badge label={`${score}% Match`} variant="purple" size="sm" />
                  </View>
                  <Text style={styles.itemSub}>{listing.category} • {listing.location}</Text>
                  <Text style={styles.priceHighlight}>₹{listing.price?.toLocaleString()} {listing.pricingType}</Text>
                </View>
                <ChevronRight size={16} color={COLORS.textDim} />
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* RESULTS: DEMANDS / OPPORTUNITIES */}
        {results && (activeTab === 'ALL' || activeTab === 'OPPORTUNITIES') && results.opportunities.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Briefcase size={16} color="#FBBF24" />
              <Text style={styles.sectionTitle}>Active Demands ({results.opportunities.length})</Text>
            </View>

            {results.opportunities.map(({ opportunity, score }) => (
              <TouchableOpacity
                key={opportunity.id}
                style={styles.resultCard}
                onPress={() => router.push(`/opportunities/${opportunity.id}` as any)}
              >
                <View style={{ flex: 1 }}>
                  <View style={styles.titleRow}>
                    <Text style={styles.itemTitle}>{opportunity.title}</Text>
                    <Badge label={`${score}% Fit`} variant="warning" size="sm" />
                  </View>
                  <Text style={styles.itemSub}>{opportunity.categoryName} • ₹{opportunity.budgetAmount?.toLocaleString()} Budget</Text>
                </View>
                <ChevronRight size={16} color={COLORS.textDim} />
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* RESULTS: COMMUNITIES */}
        {results && (activeTab === 'ALL' || activeTab === 'COMMUNITIES') && results.communities.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Layers size={16} color="#60A5FA" />
              <Text style={styles.sectionTitle}>Ecosystem Guilds ({results.communities.length})</Text>
            </View>

            {results.communities.map(({ community, score }) => (
              <TouchableOpacity
                key={community.id}
                style={styles.resultCard}
                onPress={() => router.push(`/communities/${community.id}` as any)}
              >
                <View style={{ flex: 1 }}>
                  <View style={styles.titleRow}>
                    <Text style={styles.itemTitle}>{community.name}</Text>
                    <Badge label={`${score}% Fit`} variant="accent" size="sm" />
                  </View>
                  <Text style={styles.itemSub}>{community.category} • {community.memberCount} Members</Text>
                </View>
                <ChevronRight size={16} color={COLORS.textDim} />
              </TouchableOpacity>
            ))}
          </View>
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
  promptCard: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    marginTop: SPACING.md,
    ...SHADOWS.sm,
  },
  promptTitle: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: '900',
    marginTop: SPACING.sm,
  },
  promptSub: {
    color: COLORS.textSecondary,
    fontSize: 12.5,
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 18,
    marginBottom: SPACING.lg,
  },
  exampleTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.xs,
    justifyContent: 'center',
  },
  exampleChip: {
    backgroundColor: COLORS.bgInput,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  exampleChipText: {
    color: COLORS.primaryLight,
    fontSize: 11.5,
    fontWeight: '600',
  },
  section: {
    marginTop: SPACING.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: SPACING.sm,
  },
  sectionTitle: {
    color: COLORS.textPrimary,
    fontSize: 14,
    fontWeight: '800',
  },
  resultCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.xs,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  itemTitle: {
    color: COLORS.textPrimary,
    fontSize: 13.5,
    fontWeight: '800',
    flex: 1,
    marginRight: 6,
  },
  itemSub: {
    color: COLORS.textSecondary,
    fontSize: 11.5,
    marginBottom: 2,
  },
  itemTags: {
    color: COLORS.textDim,
    fontSize: 11,
  },
  priceHighlight: {
    color: COLORS.accent,
    fontSize: 12,
    fontWeight: '800',
    marginTop: 2,
  },
});
