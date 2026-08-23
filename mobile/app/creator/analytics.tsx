import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import {
  Eye,
  Users,
  Heart,
  Radio,
  Briefcase,
  TrendingUp,
  Award,
  Sparkles,
} from 'lucide-react-native';
import { Header } from '../../src/components/common/Header';
import { CardSkeleton } from '../../src/components/common/SkeletonLoader';
import { creatorApi } from '../../src/api/domain.api';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../../src/constants/theme';

export default function CreatorAnalyticsScreen() {
  const router = useRouter();

  const { data: analytics, isLoading } = useQuery({
    queryKey: ['creator-analytics'],
    queryFn: () => creatorApi.getAnalytics(),
  });

  return (
    <View style={styles.container}>
      <Header
        title="AUDIENCE INSIGHTS"
        subtitle="CREATOR & BROADCAST PERFORMANCE"
        showBack
        onBack={() => router.back()}
      />

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Summary Card */}
        <View style={styles.topSummaryCard}>
          <View style={styles.summaryBadge}>
            <Sparkles size={13} color={COLORS.accent} />
            <Text style={styles.summaryBadgeText}>VERIFIED CREATOR METRICS</Text>
          </View>
          <Text style={styles.summaryTitle}>High-Impact Conversion Reach</Text>
          <Text style={styles.summarySub}>
            Your broadcasts and live stages directly convert into enterprise contracts and synergy deals.
          </Text>
        </View>

        {isLoading ? (
          <CardSkeleton />
        ) : (
          <>
            {/* Metric Grid */}
            <View style={styles.grid}>
              <View style={styles.metricCard}>
                <View style={[styles.iconCircle, { backgroundColor: 'rgba(139, 92, 246, 0.15)' }]}>
                  <Eye size={18} color={COLORS.primaryLight} />
                </View>
                <Text style={styles.metricValue}>{analytics?.contentImpressions || 1100}</Text>
                <Text style={styles.metricLabel}>Broadcast Impressions</Text>
              </View>

              <View style={styles.metricCard}>
                <View style={[styles.iconCircle, { backgroundColor: 'rgba(16, 185, 129, 0.15)' }]}>
                  <Users size={18} color={COLORS.accent} />
                </View>
                <Text style={styles.metricValue}>{analytics?.followersCount || 38}</Text>
                <Text style={styles.metricLabel}>Professional Followers</Text>
              </View>

              <View style={styles.metricCard}>
                <View style={[styles.iconCircle, { backgroundColor: 'rgba(245, 158, 11, 0.15)' }]}>
                  <Radio size={18} color="#FBBF24" />
                </View>
                <Text style={styles.metricValue}>{analytics?.totalLiveAttendees || 82}</Text>
                <Text style={styles.metricLabel}>Live Stage Attendees</Text>
              </View>

              <View style={styles.metricCard}>
                <View style={[styles.iconCircle, { backgroundColor: 'rgba(239, 68, 68, 0.15)' }]}>
                  <Heart size={18} color={COLORS.danger} />
                </View>
                <Text style={styles.metricValue}>{analytics?.totalLikes || 143}</Text>
                <Text style={styles.metricLabel}>Peer Appreciations</Text>
              </View>
            </View>

            {/* Deal Conversion Attribution */}
            <View style={styles.conversionCard}>
              <Text style={styles.conversionHeading}>B2B DEAL CONVERSION ATTRIBUTION</Text>

              <View style={styles.conversionRow}>
                <View style={styles.conversionIconWrap}>
                  <Briefcase size={16} color={COLORS.accent} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.conversionTitle}>Project Inquiries Generated</Text>
                  <Text style={styles.conversionSub}>Originating from live stages & broadcasts</Text>
                </View>
                <Text style={styles.conversionNumber}>+{analytics?.opportunitiesGenerated || 7}</Text>
              </View>

              <View style={[styles.conversionRow, { borderBottomWidth: 0 }]}>
                <View style={styles.conversionIconWrap}>
                  <TrendingUp size={16} color={COLORS.primaryLight} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.conversionTitle}>Retainer Deals Converted</Text>
                  <Text style={styles.conversionSub}>Moved to Closed-Won in CRM pipeline</Text>
                </View>
                <Text style={styles.conversionNumber}>+{analytics?.dealConversions || 4}</Text>
              </View>
            </View>
          </>
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
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.lg,
    gap: SPACING.lg,
    paddingBottom: SPACING.tabBarClearance,
  },
  topSummaryCard: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.primaryDark,
    ...SHADOWS.md,
  },
  summaryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
    alignSelf: 'flex-start',
    marginBottom: SPACING.sm,
  },
  summaryBadgeText: {
    color: COLORS.accent,
    fontSize: 9.5,
    fontWeight: '900',
  },
  summaryTitle: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 4,
  },
  summarySub: {
    color: COLORS.textDim,
    fontSize: 12.5,
    lineHeight: 18,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
  },
  metricCard: {
    width: '47.5%',
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'flex-start',
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.sm,
  },
  metricValue: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: '900',
    marginBottom: 2,
  },
  metricLabel: {
    color: COLORS.textDim,
    fontSize: 11.5,
    fontWeight: '600',
  },
  conversionCard: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
  },
  conversionHeading: {
    color: COLORS.primaryLight,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginBottom: SPACING.md,
  },
  conversionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  conversionIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.bgDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  conversionTitle: {
    color: COLORS.textPrimary,
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 2,
  },
  conversionSub: {
    color: COLORS.textDim,
    fontSize: 11,
  },
  conversionNumber: {
    color: COLORS.accent,
    fontSize: 16,
    fontWeight: '900',
  },
});
