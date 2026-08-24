import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  TextInput,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  Bot,
  Brain,
  Shield,
  Lock,
  Sparkles,
  Zap,
  Trash2,
  Plus,
  Pin,
  Eye,
  Activity,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  Clock,
  Check,
  X,
} from 'lucide-react-native';
import { useAiStore } from '../../src/store/ai.store';
import { Button } from '../../src/components/common/Button';
import { Badge } from '../../src/components/common/Badge';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../../src/constants/theme';

export default function AiSettingsScreen() {
  const router = useRouter();
  const {
    preferences,
    memories,
    actions,
    trends,
    usage,
    config,
    init,
    updatePreferences,
    toggleScope,
    addMemory,
    deleteMemory,
    clearAllMemories,
    confirmAction,
    rejectAction,
  } = useAiStore();

  const [newMemoryKey, setNewMemoryKey] = useState('');
  const [newMemoryValue, setNewMemoryValue] = useState('');
  const [showAddMemory, setShowAddMemory] = useState(false);

  useEffect(() => {
    init();
  }, []);

  const handleSaveMemory = async () => {
    if (!newMemoryKey.trim() || !newMemoryValue.trim()) {
      Alert.alert('Required', 'Please enter both a memory title and preference details.');
      return;
    }
    await addMemory(newMemoryKey.trim(), newMemoryValue.trim(), 'PREFERENCE', false);
    setNewMemoryKey('');
    setNewMemoryValue('');
    setShowAddMemory(false);
    Alert.alert('Memory Saved', 'LipTalk AI will now remember this preference.');
  };

  const handlePurgeMemories = () => {
    Alert.alert(
      'Purge All AI Memory?',
      'This will permanently delete all learned context and custom preferences from your AI profile.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Purge All',
          style: 'destructive',
          onPress: async () => {
            await clearAllMemories();
            Alert.alert('Cleared', 'All AI memories have been permanently purged.');
          },
        },
      ],
    );
  };

  const allScopes = [
    { id: 'ai.read', label: 'Read Content & Feeds', desc: 'Allow AI to read public posts and community context.' },
    { id: 'ai.search', label: 'Intelligent Search', desc: 'Allow semantic and natural-language search queries.' },
    { id: 'ai.recommend', label: 'Personalized Recommendations', desc: 'Enable explainable partnership matching.' },
    { id: 'ai.summarize', label: 'Summarization', desc: 'Generate executive digests of chats and events.' },
    { id: 'ai.translate', label: 'Live Multilingual Translation', desc: 'Translate across regional and global languages.' },
    { id: 'ai.draft', label: 'Assisted Drafting', desc: 'Help structure needs, offers, and proposals.' },
    { id: 'ai.message', label: 'Chat Messaging Assistant', desc: 'Rephrase and refine chat deal proposals.' },
    { id: 'ai.publish', label: 'Autonomous Publishing', desc: 'Draft and publish ecosystem content.' },
    { id: 'ai.purchase', label: 'Commercial Actions', desc: 'Execute marketplace escrow bookings.' },
  ];

  const pendingActions = actions.filter((a) => a.status === 'PENDING_CONFIRMATION');

  return (
    <View style={styles.container}>
      {/* Top Navigation */}
      <View style={styles.topNav}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={20} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.topNavTitle}>AI & INTELLIGENCE CONTROLS</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Gateway Status Banner */}
        <View style={styles.gatewayCard}>
          <View style={styles.gatewayTopRow}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: SPACING.sm }}>
              <Image
                source={require('../../assets/mascot/mascot_default.png')}
                style={styles.mascotImg}
                resizeMode="contain"
              />
              <View>
                <Text style={styles.gatewayTitle}>Central AI Gateway</Text>
                <Text style={styles.gatewaySub}>Enterprise Model Router & Policy Guard</Text>
              </View>
            </View>
            <Badge label="v9.2 ACTIVE" variant="success" size="sm" />
          </View>
          <View style={styles.gatewayDivider} />
          <View style={styles.gatewayStats}>
            <View style={styles.gatewayStatItem}>
              <Shield size={13} color="#10B981" />
              <Text style={styles.gatewayStatText}>PII Redaction: ON</Text>
            </View>
            <View style={styles.gatewayStatItem}>
              <Zap size={13} color="#F59E0B" />
              <Text style={styles.gatewayStatText}>Auto-Fallback: ON</Text>
            </View>
            <View style={styles.gatewayStatItem}>
              <Lock size={13} color="#3B82F6" />
              <Text style={styles.gatewayStatText}>Policy Layer: SECURE</Text>
            </View>
          </View>
        </View>

        {/* Pending High-Impact AI Confirmations */}
        {pendingActions.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <AlertTriangle size={16} color="#EF4444" />
              <Text style={[styles.sectionTitle, { color: '#EF4444' }]}>
                Pending AI Action Approvals ({pendingActions.length})
              </Text>
            </View>

            {pendingActions.map((act) => (
              <View key={act.id} style={styles.pendingActionCard}>
                <View style={styles.pendingActionHeader}>
                  <Badge label={act.actionType} variant="warning" size="sm" />
                  <Text style={styles.pendingActionTarget}>{act.targetEntity}</Text>
                </View>
                <Text style={styles.pendingActionDesc}>
                  AI Agent is requesting permission to execute: {JSON.stringify(act.payload)}
                </Text>
                <View style={styles.pendingActionBtns}>
                  <TouchableOpacity
                    style={[styles.actionBtn, { backgroundColor: '#10B981' }]}
                    onPress={() => confirmAction(act.id)}
                  >
                    <Check size={14} color="#FFF" />
                    <Text style={styles.actionBtnText}>Approve & Execute</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionBtn, { backgroundColor: 'rgba(239, 68, 68, 0.2)' }]}
                    onPress={() => rejectAction(act.id)}
                  >
                    <X size={14} color="#EF4444" />
                    <Text style={[styles.actionBtnText, { color: '#EF4444' }]}>Reject</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Core AI Capabilities */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Brain size={16} color={COLORS.primaryLight} />
            <Text style={styles.sectionTitle}>AI Personalization & Assistance</Text>
          </View>

          <View style={styles.card}>
            <View style={styles.toggleRow}>
              <View style={styles.toggleTextWrap}>
                <Text style={styles.toggleTitle}>AI Personalization</Text>
                <Text style={styles.toggleSub}>Tailor opportunities and partners to your capabilities</Text>
              </View>
              <Switch
                value={preferences.aiPersonalizationEnabled}
                onValueChange={(val) => updatePreferences({ aiPersonalizationEnabled: val })}
                trackColor={{ false: COLORS.border, true: COLORS.primary }}
              />
            </View>

            <View style={styles.rowDivider} />

            <View style={styles.toggleRow}>
              <View style={styles.toggleTextWrap}>
                <Text style={styles.toggleTitle}>AI Assistant & Memory</Text>
                <Text style={styles.toggleSub}>Remember industry focus and conversation preferences</Text>
              </View>
              <Switch
                value={preferences.aiMemoryEnabled}
                onValueChange={(val) => updatePreferences({ aiMemoryEnabled: val })}
                trackColor={{ false: COLORS.border, true: COLORS.primary }}
              />
            </View>

            <View style={styles.rowDivider} />

            <View style={styles.toggleRow}>
              <View style={styles.toggleTextWrap}>
                <Text style={styles.toggleTitle}>Content & Opportunity Drafting</Text>
                <Text style={styles.toggleSub}>AI assistance for Need and Service creation</Text>
              </View>
              <Switch
                value={preferences.aiContentAssistanceEnabled}
                onValueChange={(val) => updatePreferences({ aiContentAssistanceEnabled: val })}
                trackColor={{ false: COLORS.border, true: COLORS.primary }}
              />
            </View>

            <View style={styles.rowDivider} />

            <View style={styles.toggleRow}>
              <View style={styles.toggleTextWrap}>
                <Text style={styles.toggleTitle}>Multilingual AI Translation</Text>
                <Text style={styles.toggleSub}>Instant cross-language chat and post translation</Text>
              </View>
              <Switch
                value={preferences.aiTranslationEnabled}
                onValueChange={(val) => updatePreferences({ aiTranslationEnabled: val })}
                trackColor={{ false: COLORS.border, true: COLORS.primary }}
              />
            </View>
          </View>
        </View>

        {/* Autonomous Action Permissions & Safety */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Shield size={16} color="#10B981" />
            <Text style={styles.sectionTitle}>Autonomous Action Controls</Text>
          </View>

          <View style={styles.card}>
            <View style={styles.toggleRow}>
              <View style={styles.toggleTextWrap}>
                <Text style={styles.toggleTitle}>Autonomous Read Operations</Text>
                <Text style={styles.toggleSub}>Allow AI to read search indexes and recommendations</Text>
              </View>
              <Switch
                value={preferences.aiAutonomousReadEnabled}
                onValueChange={(val) => updatePreferences({ aiAutonomousReadEnabled: val })}
                trackColor={{ false: COLORS.border, true: COLORS.primary }}
              />
            </View>

            <View style={styles.rowDivider} />

            <View style={styles.toggleRow}>
              <View style={styles.toggleTextWrap}>
                <Text style={styles.toggleTitle}>Autonomous Write Operations</Text>
                <Text style={styles.toggleSub}>Allow AI to automatically save drafts (Safe Mode)</Text>
              </View>
              <Switch
                value={preferences.aiAutonomousWriteEnabled}
                onValueChange={(val) => updatePreferences({ aiAutonomousWriteEnabled: val })}
                trackColor={{ false: COLORS.border, true: COLORS.primary }}
              />
            </View>

            <View style={styles.rowDivider} />

            <View style={styles.toggleRow}>
              <View style={styles.toggleTextWrap}>
                <Text style={styles.toggleTitle}>Mandatory Confirmation for High-Impact</Text>
                <Text style={styles.toggleSub}>Always require explicit approval for purchases or publishes</Text>
              </View>
              <Switch
                value={preferences.aiHighImpactConfirmEnabled}
                onValueChange={(val) => updatePreferences({ aiHighImpactConfirmEnabled: val })}
                trackColor={{ false: COLORS.border, true: COLORS.primary }}
              />
            </View>
          </View>
        </View>

        {/* Data Classification & Privacy Level */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Lock size={16} color="#3B82F6" />
            <Text style={styles.sectionTitle}>Context Privacy & Minimization</Text>
          </View>

          <View style={styles.privacyGrid}>
            {[
              { id: 'STANDARD', title: 'Standard Context', desc: 'Balanced context with automatic credential redaction' },
              { id: 'MINIMAL', title: 'Minimal Context', desc: 'Truncated context with zero chat history transmission' },
              { id: 'STRICT_ANONYMIZED', title: 'Strict Anonymized', desc: 'Full PII, phone, email, and entity redaction' },
            ].map((lvl) => {
              const isSelected = preferences.dataClassificationLevel === lvl.id;
              return (
                <TouchableOpacity
                  key={lvl.id}
                  style={[styles.privacyCard, isSelected && styles.privacyCardSelected]}
                  onPress={() => updatePreferences({ dataClassificationLevel: lvl.id as any })}
                  activeOpacity={0.8}
                >
                  <View style={styles.privacyCardHeader}>
                    <Text style={[styles.privacyTitle, isSelected && styles.privacyTitleSelected]}>
                      {lvl.title}
                    </Text>
                    {isSelected && <CheckCircle2 size={16} color="#10B981" />}
                  </View>
                  <Text style={styles.privacyDesc}>{lvl.desc}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Granular Permission Scopes */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Activity size={16} color="#F59E0B" />
            <Text style={styles.sectionTitle}>Granular Permission Scopes</Text>
          </View>

          <View style={styles.card}>
            {allScopes.map((sc, idx) => {
              const hasScope = preferences.allowedScopes?.includes(sc.id);
              return (
                <View key={sc.id}>
                  <View style={styles.toggleRow}>
                    <View style={styles.toggleTextWrap}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                        <Text style={styles.scopeCode}>{sc.id}</Text>
                        <Text style={styles.toggleTitle}>{sc.label}</Text>
                      </View>
                      <Text style={styles.toggleSub}>{sc.desc}</Text>
                    </View>
                    <Switch
                      value={hasScope}
                      onValueChange={() => toggleScope(sc.id)}
                      trackColor={{ false: COLORS.border, true: COLORS.primary }}
                    />
                  </View>
                  {idx < allScopes.length - 1 && <View style={styles.rowDivider} />}
                </View>
              );
            })}
          </View>
        </View>

        {/* Global Trend Intelligence */}
        {trends.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <TrendingUp size={16} color="#60A5FA" />
              <Text style={styles.sectionTitle}>Global & Regional Trend Intelligence</Text>
            </View>

            <View style={styles.card}>
              {trends.map((tr, idx) => (
                <View key={tr.id}>
                  <View style={styles.trendRow}>
                    <View style={{ flex: 1 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                        <Text style={styles.trendTopic}>{tr.topic}</Text>
                        <Badge label={tr.scope} variant="purple" size="sm" />
                      </View>
                      <Text style={styles.trendMeta}>
                        {tr.category} • {tr.postCount} Discussions • {tr.searchCount} Searches
                      </Text>
                    </View>
                    <View style={styles.velocityBadge}>
                      <Text style={styles.velocityText}>⚡ {tr.velocityScore}%</Text>
                    </View>
                  </View>
                  {idx < trends.length - 1 && <View style={styles.rowDivider} />}
                </View>
              ))}
            </View>
          </View>
        )}

        {/* User-Controlled AI Memory Vault */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: SPACING.xs }}>
              <Brain size={16} color="#EC4899" />
              <Text style={styles.sectionTitle}>Learned AI Memory Vault ({memories.length})</Text>
            </View>
            <TouchableOpacity
              style={styles.addMemBtn}
              onPress={() => setShowAddMemory(!showAddMemory)}
              activeOpacity={0.8}
            >
              <Plus size={14} color="#FFF" />
              <Text style={styles.addMemBtnText}>Add Memory</Text>
            </TouchableOpacity>
          </View>

          {showAddMemory && (
            <View style={styles.addMemoryBox}>
              <Text style={styles.addMemTitle}>Teach LipTalk AI a Custom Preference</Text>
              <TextInput
                style={styles.input}
                placeholder="Title / Key (e.g. Preferred Tech Stack)"
                placeholderTextColor={COLORS.textDim}
                value={newMemoryKey}
                onChangeText={setNewMemoryKey}
              />
              <TextInput
                style={[styles.input, { height: 70 }]}
                placeholder="Details (e.g. Focus exclusively on React Native and NestJS contracts)"
                placeholderTextColor={COLORS.textDim}
                value={newMemoryValue}
                onChangeText={setNewMemoryValue}
                multiline
              />
              <View style={{ flexDirection: 'row', gap: SPACING.sm, marginTop: SPACING.xs }}>
                <Button title="Save Memory" variant="primary" size="sm" onPress={handleSaveMemory} />
                <Button title="Cancel" variant="outline" size="sm" onPress={() => setShowAddMemory(false)} />
              </View>
            </View>
          )}

          {memories.length > 0 ? (
            <View style={styles.card}>
              {memories.map((mem, idx) => (
                <View key={mem.id}>
                  <View style={styles.memoryItem}>
                    <View style={{ flex: 1 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                        {mem.isPinned && <Pin size={12} color="#F59E0B" />}
                        <Text style={styles.memoryKey}>{mem.key}</Text>
                        <Badge label={mem.category} variant="neutral" size="sm" />
                      </View>
                      <Text style={styles.memoryValue}>{mem.value}</Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => deleteMemory(mem.id)}
                      style={styles.delMemBtn}
                    >
                      <Trash2 size={15} color={COLORS.danger} />
                    </TouchableOpacity>
                  </View>
                  {idx < memories.length - 1 && <View style={styles.rowDivider} />}
                </View>
              ))}

              <View style={{ padding: SPACING.md, alignItems: 'center' }}>
                <Button
                  title="Purge All Learned AI Memory"
                  variant="outline"
                  size="sm"
                  onPress={handlePurgeMemories}
                  style={{ borderColor: 'rgba(239, 68, 68, 0.4)' }}
                />
              </View>
            </View>
          ) : (
            <View style={styles.emptyMemoryCard}>
              <Text style={styles.emptyMemText}>No active learned memories.</Text>
              <Text style={styles.emptyMemSub}>AI will learn your communication preferences as you interact.</Text>
            </View>
          )}
        </View>

        {/* AI Usage & Cost Transparency */}
        {usage && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Eye size={16} color="#34D399" />
              <Text style={styles.sectionTitle}>Transparent AI Usage & Cost Ledger</Text>
            </View>

            <View style={styles.usageCard}>
              <View style={styles.usageStatsRow}>
                <View style={styles.usageStat}>
                  <Text style={styles.usageStatNum}>{usage.totalRequests}</Text>
                  <Text style={styles.usageStatLabel}>TOTAL REQUESTS</Text>
                </View>
                <View style={styles.usageDivider} />
                <View style={styles.usageStat}>
                  <Text style={styles.usageStatNum}>{usage.totalTokens.toLocaleString()}</Text>
                  <Text style={styles.usageStatLabel}>TOKENS PROCESSED</Text>
                </View>
                <View style={styles.usageDivider} />
                <View style={styles.usageStat}>
                  <Text style={styles.usageStatNum}>${usage.estimatedCostUsd}</Text>
                  <Text style={styles.usageStatLabel}>ESTIMATED COST</Text>
                </View>
              </View>
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
    fontSize: 13.5,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.lg,
    paddingBottom: SPACING.tabBarClearance,
  },
  gatewayCard: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.xl,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
    marginBottom: SPACING.lg,
    ...SHADOWS.md,
  },
  gatewayTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  mascotImg: {
    width: 38,
    height: 38,
  },
  gatewayTitle: {
    color: COLORS.textPrimary,
    fontSize: 15,
    fontWeight: '900',
  },
  gatewaySub: {
    color: COLORS.textDim,
    fontSize: 11,
    marginTop: 1,
  },
  gatewayDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    marginVertical: SPACING.sm,
  },
  gatewayStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  gatewayStatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  gatewayStatText: {
    color: COLORS.textMuted,
    fontSize: 10,
    fontWeight: '700',
  },
  section: {
    marginBottom: SPACING.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    marginBottom: SPACING.sm,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  sectionTitle: {
    color: COLORS.textPrimary,
    fontSize: 14,
    fontWeight: '800',
  },
  pendingActionCard: {
    backgroundColor: 'rgba(239, 68, 68, 0.08)',
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    marginBottom: SPACING.sm,
  },
  pendingActionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.xs,
  },
  pendingActionTarget: {
    color: COLORS.textMuted,
    fontSize: 11,
    fontWeight: '700',
  },
  pendingActionDesc: {
    color: COLORS.textPrimary,
    fontSize: 12,
    lineHeight: 16,
    marginBottom: SPACING.sm,
  },
  pendingActionBtns: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: SPACING.md,
    paddingVertical: 6,
    borderRadius: RADIUS.md,
  },
  actionBtnText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '800',
  },
  card: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.md,
  },
  toggleTextWrap: {
    flex: 1,
    marginRight: SPACING.md,
  },
  toggleTitle: {
    color: COLORS.textPrimary,
    fontSize: 13.5,
    fontWeight: '700',
  },
  toggleSub: {
    color: COLORS.textMuted,
    fontSize: 11,
    marginTop: 2,
    lineHeight: 15,
  },
  rowDivider: {
    height: 1,
    backgroundColor: COLORS.border,
  },
  privacyGrid: {
    gap: SPACING.sm,
  },
  privacyCard: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  privacyCardSelected: {
    backgroundColor: 'rgba(16, 185, 129, 0.08)',
    borderColor: '#10B981',
  },
  privacyCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  privacyTitle: {
    color: COLORS.textPrimary,
    fontSize: 13,
    fontWeight: '800',
  },
  privacyTitleSelected: {
    color: '#34D399',
  },
  privacyDesc: {
    color: COLORS.textMuted,
    fontSize: 11,
    lineHeight: 15,
  },
  scopeCode: {
    color: COLORS.primaryLight,
    fontSize: 10,
    fontFamily: 'monospace',
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 4,
  },
  trendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.md,
  },
  trendTopic: {
    color: COLORS.textPrimary,
    fontSize: 13,
    fontWeight: '800',
  },
  trendMeta: {
    color: COLORS.textDim,
    fontSize: 10.5,
    marginTop: 2,
  },
  velocityBadge: {
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
  },
  velocityText: {
    color: '#60A5FA',
    fontSize: 11,
    fontWeight: '800',
  },
  addMemBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
  },
  addMemBtnText: {
    color: '#FFF',
    fontSize: 10.5,
    fontWeight: '800',
  },
  addMemoryBox: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.primaryDark,
    marginBottom: SPACING.md,
  },
  addMemTitle: {
    color: COLORS.textPrimary,
    fontSize: 12.5,
    fontWeight: '800',
    marginBottom: SPACING.xs,
  },
  input: {
    backgroundColor: COLORS.bgInput,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    color: COLORS.textPrimary,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    fontSize: 12,
    marginBottom: SPACING.xs,
  },
  memoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    gap: SPACING.sm,
  },
  memoryKey: {
    color: COLORS.textPrimary,
    fontSize: 12.5,
    fontWeight: '800',
  },
  memoryValue: {
    color: COLORS.textMuted,
    fontSize: 11.5,
    lineHeight: 16,
    marginTop: 2,
  },
  delMemBtn: {
    padding: 6,
  },
  emptyMemoryCard: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  emptyMemText: {
    color: COLORS.textPrimary,
    fontSize: 13,
    fontWeight: '700',
  },
  emptyMemSub: {
    color: COLORS.textDim,
    fontSize: 11,
    marginTop: 2,
    textAlign: 'center',
  },
  usageCard: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.xl,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  usageStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  usageStat: {
    alignItems: 'center',
  },
  usageStatNum: {
    color: COLORS.textPrimary,
    fontSize: 18,
    fontWeight: '900',
  },
  usageStatLabel: {
    color: COLORS.textDim,
    fontSize: 9,
    fontWeight: '800',
    marginTop: 2,
    letterSpacing: 0.5,
  },
  usageDivider: {
    width: 1,
    height: 30,
    backgroundColor: COLORS.border,
  },
});
