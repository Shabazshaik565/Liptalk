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
import { SimulationScenarioItem } from '../../src/types';

export default function SimulationScreen() {
  const router = useRouter();
  const [scenarios, setScenarios] = useState<SimulationScenarioItem[]>([]);
  const [loading, setLoading] = useState(true);

  // New Simulation Builder state
  const [newTitle, setNewTitle] = useState('');
  const [newHypothesis, setNewHypothesis] = useState('');
  const [simulating, setSimulating] = useState(false);

  // Comparison state
  const [comparing, setComparing] = useState(false);
  const [comparisonResult, setComparisonResult] = useState<any>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const list = await intelligenceApi.getSimulations();
      setScenarios(list);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleRunCustomSimulation = async () => {
    if (!newTitle.trim() || !newHypothesis.trim()) {
      Alert.alert('Required', 'Please enter a scenario title and hypothesis.');
      return;
    }
    setSimulating(true);
    try {
      const res = await intelligenceApi.runSimulation({
        title: newTitle,
        hypothesis: newHypothesis,
        scope: 'COMMUNITY',
        variables: [
          { variableName: 'Community Growth Rate', baselineValue: '5%', simulatedValue: '25%' },
          { variableName: 'Moderator Capacity', baselineValue: 2, simulatedValue: 4 },
        ],
      });
      setScenarios((prev) => [res as any, ...prev]);
      setNewTitle('');
      setNewHypothesis('');
      Alert.alert('Simulation Complete', 'Estimated outcome generated in isolated sandbox environment.');
    } catch (e) {
      Alert.alert('Simulation Error', 'Failed to run simulation.');
    } finally {
      setSimulating(false);
    }
  };

  const handleCompare = async () => {
    setComparing(true);
    try {
      const res = await intelligenceApi.compareSimulations(['scen_01', 'scen_02']);
      setComparisonResult(res);
    } catch (e) {
      Alert.alert('Comparison Error', 'Unable to compare scenarios.');
    } finally {
      setComparing(false);
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
          <Text style={styles.headerTitle}>Simulation Lab & Sandboxes</Text>
          <Text style={styles.headerSubtitle}>Isolated "What-If" Scenario Planning</Text>
        </View>
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => Alert.alert('Zero Mutation Guarantee', 'All simulations run on isolated snapshots. Production data is never modified directly.')}
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
          {/* Isolation Banner */}
          <View style={styles.sandboxBanner}>
            <Ionicons name="lock-closed" size={14} color="#38BDF8" />
            <Text style={styles.sandboxBannerText}>
              Sandbox Mode Active: Hypothetical parameter changes are purely probabilistic estimates.
            </Text>
          </View>

          {/* Scenario Builder Card */}
          <View style={styles.card}>
            <Text style={styles.cardSectionTitle}>Create What-If Scenario</Text>
            <Text style={styles.cardDesc}>
              Test changes in event schedules, community growth, creator monetization, or moderator capacity.
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Scenario Title (e.g. Add 2 regional grain hubs)"
              placeholderTextColor="#64748B"
              value={newTitle}
              onChangeText={setNewTitle}
            />
            <TextInput
              style={[styles.input, { height: 60 }]}
              placeholder="Hypothesis (e.g. Will shorten trade transit latency by 30%)"
              placeholderTextColor="#64748B"
              multiline
              value={newHypothesis}
              onChangeText={setNewHypothesis}
            />

            <TouchableOpacity
              style={styles.simulateBtn}
              onPress={handleRunCustomSimulation}
              disabled={simulating}
            >
              {simulating ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <>
                  <Ionicons name="play" size={16} color="#FFFFFF" />
                  <Text style={styles.simulateBtnText}>Run Isolated Simulation</Text>
                </>
              )}
            </TouchableOpacity>
          </View>

          {/* Active / Historical Scenarios */}
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Simulated Scenarios ({scenarios.length})</Text>
            <TouchableOpacity style={styles.compareBtn} onPress={handleCompare} disabled={comparing}>
              <Ionicons name="git-compare-outline" size={14} color="#6366F1" />
              <Text style={styles.compareBtnText}>Compare Scenarios</Text>
            </TouchableOpacity>
          </View>

          {/* Comparison Output */}
          {comparisonResult && (
            <View style={styles.comparisonBox}>
              <Text style={styles.comparisonTitle}>Multi-Scenario Comparative Analysis:</Text>
              {comparisonResult.comparisonMetrics?.map((m: any, idx: number) => (
                <View key={idx} style={styles.metricRow}>
                  <Text style={styles.metricName}>{m.metric}</Text>
                  <View style={styles.metricScores}>
                    <Text style={styles.scoreText}>A: {m.scenarioA}</Text>
                    <Text style={styles.scoreText}>B: {m.scenarioB}</Text>
                    <Text style={styles.winningBadge}>Top: {m.winningScenario}</Text>
                  </View>
                </View>
              ))}
              <Text style={styles.synthesisText}>
                {comparisonResult.aiComparativeSynthesis}
              </Text>
            </View>
          )}

          {scenarios.map((scen) => (
            <View key={scen.id} style={styles.scenarioCard}>
              <View style={styles.scenHead}>
                <View style={styles.scopeBadge}>
                  <Text style={styles.scopeBadgeText}>{scen.scope}</Text>
                </View>
                <Text style={styles.confidenceTag}>
                  {scen.simulationResults?.uncertaintyConfidencePercent || 85}% Confidence
                </Text>
              </View>

              <Text style={styles.scenTitle}>{scen.title}</Text>
              <Text style={styles.scenHypo}>"{scen.hypothesis}"</Text>

              {/* Variable Perturbations */}
              <View style={styles.variablesGrid}>
                {scen.variablePerturbations?.map((v, vIdx) => (
                  <View key={vIdx} style={styles.vChip}>
                    <Text style={styles.vName}>{v.variableName}:</Text>
                    <Text style={styles.vChange}>
                      {String(v.baselineValue)} ➔ {String(v.simulatedValue)} {v.unit || ''}
                    </Text>
                  </View>
                ))}
              </View>

              {/* Projected Outcomes */}
              <View style={styles.outcomesBox}>
                <Text style={styles.outcomesHeader}>Projected Outcomes (Estimates):</Text>
                {scen.simulationResults?.expectedOutcomes?.map((out, oIdx) => (
                  <View key={oIdx} style={styles.outcomeRow}>
                    <Ionicons name="arrow-up-circle" size={14} color="#10B981" />
                    <Text style={styles.outcomeText}>{out.outcomeSummary}</Text>
                  </View>
                ))}
              </View>

              <Text style={styles.execSummary}>
                {scen.simulationResults?.aiSimulationExecutiveSummary}
              </Text>
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
  sandboxBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(56, 189, 248, 0.1)',
    borderRadius: 8,
    padding: 10,
    marginBottom: 14,
  },
  sandboxBannerText: { fontSize: 11, color: '#BAE6FD', flex: 1, lineHeight: 15 },
  card: {
    backgroundColor: '#111827',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  cardSectionTitle: { fontSize: 16, fontWeight: '700', color: '#F8FAFC', marginBottom: 4 },
  cardDesc: { fontSize: 12, color: '#94A3B8', lineHeight: 17, marginBottom: 12 },
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
  simulateBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#6366F1',
    paddingVertical: 11,
    borderRadius: 8,
  },
  simulateBtnText: { color: '#FFFFFF', fontSize: 13, fontWeight: '700' },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: '#F8FAFC' },
  compareBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  compareBtnText: { color: '#6366F1', fontSize: 11, fontWeight: '700' },
  comparisonBox: {
    backgroundColor: '#0F172A',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#6366F1',
  },
  comparisonTitle: { fontSize: 12, fontWeight: '700', color: '#38BDF8', marginBottom: 8 },
  metricRow: {
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  metricName: { fontSize: 11, color: '#94A3B8', fontWeight: '600' },
  metricScores: { flexDirection: 'row', gap: 10, alignItems: 'center', marginTop: 2 },
  scoreText: { fontSize: 11, color: '#F1F5F9' },
  winningBadge: { fontSize: 10, color: '#10B981', fontWeight: '700' },
  synthesisText: { fontSize: 11, color: '#E2E8F0', fontStyle: 'italic', marginTop: 8 },
  scenarioCard: {
    backgroundColor: '#111827',
    borderRadius: 14,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  scenHead: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  scopeBadge: {
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  scopeBadgeText: { color: '#6366F1', fontSize: 10, fontWeight: '700' },
  confidenceTag: { color: '#10B981', fontSize: 11, fontWeight: '600' },
  scenTitle: { fontSize: 14, fontWeight: '700', color: '#F1F5F9', marginBottom: 4 },
  scenHypo: { fontSize: 12, color: '#94A3B8', fontStyle: 'italic', marginBottom: 10 },
  variablesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 10 },
  vChip: {
    backgroundColor: '#0F172A',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  vName: { fontSize: 9, color: '#94A3B8' },
  vChange: { fontSize: 11, fontWeight: '600', color: '#38BDF8' },
  outcomesBox: {
    backgroundColor: '#0F172A',
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
  },
  outcomesHeader: { fontSize: 10, fontWeight: '700', color: '#94A3B8', marginBottom: 4 },
  outcomeRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 2 },
  outcomeText: { fontSize: 11, color: '#6EE7B7' },
  execSummary: { fontSize: 11, color: '#CBD5E1', lineHeight: 15 },
});
