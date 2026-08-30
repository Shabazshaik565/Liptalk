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
import { ArrowLeft, FlaskConical, GitCompare, Library, Sparkles } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { coordinationApi } from '../../src/api/domain.api';
import { KnowledgeConflictItem, ResearchProjectItem } from '../../src/types';
import { COLORS, RADIUS, SPACING, SHADOWS } from '../../src/constants/theme';

export default function KnowledgeNetworkScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'CONFLICTS' | 'RESEARCH'>('CONFLICTS');
  const [conflicts, setConflicts] = useState<KnowledgeConflictItem[]>([]);
  const [researchList, setResearchList] = useState<ResearchProjectItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [c, r] = await Promise.all([
        coordinationApi.getKnowledgeConflicts(),
        coordinationApi.getResearchProjects(),
      ]);
      setConflicts(c);
      setResearchList(r);
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
          <Text style={styles.headerTitle}>Collective Knowledge Network</Text>
          <Text style={styles.headerSubtitle}>Cross-Source Verification & Research</Text>
        </View>
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => Alert.alert('New Research', 'Start a structured collective research investigation.')}
          activeOpacity={0.8}
        >
          <FlaskConical size={18} color={COLORS.primaryLight} />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'CONFLICTS' && styles.tabItemActive]}
          onPress={() => setActiveTab('CONFLICTS')}
          activeOpacity={0.82}
        >
          <GitCompare
            size={15}
            color={activeTab === 'CONFLICTS' ? COLORS.primaryLight : COLORS.textMuted}
          />
          <Text style={[styles.tabText, activeTab === 'CONFLICTS' && styles.tabTextActive]}>
            Conflict Analysis ({conflicts.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'RESEARCH' && styles.tabItemActive]}
          onPress={() => setActiveTab('RESEARCH')}
          activeOpacity={0.82}
        >
          <Library
            size={15}
            color={activeTab === 'RESEARCH' ? COLORS.primaryLight : COLORS.textMuted}
          />
          <Text style={[styles.tabText, activeTab === 'RESEARCH' && styles.tabTextActive]}>
            Research Hub ({researchList.length})
          </Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {activeTab === 'CONFLICTS' &&
            conflicts.map((conf) => (
              <View key={conf.id} style={styles.card}>
                <View style={styles.cardHeader}>
                  <View style={[styles.badge, { backgroundColor: 'rgba(239, 68, 68, 0.15)', borderColor: 'rgba(239, 68, 68, 0.3)' }]}>
                    <Text style={[styles.badgeText, { color: COLORS.danger }]}>Source Divergence</Text>
                  </View>
                  <Text style={styles.statusText}>● {conf.status}</Text>
                </View>

                <Text style={styles.cardTitle}>{conf.topic}</Text>

                {/* Conflicting Sources Breakdown */}
                <View style={styles.sourcesContainer}>
                  {conf.conflictingSources?.map((src, idx) => (
                    <View key={idx} style={styles.sourceBox}>
                      <View style={styles.sourceHeader}>
                        <Text style={styles.sourceName}>{src.sourceName}</Text>
                        <Text style={styles.confidenceScore}>
                          {(src.confidenceScore * 100).toFixed(0)}% Conf
                        </Text>
                      </View>
                      <Text style={styles.sourceClaim}>"{src.claim}"</Text>
                    </View>
                  ))}
                </View>

                {/* AI Conflict Synthesis */}
                <View style={styles.aiExplanationBox}>
                  <View style={styles.aiHead}>
                    <Sparkles size={14} color={COLORS.info} />
                    <Text style={styles.aiHeadTitle}>AI Conflict Context Engine</Text>
                  </View>
                  <Text style={styles.aiExplainText}>{conf.aiConflictExplanation}</Text>
                </View>
              </View>
            ))}

          {activeTab === 'RESEARCH' &&
            researchList.map((res) => (
              <View key={res.id} style={styles.card}>
                <View style={styles.cardHeader}>
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{res.status}</Text>
                  </View>
                </View>

                <Text style={styles.cardTitle}>{res.title}</Text>
                <Text style={styles.questionText}>Query: {res.researchQuestion}</Text>

                {res.aiSynthesizedReport && (
                  <View style={styles.reportBox}>
                    <Text style={styles.reportHeader}>Synthesized Evidence Findings:</Text>
                    <Text style={styles.reportText}>{res.aiSynthesizedReport}</Text>
                  </View>
                )}

                <TouchableOpacity
                  style={styles.actionBtnFull}
                  onPress={() => Alert.alert('Evidence Added', 'Added peer-reviewed citation to this research.')}
                  activeOpacity={0.82}
                >
                  <Text style={styles.actionBtnText}>Add Peer Evidence / Note</Text>
                </TouchableOpacity>
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
  tabBar: {
    flexDirection: 'row',
    backgroundColor: COLORS.bgInput,
    padding: 4,
    marginHorizontal: SPACING.lg,
    marginTop: 12,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  tabItem: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 9,
    borderRadius: RADIUS.sm,
    gap: 6,
  },
  tabItemActive: { backgroundColor: COLORS.bgElevated },
  tabText: { fontSize: 11.5, fontWeight: '700', color: COLORS.textMuted },
  tabTextActive: { color: COLORS.primaryLight, fontWeight: '800' },
  loadingBox: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scrollContent: { padding: SPACING.lg, paddingBottom: 40 },
  card: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  badge: {
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
  },
  badgeText: { color: COLORS.primaryLight, fontSize: 10, fontWeight: '800' },
  statusText: { color: COLORS.accent, fontSize: 11, fontWeight: '700' },
  cardTitle: { fontSize: 16, fontWeight: '800', color: COLORS.textPrimary, marginBottom: 8 },
  questionText: { fontSize: 13, color: COLORS.textSecondary, marginBottom: 12, fontStyle: 'italic' },
  sourcesContainer: { gap: 8, marginBottom: 12 },
  sourceBox: {
    backgroundColor: COLORS.bgInput,
    borderRadius: RADIUS.md,
    padding: 10,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.danger,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  sourceHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  sourceName: { fontSize: 12, fontWeight: '800', color: COLORS.textPrimary, flex: 1 },
  confidenceScore: { fontSize: 11, color: COLORS.info, fontWeight: '700' },
  sourceClaim: { fontSize: 12, color: COLORS.textSecondary, lineHeight: 16 },
  aiExplanationBox: {
    backgroundColor: 'rgba(56, 189, 248, 0.08)',
    borderRadius: RADIUS.md,
    padding: 10,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.info,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.2)',
  },
  aiHead: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  aiHeadTitle: { fontSize: 12, fontWeight: '800', color: COLORS.info },
  aiExplainText: { fontSize: 12, color: COLORS.textPrimary, lineHeight: 17 },
  reportBox: { backgroundColor: COLORS.bgInput, borderRadius: RADIUS.md, padding: 12, marginBottom: 12, borderWidth: 1, borderColor: COLORS.borderLight },
  reportHeader: { fontSize: 11, fontWeight: '800', color: COLORS.primaryLight, marginBottom: 6, letterSpacing: 0.4 },
  reportText: { fontSize: 12, color: COLORS.textSecondary, lineHeight: 17 },
  actionBtnFull: {
    backgroundColor: COLORS.bgElevated,
    paddingVertical: 11,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  actionBtnText: { color: COLORS.primaryLight, fontSize: 12, fontWeight: '800' },
});
