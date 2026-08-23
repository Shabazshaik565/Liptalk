import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Heart, MessageSquare, Pin, HelpCircle, Megaphone, Share2 } from 'lucide-react-native';
import { CommunityPostItem } from '../../types';
import { Badge } from '../common/Badge';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../../constants/theme';

interface CommunityPostCardProps {
  post: CommunityPostItem;
  onLikeToggle?: (id: string) => void;
  onCommentPress?: (post: CommunityPostItem) => void;
}

export function CommunityPostCard({
  post,
  onLikeToggle,
  onCommentPress,
}: CommunityPostCardProps) {
  const getPostTypeBadge = (type: CommunityPostItem['type']) => {
    switch (type) {
      case 'ANNOUNCEMENT':
        return (
          <Badge
            label="Announcement"
            variant="primary"
            size="sm"
            icon={<Megaphone size={11} color="#FFF" />}
          />
        );
      case 'QUESTION':
        return (
          <Badge
            label="Question"
            variant="warning"
            size="sm"
            icon={<HelpCircle size={11} color="#FFF" />}
          />
        );
      default:
        return null;
    }
  };

  return (
    <View style={[styles.card, post.isPinned && styles.pinnedCard]}>
      {/* Pinned Tag */}
      {post.isPinned && (
        <View style={styles.pinnedRow}>
          <Pin size={11} color={COLORS.primaryLight} />
          <Text style={styles.pinnedText}>PINNED ANNOUNCEMENT</Text>
        </View>
      )}

      {/* Author Bar */}
      <View style={styles.authorRow}>
        <Image
          source={{
            uri:
              post.author.profile?.avatarUrl ||
              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
          }}
          style={styles.avatar}
        />
        <View style={styles.authorMeta}>
          <View style={styles.nameRow}>
            <Text style={styles.authorName} numberOfLines={1}>
              {post.author.profile?.fullName || 'Community Member'}
            </Text>
            {getPostTypeBadge(post.type)}
          </View>
          <Text style={styles.authorHeadline} numberOfLines={1}>
            {post.author.businesses?.[0]?.businessName ||
              post.author.profile?.headline ||
              'Verified Executive'}
          </Text>
        </View>
      </View>

      {/* Post Title */}
      {post.title && <Text style={styles.postTitle}>{post.title}</Text>}

      {/* Content */}
      <Text style={styles.postContent}>{post.content}</Text>

      {/* Engagement Footer */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.actionBtn, post.hasLiked && styles.actionBtnActive]}
          onPress={() => onLikeToggle?.(post.id)}
          activeOpacity={0.7}
        >
          <Heart
            size={16}
            color={post.hasLiked ? COLORS.danger : COLORS.textDim}
            fill={post.hasLiked ? COLORS.danger : 'transparent'}
          />
          <Text style={[styles.actionText, post.hasLiked && styles.actionTextLiked]}>
            {post.likesCount}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => onCommentPress?.(post)}
          activeOpacity={0.7}
        >
          <MessageSquare size={16} color={COLORS.textDim} />
          <Text style={styles.actionText}>{post.commentsCount} comments</Text>
        </TouchableOpacity>

        <View style={{ flex: 1 }} />

        <TouchableOpacity style={styles.shareBtn} activeOpacity={0.7}>
          <Share2 size={14} color={COLORS.textDim} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.xl,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.sm,
    ...SHADOWS.sm,
  },
  pinnedCard: {
    borderColor: COLORS.primaryDark,
    backgroundColor: COLORS.bgElevated,
  },
  pinnedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: SPACING.xs,
  },
  pinnedText: {
    color: COLORS.primaryLight,
    fontSize: 9.5,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.bgDark,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  authorMeta: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 6,
  },
  authorName: {
    color: COLORS.textPrimary,
    fontSize: 13.5,
    fontWeight: '800',
    flex: 1,
  },
  authorHeadline: {
    color: COLORS.textDim,
    fontSize: 11,
    fontWeight: '500',
    marginTop: 1,
  },
  postTitle: {
    color: COLORS.textPrimary,
    fontSize: 14.5,
    fontWeight: '900',
    marginBottom: 4,
    lineHeight: 19,
  },
  postContent: {
    color: COLORS.textSecondary,
    fontSize: 13,
    lineHeight: 18,
    marginBottom: SPACING.sm,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: SPACING.xs,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: RADIUS.md,
  },
  actionBtnActive: {
    backgroundColor: 'rgba(239, 68, 68, 0.08)',
  },
  actionText: {
    color: COLORS.textDim,
    fontSize: 12,
    fontWeight: '700',
  },
  actionTextLiked: {
    color: COLORS.danger,
    fontWeight: '900',
  },
  shareBtn: {
    padding: 6,
  },
});
