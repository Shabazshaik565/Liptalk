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
  Crown,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Zap,
} from 'lucide-react-native';
import { Button } from '../../src/components/common/Button';
import { Badge } from '../../src/components/common/Badge';
import { CardSkeleton } from '../../src/components/common/SkeletonLoader';
import { membershipApi } from '../../src/api/domain.api';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../../src/constants/theme';

export default function MembershipScreen() {
  const router = useRouter();

  const { data: membership, isLoading: loadingMem } = useQuery({
    queryKey: ['membership_current'],
    queryFn: () => membershipApi.getCurrentMembership(),
  });

  const { data: plans = [], isLoading: loadingPlans } = useQuery({
    queryKey: ['membership_plans'],
    queryFn: () => membershipApi.getPlans(),
  });

  const currentTier = membership?.tier || 'PRO';

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={styles.topNav}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={20} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.topNavTitle}>MEMBERSHIP & TIERS</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Current Tier Status Banner */}
        <View style={styles.currentTierCard}>
          <View style={styles.tierTopRow}>
            <View style={styles.crownRow}>
              <Crown size={18} color="#FBBF24" />
              <Text style={styles.tierBadgeText}>ACTIVE SUBSCRIPTION</Text>
            </View>
            <Badge label="Active Pro" variant="warning" size="sm" />
          </View>

          <Text style={styles.tierName}>Executive Pro Member</Text>
          <Text style={styles.tierSub}>
            2x Priority matching boost, high-visibility demands, and custom service badges active on your profile.
          </Text>

          {/* Active Entitlements Checklist */}
          <View style={styles.entitlementBox}>
            <View style={styles.entitlementItem}>
              <CheckCircle2 size={14} color={COLORS.accent} />
              <Text style={styles.entitlementText}>15 Maximum Active Demands</Text>
            </View>
            <View style={styles.entitlementItem}>
              <CheckCircle2 size={14} color={COLORS.accent} />
              <Text style={styles.entitlementText}>Priority Synergy Algorithm</Text>
            </View>
            <View style={styles.entitlementItem}>
              <CheckCircle2 size={14} color={COLORS.accent} />
              <Text style={styles.entitlementText}>Verified Guild Creation & Hosting</Text>
            </View>
            <View style={styles.entitlementItem}>
              <CheckCircle2 size={14} color={COLORS.accent} />
              <Text style={styles.entitlementText}>Advanced Lead Deal Analytics</Text>
            </View>
          </View>
        </View>

        {/* Plan Tiers Comparison */}
        <Text style={styles.sectionHeading}>AVAILABLE ECOSYSTEM TIERS</Text>
        <Text style={styles.sectionSub}>
          Scale your deal flow and B2B reach across India's premier executive network.
        </Text>

        {loadingPlans ? (
          <CardSkeleton />
        ) : (
          plans.map((plan) => {
            const isCurrent = plan.tier === currentTier;

            return (
              <View
                key={plan.id}
                style={[
                  styles.planCard,
                  isCurrent && styles.currentPlanCard,
                ]}
              >
                <View style={styles.planHeader}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.planName}>{plan.name}</Text>
                    <Text style={styles.planPrice}>
                      {plan.pricePerMonth === 0
                        ? 'Free'
                        : `₹${plan.pricePerMonth.toLocaleString()} / mo`}
                    </Text>
                  </View>
                  <Badge
                    label={plan.badge || plan.tier}
                    variant={isCurrent ? 'warning' : 'neutral'}
                    size="sm"
                  />
                </View>

                {/* Features List */}
                <View style={styles.featureList}>
                  {plan.features.map((feat, idx) => (
                    <View key={idx} style={styles.featureRow}>
                      <CheckCircle2
                        size={13}
                        color={isCurrent ? COLORS.accent : COLORS.textDim}
                      />
                      <Text style={styles.featureText}>{feat}</Text>
                    </View>
                  ))}
                </View>

                <Button
                  title={isCurrent ? 'Current Plan' : 'Select Plan'}
                  variant={isCurrent ? 'glass' : 'primary'}
                  size="md"
                  disabled={isCurrent}
                  onPress={() => {}}
                  style={{ marginTop: SPACING.md }}
                />
              </View>
            );
          })
        )}
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
  currentTierCard: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: '#FBBF24',
    marginBottom: SPACING.lg,
    ...SHADOWS.md,
  },
  tierTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  crownRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  tierBadgeText: {
    color: '#FBBF24',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  tierName: {
    color: COLORS.textPrimary,
    fontSize: 20,
    fontWeight: '900',
    marginTop: SPACING.xs,
  },
  tierSub: {
    color: COLORS.textSecondary,
    fontSize: 12.5,
    lineHeight: 17,
    marginTop: 4,
    marginBottom: SPACING.md,
  },
  entitlementBox: {
    backgroundColor: COLORS.bgInput,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    gap: SPACING.xs,
  },
  entitlementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  entitlementText: {
    color: COLORS.textPrimary,
    fontSize: 12,
    fontWeight: '600',
  },
  sectionHeading: {
    color: COLORS.textPrimary,
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0.8,
    marginBottom: 2,
  },
  sectionSub: {
    color: COLORS.textDim,
    fontSize: 11.5,
    marginBottom: SPACING.md,
  },
  planCard: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.md,
    ...SHADOWS.sm,
  },
  currentPlanCard: {
    borderColor: COLORS.primaryDark,
    backgroundColor: COLORS.bgElevated,
  },
  planHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingBottom: SPACING.md,
    marginBottom: SPACING.md,
  },
  planName: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: '900',
  },
  planPrice: {
    color: COLORS.accent,
    fontSize: 18,
    fontWeight: '900',
    marginTop: 2,
  },
  featureList: {
    gap: SPACING.xs,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  featureText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    lineHeight: 16,
    flex: 1,
  },
});
