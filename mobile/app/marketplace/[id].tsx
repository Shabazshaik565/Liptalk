import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Modal,
  TextInput,
  RefreshControl,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  ArrowLeft,
  Star,
  MapPin,
  Bookmark,
  ShieldCheck,
  Send,
  MessageSquare,
  Sparkles,
  X,
  CheckCircle2,
} from 'lucide-react-native';
import { Button } from '../../src/components/common/Button';
import { Badge } from '../../src/components/common/Badge';
import { CardSkeleton } from '../../src/components/common/SkeletonLoader';
import { marketplaceApi, savedApi, reviewsApi } from '../../src/api/domain.api';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../../src/constants/theme';

export default function MarketplaceListingDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [requestModalVisible, setRequestModalVisible] = useState(false);
  const [inquiryMessage, setInquiryMessage] = useState(
    'Hi! We are looking for an experienced engineering team to build our mobile client architecture. We would love to discuss deliverables and scope.',
  );
  const [estimatedBudget, setEstimatedBudget] = useState('250000');
  const [timeline, setTimeline] = useState('4-6 Weeks');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: listing, isLoading, refetch } = useQuery({
    queryKey: ['marketplace_listing', id],
    queryFn: () => marketplaceApi.getListingById(id || ''),
    enabled: !!id,
  });

  const { data: reviews = [] } = useQuery({
    queryKey: ['listing_reviews', id],
    queryFn: () => reviewsApi.getListingReviews(id || ''),
    enabled: !!id,
  });

  const handleSaveToggle = async () => {
    if (!listing) return;
    await savedApi.toggleSave('LISTING', listing.id);
    queryClient.invalidateQueries({ queryKey: ['marketplace_listing', id] });
    queryClient.invalidateQueries({ queryKey: ['marketplace_listings'] });
  };

  const handleSendRequest = async () => {
    if (!inquiryMessage.trim() || !listing) return;

    setIsSubmitting(true);
    try {
      await marketplaceApi.requestService(listing.id, {
        message: inquiryMessage.trim(),
        estimatedBudget: parseInt(estimatedBudget, 10) || undefined,
        timeline: timeline.trim() || undefined,
      });

      queryClient.invalidateQueries({ queryKey: ['leads'] });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      setRequestModalVisible(false);

      Alert.alert(
        'Inquiry Sent Successfully!',
        'Your service request has been transmitted and a deal lead has been added to your CRM conversation thread.',
        [
          {
            text: 'Open Chat',
            onPress: () => router.push('/chat' as any),
          },
          { text: 'OK' },
        ],
      );
    } catch (err: any) {
      Alert.alert('Request Failed', err.message || 'Unable to submit request.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || !listing) {
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

  const formatPrice = () => {
    if (listing.pricingType === 'CONTACT_FOR_PRICE') return 'Custom Quotation';
    if (listing.pricingType === 'NEGOTIABLE') return `₹${listing.price?.toLocaleString()} (Negotiable)`;
    if (listing.pricingType === 'HOURLY') return `₹${listing.price?.toLocaleString()} / hour`;
    return `₹${listing.price?.toLocaleString()} Fixed Price`;
  };

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={styles.topNav}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={20} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.topNavTitle}>SERVICE OFFERING</Text>
        <TouchableOpacity
          onPress={handleSaveToggle}
          style={[styles.backBtn, listing.isSaved && styles.bookmarkActive]}
        >
          <Bookmark
            size={18}
            color={listing.isSaved ? COLORS.primaryLight : '#FFF'}
            fill={listing.isSaved ? COLORS.primaryLight : 'transparent'}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Cover Image */}
        <Image
          source={{
            uri:
              listing.imageUrls?.[0] ||
              'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600',
          }}
          style={styles.cover}
        />

        <View style={styles.body}>
          {/* Category & Ratings Bar */}
          <View style={styles.tagRow}>
            <Badge label={listing.category} variant="purple" size="sm" />
            <View style={styles.ratingBox}>
              <Star size={13} color="#FBBF24" fill="#FBBF24" />
              <Text style={styles.ratingText}>
                {listing.averageRating.toFixed(1)} ({listing.reviewsCount} Client Reviews)
              </Text>
            </View>
          </View>

          {/* Title */}
          <Text style={styles.title}>{listing.title}</Text>

          {/* Price Box */}
          <View style={styles.priceBox}>
            <View style={{ flex: 1 }}>
              <Text style={styles.priceLabel}>BASE PRICING MODEL</Text>
              <Text style={styles.priceValue}>{formatPrice()}</Text>
            </View>
            <Badge label={listing.pricingType} variant="neutral" size="sm" />
          </View>

          {/* Provider Card */}
          <View style={styles.providerCard}>
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
                <Text style={styles.providerName}>
                  {listing.provider.businesses?.[0]?.businessName ||
                    listing.provider.profile?.fullName ||
                    'Verified Agency'}
                </Text>
                <ShieldCheck size={16} color={COLORS.accent} />
              </View>
              <Text style={styles.providerHeadline}>
                {listing.provider.profile?.headline || 'Technology Services Provider'}
              </Text>
              <View style={styles.locationRow}>
                <MapPin size={11} color={COLORS.textDim} />
                <Text style={styles.locationText}>{listing.location}</Text>
              </View>
            </View>
          </View>

          {/* Scope & Overview */}
          <Text style={styles.sectionHeading}>SERVICE OVERVIEW & DELIVERABLES</Text>
          <Text style={styles.description}>{listing.description}</Text>

          {/* Skill / Technology Tags */}
          <Text style={styles.sectionHeading}>CORE COMPETENCIES & STACK</Text>
          <View style={styles.tagWrap}>
            {listing.tags.map((tag, idx) => (
              <Badge key={idx} label={tag} variant="neutral" size="sm" />
            ))}
          </View>

          {/* Verified Client Reviews */}
          <Text style={styles.sectionHeading}>
            VERIFIED REVIEWS ({reviews.length})
          </Text>
          {reviews.length > 0 ? (
            reviews.map((rev) => (
              <View key={rev.id} style={styles.reviewCard}>
                <View style={styles.reviewHeader}>
                  <Text style={styles.reviewerName}>
                    {rev.reviewer?.profile?.fullName || 'Verified Client'}
                  </Text>
                  <View style={styles.starRow}>
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} size={11} color="#FBBF24" fill="#FBBF24" />
                    ))}
                  </View>
                </View>
                <Text style={styles.reviewComment}>{rev.comment}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.noReviewsText}>
              No client reviews yet. Be the first to engage this provider!
            </Text>
          )}

          {/* Action CTA */}
          <Button
            title="Request Service & Scope Quotation"
            variant="primary"
            size="lg"
            icon={<Send size={16} color="#FFF" />}
            onPress={() => setRequestModalVisible(true)}
            style={{ marginTop: SPACING.xl, marginBottom: SPACING.xxl }}
          />
        </View>
      </ScrollView>

      {/* REQUEST SERVICE MODAL */}
      <Modal visible={requestModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Request Service Proposal</Text>
              <TouchableOpacity onPress={() => setRequestModalVisible(false)}>
                <X size={20} color={COLORS.textDim} />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalSub}>
              Directly contacts {listing.provider.businesses?.[0]?.businessName || 'the provider'} and initiates a deal discussion in your CRM pipeline.
            </Text>

            <Text style={styles.inputLabel}>PROJECT INQUIRY / SCOPE DETAILS</Text>
            <TextInput
              style={styles.modalTextArea}
              multiline
              numberOfLines={4}
              value={inquiryMessage}
              onChangeText={setInquiryMessage}
              placeholder="Describe your requirements, deliverables, or technical needs..."
              placeholderTextColor={COLORS.textDim}
            />

            <View style={styles.modalRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.inputLabel}>ESTIMATED BUDGET (INR)</Text>
                <TextInput
                  style={styles.modalInput}
                  keyboardType="numeric"
                  value={estimatedBudget}
                  onChangeText={setEstimatedBudget}
                  placeholder="e.g. 250000"
                  placeholderTextColor={COLORS.textDim}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.inputLabel}>TIMELINE</Text>
                <TextInput
                  style={styles.modalInput}
                  value={timeline}
                  onChangeText={setTimeline}
                  placeholder="e.g. 4-6 Weeks"
                  placeholderTextColor={COLORS.textDim}
                />
              </View>
            </View>

            <Button
              title={isSubmitting ? 'Transmitting...' : 'Send Inquiry to Provider'}
              variant="primary"
              size="md"
              icon={<Send size={15} color="#FFF" />}
              onPress={handleSendRequest}
              disabled={isSubmitting}
              style={{ marginTop: SPACING.md }}
            />
          </View>
        </View>
      </Modal>
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
  bookmarkActive: {
    backgroundColor: COLORS.bgElevated,
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
    fontSize: 20,
    fontWeight: '900',
    lineHeight: 26,
    marginVertical: SPACING.xs,
  },
  priceBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginVertical: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  priceLabel: {
    color: COLORS.textDim,
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  priceValue: {
    color: COLORS.accent,
    fontSize: 17,
    fontWeight: '900',
    marginTop: 2,
  },
  providerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.xl,
    padding: SPACING.md,
    gap: SPACING.md,
    marginVertical: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
  },
  providerAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.bgDark,
  },
  providerNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  providerName: {
    color: COLORS.textPrimary,
    fontSize: 14,
    fontWeight: '800',
  },
  providerHeadline: {
    color: COLORS.textSecondary,
    fontSize: 11.5,
    marginTop: 1,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 2,
  },
  locationText: {
    color: COLORS.textDim,
    fontSize: 11,
  },
  sectionHeading: {
    color: COLORS.textPrimary,
    fontSize: 12.5,
    fontWeight: '900',
    letterSpacing: 0.8,
    marginTop: SPACING.lg,
    marginBottom: SPACING.xs,
  },
  description: {
    color: COLORS.textSecondary,
    fontSize: 13.5,
    lineHeight: 20,
  },
  tagWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.xs,
    marginVertical: SPACING.xs,
  },
  reviewCard: {
    backgroundColor: COLORS.bgInput,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginVertical: 4,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  reviewerName: {
    color: COLORS.textPrimary,
    fontSize: 12.5,
    fontWeight: '800',
  },
  starRow: {
    flexDirection: 'row',
    gap: 2,
  },
  reviewComment: {
    color: COLORS.textSecondary,
    fontSize: 12.5,
    lineHeight: 17,
  },
  noReviewsText: {
    color: COLORS.textDim,
    fontSize: 12,
    fontStyle: 'italic',
    marginVertical: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: COLORS.bgCard,
    borderTopLeftRadius: RADIUS.xxl,
    borderTopRightRadius: RADIUS.xxl,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  modalTitle: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: '800',
  },
  modalSub: {
    color: COLORS.textDim,
    fontSize: 11.5,
    lineHeight: 16,
    marginBottom: SPACING.md,
  },
  inputLabel: {
    color: COLORS.textDim,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.6,
    marginBottom: 4,
  },
  modalTextArea: {
    backgroundColor: COLORS.bgInput,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    color: COLORS.textPrimary,
    fontSize: 13,
    height: 90,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.sm,
  },
  modalRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  modalInput: {
    backgroundColor: COLORS.bgInput,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    color: COLORS.textPrimary,
    fontSize: 13,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
});
