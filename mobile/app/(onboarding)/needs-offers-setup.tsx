import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { HelpCircle, Gift, Sparkles } from 'lucide-react-native';
import { COLORS, SPACING, RADIUS } from '../../src/constants/theme';
import { Input } from '../../src/components/common/Input';
import { Button } from '../../src/components/common/Button';
import { useAuthStore } from '../../src/store/auth.store';
import { CURRENT_USER } from '../../src/api/mockData';

export default function NeedsOffersSetupScreen() {
  const router = useRouter();
  const { setAuth } = useAuthStore();

  // Need state
  const [needTitle, setNeedTitle] = useState('Performance Marketing & Lead Gen Agency');
  const [needCategory, setNeedCategory] = useState('Digital Marketing & Growth');
  const [needTags, setNeedTags] = useState('B2B Marketing, Google Ads, Lead Generation');
  const [needPriority, setNeedPriority] = useState<'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'>('HIGH');

  // Offer state
  const [offerTitle, setOfferTitle] = useState('Custom Mobile & Web Application Engineering');
  const [offerCategory, setOfferCategory] = useState('IT & Software Development');
  const [offerTags, setOfferTags] = useState('React Native, TypeScript, NestJS, Mobile Apps');

  const [loading, setLoading] = useState(false);

  const handleFinishOnboarding = async () => {
    setLoading(true);
    try {
      setAuth(
        {
          ...CURRENT_USER,
          needsOnboarding: false,
        },
        'token_verified_alex_morgan',
      );
      router.replace('/(tabs)' as any);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.stepBadge}>STEP 3 OF 3 • CORE MATCHING SETUP</Text>
        <Text style={styles.title}>What do you Need & Offer?</Text>
        <Text style={styles.subtitle}>
          Lip Talk matches your explicit needs with verified providers and helps you discover new clients for what you offer.
        </Text>
      </View>

      {/* SECTION 1: WHAT I NEED */}
      <View style={styles.sectionCard}>
        <View style={styles.sectionTitleRow}>
          <View style={[styles.iconBox, { backgroundColor: '#78350F' }]}>
            <HelpCircle size={18} color="#FBBF24" />
          </View>
          <View>
            <Text style={styles.sectionTitle}>WHAT I NEED</Text>
            <Text style={styles.sectionSub}>Services or talent you are seeking</Text>
          </View>
        </View>

        <Input
          label="Requirement Title"
          value={needTitle}
          onChangeText={setNeedTitle}
          placeholder="e.g. Website Development, B2B Marketing"
        />

        <Input
          label="Need Category"
          value={needCategory}
          onChangeText={setNeedCategory}
          placeholder="Digital Marketing, Legal, IT..."
        />

        <Input
          label="Keywords / Tags (comma separated)"
          value={needTags}
          onChangeText={setNeedTags}
          placeholder="e.g. Google Ads, SEO, React"
        />

        <Text style={styles.priorityLabel}>PRIORITY LEVEL</Text>
        <View style={styles.priorityRow}>
          {(['LOW', 'MEDIUM', 'HIGH', 'URGENT'] as const).map((p) => (
            <TouchableOpacity
              key={p}
              style={[
                styles.priorityBtn,
                needPriority === p && styles.priorityBtnActive,
              ]}
              onPress={() => setNeedPriority(p)}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.priorityText,
                  needPriority === p && styles.priorityTextActive,
                ]}
              >
                {p}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* SECTION 2: WHAT I OFFER */}
      <View style={styles.sectionCard}>
        <View style={styles.sectionTitleRow}>
          <View style={[styles.iconBox, { backgroundColor: '#064E3B' }]}>
            <Gift size={18} color="#34D399" />
          </View>
          <View>
            <Text style={styles.sectionTitle}>WHAT I OFFER</Text>
            <Text style={styles.sectionSub}>Services or capabilities you provide</Text>
          </View>
        </View>

        <Input
          label="Service / Offer Title"
          value={offerTitle}
          onChangeText={setOfferTitle}
          placeholder="e.g. Mobile App Dev, UI/UX Design"
        />

        <Input
          label="Offer Category"
          value={offerCategory}
          onChangeText={setOfferCategory}
          placeholder="IT & Software Development, Consulting..."
        />

        <Input
          label="Keywords / Tags (comma separated)"
          value={offerTags}
          onChangeText={setOfferTags}
          placeholder="e.g. React Native, TypeScript, Postgres"
        />
      </View>

      <Button
        title="Complete Setup & Discover Matches"
        onPress={handleFinishOnboarding}
        loading={loading}
        size="lg"
        variant="primary"
        icon={<Sparkles size={18} color="#FFF" />}
        style={{ marginTop: SPACING.lg, marginBottom: SPACING.xxl }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgDark,
  },
  content: {
    padding: SPACING.xxl,
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  stepBadge: {
    color: COLORS.primaryLight,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.5,
    marginBottom: SPACING.xs,
  },
  title: {
    color: COLORS.textPrimary,
    fontSize: 22,
    fontWeight: '900',
    textAlign: 'center',
  },
  subtitle: {
    color: COLORS.textSecondary,
    fontSize: 13,
    textAlign: 'center',
    marginTop: SPACING.xs,
    lineHeight: 18,
  },
  sectionCard: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.lg,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    color: COLORS.textPrimary,
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  sectionSub: {
    color: COLORS.textMuted,
    fontSize: 11,
  },
  priorityLabel: {
    color: COLORS.primaryLight,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: SPACING.xs,
  },
  priorityRow: {
    flexDirection: 'row',
    gap: SPACING.xs,
  },
  priorityBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.bgInput,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  priorityBtnActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primaryLight,
  },
  priorityText: {
    color: COLORS.textMuted,
    fontSize: 11,
    fontWeight: '700',
  },
  priorityTextActive: {
    color: '#FFF',
    fontWeight: '800',
  },
});
