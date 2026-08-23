import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Linking } from 'react-native';
import { ExternalLink, Tag, ShieldCheck, Copy, Check } from 'lucide-react-native';
import { PartnerItem } from '../../types';
import { COLORS, RADIUS, SPACING, SHADOWS } from '../../constants/theme';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';

interface PartnerCardProps {
  partner: PartnerItem;
}

export const PartnerCard: React.FC<PartnerCardProps> = ({ partner }) => {
  const [copied, setCopied] = React.useState(false);
  const primaryOffer = partner.offers && partner.offers[0];

  const handleOpenCTA = () => {
    if (primaryOffer?.ctaUrl) {
      Linking.openURL(primaryOffer.ctaUrl);
    }
  };

  const handleCopyCode = () => {
    if (primaryOffer?.discountCode) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <Image
          source={{
            uri:
              partner.logoUrl ||
              'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=150',
          }}
          style={styles.logo}
        />
        <View style={styles.headerTextCol}>
          <View style={styles.nameRow}>
            <Text style={styles.name}>{partner.name}</Text>
            {partner.exclusiveBadge && (
              <Badge label={partner.exclusiveBadge} variant="accent" size="sm" />
            )}
          </View>
          <Text style={styles.category}>
            {partner.categoryName} • {partner.coverageArea}
          </Text>
        </View>
      </View>

      <Text style={styles.description}>{partner.description}</Text>

      {/* Offer Highlight Box */}
      {primaryOffer && (
        <View style={styles.offerBox}>
          <View style={styles.offerTopRow}>
            <View style={styles.discountBadge}>
              <Tag size={12} color="#000" />
              <Text style={styles.discountText}>{primaryOffer.discountValue}</Text>
            </View>
            <Text style={styles.offerTitle}>{primaryOffer.title}</Text>
          </View>

          <Text style={styles.offerDesc}>{primaryOffer.description}</Text>

          {primaryOffer.discountCode && (
            <TouchableOpacity
              style={styles.couponRow}
              onPress={handleCopyCode}
              activeOpacity={0.75}
            >
              <Text style={styles.couponLabel}>PROMO CODE:</Text>
              <Text style={styles.couponCode}>{primaryOffer.discountCode}</Text>
              {copied ? (
                <Check size={13} color={COLORS.accent} />
              ) : (
                <Copy size={13} color={COLORS.textDim} />
              )}
            </TouchableOpacity>
          )}
        </View>
      )}

      <Button
        title="Claim Partner Perk"
        variant="primary"
        size="sm"
        icon={<ExternalLink size={14} color="#FFF" />}
        onPress={handleOpenCTA}
      />
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
    gap: SPACING.md,
    marginBottom: SPACING.xs,
  },
  logo: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.bgElevated,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  headerTextCol: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  name: {
    color: COLORS.textPrimary,
    fontSize: 15,
    fontWeight: '800',
  },
  category: {
    color: COLORS.textDim,
    fontSize: 11,
    marginTop: 2,
  },
  description: {
    color: COLORS.textSecondary,
    fontSize: 13,
    lineHeight: 18,
    marginVertical: SPACING.xs,
  },
  offerBox: {
    backgroundColor: COLORS.bgInput,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginVertical: SPACING.sm,
  },
  offerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  discountBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.accent,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.xs,
  },
  discountText: {
    color: '#000000',
    fontSize: 11,
    fontWeight: '900',
  },
  offerTitle: {
    color: COLORS.textPrimary,
    fontSize: 13,
    fontWeight: '800',
    flex: 1,
  },
  offerDesc: {
    color: COLORS.textMuted,
    fontSize: 12,
    lineHeight: 16,
    marginVertical: 4,
  },
  couponRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.bgCard,
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    marginTop: 6,
  },
  couponLabel: {
    color: COLORS.primaryLight,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  couponCode: {
    color: COLORS.accent,
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
});
