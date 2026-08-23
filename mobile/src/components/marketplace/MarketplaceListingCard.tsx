import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Star, MapPin, Bookmark, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react-native';
import { MarketplaceListingItem } from '../../types';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../../constants/theme';

interface MarketplaceListingCardProps {
  listing: MarketplaceListingItem;
  onSaveToggle?: (id: string) => void;
}

export function MarketplaceListingCard({
  listing,
  onSaveToggle,
}: MarketplaceListingCardProps) {
  const router = useRouter();

  const isFeatured = listing.promotionType === 'FEATURED';
  const isPromoted = listing.promotionType === 'PROMOTED';

  const formatPrice = () => {
    if (listing.pricingType === 'CONTACT_FOR_PRICE') return 'Contact for Pricing';
    if (listing.pricingType === 'NEGOTIABLE') return `₹${listing.price?.toLocaleString()} (Negotiable)`;
    if (listing.pricingType === 'HOURLY') return `₹${listing.price?.toLocaleString()} / hr`;
    return `₹${listing.price?.toLocaleString()} Fixed`;
  };

  return (
    <TouchableOpacity
      style={[
        styles.card,
        isFeatured && styles.featuredCard,
        isPromoted && styles.promotedCard,
      ]}
      onPress={() => router.push(`/marketplace/${listing.id}` as any)}
      activeOpacity={0.85}
    >
      {/* Cover Image with Bookmark Overlay */}
      <View style={styles.imageWrap}>
        <Image
          source={{
            uri:
              listing.imageUrls?.[0] ||
              'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600',
          }}
          style={styles.coverImage}
        />
        <TouchableOpacity
          style={[styles.bookmarkBtn, listing.isSaved && styles.bookmarkBtnActive]}
          onPress={() => onSaveToggle?.(listing.id)}
          activeOpacity={0.7}
        >
          <Bookmark
            size={16}
            color={listing.isSaved ? COLORS.primaryLight : '#FFF'}
            fill={listing.isSaved ? COLORS.primaryLight : 'transparent'}
          />
        </TouchableOpacity>

        {/* Promotion Tag */}
        {isFeatured && (
          <View style={styles.promoTag}>
            <Sparkles size={11} color="#FFF" />
            <Text style={styles.promoTagText}>FEATURED</Text>
          </View>
        )}
      </View>

      <View style={styles.body}>
        {/* Category & Rating Row */}
        <View style={styles.metaRow}>
          <Badge label={listing.category} variant="purple" size="sm" />
          <View style={styles.ratingBox}>
            <Star size={12} color="#FBBF24" fill="#FBBF24" />
            <Text style={styles.ratingText}>
              {listing.averageRating.toFixed(1)} ({listing.reviewsCount})
            </Text>
          </View>
        </View>

        {/* Title */}
        <Text style={styles.title} numberOfLines={2}>
          {listing.title}
        </Text>

        {/* Provider Profile Info */}
        <View style={styles.providerRow}>
          <Image
            source={{
              uri:
                listing.provider.profile?.avatarUrl ||
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
            }}
            style={styles.providerAvatar}
          />
          <View style={{ flex: 1 }}>
            <View style={styles.providerNameRow}>
              <Text style={styles.providerName} numberOfLines={1}>
                {listing.provider.businesses?.[0]?.businessName ||
                  listing.provider.profile?.fullName ||
                  'Verified Agency'}
              </Text>
              <ShieldCheck size={13} color={COLORS.accent} />
            </View>
            <View style={styles.locationRow}>
              <MapPin size={11} color={COLORS.textDim} />
              <Text style={styles.locationText}>{listing.location}</Text>
            </View>
          </View>
        </View>

        {/* Synergy Recommendation Note */}
        {listing.recommendedReason && (
          <View style={styles.synergyBox}>
            <Sparkles size={11} color={COLORS.accent} />
            <Text style={styles.synergyText} numberOfLines={1}>
              {listing.recommendedReason}
            </Text>
          </View>
        )}

        {/* Price & Action Footer */}
        <View style={styles.footer}>
          <View style={styles.priceCol}>
            <Text style={styles.priceLabel}>ESTIMATED INVESTMENT</Text>
            <Text style={styles.priceValue}>{formatPrice()}</Text>
          </View>

          <Button
            title="Details & Quote"
            variant="primary"
            size="sm"
            onPress={() => router.push(`/marketplace/${listing.id}` as any)}
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
  featuredCard: {
    borderColor: COLORS.primaryDark,
    backgroundColor: COLORS.bgElevated,
  },
  promotedCard: {
    borderColor: 'rgba(139, 92, 246, 0.4)',
  },
  imageWrap: {
    position: 'relative',
    width: '100%',
    height: 125,
    backgroundColor: COLORS.bgDark,
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  bookmarkBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookmarkBtnActive: {
    backgroundColor: COLORS.bgDark,
  },
  promoTag: {
    position: 'absolute',
    top: 10,
    left: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.sm,
  },
  promoTagText: {
    color: '#FFF',
    fontSize: 9.5,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  body: {
    padding: SPACING.md,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.xs,
  },
  ratingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    color: COLORS.textSecondary,
    fontSize: 11.5,
    fontWeight: '700',
  },
  title: {
    color: COLORS.textPrimary,
    fontSize: 15,
    fontWeight: '800',
    lineHeight: 20,
    marginVertical: 4,
  },
  providerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginVertical: SPACING.xs,
  },
  providerAvatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: COLORS.bgDark,
  },
  providerNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  providerName: {
    color: COLORS.textPrimary,
    fontSize: 12.5,
    fontWeight: '700',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 1,
  },
  locationText: {
    color: COLORS.textDim,
    fontSize: 11,
  },
  synergyBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(16, 185, 129, 0.08)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: RADIUS.sm,
    marginVertical: SPACING.xs,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.2)',
  },
  synergyText: {
    color: COLORS.accent,
    fontSize: 11,
    fontWeight: '700',
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
  priceCol: {
    flex: 1,
  },
  priceLabel: {
    color: COLORS.textDim,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  priceValue: {
    color: COLORS.accent,
    fontSize: 14,
    fontWeight: '900',
    marginTop: 1,
  },
});
