import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Modal,
  TextInput,
  RefreshControl,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  ArrowLeft,
  Users,
  ShieldCheck,
  Plus,
  MessageSquare,
  Calendar,
  Briefcase,
  Layers,
  Sparkles,
  Send,
  X,
  Megaphone,
} from 'lucide-react-native';
import { Button } from '../../src/components/common/Button';
import { Badge } from '../../src/components/common/Badge';
import { PillTabs, PillTabItem } from '../../src/components/common/PillTabs';
import { CommunityPostCard } from '../../src/components/community/CommunityPostCard';
import { EventCard } from '../../src/components/community/EventCard';
import { OpportunityCard } from '../../src/components/opportunity/OpportunityCard';
import { CardSkeleton } from '../../src/components/common/SkeletonLoader';
import { EmptyState } from '../../src/components/common/EmptyState';
import {
  communitiesApi,
  postsApi,
  eventsApi,
  opportunitiesApi,
} from '../../src/api/domain.api';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../../src/constants/theme';
import { CommunityPostItem, PostType } from '../../src/types';

type CommunityTab = 'POSTS' | 'EVENTS' | 'OPPORTUNITIES' | 'MEMBERS';

export default function CommunityDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState<CommunityTab>('POSTS');
  const [refreshing, setRefreshing] = useState(false);
  const [postModalVisible, setPostModalVisible] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostType, setNewPostType] = useState<PostType>('TEXT');

  // Comment Modal
  const [commentModalVisible, setCommentModalVisible] = useState(false);
  const [selectedPost, setSelectedPost] = useState<CommunityPostItem | null>(null);
  const [commentText, setCommentText] = useState('');

  const { data: community, isLoading: loadingComm, refetch: refetchComm } = useQuery({
    queryKey: ['community', id],
    queryFn: () => communitiesApi.getCommunityById(id || ''),
    enabled: !!id,
  });

  const { data: posts = [], refetch: refetchPosts } = useQuery({
    queryKey: ['community_posts', id],
    queryFn: () => postsApi.getCommunityPosts(id || ''),
    enabled: !!id,
  });

  const { data: events = [], refetch: refetchEvents } = useQuery({
    queryKey: ['community_events', id],
    queryFn: () => eventsApi.getEvents({ communityId: id }),
    enabled: !!id,
  });

  const { data: opportunities = [], refetch: refetchOpps } = useQuery({
    queryKey: ['community_opportunities', id],
    queryFn: () => opportunitiesApi.getOpportunities(),
  });

  const { data: members = [], refetch: refetchMembers } = useQuery({
    queryKey: ['community_members', id],
    queryFn: () => communitiesApi.getMembers(id || ''),
    enabled: !!id,
  });

  const { data: comments = [], refetch: refetchComments } = useQuery({
    queryKey: ['post_comments', selectedPost?.id],
    queryFn: () => (selectedPost ? postsApi.getComments(selectedPost.id) : []),
    enabled: !!selectedPost,
  });

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([
      refetchComm(),
      refetchPosts(),
      refetchEvents(),
      refetchOpps(),
      refetchMembers(),
    ]);
    setRefreshing(false);
  };

  const handleJoinToggle = async () => {
    if (!community) return;
    if (community.isJoined) {
      await communitiesApi.leaveCommunity(community.id);
    } else {
      await communitiesApi.joinCommunity(community.id);
    }
    queryClient.invalidateQueries({ queryKey: ['community', id] });
    queryClient.invalidateQueries({ queryKey: ['communities'] });
  };

  const handleLikePost = async (postId: string) => {
    await postsApi.reactPost(postId);
    queryClient.invalidateQueries({ queryKey: ['community_posts', id] });
  };

  const handleRegisterEvent = async (eventId: string) => {
    await eventsApi.registerEvent(eventId);
    queryClient.invalidateQueries({ queryKey: ['community_events', id] });
  };

  const handleCreatePost = async () => {
    if (!newPostContent.trim() || !community) return;
    await postsApi.createPost(community.id, {
      title: newPostTitle.trim() || undefined,
      content: newPostContent.trim(),
      type: newPostType,
    });
    setNewPostTitle('');
    setNewPostContent('');
    setPostModalVisible(false);
    queryClient.invalidateQueries({ queryKey: ['community_posts', id] });
  };

  const handleAddComment = async () => {
    if (!commentText.trim() || !selectedPost) return;
    await postsApi.addComment(selectedPost.id, commentText.trim());
    setCommentText('');
    refetchComments();
    queryClient.invalidateQueries({ queryKey: ['community_posts', id] });
  };

  const tabs: PillTabItem<CommunityTab>[] = [
    { id: 'POSTS', label: 'Discussions', count: posts?.length || 0 },
    { id: 'EVENTS', label: 'Mixers & Events', count: events?.length || 0 },
    { id: 'OPPORTUNITIES', label: 'Demands', count: opportunities?.length || 0 },
    { id: 'MEMBERS', label: 'Members', count: community?.memberCount || 0 },
  ];

  if (loadingComm || !community) {
    return (
      <View style={styles.container}>
        <View style={styles.topNav}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <ArrowLeft size={20} color="#FFF" />
          </TouchableOpacity>
        </View>
        <View style={{ padding: SPACING.lg }}>
          <CardSkeleton />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Top Fixed Header with Back Button */}
      <View style={styles.topNav}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={20} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.topNavTitle} numberOfLines={1}>
          {community.name}
        </Text>
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
        {/* Cover Image */}
        <Image
          source={{
            uri:
              community.coverImageUrl ||
              'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600',
          }}
          style={styles.cover}
        />

        {/* Guild Identity Card */}
        <View style={styles.headerCard}>
          <Image
            source={{
              uri:
                community.avatarUrl ||
                'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=150',
            }}
            style={styles.avatar}
          />
          <View style={styles.headerInfo}>
            <View style={styles.titleRow}>
              <Text style={styles.guildName}>{community.name}</Text>
              {community.isVerified && <ShieldCheck size={18} color={COLORS.accent} />}
            </View>

            <View style={styles.badgeRow}>
              <Badge label={community.category} variant="purple" size="sm" />
              <Text style={styles.memberStat}>
                {community.memberCount} Members • {community.visibility}
              </Text>
            </View>

            <Text style={styles.descriptionText}>{community.description}</Text>

            {/* Guild Rules Accordion Preview */}
            {community.rules && community.rules.length > 0 && (
              <View style={styles.rulesBox}>
                <Text style={styles.rulesHeading}>GUILD CHARTER & RULES:</Text>
                {community.rules.map((rule, idx) => (
                  <Text key={idx} style={styles.ruleItem}>
                    • {rule}
                  </Text>
                ))}
              </View>
            )}

            {/* Action Bar */}
            <View style={styles.actionRow}>
              <Button
                title={community.isJoined ? 'Joined Member' : 'Join Guild'}
                variant={community.isJoined ? 'glass' : 'primary'}
                size="md"
                onPress={handleJoinToggle}
                style={{ flex: 1 }}
              />
              <Button
                title="Post"
                variant="accent"
                size="md"
                icon={<Plus size={16} color="#FFF" />}
                onPress={() => setPostModalVisible(true)}
              />
            </View>
          </View>
        </View>

        {/* Sub-Navigation Pill Tabs */}
        <View style={{ marginVertical: SPACING.md }}>
          <PillTabs
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            scrollable
          />
        </View>

        {/* TAB 1: POSTS & DISCUSSIONS */}
        {activeTab === 'POSTS' && (
          <View style={styles.tabContent}>
            {posts.length > 0 ? (
              posts.map((post) => (
                <CommunityPostCard
                  key={post.id}
                  post={post}
                  onLikeToggle={handleLikePost}
                  onCommentPress={(p) => {
                    setSelectedPost(p);
                    setCommentModalVisible(true);
                  }}
                />
              ))
            ) : (
              <EmptyState
                icon={<MessageSquare size={24} color={COLORS.primaryLight} />}
                title="No Discussions Yet"
                description="Be the first to share an insight, ask a question, or post an announcement!"
                actionTitle="Start Discussion"
                onAction={() => setPostModalVisible(true)}
              />
            )}
          </View>
        )}

        {/* TAB 2: EVENTS & MIXERS */}
        {activeTab === 'EVENTS' && (
          <View style={styles.tabContent}>
            {events.length > 0 ? (
              events.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  onRegisterToggle={handleRegisterEvent}
                />
              ))
            ) : (
              <EmptyState
                icon={<Calendar size={24} color={COLORS.accent} />}
                title="No Scheduled Events"
                description="Upcoming mixers and webinars hosted in this guild will appear here."
              />
            )}
          </View>
        )}

        {/* TAB 3: INTEGRATED OPPORTUNITIES */}
        {activeTab === 'OPPORTUNITIES' && (
          <View style={styles.tabContent}>
            <View style={styles.oppIntroBox}>
              <Sparkles size={14} color={COLORS.accent} />
              <Text style={styles.oppIntroText}>
                Active demands matching this guild's specialization.
              </Text>
            </View>
            {opportunities.slice(0, 3).map((opp) => (
              <OpportunityCard key={opp.id} opportunity={opp} />
            ))}
          </View>
        )}

        {/* TAB 4: MEMBERS ROSTER */}
        {activeTab === 'MEMBERS' && (
          <View style={styles.tabContent}>
            <View style={styles.memberListBox}>
              <View style={styles.memberCardRow}>
                <Image
                  source={{
                    uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
                  }}
                  style={styles.memberAvatar}
                />
                <View style={{ flex: 1 }}>
                  <Text style={styles.memberName}>Alex Morgan (You)</Text>
                  <Text style={styles.memberRole}>Founder @ Nexas Digital</Text>
                </View>
                <Badge label="Owner" variant="primary" size="sm" />
              </View>

              <View style={styles.memberCardRow}>
                <Image
                  source={{
                    uri: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
                  }}
                  style={styles.memberAvatar}
                />
                <View style={{ flex: 1 }}>
                  <Text style={styles.memberName}>Vikram Singh</Text>
                  <Text style={styles.memberRole}>CTO @ FinFlow Logistics</Text>
                </View>
                <Button
                  title="Message"
                  variant="glass"
                  size="sm"
                  onPress={() => router.push('/chat/conv_01' as any)}
                />
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      {/* CREATE POST MODAL */}
      <Modal visible={postModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>New Guild Discussion</Text>
              <TouchableOpacity onPress={() => setPostModalVisible(false)}>
                <X size={20} color={COLORS.textDim} />
              </TouchableOpacity>
            </View>

            {/* Post Type Selector */}
            <View style={styles.postTypeRow}>
              {(['TEXT', 'QUESTION', 'ANNOUNCEMENT'] as PostType[]).map((t) => (
                <TouchableOpacity
                  key={t}
                  style={[
                    styles.postTypeChip,
                    newPostType === t && styles.postTypeChipActive,
                  ]}
                  onPress={() => setNewPostType(t)}
                >
                  <Text
                    style={[
                      styles.postTypeText,
                      newPostType === t && styles.postTypeTextActive,
                    ]}
                  >
                    {t}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TextInput
              style={styles.modalTitleInput}
              placeholder="Discussion Topic / Question Headline (Optional)"
              placeholderTextColor={COLORS.textDim}
              value={newPostTitle}
              onChangeText={setNewPostTitle}
            />

            <TextInput
              style={styles.modalContentInput}
              placeholder="Share architectural insights, queries, or opportunities..."
              placeholderTextColor={COLORS.textDim}
              multiline
              numberOfLines={4}
              value={newPostContent}
              onChangeText={setNewPostContent}
            />

            <Button
              title="Publish to Guild"
              variant="primary"
              size="md"
              icon={<Send size={15} color="#FFF" />}
              onPress={handleCreatePost}
              style={{ marginTop: SPACING.md }}
            />
          </View>
        </View>
      </Modal>

      {/* COMMENTS MODAL */}
      <Modal visible={commentModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Comments & Replies</Text>
              <TouchableOpacity onPress={() => setCommentModalVisible(false)}>
                <X size={20} color={COLORS.textDim} />
              </TouchableOpacity>
            </View>

            {/* Comments List */}
            <ScrollView style={{ maxHeight: 240, marginVertical: SPACING.sm }}>
              {comments.length > 0 ? (
                comments.map((c) => (
                  <View key={c.id} style={styles.commentItem}>
                    <Text style={styles.commentAuthor}>
                      {c.author?.profile?.fullName || 'Member'}
                    </Text>
                    <Text style={styles.commentContent}>{c.content}</Text>
                  </View>
                ))
              ) : (
                <Text style={styles.noCommentsText}>
                  No comments yet. Start the conversation!
                </Text>
              )}
            </ScrollView>

            <View style={styles.commentInputRow}>
              <TextInput
                style={styles.commentInput}
                placeholder="Write a constructive reply..."
                placeholderTextColor={COLORS.textDim}
                value={commentText}
                onChangeText={setCommentText}
              />
              <TouchableOpacity
                style={styles.commentSendBtn}
                onPress={handleAddComment}
              >
                <Send size={16} color="#FFF" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    fontSize: 15,
    fontWeight: '800',
    flex: 1,
    textAlign: 'center',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: SPACING.tabBarClearance,
  },
  cover: {
    width: '100%',
    height: 140,
    backgroundColor: COLORS.bgElevated,
  },
  headerCard: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    marginHorizontal: SPACING.lg,
    marginTop: -32,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.md,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 3,
    borderColor: COLORS.bgCard,
    backgroundColor: COLORS.bgElevated,
    marginBottom: SPACING.sm,
  },
  headerInfo: {},
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  guildName: {
    color: COLORS.textPrimary,
    fontSize: 18,
    fontWeight: '900',
    flex: 1,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginVertical: SPACING.xs,
  },
  memberStat: {
    color: COLORS.textDim,
    fontSize: 11.5,
    fontWeight: '600',
  },
  descriptionText: {
    color: COLORS.textSecondary,
    fontSize: 13,
    lineHeight: 18,
    marginVertical: SPACING.xs,
  },
  rulesBox: {
    backgroundColor: COLORS.bgInput,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    marginVertical: SPACING.sm,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.primaryLight,
  },
  rulesHeading: {
    color: COLORS.primaryLight,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  ruleItem: {
    color: COLORS.textSecondary,
    fontSize: 11.5,
    lineHeight: 16,
    marginVertical: 1,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginTop: SPACING.sm,
  },
  tabContent: {
    paddingHorizontal: SPACING.lg,
  },
  oppIntroBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(16, 185, 129, 0.08)',
    padding: SPACING.sm,
    borderRadius: RADIUS.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.2)',
  },
  oppIntroText: {
    color: COLORS.accent,
    fontSize: 11.5,
    fontWeight: '700',
    flex: 1,
  },
  memberListBox: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.xl,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  memberCardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  memberAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: COLORS.bgDark,
  },
  memberName: {
    color: COLORS.textPrimary,
    fontSize: 13.5,
    fontWeight: '800',
  },
  memberRole: {
    color: COLORS.textDim,
    fontSize: 11,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: COLORS.bgCard,
    borderTopLeftRadius: RADIUS.xxl,
    borderTopRightRadius: RADIUS.xxl,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  modalTitle: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: '800',
  },
  postTypeRow: {
    flexDirection: 'row',
    gap: SPACING.xs,
    marginBottom: SPACING.sm,
  },
  postTypeChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.bgInput,
  },
  postTypeChipActive: {
    backgroundColor: COLORS.primary,
  },
  postTypeText: {
    color: COLORS.textDim,
    fontSize: 10.5,
    fontWeight: '700',
  },
  postTypeTextActive: {
    color: '#FFF',
  },
  modalTitleInput: {
    backgroundColor: COLORS.bgInput,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    color: COLORS.textPrimary,
    fontSize: 13.5,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  modalContentInput: {
    backgroundColor: COLORS.bgInput,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    color: COLORS.textPrimary,
    fontSize: 13.5,
    height: 100,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  commentItem: {
    backgroundColor: COLORS.bgInput,
    padding: SPACING.sm,
    borderRadius: RADIUS.md,
    marginBottom: 6,
  },
  commentAuthor: {
    color: COLORS.primaryLight,
    fontSize: 11,
    fontWeight: '800',
  },
  commentContent: {
    color: COLORS.textSecondary,
    fontSize: 12.5,
    marginTop: 2,
  },
  noCommentsText: {
    color: COLORS.textDim,
    fontSize: 12,
    textAlign: 'center',
    paddingVertical: SPACING.md,
  },
  commentInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    marginTop: SPACING.sm,
  },
  commentInput: {
    flex: 1,
    backgroundColor: COLORS.bgInput,
    borderRadius: RADIUS.md,
    padding: SPACING.sm,
    color: COLORS.textPrimary,
    fontSize: 13,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  commentSendBtn: {
    backgroundColor: COLORS.primary,
    padding: SPACING.sm,
    borderRadius: RADIUS.md,
  },
});
