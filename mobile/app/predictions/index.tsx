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
import { ArrowLeft, Info, Activity } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { intelligenceApi } from '../../src/api/domain.api';
import { EcosystemPredictionItem } from '../../src/types';
import { COLORS, RADIUS, SPACING, SHADOWS } from '../../src/constants/theme';

export default function PredictionsScreen() {
  const router = useRouter();
  const [predictions, setPredictions] = useState<EcosystemPredictionItem[]>([]);
  const [selectedDomain, setSelectedDomain] = useState<string>('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [selectedDomain]);

  const loadData = async () => {
    setLoading(true);
    try {
      const list = await intelligenceApi.getPredictions(
        selectedDomain === 'ALL' ? undefined : selectedDomain
      );
      setPredictions(list);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const domainTabs = ['ALL', 'COMMUNITY_GROWTH', 'MARKETPLACE_DEMAND', 'INFRASTRUCTURE_LOAD'];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} activeOpacity={0.8}>
          <ArrowLeft size={20} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Predictive Intelligence</Text>
          <Text style={styles.headerSubtitle}>Probabilistic Ecosystem Forecasts</Text>
        </View>
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => Alert.alert('Uncertainty Disclaimer', 'Forecasts communicate statistical confidence bands and are never guaranteed outcomes.')}
          activeOpacity={0.8}
        >
          <Info size={18} color={COLORS.info} />
        </TouchableOpacity>
      </View>

      {/* Domain Pill Filter */}
      <View style={styles.domainStrip}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.domainScroll}>
          {domainTabs.map((d) => {
            const isActive = selectedDomain === d;
            return (
              <TouchableOpacity
                key={d}
                style={[styles.domainTab, isActive && styles.domainTabActive]}
                onPress={() => setSelectedDomain(d)}
                activeOpacity={0.82}
              >
                <Text style={[styles.domainTabText, isActive && styles.domainTabTextActive]}>
                  {d.replace(/_/g, ' ')}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {loading ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {predictions.map((pred) => (
            <View key={pred.id} style={styles.predCard}>
              <View style={styles.cardHead}>
                <View style={styles.domainBadge}>
                  <Text style={styles.domainBadgeText}>{pred.domain}</Text>
                </View>
                <Text style={styles.confidenceScore}>
                  {(pred.confidenceScore * 100).toFixed(0)}% Probability
                </Text>
              </View>

              <Text style={styles.predTitle}>{pred.predictionTitle}</Text>
              <Text style={styles.forecastText}>{pred.forecastStatement}</Text>

              {/* Uncertainty Band Visualizer */}
              {pred.uncertaintyBand && (
                <View style={styles.uncertaintyBox}>
                  <Text style={styles.uncertaintyHeader}>
                    Uncertainty Band ({pred.uncertaintyBand.unit}):
                  </Text>
                  <View style={styles.rangeRow}>
                    <Text style={styles.rangeVal}>Min: {pred.uncertaintyBand.lowerBound}</Text>
                    <View style={styles.rangeCenter}>
                      <Text style={styles.expectedVal}>Expected: {pred.uncertaintyBand.expectedValue}</Text>
                    </View>
                    <Text style={styles.rangeVal}>Max: {pred.uncertaintyBand.upperBound}</Text>
                  </View>
                  <View style={styles.barBackground}>
                    <View style={styles.barFill} />
                  </View>
                </View>
              )}

              {/* Key Influencing Signals */}
              <View style={styles.signalsBox}>
                <Text style={styles.signalsHeader}>Key Influencing Signals:</Text>
                {pred.influencingSignals?.map((sig, sIdx) => (
                  <View key={sIdx} style={styles.signalRow}>
                    <Activity size={12} color={COLORS.primaryLight} />
                    <Text style={styles.signalName}>{sig.signalName}:</Text>
                    <Text style={styles.signalObs}>{sig.observation}</Text>
                  </View>
                ))}
              </View>

              <Text style={styles.rationaleText}>
                Rationale: {pred.aiExplanationRationale}
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
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.3)',
  },
  domainStrip: { backgroundColor: COLORS.bgInput, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  domainScroll: { paddingHorizontal: SPACING.lg, gap: 8 },
  domainTab: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.bgElevated,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  domainTabActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primaryLight, ...SHADOWS.glowPrimary },
  domainTabText: { fontSize: 11, fontWeight: '700', color: COLORS.textMuted },
  domainTabTextActive: { color: '#FFFFFF', fontWeight: '800' },
  loadingBox: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scrollContent: { padding: SPACING.lg, paddingBottom: 40 },
  predCard: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
  },
  cardHead: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  domainBadge: {
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
  },
  domainBadgeText: { color: COLORS.primaryLight, fontSize: 10, fontWeight: '800' },
  confidenceScore: { color: COLORS.accent, fontSize: 11, fontWeight: '800' },
  predTitle: { fontSize: 15, fontWeight: '800', color: COLORS.textPrimary, marginBottom: 6 },
  forecastText: { fontSize: 13, color: COLORS.textSecondary, lineHeight: 18, marginBottom: 12 },
  uncertaintyBox: {
    backgroundColor: COLORS.bgInput,
    borderRadius: RADIUS.md,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  uncertaintyHeader: { fontSize: 10, fontWeight: '800', color: COLORS.primaryLight, marginBottom: 6, letterSpacing: 0.4 },
  rangeRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  rangeVal: { fontSize: 10, color: COLORS.textMuted },
  rangeCenter: {
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.3)',
  },
  expectedVal: { fontSize: 11, fontWeight: '800', color: COLORS.info },
  barBackground: { height: 6, backgroundColor: COLORS.bgElevated, borderRadius: 3, overflow: 'hidden' },
  barFill: { height: '100%', width: '70%', backgroundColor: COLORS.primary, alignSelf: 'center', borderRadius: 3 },
  signalsBox: {
    backgroundColor: COLORS.bgInput,
    borderRadius: RADIUS.md,
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  signalsHeader: { fontSize: 10, fontWeight: '800', color: COLORS.primaryLight, marginBottom: 6, letterSpacing: 0.4 },
  signalRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  signalName: { fontSize: 11, fontWeight: '700', color: COLORS.textPrimary },
  signalObs: { fontSize: 10.5, color: COLORS.textMuted, flex: 1 },
  rationaleText: { fontSize: 11, color: COLORS.textMuted, fontStyle: 'italic' },
});
