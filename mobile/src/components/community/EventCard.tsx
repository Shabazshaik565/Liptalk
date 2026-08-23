import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Calendar, Clock, MapPin, Video, Users, CheckCircle2 } from 'lucide-react-native';
import { EventItem } from '../../types';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../../constants/theme';

interface EventCardProps {
  event: EventItem;
  onRegisterToggle?: (id: string) => void;
}

export function EventCard({ event, onRegisterToggle }: EventCardProps) {
  const router = useRouter();

  const isOnline = event.locationType === 'ONLINE';

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/events/${event.id}` as any)}
      activeOpacity={0.85}
    >
      {/* Cover */}
      {event.coverImageUrl && (
        <Image source={{ uri: event.coverImageUrl }} style={styles.cover} />
      )}

      <View style={styles.body}>
        {/* Category & Status Bar */}
        <View style={styles.topRow}>
          <Badge label={event.category} variant="purple" size="sm" />
          <View style={styles.locationBadge}>
            {isOnline ? (
              <Video size={11} color={COLORS.accent} />
            ) : (
              <MapPin size={11} color={COLORS.primaryLight} />
            )}
            <Text style={styles.locationText}>
              {isOnline ? 'Online Masterclass' : 'In-Person Mixer'}
            </Text>
          </View>
        </View>

        {/* Title */}
        <Text style={styles.title} numberOfLines={2}>
          {event.title}
        </Text>

        {/* Date & Time */}
        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Calendar size={13} color={COLORS.accent} />
            <Text style={styles.infoText}>{event.eventDate}</Text>
          </View>
          {event.startTime && (
            <View style={styles.infoItem}>
              <Clock size={13} color={COLORS.textDim} />
              <Text style={styles.infoText}>
                {event.startTime} {event.endTime ? ` - ${event.endTime}` : ''}
              </Text>
            </View>
          )}
        </View>

        {/* Location / Host */}
        <View style={styles.hostRow}>
          <Text style={styles.locationDetail} numberOfLines={1}>
            {event.locationUrlOrAddress}
          </Text>
        </View>

        {/* Footer with Capacity & RSVP */}
        <View style={styles.footer}>
          <View style={styles.capacityCol}>
            <View style={styles.capacityRow}>
              <Users size={12} color={COLORS.textDim} />
              <Text style={styles.capacityText}>
                {event.registeredCount} / {event.capacity} Registered
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

          <Button
            title={event.isRegistered ? 'Registered' : 'RSVP Free'}
            variant={event.isRegistered ? 'glass' : 'primary'}
            size="sm"
            icon={event.isRegistered ? <CheckCircle2 size={13} color={COLORS.accent} /> : undefined}
            onPress={() => onRegisterToggle?.(event.id)}
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
  cover: {
    width: '100%',
    height: 110,
    backgroundColor: COLORS.bgElevated,
  },
  body: {
    padding: SPACING.md,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.xs,
  },
  locationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.bgInput,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.sm,
  },
  locationText: {
    color: COLORS.textSecondary,
    fontSize: 10.5,
    fontWeight: '700',
  },
  title: {
    color: COLORS.textPrimary,
    fontSize: 15,
    fontWeight: '800',
    lineHeight: 20,
    marginVertical: 4,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    marginTop: 4,
    marginBottom: 6,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  infoText: {
    color: COLORS.textSecondary,
    fontSize: 11.5,
    fontWeight: '600',
  },
  hostRow: {
    marginBottom: SPACING.sm,
  },
  locationDetail: {
    color: COLORS.textDim,
    fontSize: 11,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: SPACING.sm,
    gap: SPACING.md,
  },
  capacityCol: {
    flex: 1,
  },
  capacityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  capacityText: {
    color: COLORS.textDim,
    fontSize: 10.5,
    fontWeight: '600',
  },
  progressBar: {
    height: 4,
    backgroundColor: COLORS.bgInput,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.accent,
    borderRadius: 2,
  },
});
