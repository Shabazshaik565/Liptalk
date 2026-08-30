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
import { ArrowLeft, Sparkles, Shield, Play, StopCircle } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { adaptationApi } from '../../src/api/domain.api';
import { AiPlanItem } from '../../src/types';
import { COLORS, RADIUS, SPACING, SHADOWS } from '../../src/constants/theme';

export default function AiPlansScreen() {
  const router = useRouter();
  const [plans, setPlans] = useState<AiPlanItem[]>([]);
  const [goalInput, setGoalInput] = useState('');
  const [generating, setGenerating] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    setLoading(true);
    try {
      const list = await adaptationApi.getAiPlans();
      setPlans(list);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleGeneratePlan = async () => {
    if (!goalInput.trim()) {
      Alert.alert('Please enter a goal prompt');
      return;
    }
    setGenerating(true);
    try {
      const newPlan = await adaptationApi.generatePlan(goalInput.trim());
      setPlans([newPlan, ...plans]);
      setGoalInput('');
      Alert.alert('Plan Generated (Preview Mode)', 'Review the step breakdown and permissions before executing.');
    } catch (e) {
      console.error(e);
    } finally {
      setGenerating(false);
    }
  };

  const handleExecuteStep = async (planId: string, index: number, requiresReview: boolean) => {
    if (requiresReview) {
      Alert.alert(
        'Human Authorization Gate',
        'This step involves consequential output or external drafting. Do you authorize the specialized agent to execute?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Authorize & Execute',
            onPress: async () => {
              await adaptationApi.executePlanStep(planId, index);
              Alert.alert('Step Executed', 'Agent task completed and verified against safety schemas.');
              loadPlans();
            },
          },
        ]
      );
    } else {
      await adaptationApi.executePlanStep(planId, index);
      Alert.alert('Step Executed', 'Agent task completed.');
      loadPlans();
    }
  };

  const handleCancelPlan = async (planId: string) => {
    Alert.alert(
      'Halt Plan Execution?',
      'All pending agent sub-tasks will be cancelled immediately.',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Halt Execution',
          style: 'destructive',
          onPress: async () => {
            await adaptationApi.cancelPlan(planId);
            loadPlans();
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} activeOpacity={0.8}>
          <ArrowLeft size={20} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>AI Planning Engine</Text>
          <Text style={styles.headerSubtitle}>Multi-Agent Coordination & Execution Monitor</Text>
        </View>
      </View>

      {/* Goal Prompt Generator Box */}
      <View style={styles.promptBox}>
        <Text style={styles.promptLabel}>Request Complex AI Plan:</Text>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="e.g. Help me coordinate a regional logistics pilot..."
            placeholderTextColor={COLORS.textDim}
            value={goalInput}
            onChangeText={setGoalInput}
          />
          <TouchableOpacity
            style={styles.genBtn}
            onPress={handleGeneratePlan}
            disabled={generating}
            activeOpacity={0.85}
          >
            {generating ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Sparkles size={16} color="#FFFFFF" />
            )}
          </TouchableOpacity>
        </View>
      </View>

      {loading ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {plans.map((plan) => (
            <View key={plan.id} style={styles.planCard}>
              <View style={styles.planHeader}>
                <View style={styles.statusBadge}>
                  <Text style={styles.statusBadgeText}>{plan.status}</Text>
                </View>
                <Text style={styles.costText}>Est. Cost: ${plan.estimatedCostUsd}</Text>
              </View>

              <Text style={styles.planTitle}>{plan.goalTitle}</Text>
              {plan.goalDescription ? (
                <Text style={styles.planDesc}>{plan.goalDescription}</Text>
              ) : null}

              {/* Steps Trail */}
              <View style={styles.stepsBox}>
                <Text style={styles.stepsHeader}>Multi-Agent Execution Steps:</Text>
                {plan.stepsBreakdown.map((step) => (
                  <View key={step.stepIndex} style={styles.stepRow}>
                    <View style={styles.stepNumberBadge}>
                      <Text style={styles.stepNumText}>{step.stepIndex}</Text>
                    </View>
                    <View style={styles.stepDetails}>
                      <View style={styles.stepMetaRow}>
                        <Text style={styles.stepTitle}>{step.stepTitle}</Text>
                        <Text
                          style={[
                            styles.stepStatus,
                            {
                              color:
                                step.status === 'COMPLETED'
                                  ? COLORS.accent
                                  : step.status === 'EXECUTING'
                                  ? COLORS.info
                                  : COLORS.textMuted,
                            },
                          ]}
                        >
                          {step.status}
                        </Text>
                      </View>
                      <Text style={styles.stepRoleText}>
                        Agent: <Text style={{ color: COLORS.primaryLight }}>{step.agentRole}</Text> • Type: {step.actionType}
                      </Text>
                      <Text style={styles.stepDesc}>{step.description}</Text>

                      {step.status !== 'COMPLETED' && (
                        <TouchableOpacity
                          style={styles.stepActionBtn}
                          onPress={() =>
                            handleExecuteStep(plan.id, step.stepIndex, step.requiresHumanReview)
                          }
                          activeOpacity={0.82}
                        >
                          {step.requiresHumanReview ? (
                            <Shield size={12} color="#FFFFFF" />
                          ) : (
                            <Play size={12} color="#FFFFFF" />
                          )}
                          <Text style={styles.stepActionText}>
                            {step.requiresHumanReview ? 'Authorize & Execute' : 'Execute Step'}
                          </Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                ))}
              </View>

              {/* Action Buttons */}
              {plan.status === 'IN_PROGRESS' && (
                <TouchableOpacity
                  style={styles.cancelBtn}
                  onPress={() => handleCancelPlan(plan.id)}
                  activeOpacity={0.82}
                >
                  <StopCircle size={14} color={COLORS.danger} />
                  <Text style={styles.cancelBtnText}>Halt Plan Execution</Text>
                </TouchableOpacity>
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
  promptBox: {
    backgroundColor: COLORS.bgCard,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  promptLabel: { fontSize: 11, fontWeight: '800', color: COLORS.primaryLight, marginBottom: 8, letterSpacing: 0.4 },
  inputRow: { flexDirection: 'row', gap: 8 },
  input: {
    flex: 1,
    backgroundColor: COLORS.bgInput,
    borderRadius: RADIUS.md,
    paddingHorizontal: 12,
    paddingVertical: 9,
    color: COLORS.textPrimary,
    fontSize: 12.5,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  genBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.md,
    paddingHorizontal: 14,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.glowPrimary,
  },
  loadingBox: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scrollContent: { padding: SPACING.lg, paddingBottom: 40 },
  planCard: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
  },
  planHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  statusBadge: {
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
  },
  statusBadgeText: { color: COLORS.primaryLight, fontSize: 10, fontWeight: '800' },
  costText: { fontSize: 11, color: COLORS.accent, fontWeight: '800' },
  planTitle: { fontSize: 16, fontWeight: '800', color: COLORS.textPrimary, marginBottom: 4 },
  planDesc: { fontSize: 12, color: COLORS.textSecondary, lineHeight: 17, marginBottom: 12 },
  stepsBox: { backgroundColor: COLORS.bgInput, borderRadius: RADIUS.md, padding: 12, marginBottom: 12, borderWidth: 1, borderColor: COLORS.borderLight },
  stepsHeader: { fontSize: 11, fontWeight: '800', color: COLORS.primaryLight, marginBottom: 10, letterSpacing: 0.4 },
  stepRow: { flexDirection: 'row', gap: 10, marginBottom: 12 },
  stepNumberBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: COLORS.bgElevated,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  stepNumText: { fontSize: 10, fontWeight: '800', color: COLORS.info },
  stepDetails: { flex: 1 },
  stepMetaRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 },
  stepTitle: { fontSize: 13, fontWeight: '800', color: COLORS.textPrimary },
  stepStatus: { fontSize: 10, fontWeight: '800' },
  stepRoleText: { fontSize: 10.5, color: COLORS.textMuted, marginBottom: 4 },
  stepDesc: { fontSize: 11, color: COLORS.textSecondary, lineHeight: 15, marginBottom: 6 },
  stepActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: RADIUS.sm,
    ...SHADOWS.glowPrimary,
  },
  stepActionText: { color: '#FFFFFF', fontSize: 10.5, fontWeight: '800' },
  cancelBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  cancelBtnText: { color: COLORS.danger, fontSize: 11, fontWeight: '700' },
});
