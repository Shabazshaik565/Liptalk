import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { intelligenceApi } from '../../src/api/domain.api';
import { GraphOverviewReport, ExplainableRecommendationItem, PersonalWeeklyBriefItem } from '../../src/types';

export default function IntelligenceFabricScreen() {
  const router = useRouter();
  const [graphData, setGraphData] = useState<GraphOverviewReport | null>(null);
  const [recommendations, setRecommendations] = useState<ExplainableRecommendationItem[]>([]);
  const [weeklyBrief, setWeeklyBrief] = useState<PersonalWeeklyBriefItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuestion, setSearchQuestion] = useState('');
  const [traversing, setTraversing] = useState(false);
  const [traverseResult, setTraverseResult] = useState<any>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [g, recs, brief] = await Promise.all([
        intelligenceApi.getGraph(),
        intelligenceApi.getRecommendations(),
        intelligenceApi.getPersonalWeeklyBrief(),
      ]);
      setGraphData(g);
      setRecommendations(recs);
      setWeeklyBrief(brief);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleTraverse = async () => {
    if (!searchQuestion.trim()) return;
    setTraversing(true);
    try {
      const res = await intelligenceApi.traverseGraph('usr_curr_01', searchQuestion);
      setTraverseResult(res);
    } catch (e) {
      Alert.alert('Graph Error', 'Unable to traverse graph context.');
    } finally {
      setTraversing(false);
    }
  };

  const handleFeedback = async (id: string, feedback: string) => {
    await intelligenceApi.recordRecommendationFeedback(id, feedback);
    setRecommendations((prev) => prev.filter((r) => r.id !== id));
    Alert.alert('Feedback Applied', 'Recommendation preference updated.');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Global Intelligence Fabric</Text>
          <Text style={styles.headerSubtitle}>Cross-Domain Knowledge Graph & Insights</Text>
        </View>
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => router.push('/digital-twins' as any)}
        >
          <Ionicons name="finger-print-outline" size={20} color="#6366F1" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color="#6366F1" />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Quick Action Navigation Strip */}
          <View style={styles.navStrip}>
            <TouchableOpacity style={styles.navChip} onPress={() => router.push('/simulation' as any)}>
              <Ionicons name="cube-outline" size={14} color="#38BDF8" />
              <Text style={styles.navChipText}>Simulation Lab</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.navChip} onPress={() => router.push('/predictions' as any)}>
              <Ionicons name="trending-up-outline" size={14} color="#10B981" />
              <Text style={styles.navChipText}>Forecasts</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.navChip} onPress={() => router.push('/skills' as any)}>
              <Ionicons name="git-network-outline" size={14} color="#A855F7" />
              <Text style={styles.navChipText}>Skill Graph</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.navChip} onPress={() => router.push('/digital-twins' as any)}>
              <Ionicons name="person-circle-outline" size={14} color="#F59E0B" />
              <Text style={styles.navChipText}>Digital Twins</Text>
            </TouchableOpacity>
          </View>

          {/* Weekly Executive Briefing Card */}
          {weeklyBrief && (
            <View style={styles.card}>
              <View style={styles.badgeRow}>
                <View style={styles.briefBadge}>
                  <Text style={styles.briefBadgeText}>Weekly Intelligence</Text>
                </View>
                <Text style={styles.periodText}>{weeklyBrief.period}</Text>
              </View>
              <Text style={styles.briefHeadline}>{weeklyBrief.executiveHeadline}</Text>

              <View style={styles.highlightList}>
                {weeklyBrief.keyHighlights.map((hl, idx) => (
                  <View key={idx} style={styles.hlRow}>
                    <Ionicons name="sparkles" size={14} color="#6366F1" style={{ marginTop: 2 }} />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.hlCategory}>{hl.category}</Text>
                      <Text style={styles.hlTitle}>{hl.headline}</Text>
                      <Text style={styles.hlDesc}>{hl.details}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Cross-Domain Knowledge Graph Explorer */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Cross-Domain Graph Explorer</Text>
              <Text style={styles.graphScopeTag}>
                {graphData?.totalEntitiesCount} Nodes • {graphData?.totalRelationshipsCount} Edges
              </Text>
            </View>
            <Text style={styles.cardDesc}>
              Permission-filtered subgraph connecting your People, Communities, Projects, Creators, and AI Agents.
            </Text>

            {/* Graph Node Cloud */}
            <View style={styles.nodeGrid}>
              {graphData?.nodes.map((node) => (
                <View key={node.id} style={styles.nodeChip}>
                  <View
                    style={[
                      styles.domainDot,
                      {
                        backgroundColor:
                          node.domain === 'PEOPLE'
                            ? '#6366F1'
                            : node.domain === 'SOCIAL'
                            ? '#10B981'
                            : node.domain === 'PROJECTS'
                            ? '#38BDF8'
                            : node.domain === 'AI_AGENTS'
                            ? '#A855F7'
                            : '#F59E0B',
                      },
                    ]}
                  />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.nodeDomain}>{node.domain}</Text>
                    <Text style={styles.nodeLabel} numberOfLines={1}>
                      {node.label}
                    </Text>
                  </View>
                </View>
              ))}
            </View>

            {/* Natural Language Graph Reasoner */}
            <View style={styles.queryBox}>
              <Text style={styles.queryLabel}>Ask Graph Context Engine:</Text>
              <View style={styles.inputRow}>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. Which communities relate to my FMCG project?"
                  placeholderTextColor="#64748B"
                  value={searchQuestion}
                  onChangeText={setSearchQuestion}
                />
                <TouchableOpacity style={styles.traverseBtn} onPress={handleTraverse} disabled={traversing}>
                  {traversing ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <Ionicons name="search" size={18} color="#FFFFFF" />
                  )}
                </TouchableOpacity>
              </View>

              {traverseResult && (
                <View style={styles.traverseResultBox}>
                  <Text style={styles.traverseResultTitle}>AI Graph Synthesis:</Text>
                  <Text style={styles.traverseResultText}>{traverseResult.aiGraphReasoningSummary}</Text>
                </View>
              )}
            </View>
          </View>

          {/* Explainable Recommendations */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Explainable Recommendations</Text>
            <Text style={styles.cardDesc}>
              Personalized discoveries tailored to your goals with transparent reasoning.
            </Text>

            {recommendations.map((rec) => (
              <View key={rec.id} style={styles.recItem}>
                <View style={styles.recHead}>
                  <View style={styles.recCategoryBadge}>
                    <Text style={styles.recCategoryText}>{rec.category}</Text>
                  </View>
                  <Text style={styles.recScore}>{(rec.relevanceScore * 100).toFixed(0)}% Match</Text>
                </View>

                <Text style={styles.recTitle}>{rec.itemTitle}</Text>
                <View style={styles.whyBox}>
                  <Ionicons name="information-circle-outline" size={14} color="#38BDF8" />
                  <Text style={styles.whyText}>Why: {rec.explanationReason}</Text>
                </View>

                <View style={styles.feedbackRow}>
                  <TouchableOpacity
                    style={styles.feedbackBtn}
                    onPress={() => handleFeedback(rec.id, 'HELPFUL')}
                  >
                    <Ionicons name="thumbs-up-outline" size={12} color="#10B981" />
                    <Text style={[styles.feedbackBtnText, { color: '#10B981' }]}>Relevant</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.feedbackBtn}
                    onPress={() => handleFeedback(rec.id, 'SHOW_LESS')}
                  >
                    <Ionicons name="eye-off-outline" size={12} color="#94A3B8" />
                    <Text style={styles.feedbackBtnText}>Show Less</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.feedbackBtn}
                    onPress={() => handleFeedback(rec.id, 'DISMISSED')}
                  >
                    <Ionicons name="close-circle-outline" size={12} color="#EF4444" />
                    <Text style={[styles.feedbackBtnText, { color: '#EF4444' }]}>Dismiss</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
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
  actionBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingBox: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scrollContent: { padding: 16, paddingBottom: 40 },
  navStrip: { flexDirection: 'row', gap: 8, marginBottom: 14 },
  navChip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    backgroundColor: '#111827',
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  navChipText: { color: '#F1F5F9', fontSize: 11, fontWeight: '600' },
  card: {
    backgroundColor: '#111827',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  badgeRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  briefBadge: {
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  briefBadgeText: { color: '#6366F1', fontSize: 11, fontWeight: '700' },
  periodText: { color: '#94A3B8', fontSize: 11 },
  briefHeadline: { fontSize: 15, fontWeight: '700', color: '#F8FAFC', marginBottom: 12, lineHeight: 20 },
  highlightList: { gap: 10 },
  hlRow: { flexDirection: 'row', gap: 10, backgroundColor: '#0F172A', padding: 10, borderRadius: 8 },
  hlCategory: { fontSize: 10, fontWeight: '700', color: '#38BDF8', marginBottom: 2 },
  hlTitle: { fontSize: 12, fontWeight: '600', color: '#F1F5F9', marginBottom: 2 },
  hlDesc: { fontSize: 11, color: '#94A3B8', lineHeight: 15 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  cardTitle: { fontSize: 16, fontWeight: '700', color: '#F8FAFC' },
  graphScopeTag: { fontSize: 11, color: '#38BDF8', fontWeight: '600' },
  cardDesc: { fontSize: 12, color: '#94A3B8', lineHeight: 17, marginBottom: 12 },
  nodeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 14 },
  nodeChip: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#0F172A',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  domainDot: { width: 8, height: 8, borderRadius: 4 },
  nodeDomain: { fontSize: 9, fontWeight: '700', color: '#94A3B8' },
  nodeLabel: { fontSize: 11, fontWeight: '600', color: '#F1F5F9' },
  queryBox: { backgroundColor: '#0F172A', borderRadius: 10, padding: 12 },
  queryLabel: { fontSize: 11, fontWeight: '700', color: '#94A3B8', marginBottom: 6 },
  inputRow: { flexDirection: 'row', gap: 8 },
  input: {
    flex: 1,
    backgroundColor: '#1E293B',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: '#F8FAFC',
    fontSize: 12,
  },
  traverseBtn: {
    backgroundColor: '#6366F1',
    paddingHorizontal: 14,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  traverseResultBox: {
    marginTop: 10,
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    borderRadius: 8,
    padding: 10,
  },
  traverseResultTitle: { fontSize: 11, fontWeight: '700', color: '#6366F1', marginBottom: 4 },
  traverseResultText: { fontSize: 12, color: '#E2E8F0', lineHeight: 16 },
  recItem: { backgroundColor: '#0F172A', borderRadius: 10, padding: 12, marginBottom: 10 },
  recHead: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  recCategoryBadge: { backgroundColor: '#1E293B', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  recCategoryText: { color: '#A855F7', fontSize: 10, fontWeight: '700' },
  recScore: { color: '#10B981', fontSize: 11, fontWeight: '700' },
  recTitle: { fontSize: 14, fontWeight: '700', color: '#F1F5F9', marginBottom: 6 },
  whyBox: {
    flexDirection: 'row',
    gap: 6,
    backgroundColor: 'rgba(56, 189, 248, 0.08)',
    padding: 8,
    borderRadius: 6,
    marginBottom: 8,
  },
  whyText: { fontSize: 11, color: '#BAE6FD', flex: 1, lineHeight: 15 },
  feedbackRow: { flexDirection: 'row', gap: 8 },
  feedbackBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#1E293B',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  feedbackBtnText: { fontSize: 10, color: '#CBD5E1', fontWeight: '600' },
});
