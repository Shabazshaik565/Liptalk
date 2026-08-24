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
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { adaptationApi } from '../../src/api/domain.api';
import { ImprovementProposalItem, FeedbackClusterItem, PlatformHealthModelItem } from '../../src/types';

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
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Adaptive Operating Hub</Text>
          <Text style={styles.headerSubtitle}>Self-Learning • Guardrailed • Human-Controlled</Text>
        </View>
        <TouchableOpacity
          style={styles.safetyBadge}
          onPress={() => Alert.alert('AI Governance Protocol', 'AI evaluates telemetry and proposes experiments, but is strictly prohibited from modifying its own permissions or safety boundaries.')}
        >
          <Ionicons name="shield-checkmark" size={18} color="#10B981" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color="#6366F1" />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent}>
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
            >
              <Ionicons name="git-network-outline" size={22} color="#6366F1" />
              <Text style={styles.navCardTitle}>AI Planning</Text>
              <Text style={styles.navCardSub}>Multi-Step Plans</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.navCard}
              onPress={() => router.push('/experiments' as any)}
            >
              <Ionicons name="flask-outline" size={22} color="#38BDF8" />
              <Text style={styles.navCardTitle}>Experiments</Text>
              <Text style={styles.navCardSub}>Canary Rollouts</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.navCard}
              onPress={() => router.push('/attention' as any)}
            >
              <Ionicons name="notifications-circle-outline" size={22} color="#F59E0B" />
              <Text style={styles.navCardTitle}>Attention Center</Text>
              <Text style={styles.navCardSub}>Focus & Batching</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.navCard}
              onPress={() => router.push('/security/hub' as any)}
            >
              <Ionicons name="lock-closed-outline" size={22} color="#10B981" />
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
                    { color: prop.status === 'EXPERIMENTING' ? '#38BDF8' : '#10B981' },
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
                <Ionicons name="sparkles" size={14} color="#A855F7" />
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
  container: { flex: 1, backgroundColor: '#0B0F19' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 54,
    paddingBottom: 16,
    backgroundColor: '#111827',
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  backBtn: { padding: 6, marginRight: 10 },
  headerTitleContainer: { flex: 1 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#F8FAFC' },
  headerSubtitle: { fontSize: 12, color: '#94A3B8', marginTop: 2 },
  safetyBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingBox: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scrollContent: { padding: 16, paddingBottom: 40 },
  statusBanner: {
    backgroundColor: '#111827',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  statusPulse: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#10B981' },
  statusTitle: { fontSize: 11, fontWeight: '700', color: '#10B981', letterSpacing: 0.5 },
  statusDesc: { fontSize: 12, color: '#94A3B8', lineHeight: 17, marginBottom: 14 },
  metricsRow: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#0F172A', borderRadius: 10, padding: 12 },
  metricBox: { alignItems: 'center', flex: 1 },
  metricVal: { fontSize: 16, fontWeight: '700', color: '#F8FAFC' },
  metricLbl: { fontSize: 10, color: '#94A3B8', marginTop: 2 },
  navGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 20 },
  navCard: {
    width: '48%',
    backgroundColor: '#111827',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  navCardTitle: { fontSize: 13, fontWeight: '700', color: '#F8FAFC', marginTop: 8 },
  navCardSub: { fontSize: 10, color: '#94A3B8', marginTop: 2 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, marginTop: 6 },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: '#F8FAFC' },
  badgeCount: { backgroundColor: '#6366F1', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 },
  badgeCountText: { color: '#FFFFFF', fontSize: 10, fontWeight: '700' },
  card: {
    backgroundColor: '#111827',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  catBadge: { backgroundColor: 'rgba(99, 102, 241, 0.15)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  catBadgeText: { color: '#6366F1', fontSize: 10, fontWeight: '700' },
  statusTag: { fontSize: 11, fontWeight: '700' },
  cardTitle: { fontSize: 15, fontWeight: '700', color: '#F8FAFC', marginBottom: 6 },
  cardDesc: { fontSize: 12, color: '#94A3B8', lineHeight: 17, marginBottom: 10 },
  metaBox: { backgroundColor: '#0F172A', borderRadius: 8, padding: 10, gap: 6 },
  metaRow: { flexDirection: 'column' },
  metaLbl: { fontSize: 10, fontWeight: '700', color: '#64748B', marginBottom: 1 },
  metaVal: { fontSize: 11, color: '#CBD5E1', lineHeight: 15 },
  feedbackBadge: { backgroundColor: 'rgba(168, 85, 247, 0.15)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  feedbackBadgeText: { color: '#A855F7', fontSize: 10, fontWeight: '700' },
  urgentTag: { fontSize: 11, fontWeight: '700', color: '#F59E0B' },
  quoteBox: { backgroundColor: '#0F172A', borderRadius: 8, padding: 10, marginBottom: 10, gap: 4 },
  quoteText: { fontSize: 11, color: '#94A3B8', fontStyle: 'italic' },
  aiRoadmapBox: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(168, 85, 247, 0.1)', padding: 10, borderRadius: 8 },
  aiRoadmapText: { fontSize: 11, color: '#E9D5FF', flex: 1, lineHeight: 15 },
});
