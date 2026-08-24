import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Switch,
  Alert,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  Bot,
  Brain,
  Zap,
  Play,
  CheckCircle2,
  Clock,
  Sparkles,
  BookOpen,
  Plus,
  Shield,
  Layers,
  Search,
  Activity,
  Sliders,
} from 'lucide-react-native';
import { useAgentsStore } from '../../src/store/agents.store';
import { useAiStore } from '../../src/store/ai.store';
import { Button } from '../../src/components/common/Button';
import { Badge } from '../../src/components/common/Badge';
import { PillTabs } from '../../src/components/common/PillTabs';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../../src/constants/theme';

export default function AgentsHubScreen() {
  const router = useRouter();
  const {
    personalAgent,
    workflows,
    knowledge,
    executions,
    init,
    updateAgent,
    executeTask,
    toggleWorkflow,
    synthesizeKnowledge,
  } = useAgentsStore();

  const { actions, confirmAction, rejectAction } = useAiStore();

  const [activeTab, setActiveTab] = useState<'AGENT' | 'WORKFLOWS' | 'KNOWLEDGE' | 'EXECUTIONS'>('AGENT');
  const [taskPrompt, setTaskPrompt] = useState('');
  const [executing, setExecuting] = useState(false);
  const [synthesisQuery, setSynthesisQuery] = useState('');
  const [synthesisResult, setSynthesisResult] = useState<{ synthesis: string; sources: string[] } | null>(null);

  useEffect(() => {
    init();
  }, []);

  const handleRunTask = async () => {
    if (!taskPrompt.trim()) {
      Alert.alert('Required', 'Please enter a goal or task description for your AI agent.');
      return;
    }
    setExecuting(true);
    try {
      await executeTask(taskPrompt.trim());
      setTaskPrompt('');
      Alert.alert('Task Executed', 'Agent completed the autonomous plan within granted tool permissions.');
    } catch {
      Alert.alert('Error', 'Agent task encountered an issue.');
    } finally {
      setExecuting(false);
    }
  };

  const handleSynthesize = async () => {
    if (!synthesisQuery.trim()) return;
    try {
      const res = await synthesizeKnowledge(synthesisQuery.trim());
      setSynthesisResult(res);
    } catch {
      // Ignore
    }
  };

  const allTools = [
    { id: 'search', label: 'Semantic Search', scope: 'ai.search', risk: 'LOW' },
    { id: 'read_content', label: 'Read Content & Feeds', scope: 'ai.read', risk: 'LOW' },
    { id: 'summarize', label: 'Summarize Discussions', scope: 'ai.summarize', risk: 'LOW' },
    { id: 'translate', label: 'Multilingual Translation', scope: 'ai.translate', risk: 'LOW' },
    { id: 'save_content', label: 'Save to Knowledge Hub', scope: 'ai.save', risk: 'MEDIUM' },
    { id: 'create_draft', label: 'Draft Opportunities / Posts', scope: 'ai.draft', risk: 'MEDIUM' },
    { id: 'send_message', label: 'Send B2B Chat Messages', scope: 'ai.message', risk: 'HIGH' },
    { id: 'publish', label: 'Publish to Public Feed', scope: 'ai.publish', risk: 'HIGH' },
    { id: 'purchase', label: 'Marketplace Purchases', scope: 'ai.purchase', risk: 'HIGH' },
  ];

  const handleToggleTool = async (toolId: string) => {
    if (!personalAgent) return;
    const current = personalAgent.allowedTools || [];
    const newTools = current.includes(toolId) ? current.filter((t) => t !== toolId) : [...current, toolId];
    await updateAgent({ allowedTools: newTools });
  };

  return (
    <View style={styles.container}>
      {/* Top Navigation */}
      <View style={styles.topNav}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={20} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.topNavTitle}>AUTONOMOUS AGENT PLATFORM</Text>
        <View style={{ width: 36 }} />
      </View>

      {/* Navigation Tabs */}
      <View style={styles.tabWrap}>
        <PillTabs
          tabs={[
            { id: 'AGENT', label: 'My Agent' },
            { id: 'WORKFLOWS', label: `Workflows (${workflows.length})` },
            { id: 'KNOWLEDGE', label: 'Knowledge Hub' },
            { id: 'EXECUTIONS', label: 'Logs' },
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
        {/* TAB 1: MY AGENT */}
        {activeTab === 'AGENT' && (
          <View>
            {/* Agent Identity & Health Card */}
            <View style={styles.agentCard}>
              <View style={styles.agentHeader}>
                <Image
                  source={require('../../assets/mascot/mascot_ai.png')}
                  style={styles.mascotImg}
                  resizeMode="contain"
                />
                <View style={{ flex: 1, marginLeft: SPACING.sm }}>
                  <Text style={styles.agentName}>{personalAgent?.name || 'My Personal LipTalk Assistant'}</Text>
                  <Text style={styles.agentDesc}>
                    {personalAgent?.description || 'Autonomous assistant for smart discovery, drafting, and digests.'}
                  </Text>
                  <View style={{ flexDirection: 'row', gap: 6, marginTop: 6 }}>
                    <Badge label="ACTIVE" variant="success" size="sm" />
                    <Badge label={`Budget: $${personalAgent?.monthlyBudgetUsd || '2.00'}`} variant="neutral" size="sm" />
                  </View>
                </View>
              </View>
            </View>

            {/* Run Autonomous Goal */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Dispatch Autonomous Goal</Text>
              <View style={styles.taskInputBox}>
                <TextInput
                  style={styles.taskInput}
                  placeholder="e.g. Find 3 active FMCG contracts and draft a partnership proposal..."
                  placeholderTextColor={COLORS.textDim}
                  value={taskPrompt}
                  onChangeText={setTaskPrompt}
                  multiline
                />
                <Button
                  title={executing ? 'Executing Plan...' : 'Execute Goal'}
                  variant="primary"
                  size="md"
                  icon={<Play size={15} color="#FFF" />}
                  onPress={handleRunTask}
                  disabled={executing}
                />
              </View>
            </View>

            {/* Allowed Tool Permissions */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Agent Tool Registry & Allowlist</Text>
              <View style={styles.card}>
                {allTools.map((t, idx) => {
                  const isAllowed = personalAgent?.allowedTools?.includes(t.id);
                  return (
                    <View key={t.id}>
                      <View style={styles.toolRow}>
                        <View style={{ flex: 1 }}>
                          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                            <Text style={styles.toolLabel}>{t.label}</Text>
                            <Badge
                              label={t.risk}
                              variant={t.risk === 'HIGH' ? 'danger' : t.risk === 'MEDIUM' ? 'warning' : 'neutral'}
                              size="sm"
                            />
                          </View>
                          <Text style={styles.toolScope}>Scope: {t.scope}</Text>
                        </View>
                        <Switch
                          value={isAllowed}
                          onValueChange={() => handleToggleTool(t.id)}
                          trackColor={{ false: COLORS.border, true: COLORS.primary }}
                        />
                      </View>
                      {idx < allTools.length - 1 && <View style={styles.rowDivider} />}
                    </View>
                  );
                })}
              </View>
            </View>
          </View>
        )}

        {/* TAB 2: WORKFLOWS */}
        {activeTab === 'WORKFLOWS' && (
          <View>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>Scheduled & Triggered Automations</Text>
              <Badge label={`${workflows.length} Active`} variant="purple" size="sm" />
            </View>

            {workflows.map((wf) => (
              <View key={wf.id} style={styles.workflowCard}>
                <View style={styles.workflowTop}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.workflowTitle}>{wf.title}</Text>
                    <Text style={styles.workflowDesc}>{wf.description}</Text>
                  </View>
                  <Switch
                    value={wf.isActive}
                    onValueChange={(val) => toggleWorkflow(wf.id, val)}
                    trackColor={{ false: COLORS.border, true: COLORS.primary }}
                  />
                </View>
                <View style={styles.workflowFooter}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    <Clock size={12} color={COLORS.textDim} />
                    <Text style={styles.workflowMeta}>Cron: {wf.scheduleCron || 'Event-Driven'}</Text>
                  </View>
                  <Text style={styles.workflowMeta}>Steps: {wf.actionsPlan?.length || 2}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* TAB 3: KNOWLEDGE HUB */}
        {activeTab === 'KNOWLEDGE' && (
          <View>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Synthesize Across Private Knowledge</Text>
              <View style={styles.synthesisBox}>
                <TextInput
                  style={styles.synthInput}
                  placeholder="Ask a question across your saved notes & bookmarks..."
                  placeholderTextColor={COLORS.textDim}
                  value={synthesisQuery}
                  onChangeText={setSynthesisQuery}
                />
                <Button
                  title="Synthesize"
                  variant="primary"
                  size="sm"
                  onPress={handleSynthesize}
                />
              </View>

              {synthesisResult && (
                <View style={styles.synthesisResultCard}>
                  <Text style={styles.synthesisText}>{synthesisResult.synthesis}</Text>
                  <Text style={styles.sourcesLabel}>Sources: {synthesisResult.sources.join(', ')}</Text>
                </View>
              )}
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Knowledge Collections ({knowledge.length})</Text>
              {knowledge.map((coll) => (
                <View key={coll.id} style={styles.knowledgeCard}>
                  <View style={styles.knowledgeHeader}>
                    <BookOpen size={16} color={COLORS.primaryLight} />
                    <Text style={styles.knowledgeTitle}>{coll.title}</Text>
                    <Badge label={coll.category} variant="neutral" size="sm" />
                  </View>
                  <View style={{ marginTop: SPACING.xs }}>
                    {coll.items?.map((item) => (
                      <View key={item.id} style={styles.knowledgeItemRow}>
                        <Text style={styles.knowledgeItemTitle}>• {item.title}</Text>
                        <Text style={styles.knowledgeItemContent}>{item.content}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* TAB 4: EXECUTIONS */}
        {activeTab === 'EXECUTIONS' && (
          <View>
            <Text style={styles.sectionTitle}>Autonomous Execution History</Text>
            {executions.length > 0 ? (
              executions.map((ex) => (
                <View key={ex.id} style={styles.executionCard}>
                  <View style={styles.executionHeader}>
                    <Badge label={ex.status} variant={ex.status === 'COMPLETED' ? 'success' : 'warning'} size="sm" />
                    <Text style={styles.executionMeta}>{ex.executionTimeMs}ms • {ex.tokensUsed} tokens</Text>
                  </View>
                  <Text style={styles.executionPrompt}>Goal: "{ex.initialPromptOrTrigger}"</Text>
                  <Text style={styles.executionResult}>{ex.finalResultText}</Text>
                </View>
              ))
            ) : (
              <View style={styles.emptyCard}>
                <Text style={styles.emptyText}>No recent execution records.</Text>
                <Text style={styles.emptySub}>Dispatch a goal from the 'My Agent' tab to view live multi-step execution logs.</Text>
              </View>
            )}
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
  agentCard: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.xl,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
    marginBottom: SPACING.lg,
    ...SHADOWS.md,
  },
  agentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mascotImg: {
    width: 52,
    height: 52,
  },
  agentName: {
    color: COLORS.textPrimary,
    fontSize: 14.5,
    fontWeight: '900',
  },
  agentDesc: {
    color: COLORS.textMuted,
    fontSize: 11,
    marginTop: 2,
    lineHeight: 15,
  },
  section: {
    marginBottom: SPACING.lg,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  sectionTitle: {
    color: COLORS.textPrimary,
    fontSize: 13.5,
    fontWeight: '800',
    marginBottom: SPACING.xs,
  },
  taskInputBox: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: SPACING.sm,
  },
  taskInput: {
    color: COLORS.textPrimary,
    fontSize: 12.5,
    minHeight: 60,
  },
  card: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
  toolRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.md,
  },
  toolLabel: {
    color: COLORS.textPrimary,
    fontSize: 13,
    fontWeight: '700',
  },
  toolScope: {
    color: COLORS.textDim,
    fontSize: 10.5,
    fontFamily: 'monospace',
    marginTop: 2,
  },
  rowDivider: {
    height: 1,
    backgroundColor: COLORS.border,
  },
  workflowCard: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.sm,
  },
  workflowTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  workflowTitle: {
    color: COLORS.textPrimary,
    fontSize: 13.5,
    fontWeight: '800',
  },
  workflowDesc: {
    color: COLORS.textMuted,
    fontSize: 11,
    marginTop: 2,
    lineHeight: 15,
  },
  workflowFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SPACING.sm,
    paddingTop: SPACING.xs,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
  },
  workflowMeta: {
    color: COLORS.textDim,
    fontSize: 10.5,
  },
  synthesisBox: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  synthInput: {
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
  synthesisResultCard: {
    backgroundColor: 'rgba(139, 92, 246, 0.08)',
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
    marginBottom: SPACING.md,
  },
  synthesisText: {
    color: COLORS.textPrimary,
    fontSize: 12,
    lineHeight: 17,
  },
  sourcesLabel: {
    color: COLORS.primaryLight,
    fontSize: 10.5,
    fontWeight: '700',
    marginTop: SPACING.xs,
  },
  knowledgeCard: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.sm,
  },
  knowledgeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  knowledgeTitle: {
    color: COLORS.textPrimary,
    fontSize: 13,
    fontWeight: '800',
    flex: 1,
  },
  knowledgeItemRow: {
    marginTop: SPACING.xs,
    paddingLeft: SPACING.sm,
    borderLeftWidth: 2,
    borderLeftColor: COLORS.primary,
  },
  knowledgeItemTitle: {
    color: COLORS.textPrimary,
    fontSize: 11.5,
    fontWeight: '700',
  },
  knowledgeItemContent: {
    color: COLORS.textMuted,
    fontSize: 11,
    marginTop: 1,
    lineHeight: 15,
  },
  executionCard: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.sm,
  },
  executionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  executionMeta: {
    color: COLORS.textDim,
    fontSize: 10,
  },
  executionPrompt: {
    color: COLORS.textPrimary,
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 2,
  },
  executionResult: {
    color: COLORS.textMuted,
    fontSize: 11.5,
    lineHeight: 16,
  },
  emptyCard: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  emptyText: {
    color: COLORS.textPrimary,
    fontSize: 13,
    fontWeight: '700',
  },
  emptySub: {
    color: COLORS.textDim,
    fontSize: 11,
    marginTop: 2,
    textAlign: 'center',
  },
});
