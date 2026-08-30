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
import { ArrowLeft, ShieldCheck, Lock, Send } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { coordinationApi } from '../../src/api/domain.api';
import { AgentTeamItem } from '../../src/types';
import { COLORS, RADIUS, SPACING, SHADOWS } from '../../src/constants/theme';

export default function AgentTeamsScreen() {
  const router = useRouter();
  const [teams, setTeams] = useState<AgentTeamItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [missionPrompt, setMissionPrompt] = useState('');
  const [executing, setExecuting] = useState(false);
  const [executionResult, setExecutionResult] = useState<any>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const t = await coordinationApi.getAgentTeams();
      setTeams(t);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleExecuteMission = async (teamId: string) => {
    if (!missionPrompt.trim()) {
      Alert.alert('Required', 'Please enter a mission prompt for the agent squad.');
      return;
    }
    setExecuting(true);
    try {
      const res = await coordinationApi.executeAgentTeam(teamId, missionPrompt);
      setExecutionResult(res);
    } catch (e) {
      Alert.alert('Execution Error', 'Failed to dispatch agent squad.');
    } finally {
      setExecuting(false);
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
          <Text style={styles.headerTitle}>Multi-Agent Project Teams</Text>
          <Text style={styles.headerSubtitle}>Orchestration & Quality Gatekeepers</Text>
        </View>
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => Alert.alert('Squad Safety', 'All agents operate within strict tool allowlists & token limits.')}
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
          {teams.map((team) => (
            <View key={team.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{team.agents.length} Specialized Agents</Text>
                </View>
                <Text style={styles.budgetTag}>
                  ${team.budgetUsdPerMonth}/mo Limit
                </Text>
              </View>

              <Text style={styles.cardTitle}>{team.name}</Text>
              <Text style={styles.cardDesc}>{team.mission}</Text>

              {/* Roster of Squad Agents */}
              <View style={styles.rosterBox}>
                <Text style={styles.rosterHeader}>Squad Member Roles & Tools:</Text>
                {team.agents.map((ag, idx) => (
                  <View key={idx} style={styles.agentRow}>
                    <View style={styles.agentRoleBadge}>
                      <Text style={styles.agentRoleText}>{ag.agentRole}</Text>
                    </View>
                    <View style={styles.agentDetails}>
                      <Text style={styles.agentNameText}>{ag.agentName}</Text>
                      <Text style={styles.agentToolsText}>
                        Tools: {ag.allowedTools.join(', ')}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>

              {/* Quality Gates Badge */}
              <View style={styles.qualityGateBanner}>
                <Lock size={14} color={COLORS.accent} />
                <Text style={styles.qualityGateText}>
                  AI Quality Gatekeeper active: Schema validation + policy checks enforced between all agent hops.
                </Text>
              </View>

              {/* Mission Dispatch Input */}
              <View style={styles.dispatchSection}>
                <TextInput
                  style={styles.input}
                  placeholder="Enter mission prompt (e.g. Audit Mysore wheat suppliers)..."
                  placeholderTextColor={COLORS.textDim}
                  value={missionPrompt}
                  onChangeText={setMissionPrompt}
                />
                <TouchableOpacity
                  style={styles.dispatchBtn}
                  onPress={() => handleExecuteMission(team.id)}
                  disabled={executing}
                  activeOpacity={0.85}
                >
                  {executing ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <>
                      <Send size={15} color="#FFFFFF" />
                      <Text style={styles.dispatchBtnText}>Dispatch Squad Mission</Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>

              {/* Live Collaboration Trail Result */}
              {executionResult && (
                <View style={styles.executionBox}>
                  <Text style={styles.execHeader}>Live Collaborative Consensus Trail:</Text>
                  {executionResult.collaborationTrail?.map((step: any, sIdx: number) => (
                    <View key={sIdx} style={styles.trailStep}>
                      <View style={styles.stepBadge}>
                        <Text style={styles.stepNum}>Step {step.stepIndex}</Text>
                        <Text style={styles.stepRole}>{step.agentRole}</Text>
                      </View>
                      <Text style={styles.stepAction}>{step.actionTaken}</Text>
                      <Text style={styles.stepOutput}>➔ {step.outputSummary}</Text>
                    </View>
                  ))}

                  <View style={styles.finalBox}>
                    <Text style={styles.finalTitle}>Coordinator Final Synthesis:</Text>
                    <Text style={styles.finalText}>{executionResult.finalSynthesisResult}</Text>
                  </View>
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
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
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
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
  },
  badgeText: { color: COLORS.primaryLight, fontSize: 11, fontWeight: '800' },
  budgetTag: { fontSize: 11, color: COLORS.textMuted, fontWeight: '700' },
  cardTitle: { fontSize: 16, fontWeight: '800', color: COLORS.textPrimary, marginBottom: 6 },
  cardDesc: { fontSize: 13, color: COLORS.textSecondary, lineHeight: 18, marginBottom: 12 },
  rosterBox: { backgroundColor: COLORS.bgInput, borderRadius: RADIUS.md, padding: 12, marginBottom: 12, borderWidth: 1, borderColor: COLORS.borderLight },
  rosterHeader: { fontSize: 11, fontWeight: '800', color: COLORS.primaryLight, marginBottom: 8, letterSpacing: 0.5 },
  agentRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  agentRoleBadge: {
    backgroundColor: COLORS.bgElevated,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  agentRoleText: { color: COLORS.info, fontSize: 10, fontWeight: '800' },
  agentDetails: { flex: 1 },
  agentNameText: { fontSize: 12, fontWeight: '700', color: COLORS.textPrimary },
  agentToolsText: { fontSize: 10.5, color: COLORS.textMuted },
  qualityGateBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderRadius: RADIUS.sm,
    padding: 10,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.25)',
  },
  qualityGateText: { fontSize: 11, color: COLORS.accentLight, flex: 1, lineHeight: 15 },
  dispatchSection: { marginBottom: 10 },
  input: {
    backgroundColor: COLORS.bgInput,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: COLORS.textPrimary,
    fontSize: 13,
    marginBottom: 8,
  },
  dispatchBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.primary,
    paddingVertical: 11,
    borderRadius: RADIUS.md,
    ...SHADOWS.glowPrimary,
  },
  dispatchBtnText: { color: '#FFFFFF', fontSize: 13, fontWeight: '800' },
  executionBox: {
    backgroundColor: COLORS.bgInput,
    borderRadius: RADIUS.md,
    padding: 12,
    marginTop: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  execHeader: { fontSize: 12, fontWeight: '800', color: COLORS.info, marginBottom: 8 },
  trailStep: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.sm,
    padding: 8,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  stepBadge: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  stepNum: { color: COLORS.textMuted, fontSize: 10, fontWeight: '700' },
  stepRole: { color: COLORS.secondaryLight, fontSize: 10, fontWeight: '800' },
  stepAction: { color: COLORS.textPrimary, fontSize: 11.5, fontWeight: '700' },
  stepOutput: { color: COLORS.textMuted, fontSize: 11, fontStyle: 'italic', marginTop: 2 },
  finalBox: {
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
    borderRadius: RADIUS.sm,
    padding: 10,
    marginTop: 8,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
  },
  finalTitle: { fontSize: 11, fontWeight: '800', color: COLORS.primaryLight, marginBottom: 4 },
  finalText: { fontSize: 12, color: COLORS.textPrimary, lineHeight: 17 },
});
