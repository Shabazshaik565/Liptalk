import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import {
  Sparkles,
  BarChart3,
  Plus,
  Heart,
  Eye,
  Briefcase,
  ShoppingBag,
  UserPlus,
  UserCheck,
  Radio,
} from 'lucide-react-native';
import { Header } from '../../src/components/common/Header';
import { Badge } from '../../src/components/common/Badge';
import { CardSkeleton } from '../../src/components/common/SkeletonLoader';
import { creatorApi } from '../../src/api/domain.api';
import { ProfessionalContentItem } from '../../src/types';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../../src/constants/theme';

export default function CreatorStudioScreen() {
  const router = useRouter();
  const [followingMap, setFollowingMap] = useState<Record<string, boolean>>({});

  const { data: feed = [], isLoading, refetch } = useQuery({
    queryKey: ['creator-feed'],
    queryFn: () => creatorApi.getFeed(),
  });

  const handleToggleFollow = async (userId: string) => {
    setFollowingMap((prev) => ({
      ...prev,
      [userId]: !prev[userId],
    }));
    await creatorApi.toggleFollow(userId);
  };

  return (
    <View style={styles.container}>
      <Header
        title="CREATOR STUDIO"
        subtitle="BROADCASTING & AUDIENCE HUB"
        showBack
        onBack={() => router.back()}
        rightAction={
          <TouchableOpacity
            style={styles.analyticsBtn}
            onPress={() => router.push('/creator/analytics' as any)}
            activeOpacity={0.8}
          >
            <BarChart3 size={15} color="#FFF" />
            <Text style={styles.analyticsBtnText}>Analytics</Text>
          </TouchableOpacity>
        }
      />

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} tintColor={COLORS.primaryLight} />}
      >
        {/* Creator Studio Hero Banner */}
        <View style={styles.heroCard}>
          <View style={styles.heroHeader}>
            <View>
              <Text style={styles.heroTitle}>Professional Creator Mode</Text>
              <Text style={styles.heroSub}>
                Publish verified case studies, teardowns, and broadcast live to the ecosystem.
              </Text>
            </View>
          </View>

          <View style={styles.heroActionsRow}>
            <TouchableOpacity
              style={styles.publishBtn}
              onPress={() => router.push('/creator/publish' as any)}
              activeOpacity={0.85}
            >
              <Plus size={15} color="#FFF" />
              <Text style={styles.publishBtnText}>Publish Broadcast</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.hostStageBtn}
              onPress={() => router.push('/live/create' as any)}
              activeOpacity={0.85}
            >
              <Radio size={15} color={COLORS.primaryLight} />
              <Text style={styles.hostStageBtnText}>Host Stage</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Feed Section Title */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>PROFESSIONAL BROADCASTS & TEARDOWNS</Text>
          <Text style={styles.sectionSub}>Curated insights & case studies from verified leaders</Text>
        </View>

        {isLoading ? (
          <>
            <CardSkeleton />
            <CardSkeleton />
          </>
        ) : (
          feed.map((post) => {
            const isFollowing = followingMap[post.author.id] ?? post.isFollowing;
            return (
              <View key={post.id} style={styles.postCard}>
                {/* Author Row */}
                <View style={styles.authorRow}>
                  <Image
                    source={{
                      uri:
                        post.author?.profile?.avatarUrl ||
                        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
                    }}
                    style={styles.authorAvatar}
                  />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.authorName}>
                      {post.author?.profile?.fullName || 'Alex Morgan'}
                    </Text>
                    <Text style={styles.authorHeadline} numberOfLines={1}>
                      {post.author?.profile?.headline || 'Tech Founder & Broadcaster'}
                    </Text>
                  </View>

                  <TouchableOpacity
                    style={[styles.followBtn, isFollowing && styles.followBtnActive]}
                    onPress={() => handleToggleFollow(post.author.id)}
                    activeOpacity={0.8}
                  >
                    {isFollowing ? (
                      <>
                        <UserCheck size={12} color={COLORS.accent} />
                        <Text style={[styles.followBtnText, { color: COLORS.accent }]}>Following</Text>
                      </>
                    ) : (
                      <>
                        <UserPlus size={12} color="#FFF" />
                        <Text style={styles.followBtnText}>Follow</Text>
                      </>
                    )}
                  </TouchableOpacity>
                </View>

                {/* Post Body */}
                <Text style={styles.postTitle}>{post.title}</Text>
                <Text style={styles.postBody}>{post.body}</Text>

                {/* Media Image */}
                {post.mediaUrls && post.mediaUrls[0] ? (
                  <Image source={{ uri: post.mediaUrls[0] }} style={styles.postImage} />
                ) : null}

                {/* Linked Ecosystem Integrations */}
                <View style={styles.linksRow}>
                  <TouchableOpacity
                    style={styles.integrationBadge}
                    onPress={() => router.push('/marketplace' as any)}
                  >
                    <ShoppingBag size={12} color={COLORS.primaryLight} />
                    <Text style={styles.integrationBadgeText}>Marketplace Service Retainer</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.integrationBadge}
                    onPress={() => router.push('/(tabs)/opportunities' as any)}
                  >
                    <Briefcase size={12} color={COLORS.accent} />
                    <Text style={[styles.integrationBadgeText, { color: COLORS.accent }]}>
                      Active Project Demand
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Footer Metrics */}
                <View style={styles.postFooter}>
                  <View style={styles.metricItem}>
                    <Eye size={13} color={COLORS.textDim} />
                    <Text style={styles.metricText}>{post.viewsCount} impressions</Text>
                  </View>
                  <View style={styles.metricItem}>
                    <Heart size={13} color={COLORS.primaryLight} />
                    <Text style={styles.metricText}>{post.likesCount} appreciations</Text>
                  </View>
                </View>
              </View>
            );
          })
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
  analyticsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(124, 58, 237, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.primaryLight,
  },
  analyticsBtnText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '800',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.lg,
    gap: SPACING.lg,
    paddingBottom: SPACING.tabBarClearance,
  },
  heroCard: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.primaryDark,
    ...SHADOWS.md,
  },
  heroHeader: {
    marginBottom: SPACING.md,
  },
  heroTitle: {
    color: '#FFF',
    fontSize: 17,
    fontWeight: '800',
    marginBottom: 4,
  },
  heroSub: {
    color: COLORS.textDim,
    fontSize: 12.5,
    lineHeight: 18,
  },
  heroActionsRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  publishBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    borderRadius: RADIUS.lg,
    ...SHADOWS.glowPrimary,
  },
  publishBtnText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '800',
  },
  hostStageBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: COLORS.bgElevated,
    paddingVertical: 10,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  hostStageBtnText: {
    color: COLORS.primaryLight,
    fontSize: 12,
    fontWeight: '800',
  },
  sectionHeader: {
    marginTop: SPACING.xs,
  },
  sectionTitle: {
    color: COLORS.primaryLight,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginBottom: 2,
  },
  sectionSub: {
    color: COLORS.textDim,
    fontSize: 12,
  },
  postCard: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  authorAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  authorName: {
    color: COLORS.textPrimary,
    fontSize: 13,
    fontWeight: '800',
  },
  authorHeadline: {
    color: COLORS.textDim,
    fontSize: 11,
  },
  followBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: RADIUS.full,
  },
  followBtnActive: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  followBtnText: {
    color: '#FFF',
    fontSize: 10.5,
    fontWeight: '800',
  },
  postTitle: {
    color: COLORS.textPrimary,
    fontSize: 15,
    fontWeight: '800',
    lineHeight: 21,
    marginBottom: 6,
  },
  postBody: {
    color: COLORS.textSecondary,
    fontSize: 13,
    lineHeight: 19,
    marginBottom: SPACING.md,
  },
  postImage: {
    width: '100%',
    height: 160,
    borderRadius: RADIUS.lg,
    marginBottom: SPACING.md,
  },
  linksRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.xs,
    marginBottom: SPACING.md,
  },
  integrationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.bgDark,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  integrationBadgeText: {
    color: COLORS.primaryLight,
    fontSize: 11,
    fontWeight: '700',
  },
  postFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.lg,
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  metricItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  metricText: {
    color: COLORS.textDim,
    fontSize: 11,
  },
});
