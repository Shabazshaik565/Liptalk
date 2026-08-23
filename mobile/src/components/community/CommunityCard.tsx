import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Users, Sparkles, ShieldCheck, ArrowRight } from 'lucide-react-native';
import { CommunityItem } from '../../types';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../../constants/theme';

interface CommunityCardProps {
  community: CommunityItem;
  onJoinToggle?: (id: string) => void;
}

export function CommunityCard({ community, onJoinToggle }: CommunityCardProps) {
  const router = useRouter();

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/communities/${community.id}` as any)}
      activeOpacity={0.85}
    >
      {/* Cover Image */}
      {community.coverImageUrl && (
        <Image source={{ uri: community.coverImageUrl }} style={styles.coverImage} />
      )}

      <View style={styles.body}>
        {/* Avatar + Member & Verification Row */}
        <View style={styles.topRow}>
          <Image
            source={{
              uri:
                community.avatarUrl ||
                'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=150',
            }}
            style={styles.avatar}
          />
          <View style={styles.metaCol}>
            <View style={styles.nameRow}>
              <Text style={styles.title} numberOfLines={1}>
                {community.name}
              </Text>
              {community.isVerified && (
                <ShieldCheck size={15} color={COLORS.accent} />
              )}
            </View>
            <View style={styles.statsRow}>
              <Users size={12} color={COLORS.textDim} />
              <Text style={styles.memberText}>
                {community.memberCount} members • {community.category}
              </Text>
            </View>
          </View>
        </View>

        {/* Recommended Synergy Tag */}
        {community.recommendedReason && (
          <View style={styles.synergyBadge}>
            <Sparkles size={12} color={COLORS.accent} />
            <Text style={styles.synergyText} numberOfLines={1}>
              {community.recommendedReason}
            </Text>
          </View>
        )}

        {/* Description */}
        <Text style={styles.description} numberOfLines={2}>
          {community.description}
        </Text>

        {/* Footer Actions */}
        <View style={styles.footer}>
          <Badge
            label={community.visibility}
            variant={community.visibility === 'PUBLIC' ? 'neutral' : 'warning'}
            size="sm"
          />
          <View style={{ flex: 1 }} />
          <Button
            title={community.isJoined ? 'Joined' : 'Join Guild'}
            variant={community.isJoined ? 'glass' : 'primary'}
            size="sm"
            onPress={() => onJoinToggle?.(community.id)}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
    marginBottom: SPACING.md,
    ...SHADOWS.sm,
  },
  coverImage: {
    width: '100%',
    height: 100,
    backgroundColor: COLORS.bgElevated,
  },
  body: {
    padding: SPACING.md,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    marginTop: -24,
    marginBottom: SPACING.xs,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 2.5,
    borderColor: COLORS.bgCard,
    backgroundColor: COLORS.bgElevated,
  },
  metaCol: {
    flex: 1,
    paddingTop: 16,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  title: {
    color: COLORS.textPrimary,
    fontSize: 15,
    fontWeight: '800',
    flex: 1,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  memberText: {
    color: COLORS.textDim,
    fontSize: 11,
    fontWeight: '500',
  },
  synergyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(16, 185, 129, 0.10)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: RADIUS.sm,
    marginVertical: SPACING.xs,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.25)',
  },
  synergyText: {
    color: COLORS.accent,
    fontSize: 11,
    fontWeight: '700',
    flex: 1,
  },
  description: {
    color: COLORS.textSecondary,
    fontSize: 12.5,
    lineHeight: 17,
    marginTop: 2,
    marginBottom: SPACING.sm,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: SPACING.sm,
  },
});
