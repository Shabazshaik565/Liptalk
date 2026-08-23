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
  Radio,
  Users,
  Calendar,
  Sparkles,
  Plus,
  Compass,
  ArrowRight,
} from 'lucide-react-native';
import { Header } from '../../src/components/common/Header';
import { Badge } from '../../src/components/common/Badge';
import { CardSkeleton } from '../../src/components/common/SkeletonLoader';
import { EmptyState } from '../../src/components/common/EmptyState';
import { liveRoomsApi } from '../../src/api/domain.api';
import { LiveRoomItem } from '../../src/types';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../../src/constants/theme';

export default function LiveRoomsDiscoveryScreen() {
  const router = useRouter();
  const [selectedFilter, setSelectedFilter] = useState<'ALL' | 'LIVE' | 'UPCOMING'>('ALL');

  const { data: rooms = [], isLoading, refetch } = useQuery({
    queryKey: ['live-rooms'],
    queryFn: () => liveRoomsApi.getRooms(),
  });

  const filteredRooms = rooms.filter((r) => {
    if (selectedFilter === 'LIVE') return r.status === 'LIVE';
    if (selectedFilter === 'UPCOMING') return r.status === 'SCHEDULED';
    return true;
  });

  return (
    <View style={styles.container}>
      <Header
        title="LIVE ECOSYSTEM"
        subtitle="INTERACTIVE AUDIO & VIDEO STAGES"
        showBack
        onBack={() => router.back()}
        rightAction={
          <TouchableOpacity
            style={styles.hostBtn}
            onPress={() => router.push('/live/create' as any)}
            activeOpacity={0.8}
          >
            <Plus size={14} color="#FFF" />
            <Text style={styles.hostBtnText}>Host Stage</Text>
          </TouchableOpacity>
        }
      />

      {/* Filter Tabs */}
      <View style={styles.filterRow}>
        {(['ALL', 'LIVE', 'UPCOMING'] as const).map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.filterTab, selectedFilter === tab && styles.filterTabActive]}
            onPress={() => setSelectedFilter(tab)}
          >
            <Text
              style={[
                styles.filterTabText,
                selectedFilter === tab && styles.filterTabTextActive,
              ]}
            >
              {tab === 'LIVE' ? '🔴 Live Now' : tab === 'UPCOMING' ? '📅 Upcoming' : '🌐 All Stages'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} tintColor={COLORS.primaryLight} />}
      >
        {isLoading ? (
          <>
            <CardSkeleton />
            <CardSkeleton />
          </>
        ) : filteredRooms.length > 0 ? (
          filteredRooms.map((room) => (
            <TouchableOpacity
              key={room.id}
              style={styles.roomCard}
              onPress={() => router.push(`/live/${room.id}` as any)}
              activeOpacity={0.85}
            >
              {/* Cover Header */}
              <View style={styles.coverWrapper}>
                <Image source={{ uri: room.coverImageUrl }} style={styles.coverImage} />
                <View style={styles.coverOverlay}>
                  {room.status === 'LIVE' ? (
                    <View style={styles.livePulseBadge}>
                      <View style={styles.livePulseDot} />
                      <Text style={styles.livePulseText}>LIVE • {room.audienceCount} LISTENING</Text>
                    </View>
                  ) : (
                    <View style={styles.scheduledBadge}>
                      <Calendar size={12} color="#FFF" />
                      <Text style={styles.scheduledBadgeText}>SCHEDULED SESSION</Text>
                    </View>
                  )}
                  <Badge label={room.roomType} variant="purple" size="sm" />
                </View>
              </View>

              {/* Room Details */}
              <View style={styles.roomDetails}>
                <Text style={styles.roomCategory}>{room.category.toUpperCase()}</Text>
                <Text style={styles.roomTitle}>{room.title}</Text>
                {room.description ? (
                  <Text style={styles.roomSub} numberOfLines={2}>
                    {room.description}
                  </Text>
                ) : null}

                {/* Host & CTA Row */}
                <View style={styles.hostRow}>
                  <View style={styles.hostInfo}>
                    <Image
                      source={{
                        uri:
                          room.host?.profile?.avatarUrl ||
                          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
                      }}
                      style={styles.hostAvatar}
                    />
                    <View>
                      <Text style={styles.hostName}>
                        {room.host?.profile?.fullName || 'Alex Morgan'}
                      </Text>
                      <Text style={styles.hostHeadline}>Host & Moderator</Text>
                    </View>
                  </View>

                  <TouchableOpacity
                    style={[styles.joinBtn, room.status === 'LIVE' ? styles.joinBtnLive : styles.joinBtnScheduled]}
                    onPress={() => router.push(`/live/${room.id}` as any)}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.joinBtnText}>
                      {room.status === 'LIVE' ? 'Join Stage' : 'Set Reminder'}
                    </Text>
                    <ArrowRight size={14} color="#FFF" />
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <EmptyState
            icon={<Radio size={32} color={COLORS.primaryLight} />}
            title="No Live Stages Active"
            description="Be the first to broadcast a live masterclass or networking session to the ecosystem."
            actionTitle="Host a Stage"
            onAction={() => router.push('/live/create' as any)}
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
  hostBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
  },
  hostBtnText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '800',
  },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    gap: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  filterTab: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.bgCard,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  filterTabActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primaryLight,
  },
  filterTabText: {
    color: COLORS.textDim,
    fontSize: 12,
    fontWeight: '700',
  },
  filterTabTextActive: {
    color: '#FFF',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.lg,
    gap: SPACING.lg,
    paddingBottom: SPACING.tabBarClearance,
  },
  roomCard: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
  },
  coverWrapper: {
    height: 140,
    position: 'relative',
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  coverOverlay: {
    position: 'absolute',
    top: SPACING.md,
    left: SPACING.md,
    right: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  livePulseBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(239, 68, 68, 0.9)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: RADIUS.full,
  },
  livePulseDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#FFF',
  },
  livePulseText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  scheduledBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(30, 20, 50, 0.85)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  scheduledBadgeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '800',
  },
  roomDetails: {
    padding: SPACING.lg,
  },
  roomCategory: {
    color: COLORS.primaryLight,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  roomTitle: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: '800',
    lineHeight: 22,
    marginBottom: 6,
  },
  roomSub: {
    color: COLORS.textDim,
    fontSize: 12.5,
    lineHeight: 18,
    marginBottom: SPACING.md,
  },
  hostRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  hostInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  hostAvatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
  },
  hostName: {
    color: COLORS.textPrimary,
    fontSize: 12,
    fontWeight: '700',
  },
  hostHeadline: {
    color: COLORS.textDim,
    fontSize: 10,
  },
  joinBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: RADIUS.full,
  },
  joinBtnLive: {
    backgroundColor: COLORS.primary,
  },
  joinBtnScheduled: {
    backgroundColor: COLORS.bgElevated,
  },
  joinBtnText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '800',
  },
});
