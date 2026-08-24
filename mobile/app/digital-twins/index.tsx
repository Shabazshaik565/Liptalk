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
import { DigitalTwinItem } from '../../src/types';

export default function DigitalTwinsScreen() {
  const router = useRouter();
  const [twins, setTwins] = useState<DigitalTwinItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const list = await intelligenceApi.getDigitalTwins();
      setTwins(list);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleResetTwin = async (id: string) => {
    Alert.alert(
      'Reset Digital Twin Memory?',
      'This will purge all cached event memories and reset preference heuristics to baseline.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset Memory',
          style: 'destructive',
          onPress: async () => {
            await intelligenceApi.resetDigitalTwin(id, 'RESET');
            Alert.alert('Twin Reset', 'Digital twin working memory purged.');
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
          <Text style={styles.headerTitle}>Digital Twins Control</Text>
          <Text style={styles.headerSubtitle}>User-Controlled Cognitive Representation</Text>
        </View>
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => Alert.alert('Privacy Guard', 'Digital Twins are strictly controlled by you and never form unrestricted psychological profiles.')}
        >
          <Ionicons name="shield-checkmark" size={18} color="#10B981" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color="#6366F1" />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {twins.map((twin) => (
            <View key={twin.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.twinTypeBadge}>
                  <Text style={styles.twinTypeText}>{twin.twinType}</Text>
                </View>
                <Text style={styles.statusActive}>● ACTIVE</Text>
              </View>

              <Text style={styles.twinTitle}>{twin.displayName}</Text>
              <Text style={styles.twinDesc}>{twin.description}</Text>

              {/* State Snapshot */}
              <View style={styles.sectionBox}>
                <Text style={styles.sectionHead}>Explicit Goals & Interests:</Text>
                <View style={styles.chipWrap}>
                  {twin.stateSnapshot?.goals?.map((g, gIdx) => (
                    <View key={gIdx} style={styles.chip}>
                      <Ionicons name="flag-outline" size={12} color="#6366F1" />
                      <Text style={styles.chipText}>{g}</Text>
                    </View>
                  ))}
                  {twin.stateSnapshot?.interests?.map((i, iIdx) => (
                    <View key={iIdx} style={styles.chipNeutral}>
                      <Text style={styles.chipTextNeutral}>#{i}</Text>
                    </View>
                  ))}
                </View>
              </View>

              {/* Privacy Controls Dashboard */}
              <View style={styles.sectionBox}>
                <Text style={styles.sectionHead}>Privacy & Inference Scopes:</Text>
                <View style={styles.prefRow}>
                  <Text style={styles.prefLabel}>Cross-Domain Graph Inference</Text>
                  <Text style={styles.prefVal}>
                    {twin.privacyControls?.allowCrossDomainInference ? 'ALLOWED' : 'OFF'}
                  </Text>
                </View>
                <View style={styles.prefRow}>
                  <Text style={styles.prefLabel}>Aggregated Metrics Only</Text>
                  <Text style={styles.prefVal}>
                    {twin.privacyControls?.shareAggregatedMetricsOnly ? 'ENFORCED' : 'OFF'}
                  </Text>
                </View>
                <View style={styles.prefRow}>
                  <Text style={styles.prefLabel}>Memory Retention Horizon</Text>
                  <Text style={styles.prefVal}>
                    {twin.privacyControls?.retainEventMemoryDays || 30} Days
                  </Text>
                </View>
              </View>

              {/* Action Buttons */}
              <View style={styles.actionRow}>
                <TouchableOpacity
                  style={styles.resetBtn}
                  onPress={() => handleResetTwin(twin.id)}
                >
                  <Ionicons name="refresh-outline" size={14} color="#EF4444" />
                  <Text style={styles.resetBtnText}>Purge & Reset Memory</Text>
                </TouchableOpacity>
              </View>
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
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
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
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  twinTypeBadge: {
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  twinTypeText: { color: '#6366F1', fontSize: 10, fontWeight: '700' },
  statusActive: { color: '#10B981', fontSize: 11, fontWeight: '700' },
  twinTitle: { fontSize: 16, fontWeight: '700', color: '#F8FAFC', marginBottom: 4 },
  twinDesc: { fontSize: 13, color: '#94A3B8', lineHeight: 18, marginBottom: 12 },
  sectionBox: { backgroundColor: '#0F172A', borderRadius: 10, padding: 12, marginBottom: 10 },
  sectionHead: { fontSize: 10, fontWeight: '700', color: '#94A3B8', marginBottom: 8 },
  chipWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#1E293B',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  chipText: { fontSize: 11, color: '#F1F5F9' },
  chipNeutral: { backgroundColor: '#1E293B', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  chipTextNeutral: { fontSize: 11, color: '#38BDF8' },
  prefRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  prefLabel: { fontSize: 12, color: '#CBD5E1' },
  prefVal: { fontSize: 11, fontWeight: '700', color: '#10B981' },
  actionRow: { marginTop: 4 },
  resetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  resetBtnText: { color: '#EF4444', fontSize: 11, fontWeight: '600' },
});
