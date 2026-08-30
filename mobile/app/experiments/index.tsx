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
import { ArrowLeft, Shield, RotateCcw } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { adaptationApi } from '../../src/api/domain.api';
import { PlatformExperimentItem, FeatureFlagItem } from '../../src/types';
import { COLORS, RADIUS, SPACING, SHADOWS } from '../../src/constants/theme';

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
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} activeOpacity={0.8}>
          <ArrowLeft size={20} color="#FFFFFF" />
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
          activeOpacity={0.82}
        >
          <Text style={[styles.tabBtnText, activeTab === 'EXPERIMENTS' && styles.tabBtnTextActive]}>
            Active Experiments ({experiments.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'FLAGS' && styles.tabBtnActive]}
          onPress={() => setActiveTab('FLAGS')}
          activeOpacity={0.82}
        >
          <Text style={[styles.tabBtnText, activeTab === 'FLAGS' && styles.tabBtnTextActive]}>
            Feature Flags ({featureFlags.length})
          </Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
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
                      { color: exp.status === 'ACTIVE' ? COLORS.accent : exp.status === 'CONCLUDED_SUCCESS' ? COLORS.info : COLORS.danger },
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
                    <Text style={[styles.metricVal, { color: COLORS.accent, fontWeight: '800' }]}>
                      +{exp.liveResults?.primaryMetricLiftPercent}% (Sample: {exp.liveResults?.sampleSize})
                    </Text>
                  </View>
                </View>

                {/* Guardrail Metrics */}
                <View style={styles.guardrailBox}>
                  <Text style={styles.guardrailHeader}>Safety Guardrails (Auto-Halt Criteria):</Text>
                  {exp.guardrailMetrics?.map((g, gIdx) => (
                    <View key={gIdx} style={styles.guardRow}>
                      <Shield size={12} color={COLORS.accent} />
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
                    activeOpacity={0.82}
                  >
                    <RotateCcw size={12} color={COLORS.danger} />
                    <Text style={styles.rollbackText}>Instant Rollback</Text>
                  </TouchableOpacity>
                )}
              </View>
            ))
          ) : (
            featureFlags.map((flag) => (
              <View key={flag.key} style={styles.card}>
                <View style={styles.flagHeadRow}>
                  <View style={{ flex: 1, paddingRight: SPACING.md }}>
                    <Text style={styles.flagKey}>{flag.key}</Text>
                    <Text style={styles.flagDesc}>{flag.description}</Text>
                  </View>
                  <Switch
                    value={flag.enabled}
                    onValueChange={() => handleToggleFlag(flag.key, flag.enabled, flag.rolloutPercent || 100)}
                    trackColor={{ false: COLORS.bgElevated, true: COLORS.primary }}
                    thumbColor={flag.enabled ? '#FFFFFF' : COLORS.textMuted}
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
  tabStrip: {
    flexDirection: 'row',
    backgroundColor: COLORS.bgInput,
    paddingHorizontal: SPACING.lg,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    gap: 8,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.bgElevated,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  tabBtnActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primaryLight,
    ...SHADOWS.glowPrimary,
  },
  tabBtnText: { fontSize: 11, fontWeight: '700', color: COLORS.textMuted },
  tabBtnTextActive: { color: '#FFFFFF', fontWeight: '800' },
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
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  surfaceBadge: {
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.3)',
  },
  surfaceBadgeText: { color: COLORS.info, fontSize: 10, fontWeight: '800' },
  statusText: { fontSize: 11, fontWeight: '800' },
  cardTitle: { fontSize: 15, fontWeight: '800', color: COLORS.textPrimary, marginBottom: 4 },
  hypothesisText: { fontSize: 12, color: COLORS.textSecondary, lineHeight: 17, marginBottom: 12 },
  metricBox: { backgroundColor: COLORS.bgInput, borderRadius: RADIUS.md, padding: 10, gap: 4, marginBottom: 10, borderWidth: 1, borderColor: COLORS.borderLight },
  metricRow: { flexDirection: 'row', justifyContent: 'space-between' },
  metricLbl: { fontSize: 11, color: COLORS.textMuted },
  metricVal: { fontSize: 11, color: COLORS.textPrimary, fontWeight: '600' },
  guardrailBox: { backgroundColor: COLORS.bgInput, borderRadius: RADIUS.md, padding: 10, marginBottom: 12, borderWidth: 1, borderColor: COLORS.borderLight },
  guardrailHeader: { fontSize: 10, fontWeight: '800', color: COLORS.primaryLight, marginBottom: 6, letterSpacing: 0.4 },
  guardRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 3 },
  guardText: { fontSize: 11, color: COLORS.accentLight, fontWeight: '600' },
  rollbackBtn: {
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
  rollbackText: { color: COLORS.danger, fontSize: 11, fontWeight: '700' },
  flagHeadRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  flagKey: { fontSize: 14, fontWeight: '800', color: COLORS.textPrimary, marginBottom: 2 },
  flagDesc: { fontSize: 11.5, color: COLORS.textSecondary, lineHeight: 15 },
  flagMetaRow: { flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: COLORS.borderLight, paddingTop: 8, marginTop: 4 },
  flagOwner: { fontSize: 10.5, color: COLORS.textMuted },
  flagRollout: { fontSize: 10.5, color: COLORS.info, fontWeight: '800' },
});
