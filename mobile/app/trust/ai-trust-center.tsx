import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  ShieldCheck,
  Lock,
  Eye,
  Zap,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
} from 'lucide-react-native';
import { useAgentsStore } from '../../src/store/agents.store';
import { Badge } from '../../src/components/common/Badge';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../../src/constants/theme';

export default function AiTrustCenterScreen() {
  const router = useRouter();
  const { trustCenter, init } = useAgentsStore();

  useEffect(() => {
    init();
  }, []);

  return (
    <View style={styles.container}>
      {/* Top Navigation */}
      <View style={styles.topNav}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={20} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.topNavTitle}>AI TRUST & GOVERNANCE</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Banner */}
        <View style={styles.bannerCard}>
          <Image
            source={require('../../assets/mascot/mascot_ai.png')}
            style={styles.mascotImg}
            resizeMode="contain"
          />
          <View style={{ flex: 1, marginLeft: SPACING.sm }}>
            <Text style={styles.bannerTitle}>Human Authority by Design</Text>
            <Text style={styles.bannerSub}>
              LipTalk AI acts as an autonomous assistant within strict, user-governed boundaries.
            </Text>
          </View>
        </View>

        {/* Safety Thresholds */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Enforced Platform Safety Thresholds</Text>
          <View style={styles.thresholdGrid}>
            <View style={styles.thresholdCard}>
              <Text style={styles.thresholdVal}>{trustCenter?.safetyThresholds?.maxStepLimit || 5}</Text>
              <Text style={styles.thresholdLbl}>MAX AGENT STEPS</Text>
            </View>
            <View style={styles.thresholdCard}>
              <Text style={styles.thresholdVal}>${trustCenter?.safetyThresholds?.maxDailyBudgetUsd || '10.00'}</Text>
              <Text style={styles.thresholdLbl}>DAILY BUDGET CAP</Text>
            </View>
            <View style={styles.thresholdCard}>
              <Text style={styles.thresholdVal}>{trustCenter?.safetyThresholds?.rateLimitPerMinute || 60}/min</Text>
              <Text style={styles.thresholdLbl}>REQUEST RATE LIMIT</Text>
            </View>
          </View>
        </View>

        {/* Core Principles */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>AI Governance Principles</Text>
          <View style={styles.card}>
            {(trustCenter?.principles || [
              {
                title: 'Human Authority & Control',
                description: 'High-impact actions strictly require explicit user approval.',
              },
              {
                title: 'Zero Credential Leakage',
                description: 'Bearer tokens, passwords, and sensitive credentials are redacted automatically.',
              },
              {
                title: 'User-Governed Memory Vault',
                description: 'Users have full visibility to view, edit, or purge all learned AI context at any time.',
              },
              {
                title: 'Transparent Multi-Model Routing',
                description: 'Independent model failover ensures zero downtime with cost accounting.',
              },
            ]).map((pr, idx) => (
              <View key={idx}>
                <View style={styles.principleRow}>
                  <CheckCircle2 size={16} color="#10B981" style={{ marginTop: 2 }} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.principleTitle}>{pr.title}</Text>
                    <Text style={styles.principleDesc}>{pr.description}</Text>
                  </View>
                </View>
                {idx < 3 && <View style={styles.rowDivider} />}
              </View>
            ))}
          </View>
        </View>
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
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xl + 10,
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
    fontSize: 13,
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
  bannerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.xl,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
    marginBottom: SPACING.lg,
    ...SHADOWS.md,
  },
  mascotImg: {
    width: 48,
    height: 48,
  },
  bannerTitle: {
    color: COLORS.textPrimary,
    fontSize: 14.5,
    fontWeight: '900',
  },
  bannerSub: {
    color: COLORS.textMuted,
    fontSize: 11,
    marginTop: 2,
    lineHeight: 15,
  },
  section: {
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    color: COLORS.textPrimary,
    fontSize: 13.5,
    fontWeight: '800',
    marginBottom: SPACING.xs,
  },
  thresholdGrid: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  thresholdCard: {
    flex: 1,
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  thresholdVal: {
    color: COLORS.primaryLight,
    fontSize: 15,
    fontWeight: '900',
  },
  thresholdLbl: {
    color: COLORS.textDim,
    fontSize: 9,
    fontWeight: '800',
    marginTop: 2,
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  card: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
  principleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.sm,
    padding: SPACING.md,
  },
  principleTitle: {
    color: COLORS.textPrimary,
    fontSize: 13,
    fontWeight: '800',
  },
  principleDesc: {
    color: COLORS.textMuted,
    fontSize: 11,
    marginTop: 2,
    lineHeight: 15,
  },
  rowDivider: {
    height: 1,
    backgroundColor: COLORS.border,
  },
});
