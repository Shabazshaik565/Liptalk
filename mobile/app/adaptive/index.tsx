import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { ArrowLeft, ShieldCheck, Network, FlaskConical, BellRing, Lock, Sparkles } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { adaptationApi } from '../../src/api/domain.api';
import { ImprovementProposalItem, FeedbackClusterItem, PlatformHealthModelItem } from '../../src/types';
import { COLORS, RADIUS, SPACING, SHADOWS } from '../../src/constants/theme';

export default function AdaptiveHubScreen() {
  const router = useRouter();
  const [dashboard, setDashboard] = useState<any>(null);
  const [proposals, setProposals] = useState<ImprovementProposalItem[]>([]);
  const [feedback, setFeedback] = useState<FeedbackClusterItem[]>([]);
  const [health, setHealth] = useState<PlatformHealthModelItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [dash, props, fb, hl] = await Promise.all([
        adaptationApi.getDashboard(),
        adaptationApi.getImprovements(),
        adaptationApi.getFeedbackClusters(),
        adaptationApi.getPlatformHealth(),
      ]);
      setDashboard(dash);
      setProposals(props);
      setFeedback(fb);
      setHealth(hl);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} activeOpacity={0.8}>
          <ArrowLeft size={20} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Adaptive Operating Hub</Text>
          <Text style={styles.headerSubtitle}>Self-Learning • Guardrailed • Human-Controlled</Text>
        </View>
        <TouchableOpacity
          style={styles.safetyBadge}
          onPress={() => Alert.alert('AI Governance Protocol', 'AI evaluates telemetry and proposes experiments, but is strictly prohibited from modifying its own permissions or safety boundaries.')}
          activeOpacity={0.8}
        >
          <ShieldCheck size={18} color={COLORS.accent} />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Status Banner */}
          <View style={styles.statusBanner}>
            <View style={styles.statusRow}>
              <View style={styles.statusPulse} />
              <Text style={styles.statusTitle}>CONTINUOUS ADAPTATION ENGINE ACTIVE</Text>
            </View>
            <Text style={styles.statusDesc}>
              Analyzing cross-domain telemetry, detecting UX friction, and running controlled canary experiments.
            </Text>
            <View style={styles.metricsRow}>
              <View style={styles.metricBox}>
                <Text style={styles.metricVal}>{health?.dimensions.availability.score}%</Text>
                <Text style={styles.metricLbl}>Availability</Text>
              </View>
              <View style={styles.metricBox}>
                <Text style={styles.metricVal}>{health?.dimensions.performance.averageLatencyMs}ms</Text>
                <Text style={styles.metricLbl}>Edge Latency</Text>
              </View>
              <View style={styles.metricBox}>
                <Text style={styles.metricVal}>{dashboard?.activeExperimentsCount}</Text>
                <Text style={styles.metricLbl}>Experiments</Text>
              </View>
            </View>
          </View>

          {/* Quick Action Navigation Strip */}
          <View style={styles.navGrid}>
            <TouchableOpacity
              style={styles.navCard}
              onPress={() => router.push('/ai-plans' as any)}
              activeOpacity={0.82}
            >
              <Network size={22} color={COLORS.primaryLight} />
              <Text style={styles.navCardTitle}>AI Planning</Text>
              <Text style={styles.navCardSub}>Multi-Step Plans</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.navCard}
              onPress={() => router.push('/experiments' as any)}
              activeOpacity={0.82}
            >
              <FlaskConical size={22} color={COLORS.info} />
              <Text style={styles.navCardTitle}>Experiments</Text>
              <Text style={styles.navCardSub}>Canary Rollouts</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.navCard}
              onPress={() => router.push('/attention' as any)}
              activeOpacity={0.82}
            >
              <BellRing size={22} color={COLORS.warning} />
              <Text style={styles.navCardTitle}>Attention Center</Text>
              <Text style={styles.navCardSub}>Focus & Batching</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.navCard}
              onPress={() => router.push('/security/hub' as any)}
              activeOpacity={0.82}
            >
              <Lock size={22} color={COLORS.accent} />
              <Text style={styles.navCardTitle}>Security Hub</Text>
              <Text style={styles.navCardSub}>Threats & Privacy</Text>
            </TouchableOpacity>
          </View>

          {/* Section: Improvement Proposals */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Continuous Improvement Proposals</Text>
            <View style={styles.badgeCount}>
              <Text style={styles.badgeCountText}>{proposals.length}</Text>
            </View>
          </View>

          {proposals.map((prop) => (
            <View key={prop.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.catBadge}>
                  <Text style={styles.catBadgeText}>{prop.category.replace(/_/g, ' ')}</Text>
                </View>
                <Text
                  style={[
                    styles.statusTag,
                    { color: prop.status === 'EXPERIMENTING' ? COLORS.info : COLORS.accent },
                  ]}
                >
                  ● {prop.status}
                </Text>
              </View>

              <Text style={styles.cardTitle}>{prop.title}</Text>
              <Text style={styles.cardDesc}>{prop.problemDescription}</Text>

              <View style={styles.metaBox}>
                <View style={styles.metaRow}>
                  <Text style={styles.metaLbl}>Proposed Solution:</Text>
                  <Text style={styles.metaVal}>{prop.proposedChange}</Text>
                </View>
                <View style={styles.metaRow}>
                  <Text style={styles.metaLbl}>Expected Benefit:</Text>
                  <Text style={styles.metaVal}>{prop.expectedBenefit}</Text>
                </View>
                <View style={styles.metaRow}>
                  <Text style={styles.metaLbl}>Rollback Plan:</Text>
                  <Text style={styles.metaVal}>{prop.rollbackPlan}</Text>
                </View>
              </View>
            </View>
          ))}

          {/* Section: Feedback Intelligence & Roadmap Recommendations */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>User Feedback Intelligence & Roadmap</Text>
          </View>

          {feedback.map((fb) => (
            <View key={fb.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.feedbackBadge}>
                  <Text style={styles.feedbackBadgeText}>{fb.clusterCategory}</Text>
                </View>
                <Text style={styles.urgentTag}>{fb.urgencyLevel} PRIORITY ({fb.feedbackItemsCount} Users)</Text>
              </View>

              <Text style={styles.cardTitle}>{fb.clusterTheme}</Text>

              <View style={styles.quoteBox}>
                {fb.representativeQuotes.map((q, qIdx) => (
                  <Text key={qIdx} style={styles.quoteText}>
                    "{q}"
                  </Text>
                ))}
              </View>

              <View style={styles.aiRoadmapBox}>
                <Sparkles size={14} color={COLORS.primaryLight} />
                <Text style={styles.aiRoadmapText}>{fb.aiRoadmapRecommendation}</Text>
              </View>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bgDark },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingTop: 54,
    paddingBottom: SPACING.lg,
    backgroundColor: COLORS.bgCard,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.bgElevated,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  headerTitleContainer: { flex: 1 },
  headerTitle: { fontSize: 18, fontWeight: '800', color: COLORS.textPrimary },
  headerSubtitle: { fontSize: 12, color: COLORS.textMuted, marginTop: 2 },
  safetyBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  loadingBox: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scrollContent: { padding: SPACING.lg, paddingBottom: 40 },
  statusBanner: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
  },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  statusPulse: { width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.accent },
  statusTitle: { fontSize: 11, fontWeight: '800', color: COLORS.accent, letterSpacing: 0.5 },
  statusDesc: { fontSize: 12, color: COLORS.textSecondary, lineHeight: 17, marginBottom: 14 },
  metricsRow: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: COLORS.bgInput, borderRadius: RADIUS.md, padding: 12, borderWidth: 1, borderColor: COLORS.borderLight },
  metricBox: { alignItems: 'center', flex: 1 },
  metricVal: { fontSize: 16, fontWeight: '800', color: COLORS.textPrimary },
  metricLbl: { fontSize: 10.5, color: COLORS.textMuted, marginTop: 2 },
  navGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 20 },
  navCard: {
    width: '48%',
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.lg,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
  },
  navCardTitle: { fontSize: 13, fontWeight: '800', color: COLORS.textPrimary, marginTop: 8 },
  navCardSub: { fontSize: 10.5, color: COLORS.textMuted, marginTop: 2 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, marginTop: 6 },
  sectionTitle: { fontSize: 15, fontWeight: '800', color: COLORS.textPrimary },
  badgeCount: { backgroundColor: COLORS.primary, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 },
  badgeCountText: { color: '#FFFFFF', fontSize: 10, fontWeight: '800' },
  card: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  catBadge: {
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
  },
  catBadgeText: { color: COLORS.primaryLight, fontSize: 10, fontWeight: '800' },
  statusTag: { fontSize: 11, fontWeight: '800' },
  cardTitle: { fontSize: 15, fontWeight: '800', color: COLORS.textPrimary, marginBottom: 6 },
  cardDesc: { fontSize: 12, color: COLORS.textSecondary, lineHeight: 17, marginBottom: 10 },
  metaBox: { backgroundColor: COLORS.bgInput, borderRadius: RADIUS.md, padding: 10, gap: 6, borderWidth: 1, borderColor: COLORS.borderLight },
  metaRow: { flexDirection: 'column' },
  metaLbl: { fontSize: 10, fontWeight: '800', color: COLORS.primaryLight, marginBottom: 1 },
  metaVal: { fontSize: 11, color: COLORS.textSecondary, lineHeight: 15 },
  feedbackBadge: {
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
  },
  feedbackBadgeText: { color: COLORS.primaryLight, fontSize: 10, fontWeight: '800' },
  urgentTag: { fontSize: 11, fontWeight: '800', color: COLORS.warning },
  quoteBox: { backgroundColor: COLORS.bgInput, borderRadius: RADIUS.md, padding: 10, marginBottom: 10, gap: 4, borderWidth: 1, borderColor: COLORS.borderLight },
  quoteText: { fontSize: 11, color: COLORS.textMuted, fontStyle: 'italic' },
  aiRoadmapBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(139, 92, 246, 0.12)',
    padding: 10,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.25)',
  },
  aiRoadmapText: { fontSize: 11, color: '#E9D5FF', flex: 1, lineHeight: 15 },
});
