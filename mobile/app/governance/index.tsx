import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Modal,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { coordinationApi } from '../../src/api/domain.api';
import { GovernanceProposalItem, DecisionRecordItem } from '../../src/types';

export default function GovernanceScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'PROPOSALS' | 'DECISIONS'>('PROPOSALS');
  const [proposals, setProposals] = useState<GovernanceProposalItem[]>([]);
  const [decisions, setDecisions] = useState<DecisionRecordItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Voting state
  const [votedMap, setVotedMap] = useState<Record<string, string>>({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [p, d] = await Promise.all([
        coordinationApi.getProposals(),
        coordinationApi.getDecisionRecords(),
      ]);
      setProposals(p);
      setDecisions(d);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (proposalId: string, option: string) => {
    await coordinationApi.castVote(proposalId, option);
    setVotedMap((prev) => ({ ...prev, [proposalId]: option }));
    setProposals((prev) =>
      prev.map((prop) => {
        if (prop.id !== proposalId) return prop;
        const currentCount = prop.voteCounts[option] || 0;
        return {
          ...prop,
          voteCounts: { ...prop.voteCounts, [option]: currentCount + 1 },
        };
      })
    );
    Alert.alert('Vote Recorded', `Your vote for [${option}] was recorded on the immutable decision log.`);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Community Governance</Text>
          <Text style={styles.headerSubtitle}>Decentralized Proposals & Decisions</Text>
        </View>
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => Alert.alert('New Proposal', 'Draft a structured community governance proposal.')}
        >
          <Ionicons name="add" size={24} color="#6366F1" />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'PROPOSALS' && styles.tabItemActive]}
          onPress={() => setActiveTab('PROPOSALS')}
        >
          <Ionicons
            name="cube-outline"
            size={16}
            color={activeTab === 'PROPOSALS' ? '#6366F1' : '#94A3B8'}
          />
          <Text style={[styles.tabText, activeTab === 'PROPOSALS' && styles.tabTextActive]}>
            Active Proposals ({proposals.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'DECISIONS' && styles.tabItemActive]}
          onPress={() => setActiveTab('DECISIONS')}
        >
          <Ionicons
            name="checkmark-done-circle-outline"
            size={16}
            color={activeTab === 'DECISIONS' ? '#6366F1' : '#94A3B8'}
          />
          <Text style={[styles.tabText, activeTab === 'DECISIONS' && styles.tabTextActive]}>
            Decision Records ({decisions.length})
          </Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color="#6366F1" />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {activeTab === 'PROPOSALS' &&
            proposals.map((prop) => {
              const totalVotes = Object.values(prop.voteCounts || {}).reduce((a, b) => a + b, 0) || 1;
              const hasVoted = votedMap[prop.id];

              return (
                <View key={prop.id} style={styles.card}>
                  <View style={styles.cardHeader}>
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>{prop.scope}</Text>
                    </View>
                    <Text style={styles.deadlineText}>
                      <Ionicons name="time-outline" size={12} color="#94A3B8" /> Ends {prop.votingDeadline?.slice(0, 10)}
                    </Text>
                  </View>

                  <Text style={styles.cardTitle}>{prop.title}</Text>
                  <Text style={styles.cardDesc}>{prop.description}</Text>

                  {/* AI Governance Assistant Summary */}
                  {prop.aiSummary && (
                    <View style={styles.aiSummaryBox}>
                      <View style={styles.aiHeader}>
                        <Ionicons name="sparkles" size={14} color="#A855F7" />
                        <Text style={styles.aiTitle}>AI Governance Assistant Synthesis</Text>
                      </View>
                      <Text style={styles.aiDesc}>{prop.aiSummary}</Text>
                      {prop.aiKeyTakeaways?.map((takeaway, idx) => (
                        <View key={idx} style={styles.takeawayRow}>
                          <Text style={styles.bulletDot}>•</Text>
                          <Text style={styles.takeawayText}>{takeaway}</Text>
                        </View>
                      ))}
                      <Text style={styles.aiDisclaim}>
                        * Advisory synthesis only. Humans retain 100% voting authority.
                      </Text>
                    </View>
                  )}

                  {/* Voting Options */}
                  <View style={styles.votingSection}>
                    <Text style={styles.voteSectionTitle}>Community Vote Tally ({totalVotes} votes)</Text>
                    {prop.options?.map((opt) => {
                      const count = prop.voteCounts[opt] || 0;
                      const pct = Math.round((count / totalVotes) * 100);
                      const isSelected = hasVoted === opt;

                      return (
                        <TouchableOpacity
                          key={opt}
                          style={[styles.optionRow, isSelected && styles.optionRowSelected]}
                          onPress={() => handleVote(prop.id, opt)}
                        >
                          <View style={styles.optionInfo}>
                            <Text style={[styles.optionLabel, isSelected && styles.optionLabelSelected]}>
                              {opt}
                            </Text>
                            <Text style={styles.optionCount}>
                              {count} votes ({pct}%)
                            </Text>
                          </View>
                          <View style={styles.optionBarBg}>
                            <View style={[styles.optionBarFill, { width: `${pct}%` }]} />
                          </View>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
              );
            })}

          {activeTab === 'DECISIONS' &&
            decisions.map((dec) => (
              <View key={dec.id} style={styles.card}>
                <View style={styles.cardHeader}>
                  <View style={[styles.badge, { backgroundColor: 'rgba(16, 185, 129, 0.15)' }]}>
                    <Text style={[styles.badgeText, { color: '#10B981' }]}>{dec.decisionOutcome}</Text>
                  </View>
                  <Text style={styles.govTypeText}>{dec.governanceType}</Text>
                </View>

                <Text style={styles.cardTitle}>{dec.title}</Text>
                <Text style={styles.cardDesc}>{dec.resolutionSummary}</Text>

                {dec.actionItems && dec.actionItems.length > 0 && (
                  <View style={styles.actionBox}>
                    <Text style={styles.actionTitle}>Ratified Implementation Steps:</Text>
                    {dec.actionItems.map((item, idx) => (
                      <View key={idx} style={styles.actionRow}>
                        <Ionicons name="checkbox" size={14} color="#10B981" />
                        <Text style={styles.actionText}>{item}</Text>
                      </View>
                    ))}
                  </View>
                )}
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
    padding: 6,
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 12,
  },
  tabItem: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
  },
  tabItemActive: { backgroundColor: '#1E293B' },
  tabText: { fontSize: 13, fontWeight: '600', color: '#94A3B8' },
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
  deadlineText: { fontSize: 11, color: '#94A3B8' },
  govTypeText: { fontSize: 11, color: '#10B981', fontWeight: '600' },
  cardTitle: { fontSize: 16, fontWeight: '700', color: '#F8FAFC', marginBottom: 6 },
  cardDesc: { fontSize: 13, color: '#94A3B8', lineHeight: 18, marginBottom: 12 },
  aiSummaryBox: {
    backgroundColor: 'rgba(168, 85, 247, 0.08)',
    borderRadius: 10,
    padding: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#A855F7',
    marginBottom: 14,
  },
  aiHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 },
  aiTitle: { fontSize: 12, fontWeight: '700', color: '#D8B4FE' },
  aiDesc: { fontSize: 12, color: '#E2E8F0', lineHeight: 17, marginBottom: 6 },
  takeawayRow: { flexDirection: 'row', gap: 6, marginBottom: 4 },
  bulletDot: { color: '#A855F7', fontSize: 12 },
  takeawayText: { fontSize: 12, color: '#CBD5E1', flex: 1 },
  aiDisclaim: { fontSize: 10, color: '#94A3B8', fontStyle: 'italic', marginTop: 4 },
  votingSection: { backgroundColor: '#0F172A', borderRadius: 10, padding: 12 },
  voteSectionTitle: { fontSize: 12, fontWeight: '700', color: '#CBD5E1', marginBottom: 10 },
  optionRow: {
    backgroundColor: '#1E293B',
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
  },
  optionRowSelected: {
    borderColor: '#6366F1',
    borderWidth: 1,
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
  },
  optionInfo: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  optionLabel: { fontSize: 13, color: '#F1F5F9', fontWeight: '600' },
  optionLabelSelected: { color: '#6366F1' },
  optionCount: { fontSize: 11, color: '#94A3B8' },
  optionBarBg: { height: 4, backgroundColor: '#334155', borderRadius: 2, overflow: 'hidden' },
  optionBarFill: { height: '100%', backgroundColor: '#6366F1', borderRadius: 2 },
  actionBox: { backgroundColor: '#0F172A', borderRadius: 8, padding: 10, marginTop: 8 },
  actionTitle: { fontSize: 11, fontWeight: '700', color: '#94A3B8', marginBottom: 6 },
  actionRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  actionText: { fontSize: 12, color: '#E2E8F0', flex: 1 },
});
