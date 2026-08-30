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
import { ArrowLeft, ShieldCheck, Wrench, Eye } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { creationApi } from '../../src/api/domain.api';
import { AgentCertificationItem } from '../../src/types';
import { COLORS, RADIUS, SPACING, SHADOWS } from '../../src/constants/theme';

export default function AgentMarketplaceScreen() {
  const router = useRouter();
  const [agents, setAgents] = useState<AgentCertificationItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAgents();
  }, []);

  const loadAgents = async () => {
    setLoading(true);
    try {
      const list = await creationApi.getCertifiedAgents();
      setAgents(list);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handlePreviewPermissions = async (agent: AgentCertificationItem) => {
    const preview = await creationApi.previewAgentPermissions(agent.agentId);
    Alert.alert(
      `${agent.agentName} — Permission Preview`,
      `Allowed Tools:\n${preview.allowedTools.map((t: string) => `• ${t}`).join('\n')}\n\nStrictly Prohibited:\n${preview.prohibitedActions.map((p: string) => `✕ ${p}`).join('\n')}\n\nBudget Cap: ${preview.sandboxBoundaries.budgetLimitPerTask}\nRuntime Cap: ${preview.sandboxBoundaries.runtimeLimit}`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Install to Workspace',
          onPress: () => Alert.alert('Agent Installed', `${agent.agentName} is now active under hardware sandbox boundaries.`),
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
          <Text style={styles.headerTitle}>Agent Marketplace 2.0</Text>
          <Text style={styles.headerSubtitle}>Verified Certifications • Sandbox Isolation</Text>
        </View>
      </View>

      {loading ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {agents.map((agent) => (
            <View key={agent.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.certBadge}>
                  <ShieldCheck size={13} color={COLORS.accent} />
                  <Text style={styles.certBadgeText}>{agent.certificationTier.replace(/_/g, ' ')}</Text>
                </View>
                <Text style={styles.developerText}>Dev: {agent.developer}</Text>
              </View>

              <Text style={styles.cardTitle}>{agent.agentName}</Text>
              <Text style={styles.cardDesc}>{agent.securityAuditSummary}</Text>

              {/* Sandbox Limits Box */}
              <View style={styles.sandboxBox}>
                <Text style={styles.sandboxHead}>Hardware Sandbox Boundaries:</Text>
                <View style={styles.limitRow}>
                  <Text style={styles.limitLbl}>Max Execution Window:</Text>
                  <Text style={styles.limitVal}>{(agent.sandboxConstraints?.maxExecutionTimeMs || 15000) / 1000}s</Text>
                </View>
                <View style={styles.limitRow}>
                  <Text style={styles.limitLbl}>Max Task Budget:</Text>
                  <Text style={styles.limitVal}>${agent.sandboxConstraints?.maxBudgetPerTaskUsd || 0.05} USD</Text>
                </View>
                <View style={styles.limitRow}>
                  <Text style={styles.limitLbl}>Network Egress:</Text>
                  <Text style={[styles.limitVal, { color: COLORS.accent }]}>Internal Gateway Only</Text>
                </View>
              </View>

              {/* Tool Allowlist Tags */}
              <View style={styles.tagWrap}>
                {agent.toolAllowlist.map((tool, idx) => (
                  <View key={idx} style={styles.tag}>
                    <Wrench size={10} color={COLORS.info} />
                    <Text style={styles.tagText}>{tool}</Text>
                  </View>
                ))}
              </View>

              {/* Permission Preview Button */}
              <TouchableOpacity
                style={styles.previewBtn}
                onPress={() => handlePreviewPermissions(agent)}
                activeOpacity={0.85}
              >
                <Eye size={14} color="#FFFFFF" />
                <Text style={styles.previewBtnText}>Preview Permissions & Install</Text>
              </TouchableOpacity>
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
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  certBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  certBadgeText: { color: COLORS.accent, fontSize: 10, fontWeight: '800' },
  developerText: { fontSize: 11, color: COLORS.textMuted },
  cardTitle: { fontSize: 16, fontWeight: '800', color: COLORS.textPrimary, marginBottom: 4 },
  cardDesc: { fontSize: 12, color: COLORS.textSecondary, lineHeight: 17, marginBottom: 12 },
  sandboxBox: { backgroundColor: COLORS.bgInput, borderRadius: RADIUS.md, padding: 12, marginBottom: 12, gap: 5, borderWidth: 1, borderColor: COLORS.borderLight },
  sandboxHead: { fontSize: 10, fontWeight: '800', color: COLORS.primaryLight, marginBottom: 2, letterSpacing: 0.5 },
  limitRow: { flexDirection: 'row', justifyContent: 'space-between' },
  limitLbl: { fontSize: 11, color: COLORS.textMuted },
  limitVal: { fontSize: 11, fontWeight: '800', color: COLORS.textPrimary },
  tagWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 14 },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.bgElevated,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  tagText: { color: COLORS.info, fontSize: 10.5, fontWeight: '700' },
  previewBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.primary,
    paddingVertical: 11,
    borderRadius: RADIUS.md,
    ...SHADOWS.glowPrimary,
  },
  previewBtnText: { color: '#FFFFFF', fontSize: 12.5, fontWeight: '800' },
});
