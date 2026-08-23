import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { FileText, ChevronRight, Briefcase } from 'lucide-react-native';
import { LeadItem, LeadStatus } from '../../types';
import { COLORS, RADIUS, SPACING, SHADOWS } from '../../constants/theme';
import { Badge } from '../common/Badge';

interface LeadCardProps {
  lead: LeadItem;
  onStatusChange?: (status: LeadStatus) => void;
}

export const LeadCard: React.FC<LeadCardProps> = ({ lead }) => {
  const router = useRouter();

  const getStatusVariant = (status: LeadStatus) => {
    switch (status) {
      case 'CONVERTED':
        return 'success';
      case 'QUALIFIED':
        return 'accent';
      case 'IN_DISCUSSION':
        return 'primary';
      case 'CONTACTED':
        return 'warning';
      case 'LOST':
        return 'danger';
      default:
        return 'neutral';
    }
  };

  const formattedValue = lead.estimatedValue
    ? `₹${lead.estimatedValue.toLocaleString('en-IN')}`
    : 'Custom';

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/leads/${lead.id}` as any)}
      activeOpacity={0.82}
    >
      {/* Top Contact Header */}
      <View style={styles.header}>
        <View style={styles.contactRow}>
          <Image
            source={{
              uri:
                lead.contactAvatar ||
                'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
            }}
            style={styles.avatar}
          />
          <View style={styles.contactTextCol}>
            <Text style={styles.title} numberOfLines={1}>
              {lead.title}
            </Text>
            <Text style={styles.contactName} numberOfLines={1}>
              {lead.contactName}
            </Text>
          </View>
        </View>

        <Badge
          label={lead.status.replace('_', ' ')}
          variant={getStatusVariant(lead.status)}
          size="sm"
        />
      </View>

      {/* Opportunity / Match Context Tag */}
      {lead.opportunityTitle && (
        <View style={styles.oppContextRow}>
          <Briefcase size={12} color={COLORS.primaryLight} />
          <Text style={styles.oppContextText} numberOfLines={1}>
            {lead.opportunityTitle}
          </Text>
        </View>
      )}

      {/* Footer Metrics */}
      <View style={styles.footer}>
        <View style={styles.valueGroup}>
          <Text style={styles.valueLabel}>DEAL ESTIMATE</Text>
          <Text style={styles.valueText}>{formattedValue}</Text>
        </View>

        <View style={styles.footerRight}>
          <View style={styles.notesCountBadge}>
            <FileText size={12} color={COLORS.purpleLight} />
            <Text style={styles.notesText}>{lead.notesCount} notes</Text>
          </View>
          <ChevronRight size={16} color={COLORS.textDim} />
        </View>
      </View>
    </TouchableOpacity>
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
    marginBottom: SPACING.xs,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    flex: 1,
    paddingRight: SPACING.xs,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.bgElevated,
    borderWidth: 1.5,
    borderColor: COLORS.borderLight,
  },
  contactTextCol: {
    flex: 1,
  },
  title: {
    color: COLORS.textPrimary,
    fontSize: 14,
    fontWeight: '800',
  },
  contactName: {
    color: COLORS.textDim,
    fontSize: 12,
    marginTop: 1,
  },
  oppContextRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.bgInput,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 5,
    borderRadius: RADIUS.sm,
    marginVertical: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  oppContextText: {
    color: COLORS.textSecondary,
    fontSize: 11,
    fontWeight: '600',
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: SPACING.sm,
    marginTop: SPACING.xs,
  },
  valueGroup: {
    flexDirection: 'column',
  },
  valueLabel: {
    color: COLORS.primaryLight,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  valueText: {
    color: COLORS.accent,
    fontSize: 15,
    fontWeight: '900',
    marginTop: 2,
  },
  footerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  notesCountBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.bgInput,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: RADIUS.xs,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  notesText: {
    color: COLORS.textMuted,
    fontSize: 11,
    fontWeight: '600',
  },
});
