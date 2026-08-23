import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import {
  ShieldCheck,
  Award,
  CheckCircle2,
  AlertCircle,
  Flag,
  Lock,
  ChevronRight,
  Info,
} from 'lucide-react-native';
import { Header } from '../../src/components/common/Header';
import { Button } from '../../src/components/common/Button';
import { Badge } from '../../src/components/common/Badge';
import { CardSkeleton } from '../../src/components/common/SkeletonLoader';
import { trustSafetyApi } from '../../src/api/domain.api';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../../src/constants/theme';

export default function TrustSafetyCenterScreen() {
  const router = useRouter();

  const { data: trustReport, isLoading } = useQuery({
    queryKey: ['trust-score', 'me'],
    queryFn: () => trustSafetyApi.getTrustScore(),
  });

  const handleReportIssue = () => {
    Alert.alert(
      'Trust & Safety Report',
      'Select what you would like to report to the LipTalk moderation team:',
      [
        { text: 'Report User / Impersonation', onPress: () => Alert.alert('Report Logged', 'Our safety team has received your ticket and will audit within 2 hours.') },
        { text: 'Report Suspicious Opportunity / Scam', onPress: () => Alert.alert('Report Logged', 'Opportunity flagged for policy review.') },
        { text: 'Cancel', style: 'cancel' },
      ],
    );
  };

  return (
    <View style={styles.container}>
      <Header title="Trust & Safety Center" showBack />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Trust Score Hero Card */}
        {isLoading || !trustReport ? (
          <CardSkeleton />
        ) : (
          <View style={styles.scoreHeroCard}>
            <View style={styles.scoreBadgeCircle}>
              <Text style={styles.scoreNumber}>{trustReport.overallScore}</Text>
              <Text style={styles.scoreMax}>/100</Text>
            </View>

            <View style={styles.scoreHeroInfo}>
              <View style={styles.tierRow}>
                <ShieldCheck size={18} color={COLORS.accent} />
                <Text style={styles.tierName}>{trustReport.trustTier.replace(/_/g, ' ')}</Text>
              </View>
              <Text style={styles.scoreSub}>
                Verified high-trust standing across business, identity, and peer transactions.
              </Text>
            </View>
          </View>
        )}

        {/* Explainable Signals Breakdown */}
        <Text style={styles.sectionHeading}>EXPLAINABLE TRUST SIGNALS</Text>

        {trustReport?.signals.map((sig, idx) => (
          <View key={idx} style={styles.signalCard}>
            <View style={styles.signalIconBox}>
              <CheckCircle2 size={18} color={COLORS.accent} />
            </View>
            <View style={{ flex: 1 }}>
              <View style={styles.signalTitleRow}>
                <Text style={styles.signalTitle}>{sig.name}</Text>
                <Text style={styles.signalScore}>+{sig.score} / {sig.maxScore} pts</Text>
              </View>
              <Text style={styles.signalDetails}>{sig.details}</Text>
            </View>
          </View>
        ))}

        {/* Safe Collaboration Policy */}
        <View style={styles.policyCard}>
          <View style={styles.policyHeader}>
            <Lock size={16} color={COLORS.primaryLight} />
            <Text style={styles.policyTitle}>Enterprise Escrow & Safe Collaboration</Text>
          </View>
          <Text style={styles.policyText}>
            LipTalk enforces verified business identity, zero-tolerance fraud filtering, and secure end-to-end communication channels to protect enterprise partnerships.
          </Text>
        </View>

        {/* Action: Report an Issue */}
        <TouchableOpacity style={styles.reportRow} onPress={handleReportIssue}>
          <Flag size={16} color={COLORS.danger} />
          <View style={{ flex: 1 }}>
            <Text style={styles.reportText}>Report a Violation or Suspicious Activity</Text>
            <Text style={styles.reportSub}>Audited by internal moderation team</Text>
          </View>
          <ChevronRight size={16} color={COLORS.textDim} />
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgDark,
  },
  scrollContent: {
    padding: SPACING.lg,
    paddingBottom: SPACING.xxxl,
  },
  scoreHeroCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
    marginBottom: SPACING.xl,
    gap: SPACING.lg,
    ...SHADOWS.sm,
  },
  scoreBadgeCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.accent,
  },
  scoreNumber: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: '900',
  },
  scoreMax: {
    color: COLORS.accent,
    fontSize: 10,
    fontWeight: '700',
  },
  scoreHeroInfo: {
    flex: 1,
  },
  tierRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  tierName: {
    color: COLORS.accent,
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  scoreSub: {
    color: COLORS.textSecondary,
    fontSize: 11.5,
    lineHeight: 16,
  },
  sectionHeading: {
    color: COLORS.textPrimary,
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.8,
    marginBottom: SPACING.sm,
  },
  signalCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.sm,
    gap: SPACING.md,
  },
  signalIconBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  signalTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  signalTitle: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '800',
  },
  signalScore: {
    color: COLORS.accent,
    fontSize: 11,
    fontWeight: '800',
  },
  signalDetails: {
    color: COLORS.textDim,
    fontSize: 11,
    marginTop: 2,
  },
  policyCard: {
    backgroundColor: COLORS.bgInput,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginTop: SPACING.lg,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  policyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  policyTitle: {
    color: '#FFF',
    fontSize: 12.5,
    fontWeight: '800',
  },
  policyText: {
    color: COLORS.textSecondary,
    fontSize: 11.5,
    lineHeight: 17,
  },
  reportRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    gap: SPACING.md,
    marginTop: SPACING.sm,
  },
  reportText: {
    color: '#FFF',
    fontSize: 12.5,
    fontWeight: '800',
  },
  reportSub: {
    color: COLORS.textDim,
    fontSize: 10.5,
    marginTop: 1,
  },
});
