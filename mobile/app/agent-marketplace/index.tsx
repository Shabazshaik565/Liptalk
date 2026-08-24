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
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { creationApi } from '../../src/api/domain.api';
import { AgentCertificationItem } from '../../src/types';

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
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Agent Marketplace 2.0</Text>
          <Text style={styles.headerSubtitle}>Verified Certifications • Sandbox Isolation</Text>
        </View>
      </View>

      {loading ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color="#6366F1" />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {agents.map((agent) => (
            <View key={agent.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.certBadge}>
                  <Ionicons name="shield-checkmark" size={12} color="#10B981" />
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
                  <Text style={[styles.limitVal, { color: '#10B981' }]}>Internal Gateway Only</Text>
                </View>
              </View>

              {/* Tool Allowlist Tags */}
              <View style={styles.tagWrap}>
                {agent.toolAllowlist.map((tool, idx) => (
                  <View key={idx} style={styles.tag}>
                    <Ionicons name="construct-outline" size={10} color="#38BDF8" />
                    <Text style={styles.tagText}>{tool}</Text>
                  </View>
                ))}
              </View>

              {/* Permission Preview Button */}
              <TouchableOpacity
                style={styles.previewBtn}
                onPress={() => handlePreviewPermissions(agent)}
              >
                <Ionicons name="eye-outline" size={14} color="#FFFFFF" />
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
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  certBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  certBadgeText: { color: '#10B981', fontSize: 10, fontWeight: '700' },
  developerText: { fontSize: 11, color: '#94A3B8' },
  cardTitle: { fontSize: 16, fontWeight: '700', color: '#F8FAFC', marginBottom: 4 },
  cardDesc: { fontSize: 12, color: '#94A3B8', lineHeight: 17, marginBottom: 12 },
  sandboxBox: { backgroundColor: '#0F172A', borderRadius: 8, padding: 10, marginBottom: 12, gap: 4 },
  sandboxHead: { fontSize: 10, fontWeight: '700', color: '#64748B', marginBottom: 4 },
  limitRow: { flexDirection: 'row', justifyContent: 'space-between' },
  limitLbl: { fontSize: 11, color: '#CBD5E1' },
  limitVal: { fontSize: 11, fontWeight: '700', color: '#F8FAFC' },
  tagWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 14 },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#1E293B',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  tagText: { color: '#38BDF8', fontSize: 10 },
  previewBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#6366F1',
    paddingVertical: 10,
    borderRadius: 8,
  },
  previewBtnText: { color: '#FFFFFF', fontSize: 12, fontWeight: '700' },
});
