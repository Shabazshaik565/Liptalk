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
import { adaptationApi } from '../../src/api/domain.api';
import { AiPlanItem } from '../../src/types';

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
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
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
            placeholderTextColor="#64748B"
            value={goalInput}
            onChangeText={setGoalInput}
          />
          <TouchableOpacity
            style={styles.genBtn}
            onPress={handleGeneratePlan}
            disabled={generating}
          >
            {generating ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Ionicons name="sparkles" size={16} color="#FFFFFF" />
            )}
          </TouchableOpacity>
        </View>
      </View>

      {loading ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color="#6366F1" />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent}>
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
                                  ? '#10B981'
                                  : step.status === 'EXECUTING'
                                  ? '#38BDF8'
                                  : '#94A3B8',
                            },
                          ]}
                        >
                          {step.status}
                        </Text>
                      </View>
                      <Text style={styles.stepRoleText}>
                        Agent: <Text style={{ color: '#6366F1' }}>{step.agentRole}</Text> • Type: {step.actionType}
                      </Text>
                      <Text style={styles.stepDesc}>{step.description}</Text>

                      {step.status !== 'COMPLETED' && (
                        <TouchableOpacity
                          style={styles.stepActionBtn}
                          onPress={() =>
                            handleExecuteStep(plan.id, step.stepIndex, step.requiresHumanReview)
                          }
                        >
                          <Ionicons
                            name={step.requiresHumanReview ? 'shield-outline' : 'play-outline'}
                            size={12}
                            color="#FFFFFF"
                          />
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
                >
                  <Ionicons name="stop-circle-outline" size={14} color="#EF4444" />
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
  promptBox: {
    backgroundColor: '#111827',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  promptLabel: { fontSize: 11, fontWeight: '700', color: '#94A3B8', marginBottom: 8 },
  inputRow: { flexDirection: 'row', gap: 8 },
  input: {
    flex: 1,
    backgroundColor: '#0F172A',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: '#F8FAFC',
    fontSize: 12,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  genBtn: {
    backgroundColor: '#6366F1',
    borderRadius: 8,
    paddingHorizontal: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingBox: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scrollContent: { padding: 16, paddingBottom: 40 },
  planCard: {
    backgroundColor: '#111827',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  planHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  statusBadge: { backgroundColor: 'rgba(99, 102, 241, 0.15)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  statusBadgeText: { color: '#6366F1', fontSize: 10, fontWeight: '700' },
  costText: { fontSize: 11, color: '#10B981', fontWeight: '700' },
  planTitle: { fontSize: 16, fontWeight: '700', color: '#F8FAFC', marginBottom: 4 },
  planDesc: { fontSize: 12, color: '#94A3B8', lineHeight: 17, marginBottom: 12 },
  stepsBox: { backgroundColor: '#0F172A', borderRadius: 10, padding: 12, marginBottom: 12 },
  stepsHeader: { fontSize: 11, fontWeight: '700', color: '#94A3B8', marginBottom: 10 },
  stepRow: { flexDirection: 'row', gap: 10, marginBottom: 12 },
  stepNumberBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#1E293B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepNumText: { fontSize: 10, fontWeight: '700', color: '#38BDF8' },
  stepDetails: { flex: 1 },
  stepMetaRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 },
  stepTitle: { fontSize: 13, fontWeight: '700', color: '#F1F5F9' },
  stepStatus: { fontSize: 10, fontWeight: '700' },
  stepRoleText: { fontSize: 10, color: '#94A3B8', marginBottom: 4 },
  stepDesc: { fontSize: 11, color: '#CBD5E1', lineHeight: 15, marginBottom: 6 },
  stepActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
    backgroundColor: '#6366F1',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  stepActionText: { color: '#FFFFFF', fontSize: 10, fontWeight: '700' },
  cancelBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  cancelBtnText: { color: '#EF4444', fontSize: 11, fontWeight: '600' },
});
