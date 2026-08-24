import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { adaptationApi } from '../../src/api/domain.api';
import { PlatformExperimentItem, FeatureFlagItem } from '../../src/types';

export default function ExperimentsScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'EXPERIMENTS' | 'FLAGS'>('EXPERIMENTS');
  const [experiments, setExperiments] = useState<PlatformExperimentItem[]>([]);
  const [featureFlags, setFeatureFlags] = useState<FeatureFlagItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [exps, flags] = await Promise.all([
        adaptationApi.getExperiments(),
        adaptationApi.getFeatureFlags(),
      ]);
      setExperiments(exps);
      setFeatureFlags(flags);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleRollbackExperiment = async (id: string) => {
    Alert.alert(
      'Halt & Roll Back Experiment?',
      'The experiment will be terminated immediately and all client traffic returned to baseline control.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Instant Rollback',
          style: 'destructive',
          onPress: async () => {
            await adaptationApi.toggleExperiment(id, 'ROLLED_BACK');
            Alert.alert('Rollback Executed', 'Feature flag disengaged across all regions with zero downtime.');
            loadData();
          },
        },
      ]
    );
  };

  const handleToggleFlag = async (key: string, currentVal: boolean, rollout: number) => {
    const updated = !currentVal;
    await adaptationApi.updateFeatureFlag(key, updated, updated ? rollout : 0);
    setFeatureFlags(
      featureFlags.map((f) =>
        f.key === key ? { ...f, enabled: updated, rolloutPercent: updated ? rollout : 0 } : f
      )
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
          <Text style={styles.headerTitle}>Controlled Experiments</Text>
          <Text style={styles.headerSubtitle}>Canary Rollouts • Guardrail Metrics • Instant Rollback</Text>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabStrip}>
        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'EXPERIMENTS' && styles.tabBtnActive]}
          onPress={() => setActiveTab('EXPERIMENTS')}
        >
          <Text style={[styles.tabBtnText, activeTab === 'EXPERIMENTS' && styles.tabBtnTextActive]}>
            Active Experiments ({experiments.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'FLAGS' && styles.tabBtnActive]}
          onPress={() => setActiveTab('FLAGS')}
        >
          <Text style={[styles.tabBtnText, activeTab === 'FLAGS' && styles.tabBtnTextActive]}>
            Feature Flags ({featureFlags.length})
          </Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color="#6366F1" />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {activeTab === 'EXPERIMENTS' ? (
            experiments.map((exp) => (
              <View key={exp.id} style={styles.card}>
                <View style={styles.cardHeader}>
                  <View style={styles.surfaceBadge}>
                    <Text style={styles.surfaceBadgeText}>{exp.targetSurface}</Text>
                  </View>
                  <Text
                    style={[
                      styles.statusText,
                      { color: exp.status === 'ACTIVE' ? '#10B981' : exp.status === 'CONCLUDED_SUCCESS' ? '#38BDF8' : '#EF4444' },
                    ]}
                  >
                    ● {exp.status.replace(/_/g, ' ')}
                  </Text>
                </View>

                <Text style={styles.cardTitle}>{exp.title}</Text>
                <Text style={styles.hypothesisText}>{exp.hypothesis}</Text>

                {/* Metrics Grid */}
                <View style={styles.metricBox}>
                  <View style={styles.metricRow}>
                    <Text style={styles.metricLbl}>Primary Metric:</Text>
                    <Text style={styles.metricVal}>{exp.primaryMetric}</Text>
                  </View>
                  <View style={styles.metricRow}>
                    <Text style={styles.metricLbl}>Audience Segment:</Text>
                    <Text style={styles.metricVal}>{exp.targetAudienceSegment}</Text>
                  </View>
                  <View style={styles.metricRow}>
                    <Text style={styles.metricLbl}>Live Result Lift:</Text>
                    <Text style={[styles.metricVal, { color: '#10B981', fontWeight: '700' }]}>
                      +{exp.liveResults?.primaryMetricLiftPercent}% (Sample: {exp.liveResults?.sampleSize})
                    </Text>
                  </View>
                </View>

                {/* Guardrail Metrics */}
                <View style={styles.guardrailBox}>
                  <Text style={styles.guardrailHeader}>Safety Guardrails (Auto-Halt Criteria):</Text>
                  {exp.guardrailMetrics?.map((g, gIdx) => (
                    <View key={gIdx} style={styles.guardRow}>
                      <Ionicons name="shield-outline" size={12} color="#10B981" />
                      <Text style={styles.guardText}>
                        {g.metricName} {g.operator === 'LT' ? '<' : '>'} {g.thresholdValue}%
                      </Text>
                    </View>
                  ))}
                </View>

                {exp.status === 'ACTIVE' && (
                  <TouchableOpacity
                    style={styles.rollbackBtn}
                    onPress={() => handleRollbackExperiment(exp.id)}
                  >
                    <Ionicons name="arrow-undo-outline" size={12} color="#EF4444" />
                    <Text style={styles.rollbackText}>Instant Rollback</Text>
                  </TouchableOpacity>
                )}
              </View>
            ))
          ) : (
            featureFlags.map((flag) => (
              <View key={flag.key} style={styles.card}>
                <View style={styles.flagHeadRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.flagKey}>{flag.key}</Text>
                    <Text style={styles.flagDesc}>{flag.description}</Text>
                  </View>
                  <Switch
                    value={flag.enabled}
                    onValueChange={() => handleToggleFlag(flag.key, flag.enabled, flag.rolloutPercent || 100)}
                    trackColor={{ false: '#1E293B', true: '#6366F1' }}
                    thumbColor={flag.enabled ? '#FFFFFF' : '#94A3B8'}
                  />
                </View>

                <View style={styles.flagMetaRow}>
                  <Text style={styles.flagOwner}>Owner: {flag.owner}</Text>
                  <Text style={styles.flagRollout}>Rollout: {flag.rolloutPercent}%</Text>
                </View>
              </View>
            ))
          )}
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
  tabStrip: {
    flexDirection: 'row',
    backgroundColor: '#111827',
    paddingHorizontal: 16,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
    gap: 8,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: '#0F172A',
  },
  tabBtnActive: { backgroundColor: '#6366F1' },
  tabBtnText: { fontSize: 11, fontWeight: '600', color: '#94A3B8' },
  tabBtnTextActive: { color: '#FFFFFF' },
  loadingBox: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scrollContent: { padding: 16, paddingBottom: 40 },
  card: {
    backgroundColor: '#111827',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  surfaceBadge: { backgroundColor: 'rgba(56, 189, 248, 0.15)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  surfaceBadgeText: { color: '#38BDF8', fontSize: 10, fontWeight: '700' },
  statusText: { fontSize: 11, fontWeight: '700' },
  cardTitle: { fontSize: 15, fontWeight: '700', color: '#F8FAFC', marginBottom: 4 },
  hypothesisText: { fontSize: 12, color: '#94A3B8', lineHeight: 17, marginBottom: 12 },
  metricBox: { backgroundColor: '#0F172A', borderRadius: 8, padding: 10, gap: 4, marginBottom: 10 },
  metricRow: { flexDirection: 'row', justifyContent: 'space-between' },
  metricLbl: { fontSize: 11, color: '#64748B' },
  metricVal: { fontSize: 11, color: '#CBD5E1' },
  guardrailBox: { backgroundColor: '#0F172A', borderRadius: 8, padding: 10, marginBottom: 12 },
  guardrailHeader: { fontSize: 10, fontWeight: '700', color: '#94A3B8', marginBottom: 6 },
  guardRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 2 },
  guardText: { fontSize: 11, color: '#10B981' },
  rollbackBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  rollbackText: { color: '#EF4444', fontSize: 11, fontWeight: '600' },
  flagHeadRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  flagKey: { fontSize: 14, fontWeight: '700', color: '#F8FAFC', marginBottom: 2 },
  flagDesc: { fontSize: 11, color: '#94A3B8', lineHeight: 15 },
  flagMetaRow: { flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: '#1E293B', paddingTop: 8 },
  flagOwner: { fontSize: 10, color: '#64748B' },
  flagRollout: { fontSize: 10, color: '#38BDF8', fontWeight: '700' },
});
