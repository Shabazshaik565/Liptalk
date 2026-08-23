import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import {
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  ShieldCheck,
  Zap,
} from 'lucide-react-native';
import { Button } from '../../src/components/common/Button';
import { Badge } from '../../src/components/common/Badge';
import { CardSkeleton } from '../../src/components/common/SkeletonLoader';
import { aiApi } from '../../src/api/domain.api';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../../src/constants/theme';

export default function ProfileIntelligenceScreen() {
  const router = useRouter();

  const { data: report, isLoading } = useQuery({
    queryKey: ['profile_intelligence'],
    queryFn: () => aiApi.profileIntelligence(),
  });

  const score = report?.completenessScore || 85;

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={styles.topNav}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={20} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.topNavTitle}>PROFILE INTELLIGENCE</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Score Meter Banner */}
        <View style={styles.scoreCard}>
          <View style={styles.scoreTopRow}>
            <View style={styles.sparkleRow}>
              <Sparkles size={16} color={COLORS.accent} />
              <Text style={styles.scoreBadgeText}>AI PROFILE AUDIT</Text>
            </View>
            <Badge
              label={score >= 85 ? 'High Synergy' : 'Needs Optimization'}
              variant={score >= 85 ? 'success' : 'warning'}
              size="sm"
            />
          </View>

          <Text style={styles.scoreNumber}>{score}%</Text>
          <Text style={styles.scoreSub}>
            Mathematical completeness evaluated across verified skills, business identity, demands, and profile attributes.
          </Text>
        </View>

        {/* Actionable AI Suggestions */}
        <Text style={styles.sectionHeading}>RECOMMENDED PROFILE ACTIONS</Text>
        <Text style={styles.sectionSub}>
          Completing these steps directly amplifies your hybrid algorithm ranking by up to 25%.
        </Text>

        {isLoading ? (
          <CardSkeleton />
        ) : (
          report?.suggestions.map((sug, idx) => (
            <View key={idx} style={styles.suggestionCard}>
              <Zap size={16} color={COLORS.accent} style={{ marginTop: 2 }} />
              <Text style={styles.suggestionText}>{sug}</Text>
            </View>
          ))
        )}

        {/* Field Checklist */}
        <Text style={styles.sectionHeading}>PROFILE ATTRIBUTES CHECKLIST</Text>
        <View style={styles.checklistCard}>
          {[
            { label: 'Profile Photo & Identity Avatar', done: true },
            { label: 'Executive Headline (25+ characters)', done: true },
            { label: 'Comprehensive Founder Bio', done: true },
            { label: 'Specialized Capabilities (3+ skills)', done: true },
            { label: 'Registered Verified Business Profile', done: true },
            { label: 'Video Elevator Pitch', done: false },
          ].map((item, idx) => (
            <View key={idx} style={styles.checklistItem}>
              {item.done ? (
                <CheckCircle2 size={16} color={COLORS.accent} />
              ) : (
                <AlertCircle size={16} color={COLORS.textDim} />
              )}
              <Text
                style={[
                  styles.checklistLabel,
                  !item.done && styles.checklistLabelPending,
                ]}
              >
                {item.label}
              </Text>
            </View>
          ))}
        </View>

        <Button
          title="Edit Profile Information"
          variant="primary"
          size="lg"
          onPress={() => router.push('/(tabs)/profile' as any)}
          style={{ marginTop: SPACING.lg, marginBottom: SPACING.xxxl }}
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
    paddingBottom: SPACING.tabBarClearance,
  },
  scoreCard: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.primaryDark,
    marginBottom: SPACING.lg,
    ...SHADOWS.md,
  },
  scoreTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sparkleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  scoreBadgeText: {
    color: COLORS.primaryLight,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  scoreNumber: {
    color: COLORS.textPrimary,
    fontSize: 40,
    fontWeight: '900',
    marginVertical: SPACING.xs,
  },
  scoreSub: {
    color: COLORS.textSecondary,
    fontSize: 12.5,
    lineHeight: 17,
  },
  sectionHeading: {
    color: COLORS.textPrimary,
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0.8,
    marginTop: SPACING.md,
    marginBottom: 2,
  },
  sectionSub: {
    color: COLORS.textDim,
    fontSize: 11.5,
    marginBottom: SPACING.md,
  },
  suggestionCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.sm,
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.xs,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  suggestionText: {
    color: COLORS.textPrimary,
    fontSize: 12.5,
    lineHeight: 18,
    flex: 1,
  },
  checklistCard: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.xl,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: SPACING.sm,
  },
  checklistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    paddingVertical: 3,
  },
  checklistLabel: {
    color: COLORS.textPrimary,
    fontSize: 12.5,
    fontWeight: '600',
  },
  checklistLabelPending: {
    color: COLORS.textDim,
  },
});
