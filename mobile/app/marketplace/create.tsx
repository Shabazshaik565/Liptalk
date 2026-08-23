import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, ShoppingBag, DollarSign, Tag, CheckCircle } from 'lucide-react-native';
import { Input } from '../../src/components/common/Input';
import { Button } from '../../src/components/common/Button';
import { marketplaceApi } from '../../src/api/domain.api';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../../src/constants/theme';
import { ListingPricingType } from '../../src/types';

export default function CreateMarketplaceListingScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('IT & Software Development');
  const [pricingType, setPricingType] = useState<ListingPricingType>('FIXED');
  const [price, setPrice] = useState('150000');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('Bangalore (Hybrid)');
  const [tags, setTags] = useState('React Native, Full-Stack, Enterprise, Cloud');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    'IT & Software Development',
    'Digital Marketing & Growth',
    'UI/UX & Product Design',
    'Legal & Corporate Compliance',
    'Finance & Accounting',
  ];

  const pricingModels: { id: ListingPricingType; label: string }[] = [
    { id: 'FIXED', label: 'Fixed Price' },
    { id: 'HOURLY', label: 'Hourly Rate' },
    { id: 'NEGOTIABLE', label: 'Negotiable' },
    { id: 'CONTACT_FOR_PRICE', label: 'Custom Quote' },
  ];

  const handleSubmit = async () => {
    if (!title.trim()) {
      Alert.alert('Missing Field', 'Please enter a title for your service offering.');
      return;
    }
    if (!description.trim()) {
      Alert.alert('Missing Field', 'Please describe your service deliverables and scope.');
      return;
    }

    setIsSubmitting(true);
    try {
      const created = await marketplaceApi.createListing({
        title: title.trim(),
        category,
        pricingType,
        price: parseInt(price, 10) || 0,
        description: description.trim(),
        location: location.trim(),
        tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
      });

      queryClient.invalidateQueries({ queryKey: ['marketplace_listings'] });
      queryClient.invalidateQueries({ queryKey: ['marketplace_recommended'] });
      router.replace(`/marketplace/${created.id}` as any);
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to publish listing.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={styles.topNav}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={20} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.topNavTitle}>PUBLISH SERVICE OFFERING</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.banner}>
          <ShoppingBag size={20} color={COLORS.primaryLight} />
          <Text style={styles.bannerTitle}>List on LipTalk Marketplace</Text>
          <Text style={styles.bannerSub}>
            Reach thousands of enterprise founders, CTOs, and businesses actively searching for specialized solutions.
          </Text>
        </View>

        {/* Listing Title */}
        <Input
          label="Service Title"
          value={title}
          onChangeText={setTitle}
          placeholder="e.g. Turnkey React Native & Cloud Backend Engineering"
          containerStyle={{ marginBottom: SPACING.md }}
        />

        {/* Category */}
        <Text style={styles.sectionLabel}>SERVICE CATEGORY</Text>
        <View style={styles.categoryWrap}>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[
                styles.categoryChip,
                category === cat && styles.categoryChipActive,
              ]}
              onPress={() => setCategory(cat)}
            >
              <Text
                style={[
                  styles.categoryText,
                  category === cat && styles.categoryTextActive,
                ]}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Pricing Model */}
        <Text style={styles.sectionLabel}>PRICING MODEL</Text>
        <View style={styles.pricingRow}>
          {pricingModels.map((m) => (
            <TouchableOpacity
              key={m.id}
              style={[
                styles.pricingChip,
                pricingType === m.id && styles.pricingChipActive,
              ]}
              onPress={() => setPricingType(m.id)}
            >
              <Text
                style={[
                  styles.pricingText,
                  pricingType === m.id && styles.pricingTextActive,
                ]}
              >
                {m.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Price Input */}
        {pricingType !== 'CONTACT_FOR_PRICE' && (
          <Input
            label={pricingType === 'HOURLY' ? 'Hourly Rate (INR)' : 'Base Price (INR)'}
            value={price}
            onChangeText={setPrice}
            keyboardType="numeric"
            placeholder="e.g. 150000"
            containerStyle={{ marginTop: SPACING.md, marginBottom: SPACING.md }}
          />
        )}

        {/* Scope & Description */}
        <Input
          label="Scope, Deliverables & Specifications"
          value={description}
          onChangeText={setDescription}
          placeholder="Detail your engineering methodologies, typical project stages, and guarantees..."
          multiline
          numberOfLines={4}
          containerStyle={{ marginBottom: SPACING.md }}
        />

        {/* Location */}
        <Input
          label="Delivery Location / Availability"
          value={location}
          onChangeText={setLocation}
          placeholder="e.g. Bangalore (Hybrid) or Remote Worldwide"
          containerStyle={{ marginBottom: SPACING.md }}
        />

        {/* Tags */}
        <Input
          label="Competencies & Tech Tags (Comma Separated)"
          value={tags}
          onChangeText={setTags}
          placeholder="e.g. React Native, NestJS, AWS, Offline Sync"
          containerStyle={{ marginBottom: SPACING.md }}
        />

        <Button
          title={isSubmitting ? 'Publishing...' : 'Publish to Marketplace'}
          variant="primary"
          size="lg"
          onPress={handleSubmit}
          disabled={isSubmitting}
          style={{ marginTop: SPACING.md, marginBottom: SPACING.xxxl }}
        />
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
    fontSize: 13.5,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.lg,
  },
  banner: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    alignItems: 'center',
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
  },
  bannerTitle: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: '900',
    marginTop: 6,
  },
  bannerSub: {
    color: COLORS.textMuted,
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 17,
  },
  sectionLabel: {
    color: COLORS.textDim,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginBottom: SPACING.xs,
  },
  categoryWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.xs,
    marginBottom: SPACING.md,
  },
  categoryChip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.bgCard,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  categoryChipActive: {
    borderColor: COLORS.primaryLight,
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
  },
  categoryText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
  categoryTextActive: {
    color: COLORS.primaryLight,
    fontWeight: '800',
  },
  pricingRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.xs,
    marginBottom: SPACING.sm,
  },
  pricingChip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.bgCard,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  pricingChipActive: {
    borderColor: COLORS.accent,
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
  },
  pricingText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
  pricingTextActive: {
    color: COLORS.accent,
    fontWeight: '800',
  },
});
