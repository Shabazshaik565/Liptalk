import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  Target,
  CheckSquare,
  Square,
  GraduationCap,
  Sparkles,
  Play,
  Plus,
  Compass,
  CheckCircle2,
  Clock,
  Layers,
  ChevronRight,
  BookOpen,
} from 'lucide-react-native';
import { usePersonalOsStore } from '../../src/store/personal-os.store';
import { Button } from '../../src/components/common/Button';
import { Badge } from '../../src/components/common/Badge';
import { PillTabs } from '../../src/components/common/PillTabs';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../../src/constants/theme';

export default function PersonalOsScreen() {
  const router = useRouter();
  const {
    goals,
    tasks,
    learningPaths,
    aiSummary,
    init,
    createGoal,
    createTask,
    toggleTask,
    queryAmbient,
    simulateWorkflow,
  } = usePersonalOsStore();

  const [activeTab, setActiveTab] = useState<'GOALS' | 'TASKS' | 'LEARNING' | 'AMBIENT' | 'SIMULATION'>('GOALS');
  const [newGoalTitle, setNewGoalTitle] = useState('');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [ambientQueryText, setAmbientQueryText] = useState('');
  const [ambientAnswerText, setAmbientAnswerText] = useState('');
  const [simResult, setSimResult] = useState<any>(null);

  useEffect(() => {
    init();
  }, []);

  const handleAddGoal = async () => {
    if (!newGoalTitle.trim()) return;
    await createGoal({ title: newGoalTitle.trim(), category: 'SKILL_GROWTH' });
    setNewGoalTitle('');
  };

  const handleAddTask = async () => {
    if (!newTaskTitle.trim()) return;
    await createTask({ title: newTaskTitle.trim(), priority: 'HIGH' });
    setNewTaskTitle('');
  };

  const handleAskAmbient = async () => {
    if (!ambientQueryText.trim()) return;
    const ans = await queryAmbient('Personal Operating System Hub', ambientQueryText.trim());
    setAmbientAnswerText(ans);
  };

  const handleRunSimulation = async () => {
    const res = await simulateWorkflow({
      title: 'Autonomous FMCG Procurement & Price Arbitrage',
      trigger: 'SCHEDULE_DAILY_0900',
      steps: ['search', 'read_content', 'summarize', 'create_draft', 'purchase'],
    });
    setSimResult(res);
  };

  return (
    <View style={styles.container}>
      {/* Top Navigation */}
      <View style={styles.topNav}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={20} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.topNavTitle}>PERSONAL OPERATING SYSTEM</Text>
        <View style={{ width: 36 }} />
      </View>

      {/* Tabs */}
      <View style={styles.tabWrap}>
        <PillTabs
          tabs={[
            { id: 'GOALS', label: `Goals (${goals.length})` },
            { id: 'TASKS', label: `Tasks (${tasks.length})` },
            { id: 'LEARNING', label: 'Learning Paths' },
            { id: 'AMBIENT', label: 'Ambient AI' },
            { id: 'SIMULATION', label: 'Simulation' },
          ]}
          activeTab={activeTab}
          onTabChange={(t) => setActiveTab(t as any)}
        />
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* TAB 1: GOALS */}
        {activeTab === 'GOALS' && (
          <View>
            <View style={styles.summaryBanner}>
              <Sparkles size={16} color={COLORS.primaryLight} />
              <Text style={styles.summaryText}>{aiSummary || 'Tracking 3 active milestones and mastery tracks.'}</Text>
            </View>

            <View style={styles.addBox}>
              <TextInput
                style={styles.input}
                placeholder="Add high-impact personal goal..."
                placeholderTextColor={COLORS.textDim}
                value={newGoalTitle}
                onChangeText={setNewGoalTitle}
              />
              <Button title="Set Goal" variant="primary" size="sm" onPress={handleAddGoal} />
            </View>

            {goals.map((g) => (
              <View key={g.id} style={styles.card}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text style={styles.cardTitle}>{g.title}</Text>
                  <Badge label={`${g.progressPercent}%`} variant="success" size="sm" />
                </View>
                <Text style={styles.cardCategory}>{g.category} • {g.status}</Text>
                <View style={styles.progressBarBg}>
                  <View style={[styles.progressBarFill, { width: `${g.progressPercent}%` }]} />
                </View>
              </View>
            ))}
          </View>
        )}

        {/* TAB 2: SMART TASKS */}
        {activeTab === 'TASKS' && (
          <View>
            <View style={styles.addBox}>
              <TextInput
                style={styles.input}
                placeholder="Add smart task (e.g. Audit API scopes)..."
                placeholderTextColor={COLORS.textDim}
                value={newTaskTitle}
                onChangeText={setNewTaskTitle}
              />
              <Button title="Add Task" variant="primary" size="sm" onPress={handleAddTask} />
            </View>

            {tasks.map((t) => (
              <TouchableOpacity
                key={t.id}
                style={styles.taskCard}
                onPress={() => toggleTask(t.id)}
              >
                {t.status === 'DONE' ? (
                  <CheckSquare size={18} color="#10B981" />
                ) : (
                  <Square size={18} color={COLORS.textDim} />
                )}
                <View style={{ flex: 1, marginLeft: SPACING.sm }}>
                  <Text style={[styles.taskTitle, t.status === 'DONE' && styles.taskTitleDone]}>
                    {t.title}
                  </Text>
                  <View style={{ flexDirection: 'row', gap: 6, marginTop: 2 }}>
                    <Badge label={t.priority} variant={t.priority === 'CRITICAL' ? 'danger' : 'neutral'} size="sm" />
                    <Badge label={t.status} variant={t.status === 'DONE' ? 'success' : 'neutral'} size="sm" />
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* TAB 3: LEARNING PATHS */}
        {activeTab === 'LEARNING' && (
          <View>
            {learningPaths.map((lp) => (
              <View key={lp.id} style={styles.card}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text style={styles.cardTitle}>{lp.title}</Text>
                  <Badge label={`${lp.progressPercent}% MASTERED`} variant="purple" size="sm" />
                </View>
                <Text style={styles.cardCategory}>{lp.category}</Text>

                <View style={styles.progressBarBg}>
                  <View style={[styles.progressBarFill, { width: `${lp.progressPercent}%` }]} />
                </View>

                <View style={{ marginTop: SPACING.sm }}>
                  <Text style={styles.subHeading}>MODULE SYLLABUS</Text>
                  {lp.modules?.map((m) => (
                    <View key={m.id} style={styles.moduleRow}>
                      <CheckCircle2 size={13} color={m.completed ? '#10B981' : COLORS.textDim} />
                      <Text style={[styles.moduleTitle, m.completed && { color: COLORS.textPrimary }]}>
                        {m.title} ({m.estimatedMinutes}m)
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            ))}
          </View>
        )}

        {/* TAB 4: AMBIENT AI */}
        {activeTab === 'AMBIENT' && (
          <View>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Grounded Screen Context Assistant</Text>
              <Text style={styles.cardCategory}>
                Answers queries relative to your current workspace context without exposing private data.
              </Text>
              <View style={{ flexDirection: 'row', gap: SPACING.sm, marginTop: SPACING.sm }}>
                <TextInput
                  style={styles.input}
                  placeholder="Ask about your active context..."
                  placeholderTextColor={COLORS.textDim}
                  value={ambientQueryText}
                  onChangeText={setAmbientQueryText}
                />
                <Button title="Ask AI" variant="primary" size="sm" onPress={handleAskAmbient} />
              </View>

              {ambientAnswerText ? (
                <View style={styles.ambientResultBox}>
                  <Sparkles size={16} color={COLORS.primaryLight} />
                  <Text style={styles.ambientResultText}>{ambientAnswerText}</Text>
                </View>
              ) : null}
            </View>
          </View>
        )}

        {/* TAB 5: SIMULATION */}
        {activeTab === 'SIMULATION' && (
          <View>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Autonomous Workflow Sandbox Simulation</Text>
              <Text style={styles.cardCategory}>
                Preview step execution plans, token consumption, and risk levels before granting live authorization.
              </Text>
              <Button
                title="Run Sample Workflow Simulation"
                variant="primary"
                size="sm"
                icon={<Play size={13} color="#FFF" />}
                style={{ marginTop: SPACING.sm }}
                onPress={handleRunSimulation}
              />

              {simResult && (
                <View style={{ marginTop: SPACING.md }}>
                  <View style={styles.simHeader}>
                    <Badge label={simResult.safetyCheck} variant="success" size="sm" />
                    <Text style={styles.simMeta}>Est. Tokens: {simResult.estimatedTokensTotal} • Cost: ${simResult.estimatedCostUsd}</Text>
                  </View>

                  <Text style={styles.subHeading}>SIMULATED STEP TRACE</Text>
                  {simResult.simulatedSteps?.map((st: any) => (
                    <View key={st.stepNumber} style={styles.simStepRow}>
                      <Text style={styles.simStepNum}>Step {st.stepNumber}:</Text>
                      <Text style={styles.simStepTool}>{st.tool}</Text>
                      <Badge
                        label={st.riskLevel}
                        variant={st.riskLevel === 'HIGH' ? 'danger' : 'neutral'}
                        size="sm"
                      />
                      {st.requiresApproval && <Badge label="APPROVAL REQUIRED" variant="warning" size="sm" />}
                    </View>
                  ))}
                </View>
              )}
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgDark,
  },
  topNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xl + 10,
    paddingBottom: SPACING.sm,
    backgroundColor: COLORS.bgDark,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.bgCard,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topNavTitle: {
    color: COLORS.textPrimary,
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  tabWrap: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.xs,
    backgroundColor: COLORS.bgDark,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.lg,
    paddingBottom: SPACING.tabBarClearance,
  },
  summaryBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.25)',
  },
  summaryText: {
    color: COLORS.textPrimary,
    fontSize: 12,
    flex: 1,
    lineHeight: 16,
  },
  addBox: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  input: {
    flex: 1,
    backgroundColor: COLORS.bgInput,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    color: COLORS.textPrimary,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    fontSize: 12,
  },
  card: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.xl,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.sm,
    ...SHADOWS.sm,
  },
  cardTitle: {
    color: COLORS.textPrimary,
    fontSize: 13.5,
    fontWeight: '800',
  },
  cardCategory: {
    color: COLORS.textDim,
    fontSize: 11,
    marginTop: 2,
  },
  progressBarBg: {
    height: 5,
    backgroundColor: COLORS.bgInput,
    borderRadius: 3,
    marginTop: SPACING.sm,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#10B981',
  },
  taskCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.xs,
  },
  taskTitle: {
    color: COLORS.textPrimary,
    fontSize: 12.5,
    fontWeight: '700',
  },
  taskTitleDone: {
    color: COLORS.textDim,
    textDecorationLine: 'line-through',
  },
  subHeading: {
    color: COLORS.textDim,
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginTop: SPACING.xs,
    marginBottom: 4,
  },
  moduleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  moduleTitle: {
    color: COLORS.textMuted,
    fontSize: 11,
  },
  ambientResultBox: {
    backgroundColor: 'rgba(139, 92, 246, 0.08)',
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginTop: SPACING.sm,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
    flexDirection: 'row',
    gap: SPACING.sm,
    alignItems: 'flex-start',
  },
  ambientResultText: {
    color: COLORS.textPrimary,
    fontSize: 12,
    flex: 1,
    lineHeight: 16,
  },
  simHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  simMeta: {
    color: COLORS.textDim,
    fontSize: 10.5,
  },
  simStepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
    backgroundColor: COLORS.bgDark,
    padding: SPACING.xs,
    borderRadius: RADIUS.sm,
  },
  simStepNum: {
    color: COLORS.textDim,
    fontSize: 10.5,
    fontWeight: '700',
  },
  simStepTool: {
    color: COLORS.primaryLight,
    fontSize: 11,
    fontFamily: 'monospace',
    flex: 1,
  },
});
