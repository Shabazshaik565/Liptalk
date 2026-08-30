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
import { ArrowLeft, Plus, Box, CheckCheck, Clock, Sparkles, CheckSquare } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { coordinationApi } from '../../src/api/domain.api';
import { GovernanceProposalItem, DecisionRecordItem } from '../../src/types';
import { COLORS, RADIUS, SPACING, SHADOWS } from '../../src/constants/theme';

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
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} activeOpacity={0.8}>
          <ArrowLeft size={20} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Community Governance</Text>
          <Text style={styles.headerSubtitle}>Decentralized Proposals & Decisions</Text>
        </View>
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => Alert.alert('New Proposal', 'Draft a structured community governance proposal.')}
          activeOpacity={0.8}
        >
          <Plus size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'PROPOSALS' && styles.tabItemActive]}
          onPress={() => setActiveTab('PROPOSALS')}
          activeOpacity={0.82}
        >
          <Box
            size={15}
            color={activeTab === 'PROPOSALS' ? COLORS.primaryLight : COLORS.textMuted}
          />
          <Text style={[styles.tabText, activeTab === 'PROPOSALS' && styles.tabTextActive]}>
            Active Proposals ({proposals.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'DECISIONS' && styles.tabItemActive]}
          onPress={() => setActiveTab('DECISIONS')}
          activeOpacity={0.82}
        >
          <CheckCheck
            size={15}
            color={activeTab === 'DECISIONS' ? COLORS.primaryLight : COLORS.textMuted}
          />
          <Text style={[styles.tabText, activeTab === 'DECISIONS' && styles.tabTextActive]}>
            Decisions ({decisions.length})
          </Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
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
                    <View style={styles.deadlineWrap}>
                      <Clock size={11} color={COLORS.textMuted} />
                      <Text style={styles.deadlineText}>
                        Ends {prop.votingDeadline?.slice(0, 10)}
                      </Text>
                    </View>
                  </View>

                  <Text style={styles.cardTitle}>{prop.title}</Text>
                  <Text style={styles.cardDesc}>{prop.description}</Text>

                  {/* AI Governance Assistant Summary */}
                  {prop.aiSummary && (
                    <View style={styles.aiSummaryBox}>
                      <View style={styles.aiHeader}>
                        <Sparkles size={14} color={COLORS.primaryLight} />
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
                          activeOpacity={0.82}
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
                  <View style={[styles.badge, { backgroundColor: 'rgba(16, 185, 129, 0.15)', borderColor: 'rgba(16, 185, 129, 0.3)' }]}>
                    <Text style={[styles.badgeText, { color: COLORS.accent }]}>{dec.decisionOutcome}</Text>
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
                        <CheckSquare size={13} color={COLORS.accent} />
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
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.glowPrimary,
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
  deadlineWrap: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  deadlineText: { fontSize: 11, color: COLORS.textMuted },
  govTypeText: { fontSize: 11, color: COLORS.accent, fontWeight: '700' },
  cardTitle: { fontSize: 16, fontWeight: '800', color: COLORS.textPrimary, marginBottom: 6 },
  cardDesc: { fontSize: 13, color: COLORS.textSecondary, lineHeight: 18, marginBottom: 12 },
  aiSummaryBox: {
    backgroundColor: 'rgba(139, 92, 246, 0.08)',
    borderRadius: RADIUS.md,
    padding: 12,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.primary,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.2)',
  },
  aiHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 },
  aiTitle: { fontSize: 12, fontWeight: '800', color: '#D8B4FE' },
  aiDesc: { fontSize: 12, color: COLORS.textSecondary, lineHeight: 17, marginBottom: 6 },
  takeawayRow: { flexDirection: 'row', gap: 6, marginBottom: 4 },
  bulletDot: { color: COLORS.primaryLight, fontSize: 12 },
  takeawayText: { fontSize: 12, color: COLORS.textPrimary, flex: 1 },
  aiDisclaim: { fontSize: 10, color: COLORS.textMuted, fontStyle: 'italic', marginTop: 4 },
  votingSection: { backgroundColor: COLORS.bgInput, borderRadius: RADIUS.md, padding: 12, borderWidth: 1, borderColor: COLORS.borderLight },
  voteSectionTitle: { fontSize: 11, fontWeight: '800', color: COLORS.primaryLight, marginBottom: 10, letterSpacing: 0.4 },
  optionRow: {
    backgroundColor: COLORS.bgElevated,
    borderRadius: RADIUS.sm,
    padding: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  optionRowSelected: {
    borderColor: COLORS.primary,
    borderWidth: 1,
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
  },
  optionInfo: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  optionLabel: { fontSize: 13, color: COLORS.textPrimary, fontWeight: '700' },
  optionLabelSelected: { color: COLORS.primaryLight },
  optionCount: { fontSize: 11, color: COLORS.textMuted },
  optionBarBg: { height: 4, backgroundColor: COLORS.border, borderRadius: 2, overflow: 'hidden' },
  optionBarFill: { height: '100%', backgroundColor: COLORS.primary, borderRadius: 2 },
  actionBox: { backgroundColor: COLORS.bgInput, borderRadius: RADIUS.md, padding: 10, marginTop: 8, borderWidth: 1, borderColor: COLORS.borderLight },
  actionTitle: { fontSize: 11, fontWeight: '800', color: COLORS.primaryLight, marginBottom: 6, letterSpacing: 0.4 },
  actionRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  actionText: { fontSize: 12, color: COLORS.textSecondary, flex: 1 },
});
