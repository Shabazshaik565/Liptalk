import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Gift, Coins, CheckCircle, ArrowRight } from 'lucide-react-native';
import { RewardItem } from '../../types';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../../constants/theme';

interface RewardPerkCardProps {
  reward: RewardItem;
  userBalance: number;
  onRedeem: (id: string) => void;
}

export function RewardPerkCard({ reward, userBalance, onRedeem }: RewardPerkCardProps) {
  const canAfford = userBalance >= reward.pointsCost;

  return (
    <View style={styles.card}>
      {reward.bannerUrl && (
        <Image source={{ uri: reward.bannerUrl }} style={styles.banner} />
      )}

      <View style={styles.body}>
        {/* Category & Points Pill */}
        <View style={styles.topRow}>
          <Badge label={reward.category} variant="purple" size="sm" />
          <View style={styles.pointsPill}>
            <Coins size={12} color={COLORS.accent} />
            <Text style={styles.pointsText}>{reward.pointsCost} Pts</Text>
          </View>
        </View>

        {/* Title */}
        <Text style={styles.title}>{reward.title}</Text>
        <Text style={styles.description}>{reward.description}</Text>

        {/* Footer with Discount & Redeem CTA */}
        <View style={styles.footer}>
          {reward.discountValue && (
            <View style={styles.discountBadge}>
              <Gift size={13} color={COLORS.accent} />
              <Text style={styles.discountText}>{reward.discountValue}</Text>
            </View>
          )}

          <View style={{ flex: 1 }} />

          <Button
            title={canAfford ? 'Redeem Benefit' : 'Need More Pts'}
            variant={canAfford ? 'primary' : 'glass'}
            size="sm"
            disabled={!canAfford}
            onPress={() => onRedeem(reward.id)}
          />
        </View>
      </View>
    </View>
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
  banner: {
    width: '100%',
    height: 100,
    backgroundColor: COLORS.bgDark,
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
  pointsPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(16, 185, 129, 0.10)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.25)',
  },
  pointsText: {
    color: COLORS.accent,
    fontSize: 11.5,
    fontWeight: '800',
  },
  title: {
    color: COLORS.textPrimary,
    fontSize: 15,
    fontWeight: '800',
    lineHeight: 20,
    marginVertical: 4,
  },
  description: {
    color: COLORS.textSecondary,
    fontSize: 12.5,
    lineHeight: 17,
    marginBottom: SPACING.sm,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: SPACING.sm,
    gap: SPACING.sm,
  },
  discountBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.bgInput,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: RADIUS.sm,
  },
  discountText: {
    color: COLORS.textPrimary,
    fontSize: 11,
    fontWeight: '800',
  },
});
