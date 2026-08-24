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
import { intelligenceApi } from '../../src/api/domain.api';
import { EcosystemPredictionItem } from '../../src/types';

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
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Predictive Intelligence</Text>
          <Text style={styles.headerSubtitle}>Probabilistic Ecosystem Forecasts</Text>
        </View>
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => Alert.alert('Uncertainty Disclaimer', 'Forecasts communicate statistical confidence bands and are never guaranteed outcomes.')}
        >
          <Ionicons name="information-circle-outline" size={20} color="#38BDF8" />
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
              >
                <Text style={[styles.domainTabText, isActive && styles.domainTabTextActive]}>
                  {d.replace('_', ' ')}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {loading ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color="#6366F1" />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent}>
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
                    <Ionicons name="analytics" size={12} color="#6366F1" />
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
  actionBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  domainStrip: { backgroundColor: '#111827', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#1E293B' },
  domainScroll: { paddingHorizontal: 16, gap: 8 },
  domainTab: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  domainTabActive: { backgroundColor: '#6366F1', borderColor: '#6366F1' },
  domainTabText: { fontSize: 11, fontWeight: '600', color: '#94A3B8' },
  domainTabTextActive: { color: '#FFFFFF' },
  loadingBox: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scrollContent: { padding: 16, paddingBottom: 40 },
  predCard: {
    backgroundColor: '#111827',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  cardHead: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  domainBadge: {
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  domainBadgeText: { color: '#6366F1', fontSize: 10, fontWeight: '700' },
  confidenceScore: { color: '#10B981', fontSize: 11, fontWeight: '700' },
  predTitle: { fontSize: 15, fontWeight: '700', color: '#F8FAFC', marginBottom: 6 },
  forecastText: { fontSize: 13, color: '#E2E8F0', lineHeight: 18, marginBottom: 12 },
  uncertaintyBox: {
    backgroundColor: '#0F172A',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
  },
  uncertaintyHeader: { fontSize: 10, fontWeight: '700', color: '#94A3B8', marginBottom: 6 },
  rangeRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  rangeVal: { fontSize: 10, color: '#94A3B8' },
  rangeCenter: { backgroundColor: 'rgba(56, 189, 248, 0.15)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  expectedVal: { fontSize: 11, fontWeight: '700', color: '#38BDF8' },
  barBackground: { height: 6, backgroundColor: '#1E293B', borderRadius: 3, overflow: 'hidden' },
  barFill: { height: '100%', width: '70%', backgroundColor: '#6366F1', alignSelf: 'center', borderRadius: 3 },
  signalsBox: {
    backgroundColor: '#0F172A',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  signalsHeader: { fontSize: 10, fontWeight: '700', color: '#94A3B8', marginBottom: 6 },
  signalRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  signalName: { fontSize: 11, fontWeight: '600', color: '#CBD5E1' },
  signalObs: { fontSize: 10, color: '#94A3B8', flex: 1 },
  rationaleText: { fontSize: 11, color: '#94A3B8', fontStyle: 'italic' },
});
