import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Plus,
  Search,
  Briefcase,
  Sparkles,
  FileText,
  MessageSquare,
  Trash2,
  Edit3,
  Calendar,
  IndianRupee,
  MapPin,
  CheckCircle2,
  Users,
  Clock,
} from 'lucide-react-native';
import { Header } from '../../src/components/common/Header';
import { OpportunityCard } from '../../src/components/opportunity/OpportunityCard';
import { Input } from '../../src/components/common/Input';
import { Button } from '../../src/components/common/Button';
import { PillTabs, PillTabItem } from '../../src/components/common/PillTabs';
import { EmptyState } from '../../src/components/common/EmptyState';
import { CardSkeleton } from '../../src/components/common/SkeletonLoader';
import { opportunitiesApi } from '../../src/api/domain.api';
import { OpportunityItem } from '../../src/types';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../../src/constants/theme';

type MainTab = 'ALL_DEMANDS' | 'MY_POSTS';
type CategoryFilter = 'ALL' | 'TECH' | 'DESIGN' | 'MARKETING';

export default function OpportunitiesScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const queryClient = useQueryClient();

  const [mainTab, setMainTab] = useState<MainTab>(
    params.tab === 'my_posts' ? 'MY_POSTS' : 'ALL_DEMANDS'
  );
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('ALL');
  const [refreshing, setRefreshing] = useState(false);

  // All public opportunities
  const {
    data: opportunities = [],
    isLoading: loadingAll,
    refetch: refetchAll,
  } = useQuery({
    queryKey: ['opportunities', search, categoryFilter],
    queryFn: () =>
      opportunitiesApi.getOpportunities({
        search: search || undefined,
        category:
          categoryFilter === 'TECH'
            ? 'IT'
            : categoryFilter === 'DESIGN'
            ? 'Design'
            : categoryFilter === 'MARKETING'
            ? 'Marketing'
            : undefined,
      }),
  });

  // User's own posted opportunities
  const {
    data: myPosts = [],
    isLoading: loadingMyPosts,
    refetch: refetchMyPosts,
  } = useQuery({
    queryKey: ['my-opportunities'],
    queryFn: () => opportunitiesApi.getMyOpportunities(),
  });

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([refetchAll(), refetchMyPosts()]);
    setRefreshing(false);
  };

  const handleDeletePost = (id: string, title: string) => {
    Alert.alert(
      'Withdraw Requirement',
      `Are you sure you want to remove "${title}"? This will close it to new inquiries.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Withdraw',
          style: 'destructive',
          onPress: async () => {
            await opportunitiesApi.deleteOpportunity(id);
            queryClient.invalidateQueries({ queryKey: ['my-opportunities'] });
            queryClient.invalidateQueries({ queryKey: ['opportunities'] });
          },
        },
      ]
    );
  };

  const categoryTabs: PillTabItem<CategoryFilter>[] = [
    { id: 'ALL', label: 'All Projects', count: opportunities?.length || 0 },
    { id: 'TECH', label: 'IT & Software' },
    { id: 'DESIGN', label: 'Design & UX' },
    { id: 'MARKETING', label: 'Marketing' },
  ];

  const filteredAll = (opportunities || []).filter((o) => {
    if (
      categoryFilter === 'TECH' &&
      !o.categoryName.toLowerCase().includes('it') &&
      !o.categoryName.toLowerCase().includes('software')
    )
      return false;
    if (categoryFilter === 'DESIGN' && !o.categoryName.toLowerCase().includes('design'))
      return false;
    if (categoryFilter === 'MARKETING' && !o.categoryName.toLowerCase().includes('marketing'))
      return false;
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      o.title.toLowerCase().includes(q) ||
      o.description.toLowerCase().includes(q) ||
      o.tags.some((t) => t.toLowerCase().includes(q))
    );
  });

  const filteredMyPosts = (myPosts || []).filter((o) => {
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
      <Header title="DEMANDS & REQUIREMENTS" subtitle="COMMERCIAL RFP & PROJECT BOARD" />

      {/* Main Top Navigation Segment: All Demands vs My Posts */}
      <View style={styles.topSegmentContainer}>
        <TouchableOpacity
          style={[styles.segmentBtn, mainTab === 'ALL_DEMANDS' && styles.segmentBtnActive]}
          onPress={() => setMainTab('ALL_DEMANDS')}
          activeOpacity={0.8}
        >
          <Briefcase
            size={14}
            color={mainTab === 'ALL_DEMANDS' ? '#FFFFFF' : COLORS.textMuted}
          />
          <Text
            style={[
              styles.segmentBtnText,
              mainTab === 'ALL_DEMANDS' && styles.segmentBtnTextActive,
            ]}
          >
            All Demands ({opportunities.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.segmentBtn, mainTab === 'MY_POSTS' && styles.segmentBtnActive]}
          onPress={() => setMainTab('MY_POSTS')}
          activeOpacity={0.8}
        >
          <FileText
            size={14}
            color={mainTab === 'MY_POSTS' ? '#FFFFFF' : COLORS.textMuted}
          />
          <Text
            style={[
              styles.segmentBtnText,
              mainTab === 'MY_POSTS' && styles.segmentBtnTextActive,
            ]}
          >
            My Posts ({myPosts.length})
          </Text>
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
        {/* Top Banner with Post Requirement CTA */}
        <View style={styles.topBanner}>
          <View style={{ flex: 1 }}>
            <View style={styles.badgeRow}>
              <Sparkles size={13} color={COLORS.primaryLight} />
              <Text style={styles.badgeRowText}>
                {mainTab === 'MY_POSTS' ? 'MY ACTIVE BROADCASTS' : 'PUBLIC REQUIREMENT BOARD'}
              </Text>
            </View>
            <Text style={styles.heading}>
              {mainTab === 'MY_POSTS' ? 'Manage Your Published Posts' : 'Post a Business Need'}
            </Text>
            <Text style={styles.subheading}>
              {mainTab === 'MY_POSTS'
                ? 'Track bids, review agency responses, and update requirements.'
                : 'Broadcast requirements to verified agencies and specialized freelancers.'}
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
          placeholder={
            mainTab === 'MY_POSTS'
              ? 'Search your published posts...'
              : 'Filter by skill, budget, tech stack, or city...'
          }
          icon={<Search size={18} color={COLORS.textDim} />}
          containerStyle={{ marginBottom: SPACING.sm }}
        />

        {/* Category Pills (Shown in All Demands mode) */}
        {mainTab === 'ALL_DEMANDS' && (
          <PillTabs
            tabs={categoryTabs}
            activeTab={categoryFilter}
            onTabChange={setCategoryFilter}
            scrollable
          />
        )}

        {/* Content Rendering based on Active Tab */}
        {mainTab === 'ALL_DEMANDS' ? (
          loadingAll ? (
            <>
              <CardSkeleton />
              <CardSkeleton />
            </>
          ) : filteredAll.length > 0 ? (
            filteredAll.map((opp) => (
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
                setCategoryFilter('ALL');
              }}
            />
          )
        ) : (
          /* MY POSTS VIEW */
          loadingMyPosts ? (
            <>
              <CardSkeleton />
              <CardSkeleton />
            </>
          ) : filteredMyPosts.length > 0 ? (
            filteredMyPosts.map((post) => (
              <View key={post.id} style={styles.myPostCard}>
                {/* Status and Category Header */}
                <View style={styles.myPostHeader}>
                  <View style={styles.categoryBadge}>
                    <Text style={styles.categoryBadgeText}>{post.categoryName}</Text>
                  </View>
                  <View style={styles.statusPill}>
                    <View style={styles.statusDot} />
                    <Text style={styles.statusPillText}>{post.status || 'OPEN'}</Text>
                  </View>
                </View>

                {/* Title and Description */}
                <Text style={styles.myPostTitle}>{post.title}</Text>
                <Text style={styles.myPostDesc} numberOfLines={2}>
                  {post.description}
                </Text>

                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                  <View style={styles.tagsRow}>
                    {post.tags.map((tag, idx) => (
                      <View key={idx} style={styles.tagChip}>
                        <Text style={styles.tagChipText}>#{tag}</Text>
                      </View>
                    ))}
                  </View>
                )}

                {/* Meta details (Budget, Deadline, City) */}
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

                {/* Pitches & Inquiry Response Highlight */}
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
                    <MessageSquare size={12} color="#FFF" />
                    <Text style={styles.viewPitchesBtnText}>View Inquiries</Text>
                  </TouchableOpacity>
                </View>

                {/* Actions Footer */}
                <View style={styles.postActionsFooter}>
                  <TouchableOpacity
                    style={styles.deletePostBtn}
                    onPress={() => handleDeletePost(post.id, post.title)}
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
              title="You Haven't Posted Any Requirements"
              description="Broadcast your first project demand to start receiving bids and proposals from verified specialists."
              actionTitle="Post Your First Need"
              onAction={() => router.push('/opportunities/create' as any)}
            />
          )
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
  topSegmentContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.bgCard,
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.sm,
    marginBottom: SPACING.sm,
    padding: 4,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  segmentBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 9,
    borderRadius: RADIUS.md,
  },
  segmentBtnActive: {
    backgroundColor: COLORS.primary,
    ...SHADOWS.glowPrimary,
  },
  segmentBtnText: {
    color: COLORS.textMuted,
    fontSize: 12.5,
    fontWeight: '700',
  },
  segmentBtnTextActive: {
    color: '#FFFFFF',
    fontWeight: '900',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.lg,
    paddingTop: SPACING.xs,
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
  // My Post Card Styles
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
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.sm,
  },
  categoryBadgeText: {
    color: COLORS.primaryLight,
    fontSize: 10.5,
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
    fontSize: 15,
    fontWeight: '800',
    lineHeight: 20,
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
    color: '#000',
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
