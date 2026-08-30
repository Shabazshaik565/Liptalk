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
import { ArrowLeft, Fingerprint, Box, TrendingUp, Network, User, Sparkles, Search, Info, ThumbsUp, EyeOff, XCircle } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { intelligenceApi } from '../../src/api/domain.api';
import { GraphOverviewReport, ExplainableRecommendationItem, PersonalWeeklyBriefItem } from '../../src/types';
import { COLORS, RADIUS, SPACING, SHADOWS } from '../../src/constants/theme';

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
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} activeOpacity={0.8}>
          <ArrowLeft size={20} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Global Intelligence Fabric</Text>
          <Text style={styles.headerSubtitle}>Cross-Domain Knowledge Graph & Insights</Text>
        </View>
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => router.push('/digital-twins' as any)}
          activeOpacity={0.8}
        >
          <Fingerprint size={18} color={COLORS.primaryLight} />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Quick Action Navigation Strip */}
          <View style={styles.navStrip}>
            <TouchableOpacity style={styles.navChip} onPress={() => router.push('/simulation' as any)} activeOpacity={0.82}>
              <Box size={14} color={COLORS.info} />
              <Text style={styles.navChipText}>Simulation Lab</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.navChip} onPress={() => router.push('/predictions' as any)} activeOpacity={0.82}>
              <TrendingUp size={14} color={COLORS.accent} />
              <Text style={styles.navChipText}>Forecasts</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.navChip} onPress={() => router.push('/skills' as any)} activeOpacity={0.82}>
              <Network size={14} color={COLORS.primaryLight} />
              <Text style={styles.navChipText}>Skill Graph</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.navChip} onPress={() => router.push('/digital-twins' as any)} activeOpacity={0.82}>
              <User size={14} color={COLORS.warning} />
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
                    <Sparkles size={14} color={COLORS.primaryLight} style={{ marginTop: 2 }} />
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
                            ? COLORS.primary
                            : node.domain === 'SOCIAL'
                            ? COLORS.accent
                            : node.domain === 'PROJECTS'
                            ? COLORS.info
                            : node.domain === 'AI_AGENTS'
                            ? COLORS.primaryLight
                            : COLORS.warning,
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
                  placeholderTextColor={COLORS.textDim}
                  value={searchQuestion}
                  onChangeText={setSearchQuestion}
                />
                <TouchableOpacity style={styles.traverseBtn} onPress={handleTraverse} disabled={traversing} activeOpacity={0.85}>
                  {traversing ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <Search size={16} color="#FFFFFF" />
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
                  <Info size={14} color={COLORS.info} />
                  <Text style={styles.whyText}>Why: {rec.explanationReason}</Text>
                </View>

                <View style={styles.feedbackRow}>
                  <TouchableOpacity
                    style={styles.feedbackBtn}
                    onPress={() => handleFeedback(rec.id, 'HELPFUL')}
                    activeOpacity={0.82}
                  >
                    <ThumbsUp size={12} color={COLORS.accent} />
                    <Text style={[styles.feedbackBtnText, { color: COLORS.accent }]}>Relevant</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.feedbackBtn}
                    onPress={() => handleFeedback(rec.id, 'SHOW_LESS')}
                    activeOpacity={0.82}
                  >
                    <EyeOff size={12} color={COLORS.textMuted} />
                    <Text style={styles.feedbackBtnText}>Show Less</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.feedbackBtn}
                    onPress={() => handleFeedback(rec.id, 'DISMISSED')}
                    activeOpacity={0.82}
                  >
                    <XCircle size={12} color={COLORS.danger} />
                    <Text style={[styles.feedbackBtnText, { color: COLORS.danger }]}>Dismiss</Text>
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
  actionBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
  },
  loadingBox: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scrollContent: { padding: SPACING.lg, paddingBottom: 40 },
  navStrip: { flexDirection: 'row', gap: 8, marginBottom: 14 },
  navChip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    backgroundColor: COLORS.bgCard,
    paddingVertical: 10,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
  },
  navChipText: { color: COLORS.textPrimary, fontSize: 10.5, fontWeight: '700' },
  card: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
  },
  badgeRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  briefBadge: {
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
  },
  briefBadgeText: { color: COLORS.primaryLight, fontSize: 10, fontWeight: '800' },
  periodText: { color: COLORS.textMuted, fontSize: 11 },
  briefHeadline: { fontSize: 15, fontWeight: '800', color: COLORS.textPrimary, marginBottom: 12, lineHeight: 20 },
  highlightList: { gap: 10 },
  hlRow: { flexDirection: 'row', gap: 10, backgroundColor: COLORS.bgInput, padding: 10, borderRadius: RADIUS.md, borderWidth: 1, borderColor: COLORS.borderLight },
  hlCategory: { fontSize: 10, fontWeight: '800', color: COLORS.info, marginBottom: 2 },
  hlTitle: { fontSize: 12.5, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 2 },
  hlDesc: { fontSize: 11, color: COLORS.textSecondary, lineHeight: 15 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  cardTitle: { fontSize: 16, fontWeight: '800', color: COLORS.textPrimary },
  graphScopeTag: { fontSize: 11, color: COLORS.info, fontWeight: '700' },
  cardDesc: { fontSize: 12, color: COLORS.textSecondary, lineHeight: 17, marginBottom: 12 },
  nodeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 14 },
  nodeChip: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: COLORS.bgInput,
    padding: 10,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  domainDot: { width: 8, height: 8, borderRadius: 4 },
  nodeDomain: { fontSize: 9, fontWeight: '800', color: COLORS.textMuted },
  nodeLabel: { fontSize: 11.5, fontWeight: '700', color: COLORS.textPrimary },
  queryBox: { backgroundColor: COLORS.bgInput, borderRadius: RADIUS.md, padding: 12, borderWidth: 1, borderColor: COLORS.borderLight },
  queryLabel: { fontSize: 11, fontWeight: '800', color: COLORS.primaryLight, marginBottom: 6, letterSpacing: 0.4 },
  inputRow: { flexDirection: 'row', gap: 8 },
  input: {
    flex: 1,
    backgroundColor: COLORS.bgElevated,
    borderRadius: RADIUS.md,
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: COLORS.textPrimary,
    fontSize: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  traverseBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 14,
    borderRadius: RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.glowPrimary,
  },
  traverseResultBox: {
    marginTop: 10,
    backgroundColor: 'rgba(139, 92, 246, 0.12)',
    borderRadius: RADIUS.md,
    padding: 10,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.25)',
  },
  traverseResultTitle: { fontSize: 11, fontWeight: '800', color: COLORS.primaryLight, marginBottom: 4 },
  traverseResultText: { fontSize: 12, color: COLORS.textPrimary, lineHeight: 16 },
  recItem: { backgroundColor: COLORS.bgInput, borderRadius: RADIUS.md, padding: 12, marginBottom: 10, borderWidth: 1, borderColor: COLORS.borderLight },
  recHead: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  recCategoryBadge: {
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
  },
  recCategoryText: { color: COLORS.primaryLight, fontSize: 10, fontWeight: '800' },
  recScore: { color: COLORS.accent, fontSize: 11, fontWeight: '800' },
  recTitle: { fontSize: 14, fontWeight: '800', color: COLORS.textPrimary, marginBottom: 6 },
  whyBox: {
    flexDirection: 'row',
    gap: 6,
    backgroundColor: 'rgba(56, 189, 248, 0.08)',
    padding: 8,
    borderRadius: 6,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.2)',
  },
  whyText: { fontSize: 11, color: '#BAE6FD', flex: 1, lineHeight: 15 },
  feedbackRow: { flexDirection: 'row', gap: 8 },
  feedbackBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.bgElevated,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  feedbackBtnText: { fontSize: 10.5, color: COLORS.textMuted, fontWeight: '700' },
});
