import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Linking,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Video,
  Users,
  CheckCircle2,
  Share2,
  ExternalLink,
  ShieldCheck,
  Radio,
} from 'lucide-react-native';
import { Button } from '../../src/components/common/Button';
import { Badge } from '../../src/components/common/Badge';
import { CardSkeleton } from '../../src/components/common/SkeletonLoader';
import { eventsApi } from '../../src/api/domain.api';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../../src/constants/theme';

export default function EventDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: event, isLoading } = useQuery({
    queryKey: ['event', id],
    queryFn: () => eventsApi.getEventById(id || ''),
    enabled: !!id,
  });

  const handleRegisterToggle = async () => {
    if (!event) return;
    if (event.isRegistered) {
      await eventsApi.cancelRegistration(event.id);
    } else {
      await eventsApi.registerEvent(event.id);
    }
    queryClient.invalidateQueries({ queryKey: ['event', id] });
    queryClient.invalidateQueries({ queryKey: ['events'] });
  };

  const handleOpenLink = () => {
    if (event?.locationUrlOrAddress?.startsWith('http')) {
      Linking.openURL(event.locationUrlOrAddress);
    } else {
      Alert.alert('Venue Address', event?.locationUrlOrAddress || 'Location details will be shared prior to event.');
    }
  };

  if (isLoading || !event) {
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

  const isOnline = event.locationType === 'ONLINE';

  return (
    <View style={styles.container}>
      {/* Top Fixed Nav */}
      <View style={styles.topNav}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={20} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.topNavTitle}>EVENT DETAILS</Text>
        <TouchableOpacity style={styles.backBtn}>
          <Share2 size={18} color="#FFF" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Cover */}
        <Image
          source={{
            uri:
              event.coverImageUrl ||
              'https://images.unsplash.com/photo-1511578314322-379afb476865?w=600',
          }}
          style={styles.cover}
        />

        <View style={styles.body}>
          {/* Tag & Status Row */}
          <View style={styles.tagRow}>
            <Badge label={event.category} variant="purple" size="sm" />
            <View style={styles.locationBadge}>
              {isOnline ? (
                <Video size={12} color={COLORS.accent} />
              ) : (
                <MapPin size={12} color={COLORS.primaryLight} />
              )}
              <Text style={styles.locationBadgeText}>
                {isOnline ? 'Virtual Masterclass' : 'In-Person Mixer'}
              </Text>
            </View>
          </View>

          {/* Title */}
          <Text style={styles.title}>{event.title}</Text>

          {/* Host Community Card */}
          {event.community && (
            <TouchableOpacity
              style={styles.communityCard}
              onPress={() => router.push(`/communities/${event.community?.id}` as any)}
            >
              <Image
                source={{
                  uri:
                    event.community.avatarUrl ||
                    'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=150',
                }}
                style={styles.communityAvatar}
              />
              <View style={{ flex: 1 }}>
                <Text style={styles.communitySub}>HOSTED BY GUILD</Text>
                <Text style={styles.communityName}>{event.community.name}</Text>
              </View>
              <ShieldCheck size={16} color={COLORS.accent} />
            </TouchableOpacity>
          )}

          {/* Key Logistics */}
          <View style={styles.logisticsBox}>
            <View style={styles.logisticsItem}>
              <Calendar size={18} color={COLORS.primaryLight} />
              <View style={{ flex: 1 }}>
                <Text style={styles.logisticsLabel}>DATE</Text>
                <Text style={styles.logisticsValue}>{event.eventDate}</Text>
              </View>
            </View>

            <View style={styles.logisticsDivider} />

            <View style={styles.logisticsItem}>
              <Clock size={18} color={COLORS.accent} />
              <View style={{ flex: 1 }}>
                <Text style={styles.logisticsLabel}>TIME</Text>
                <Text style={styles.logisticsValue}>
                  {event.startTime} - {event.endTime || 'Late'}
                </Text>
              </View>
            </View>

            <View style={styles.logisticsDivider} />

            <TouchableOpacity style={styles.logisticsItem} onPress={handleOpenLink}>
              <MapPin size={18} color={COLORS.warning} />
              <View style={{ flex: 1 }}>
                <Text style={styles.logisticsLabel}>LOCATION / LINK</Text>
                <Text style={styles.logisticsLink} numberOfLines={1}>
                  {event.locationUrlOrAddress}
                </Text>
              </View>
              <ExternalLink size={14} color={COLORS.textDim} />
            </TouchableOpacity>
          </View>

          {/* Capacity Progress Meter */}
          <View style={styles.capacityCard}>
            <View style={styles.capacityHeader}>
              <Users size={14} color={COLORS.textDim} />
              <Text style={styles.capacityTitle}>
                {event.registeredCount} out of {event.capacity} Spots Claimed
              </Text>
            </View>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${Math.min(
                      Math.round((event.registeredCount / event.capacity) * 100),
                      100,
                    )}%`,
                  },
                ]}
              />
            </View>
          </View>

          {/* Event Agenda & Overview */}
          <Text style={styles.sectionHeading}>EVENT OVERVIEW</Text>
          <Text style={styles.description}>{event.description}</Text>

          {/* Interactive Live Audio/Video Stage CTA */}
          <TouchableOpacity
            style={styles.liveStageCta}
            onPress={() => router.push('/live/room_01' as any)}
            activeOpacity={0.85}
          >
            <View style={styles.liveStageBadge}>
              <View style={styles.liveStageDot} />
              <Text style={styles.liveStageBadgeText}>LIVE NOW</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.liveStageTitle}>Join Interactive Audio Stage</Text>
              <Text style={styles.liveStageSub}>38 founders & tech leads currently listening</Text>
            </View>
            <Radio size={18} color="#FFF" />
          </TouchableOpacity>

          {/* Bottom RSVP CTA */}
          <Button
            title={event.isRegistered ? 'Registration Confirmed' : 'RSVP Free Registration'}
            variant={event.isRegistered ? 'glass' : 'primary'}
            size="lg"
            icon={event.isRegistered ? <CheckCircle2 size={18} color={COLORS.accent} /> : undefined}
            onPress={handleRegisterToggle}
            style={{ marginTop: SPACING.lg, marginBottom: SPACING.xxl }}
          />
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
    paddingBottom: SPACING.tabBarClearance,
  },
  cover: {
    width: '100%',
    height: 180,
    backgroundColor: COLORS.bgElevated,
  },
  body: {
    padding: SPACING.lg,
  },
  tagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.xs,
  },
  locationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.bgCard,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  locationBadgeText: {
    color: COLORS.textSecondary,
    fontSize: 11,
    fontWeight: '700',
  },
  title: {
    color: COLORS.textPrimary,
    fontSize: 20,
    fontWeight: '900',
    lineHeight: 26,
    marginVertical: SPACING.xs,
  },
  communityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    gap: SPACING.md,
    marginVertical: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  communityAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: COLORS.bgDark,
  },
  communitySub: {
    color: COLORS.primaryLight,
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  communityName: {
    color: COLORS.textPrimary,
    fontSize: 13,
    fontWeight: '800',
  },
  logisticsBox: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.xl,
    padding: SPACING.md,
    marginVertical: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: SPACING.sm,
    ...SHADOWS.sm,
  },
  logisticsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    paddingVertical: 4,
  },
  logisticsDivider: {
    height: 1,
    backgroundColor: COLORS.border,
  },
  logisticsLabel: {
    color: COLORS.textDim,
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  logisticsValue: {
    color: COLORS.textPrimary,
    fontSize: 13,
    fontWeight: '700',
    marginTop: 1,
  },
  logisticsLink: {
    color: COLORS.primaryLight,
    fontSize: 12.5,
    fontWeight: '700',
    marginTop: 1,
  },
  capacityCard: {
    backgroundColor: COLORS.bgInput,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  capacityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  capacityTitle: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
  progressBar: {
    height: 6,
    backgroundColor: COLORS.bgDark,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.accent,
    borderRadius: 3,
  },
  sectionHeading: {
    color: COLORS.textPrimary,
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0.8,
    marginTop: SPACING.md,
    marginBottom: SPACING.xs,
  },
  description: {
    color: COLORS.textSecondary,
    fontSize: 13.5,
    lineHeight: 20,
  },
  liveStageCta: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.xl,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.4)',
    marginTop: SPACING.lg,
    gap: SPACING.sm,
    ...SHADOWS.sm,
  },
  liveStageBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
  },
  liveStageDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.danger,
  },
  liveStageBadgeText: {
    color: COLORS.danger,
    fontSize: 9,
    fontWeight: '900',
  },
  liveStageTitle: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '800',
  },
  liveStageSub: {
    color: COLORS.textDim,
    fontSize: 10.5,
  },
});
