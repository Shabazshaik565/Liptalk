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
import { coordinationApi } from '../../src/api/domain.api';
import { AgentTeamItem } from '../../src/types';

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
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Multi-Agent Project Teams</Text>
          <Text style={styles.headerSubtitle}>Orchestration & Quality Gatekeepers</Text>
        </View>
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => Alert.alert('Squad Safety', 'All agents operate within strict tool allowlists & token limits.')}
        >
          <Ionicons name="shield-checkmark" size={20} color="#10B981" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color="#6366F1" />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent}>
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
                <Ionicons name="lock-closed" size={14} color="#10B981" />
                <Text style={styles.qualityGateText}>
                  AI Quality Gatekeeper active: Schema validation + policy checks enforced between all agent hops.
                </Text>
              </View>

              {/* Mission Dispatch Input */}
              <View style={styles.dispatchSection}>
                <TextInput
                  style={styles.input}
                  placeholder="Enter mission prompt (e.g. Audit Mysore wheat suppliers)..."
                  placeholderTextColor="#64748B"
                  value={missionPrompt}
                  onChangeText={setMissionPrompt}
                />
                <TouchableOpacity
                  style={styles.dispatchBtn}
                  onPress={() => handleExecuteMission(team.id)}
                  disabled={executing}
                >
                  {executing ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <>
                      <Ionicons name="paper-plane" size={16} color="#FFFFFF" />
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
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
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
  budgetTag: { fontSize: 11, color: '#94A3B8', fontWeight: '600' },
  cardTitle: { fontSize: 16, fontWeight: '700', color: '#F8FAFC', marginBottom: 6 },
  cardDesc: { fontSize: 13, color: '#94A3B8', lineHeight: 18, marginBottom: 12 },
  rosterBox: { backgroundColor: '#0F172A', borderRadius: 10, padding: 12, marginBottom: 12 },
  rosterHeader: { fontSize: 11, fontWeight: '700', color: '#94A3B8', marginBottom: 8 },
  agentRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  agentRoleBadge: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
  },
  agentRoleText: { color: '#38BDF8', fontSize: 10, fontWeight: '700' },
  agentDetails: { flex: 1 },
  agentNameText: { fontSize: 12, fontWeight: '600', color: '#F1F5F9' },
  agentToolsText: { fontSize: 10, color: '#94A3B8' },
  qualityGateBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderRadius: 8,
    padding: 10,
    marginBottom: 14,
  },
  qualityGateText: { fontSize: 11, color: '#6EE7B7', flex: 1, lineHeight: 15 },
  dispatchSection: { marginBottom: 10 },
  input: {
    backgroundColor: '#0F172A',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#1E293B',
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#F8FAFC',
    fontSize: 13,
    marginBottom: 8,
  },
  dispatchBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#6366F1',
    paddingVertical: 11,
    borderRadius: 8,
  },
  dispatchBtnText: { color: '#FFFFFF', fontSize: 13, fontWeight: '700' },
  executionBox: {
    backgroundColor: '#0F172A',
    borderRadius: 10,
    padding: 12,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#334155',
  },
  execHeader: { fontSize: 12, fontWeight: '700', color: '#38BDF8', marginBottom: 8 },
  trailStep: {
    backgroundColor: '#1E293B',
    borderRadius: 6,
    padding: 8,
    marginBottom: 6,
  },
  stepBadge: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  stepNum: { color: '#94A3B8', fontSize: 10, fontWeight: '600' },
  stepRole: { color: '#A855F7', fontSize: 10, fontWeight: '700' },
  stepAction: { color: '#F1F5F9', fontSize: 11, fontWeight: '500' },
  stepOutput: { color: '#CBD5E1', fontSize: 11, fontStyle: 'italic', marginTop: 2 },
  finalBox: {
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
    borderRadius: 8,
    padding: 10,
    marginTop: 8,
  },
  finalTitle: { fontSize: 11, fontWeight: '700', color: '#6366F1', marginBottom: 4 },
  finalText: { fontSize: 12, color: '#E2E8F0', lineHeight: 17 },
});
