import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Calendar, Sparkles, MapPin, IndianRupee } from 'lucide-react-native';
import { OpportunityItem } from '../../types';
import { COLORS, RADIUS, SPACING, SHADOWS } from '../../constants/theme';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';

interface OpportunityCardProps {
  opportunity: OpportunityItem;
  onExpressInterest?: () => void;
}

export const OpportunityCard: React.FC<OpportunityCardProps> = ({
  opportunity,
  onExpressInterest,
}) => {
  const router = useRouter();

  const formattedBudget = opportunity.budgetAmount
    ? `₹${opportunity.budgetAmount.toLocaleString('en-IN')}`
    : 'Negotiable';

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.creatorRow}>
          <Image
            source={{
              uri:
                opportunity.creatorAvatar ||
                'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
            }}
            style={styles.avatar}
          />
          <View style={styles.creatorTextCol}>
            <Text style={styles.creatorName}>{opportunity.creatorName}</Text>
            <View style={styles.subMetaRow}>
              <Text style={styles.businessName}>
                {opportunity.businessName || opportunity.categoryName}
              </Text>
              <Text style={styles.dot}>•</Text>
              <Text style={styles.city}>{opportunity.city}</Text>
            </View>
          </View>
        </View>

        {opportunity.matchScore && (
          <View style={styles.matchPill}>
            <Sparkles size={11} color={COLORS.accent} />
            <Text style={styles.matchText}>{opportunity.matchScore}% Match</Text>
          </View>
        )}
      </View>

      {/* Title */}
      <Text style={styles.title}>{opportunity.title}</Text>

      {/* Scope / Description */}
      <Text style={styles.description} numberOfLines={2}>
        {opportunity.description}
      </Text>

      {/* Tags */}
      <View style={styles.tagsRow}>
        {opportunity.tags.slice(0, 3).map((tag, idx) => (
          <Badge key={idx} label={tag} variant="neutral" size="sm" />
        ))}
        {opportunity.tags.length > 3 && (
          <Badge label={`+${opportunity.tags.length - 3}`} variant="neutral" size="sm" />
        )}
      </View>

      {/* Budget & Timeline Meta Box */}
      <View style={styles.metaBar}>
        <View style={styles.metaItem}>
          <Text style={styles.metaLabel}>BUDGET</Text>
          <Text style={styles.budgetValue}>{formattedBudget}</Text>
        </View>

        <View style={styles.metaDivider} />

        <View style={styles.metaItem}>
          <Text style={styles.metaLabel}>TARGET DUE</Text>
          <View style={styles.deadlineContainer}>
            <Calendar size={12} color={COLORS.textDim} />
            <Text style={styles.deadlineText}>
              {opportunity.deadline ? opportunity.deadline : 'Flexible'}
            </Text>
          </View>
        </View>
      </View>

      {/* Action Row */}
      <View style={styles.actionRow}>
        <Button
          title="Details"
          variant="glass"
          size="sm"
          onPress={() => router.push(`/opportunities/${opportunity.id}` as any)}
          style={{ flex: 1 }}
        />
        <Button
          title={opportunity.hasExpressedInterest ? 'Pitch Sent' : 'Express Interest'}
          variant={opportunity.hasExpressedInterest ? 'glass' : 'primary'}
          size="sm"
          disabled={opportunity.hasExpressedInterest}
          onPress={() => {
            if (onExpressInterest) onExpressInterest();
            else router.push(`/opportunities/${opportunity.id}` as any);
          }}
          style={{ flex: 1.4 }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.md,
    ...SHADOWS.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  creatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    flex: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.bgElevated,
    borderWidth: 1.5,
    borderColor: COLORS.borderLight,
  },
  creatorTextCol: {
    flex: 1,
    paddingRight: SPACING.xs,
  },
  creatorName: {
    color: COLORS.textPrimary,
    fontSize: 14,
    fontWeight: '800',
  },
  subMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  businessName: {
    color: COLORS.textDim,
    fontSize: 11,
    fontWeight: '500',
  },
  dot: {
    color: COLORS.textDim,
    fontSize: 10,
  },
  city: {
    color: COLORS.textDim,
    fontSize: 11,
  },
  matchPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  matchText: {
    color: COLORS.accent,
    fontSize: 11,
    fontWeight: '900',
  },
  title: {
    color: COLORS.textPrimary,
    fontSize: 15,
    fontWeight: '800',
    lineHeight: 21,
    marginTop: 2,
    marginBottom: 4,
  },
  description: {
    color: COLORS.textSecondary,
    fontSize: 13,
    lineHeight: 18,
    marginBottom: SPACING.sm,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: SPACING.md,
  },
  metaBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.bgInput,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  metaItem: {
    flex: 1,
  },
  metaDivider: {
    width: 1,
    height: 24,
    backgroundColor: COLORS.borderLight,
    marginHorizontal: SPACING.md,
  },
  metaLabel: {
    color: COLORS.primaryLight,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  budgetValue: {
    color: COLORS.accent,
    fontSize: 14,
    fontWeight: '900',
    marginTop: 2,
  },
  deadlineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  deadlineText: {
    color: COLORS.textPrimary,
    fontSize: 12,
    fontWeight: '600',
  },
  actionRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
});
