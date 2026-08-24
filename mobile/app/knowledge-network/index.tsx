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
import { coordinationApi } from '../../src/api/domain.api';
import { KnowledgeConflictItem, ResearchProjectItem } from '../../src/types';

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
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Collective Knowledge Network</Text>
          <Text style={styles.headerSubtitle}>Cross-Source Verification & Research</Text>
        </View>
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => Alert.alert('New Research', 'Start a structured collective research investigation.')}
        >
          <Ionicons name="flask-outline" size={20} color="#6366F1" />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'CONFLICTS' && styles.tabItemActive]}
          onPress={() => setActiveTab('CONFLICTS')}
        >
          <Ionicons
            name="git-compare-outline"
            size={16}
            color={activeTab === 'CONFLICTS' ? '#6366F1' : '#94A3B8'}
          />
          <Text style={[styles.tabText, activeTab === 'CONFLICTS' && styles.tabTextActive]}>
            Conflict Analysis ({conflicts.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'RESEARCH' && styles.tabItemActive]}
          onPress={() => setActiveTab('RESEARCH')}
        >
          <Ionicons
            name="library-outline"
            size={16}
            color={activeTab === 'RESEARCH' ? '#6366F1' : '#94A3B8'}
          />
          <Text style={[styles.tabText, activeTab === 'RESEARCH' && styles.tabTextActive]}>
            Research Hub ({researchList.length})
          </Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color="#6366F1" />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {activeTab === 'CONFLICTS' &&
            conflicts.map((conf) => (
              <View key={conf.id} style={styles.card}>
                <View style={styles.cardHeader}>
                  <View style={[styles.badge, { backgroundColor: 'rgba(239, 68, 68, 0.15)' }]}>
                    <Text style={[styles.badgeText, { color: '#EF4444' }]}>Source Divergence</Text>
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
                    <Ionicons name="sparkles" size={14} color="#38BDF8" />
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
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#0F172A',
    padding: 4,
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 10,
  },
  tabItem: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 9,
    borderRadius: 8,
    gap: 6,
  },
  tabItemActive: { backgroundColor: '#1E293B' },
  tabText: { fontSize: 12, fontWeight: '600', color: '#94A3B8' },
  tabTextActive: { color: '#6366F1' },
  loadingBox: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scrollContent: { padding: 16, paddingBottom: 40 },
  card: {
    backgroundColor: '#111827',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  badge: {
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: { color: '#6366F1', fontSize: 11, fontWeight: '700' },
  statusText: { color: '#10B981', fontSize: 11, fontWeight: '600' },
  cardTitle: { fontSize: 16, fontWeight: '700', color: '#F8FAFC', marginBottom: 8 },
  questionText: { fontSize: 13, color: '#CBD5E1', marginBottom: 12, fontStyle: 'italic' },
  sourcesContainer: { gap: 8, marginBottom: 12 },
  sourceBox: {
    backgroundColor: '#0F172A',
    borderRadius: 8,
    padding: 10,
    borderLeftWidth: 2,
    borderLeftColor: '#64748B',
  },
  sourceHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  sourceName: { fontSize: 12, fontWeight: '700', color: '#CBD5E1', flex: 1 },
  confidenceScore: { fontSize: 11, color: '#38BDF8', fontWeight: '600' },
  sourceClaim: { fontSize: 12, color: '#94A3B8', lineHeight: 16 },
  aiExplanationBox: {
    backgroundColor: 'rgba(56, 189, 248, 0.08)',
    borderRadius: 8,
    padding: 10,
    borderLeftWidth: 3,
    borderLeftColor: '#38BDF8',
  },
  aiHead: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  aiHeadTitle: { fontSize: 12, fontWeight: '700', color: '#38BDF8' },
  aiExplainText: { fontSize: 12, color: '#E2E8F0', lineHeight: 17 },
  reportBox: { backgroundColor: '#0F172A', borderRadius: 8, padding: 12, marginBottom: 12 },
  reportHeader: { fontSize: 11, fontWeight: '700', color: '#94A3B8', marginBottom: 6 },
  reportText: { fontSize: 12, color: '#E2E8F0', lineHeight: 17 },
  actionBtnFull: {
    backgroundColor: '#1E293B',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionBtnText: { color: '#6366F1', fontSize: 12, fontWeight: '700' },
});
