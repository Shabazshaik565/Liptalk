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
import { ArrowLeft, Users, ShieldCheck, Sparkles, Globe, Lock } from 'lucide-react-native';
import { Input } from '../../src/components/common/Input';
import { Button } from '../../src/components/common/Button';
import { communitiesApi } from '../../src/api/domain.api';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../../src/constants/theme';
import { CommunityVisibility } from '../../src/types';

export default function CreateCommunityScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [name, setName] = useState('');
  const [category, setCategory] = useState('IT & Software Development');
  const [description, setDescription] = useState('');
  const [rules, setRules] = useState('1. Share authentic business insights\n2. No spam\n3. Respect members');
  const [visibility, setVisibility] = useState<CommunityVisibility>('PUBLIC');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    'IT & Software Development',
    'Digital Marketing & Growth',
    'UI/UX & Product Design',
    'Legal & Corporate Compliance',
    'Finance & Accounting',
    'Logistics & Operations',
  ];

  const handleSubmit = async () => {
    if (!name.trim()) {
      Alert.alert('Missing Field', 'Please enter a name for your community.');
      return;
    }
    if (!description.trim()) {
      Alert.alert('Missing Field', 'Please provide a brief description.');
      return;
    }

    setIsSubmitting(true);
    try {
      const created = await communitiesApi.createCommunity({
        name: name.trim(),
        category,
        description: description.trim(),
        rules: rules.split('\n').filter((r) => r.trim().length > 0),
        visibility,
      });

      queryClient.invalidateQueries({ queryKey: ['communities'] });
      queryClient.invalidateQueries({ queryKey: ['communities_recommended'] });
      router.replace(`/communities/${created.id}` as any);
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to create community.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Top Navigation */}
      <View style={styles.topNav}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={20} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.topNavTitle}>CREATE NEW GUILD</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.banner}>
          <Users size={20} color={COLORS.primaryLight} />
          <Text style={styles.bannerTitle}>Launch an Ecosystem Guild</Text>
          <Text style={styles.bannerSub}>
            Build your niche network, moderate discussions, and connect founders across India.
          </Text>
        </View>

        {/* Guild Name */}
        <Input
          label="Guild Name"
          value={name}
          onChangeText={setName}
          placeholder="e.g. Bangalore B2B SaaS Leaders"
          containerStyle={{ marginBottom: SPACING.md }}
        />

        {/* Category Selector */}
        <Text style={styles.sectionLabel}>CATEGORY</Text>
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

        {/* Description */}
        <Input
          label="Guild Purpose & Description"
          value={description}
          onChangeText={setDescription}
          placeholder="What is this guild focused on? Who should join?"
          multiline
          numberOfLines={4}
          containerStyle={{ marginTop: SPACING.md, marginBottom: SPACING.md }}
        />

        {/* Guild Rules */}
        <Input
          label="Guild Rules (One per line)"
          value={rules}
          onChangeText={setRules}
          placeholder="Enter guidelines for members..."
          multiline
          numberOfLines={3}
          containerStyle={{ marginBottom: SPACING.md }}
        />

        {/* Visibility */}
        <Text style={styles.sectionLabel}>ACCESS VISIBILITY</Text>
        <View style={styles.visRow}>
          <TouchableOpacity
            style={[styles.visCard, visibility === 'PUBLIC' && styles.visCardActive]}
            onPress={() => setVisibility('PUBLIC')}
          >
            <Globe
              size={18}
              color={visibility === 'PUBLIC' ? COLORS.primaryLight : COLORS.textDim}
            />
            <Text
              style={[
                styles.visTitle,
                visibility === 'PUBLIC' && styles.visTitleActive,
              ]}
            >
              Public Guild
            </Text>
            <Text style={styles.visSub}>Anyone can discover & join immediately</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.visCard, visibility === 'PRIVATE' && styles.visCardActive]}
            onPress={() => setVisibility('PRIVATE')}
          >
            <Lock
              size={18}
              color={visibility === 'PRIVATE' ? COLORS.accent : COLORS.textDim}
            />
            <Text
              style={[
                styles.visTitle,
                visibility === 'PRIVATE' && styles.visTitleActive,
              ]}
            >
              Private Guild
            </Text>
            <Text style={styles.visSub}>Requires owner/moderator approval</Text>
          </TouchableOpacity>
        </View>

        <Button
          title={isSubmitting ? 'Creating Guild...' : 'Launch Guild'}
          variant="primary"
          size="lg"
          onPress={handleSubmit}
          disabled={isSubmitting}
          style={{ marginTop: SPACING.xl, marginBottom: SPACING.xxxl }}
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
    fontSize: 14,
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
    marginBottom: SPACING.sm,
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
  visRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  visCard: {
    flex: 1,
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  visCardActive: {
    borderColor: COLORS.primaryLight,
    backgroundColor: COLORS.bgElevated,
  },
  visTitle: {
    color: COLORS.textPrimary,
    fontSize: 13,
    fontWeight: '800',
    marginTop: 6,
  },
  visTitleActive: {
    color: COLORS.primaryLight,
  },
  visSub: {
    color: COLORS.textDim,
    fontSize: 11,
    marginTop: 2,
    lineHeight: 15,
  },
});
