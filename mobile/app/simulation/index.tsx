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
import { ArrowLeft, ShieldCheck, Lock, Play, GitCompare, ArrowUpCircle } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { intelligenceApi } from '../../src/api/domain.api';
import { SimulationScenarioItem } from '../../src/types';
import { COLORS, RADIUS, SPACING, SHADOWS } from '../../src/constants/theme';

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
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} activeOpacity={0.8}>
          <ArrowLeft size={20} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Simulation Lab & Sandboxes</Text>
          <Text style={styles.headerSubtitle}>Isolated "What-If" Scenario Planning</Text>
        </View>
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => Alert.alert('Zero Mutation Guarantee', 'All simulations run on isolated snapshots. Production data is never modified directly.')}
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
          {/* Isolation Banner */}
          <View style={styles.sandboxBanner}>
            <Lock size={14} color={COLORS.info} />
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
              placeholderTextColor={COLORS.textDim}
              value={newTitle}
              onChangeText={setNewTitle}
            />
            <TextInput
              style={[styles.input, { height: 64 }]}
              placeholder="Hypothesis (e.g. Will shorten trade transit latency by 30%)"
              placeholderTextColor={COLORS.textDim}
              multiline
              value={newHypothesis}
              onChangeText={setNewHypothesis}
            />

            <TouchableOpacity
              style={styles.simulateBtn}
              onPress={handleRunCustomSimulation}
              disabled={simulating}
              activeOpacity={0.85}
            >
              {simulating ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <>
                  <Play size={15} color="#FFFFFF" />
                  <Text style={styles.simulateBtnText}>Run Isolated Simulation</Text>
                </>
              )}
            </TouchableOpacity>
          </View>

          {/* Active / Historical Scenarios */}
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Simulated Scenarios ({scenarios.length})</Text>
            <TouchableOpacity style={styles.compareBtn} onPress={handleCompare} disabled={comparing} activeOpacity={0.8}>
              <GitCompare size={14} color={COLORS.primaryLight} />
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
                    <ArrowUpCircle size={14} color={COLORS.accent} />
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
  sandboxBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(56, 189, 248, 0.12)',
    borderRadius: RADIUS.md,
    padding: 11,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.25)',
  },
  sandboxBannerText: { fontSize: 11, color: '#BAE6FD', flex: 1, lineHeight: 15, fontWeight: '600' },
  card: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
  },
  cardSectionTitle: { fontSize: 16, fontWeight: '800', color: COLORS.textPrimary, marginBottom: 4 },
  cardDesc: { fontSize: 12, color: COLORS.textSecondary, lineHeight: 17, marginBottom: 12 },
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
  simulateBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.primary,
    paddingVertical: 11,
    borderRadius: RADIUS.md,
    ...SHADOWS.glowPrimary,
  },
  simulateBtnText: { color: '#FFFFFF', fontSize: 13, fontWeight: '800' },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: { fontSize: 15, fontWeight: '800', color: COLORS.textPrimary },
  compareBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
  },
  compareBtnText: { color: COLORS.primaryLight, fontSize: 11, fontWeight: '800' },
  comparisonBox: {
    backgroundColor: COLORS.bgInput,
    borderRadius: RADIUS.lg,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  comparisonTitle: { fontSize: 12, fontWeight: '800', color: COLORS.info, marginBottom: 8 },
  metricRow: {
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  metricName: { fontSize: 11, color: COLORS.textMuted, fontWeight: '700' },
  metricScores: { flexDirection: 'row', gap: 10, alignItems: 'center', marginTop: 2 },
  scoreText: { fontSize: 11, color: COLORS.textPrimary },
  winningBadge: { fontSize: 10.5, color: COLORS.accent, fontWeight: '800' },
  synthesisText: { fontSize: 11, color: COLORS.textSecondary, fontStyle: 'italic', marginTop: 8, lineHeight: 16 },
  scenarioCard: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.xl,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
  },
  scenHead: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  scopeBadge: {
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
  },
  scopeBadgeText: { color: COLORS.primaryLight, fontSize: 10, fontWeight: '800' },
  confidenceTag: { color: COLORS.accent, fontSize: 11, fontWeight: '800' },
  scenTitle: { fontSize: 14.5, fontWeight: '800', color: COLORS.textPrimary, marginBottom: 4 },
  scenHypo: { fontSize: 12, color: COLORS.textMuted, fontStyle: 'italic', marginBottom: 10 },
  variablesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 10 },
  vChip: {
    backgroundColor: COLORS.bgInput,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  vName: { fontSize: 9.5, color: COLORS.textMuted },
  vChange: { fontSize: 11, fontWeight: '700', color: COLORS.info },
  outcomesBox: {
    backgroundColor: COLORS.bgInput,
    borderRadius: RADIUS.md,
    padding: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  outcomesHeader: { fontSize: 10, fontWeight: '800', color: COLORS.textMuted, marginBottom: 4 },
  outcomeRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  outcomeText: { fontSize: 11, color: COLORS.accentLight, fontWeight: '600' },
  execSummary: { fontSize: 11, color: COLORS.textSecondary, lineHeight: 16 },
});
