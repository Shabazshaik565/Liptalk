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
import { ArrowLeft, ShieldCheck, Flag, RotateCcw } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { intelligenceApi } from '../../src/api/domain.api';
import { DigitalTwinItem } from '../../src/types';
import { COLORS, RADIUS, SPACING, SHADOWS } from '../../src/constants/theme';

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
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} activeOpacity={0.8}>
          <ArrowLeft size={20} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Digital Twins Control</Text>
          <Text style={styles.headerSubtitle}>User-Controlled Cognitive Representation</Text>
        </View>
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => Alert.alert('Privacy Guard', 'Digital Twins are strictly controlled by you and never form unrestricted psychological profiles.')}
          activeOpacity={0.8}
        >
          <ShieldCheck size={18} color={COLORS.accent} />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
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
                      <Flag size={12} color={COLORS.primaryLight} />
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
                <View style={[styles.prefRow, { borderBottomWidth: 0 }]}>
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
                  activeOpacity={0.82}
                >
                  <RotateCcw size={13} color={COLORS.danger} />
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
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
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
  twinTypeBadge: {
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
  },
  twinTypeText: { color: COLORS.primaryLight, fontSize: 10, fontWeight: '800' },
  statusActive: { color: COLORS.accent, fontSize: 11, fontWeight: '800' },
  twinTitle: { fontSize: 16, fontWeight: '800', color: COLORS.textPrimary, marginBottom: 4 },
  twinDesc: { fontSize: 13, color: COLORS.textSecondary, lineHeight: 18, marginBottom: 12 },
  sectionBox: { backgroundColor: COLORS.bgInput, borderRadius: RADIUS.md, padding: 12, marginBottom: 10, borderWidth: 1, borderColor: COLORS.borderLight },
  sectionHead: { fontSize: 10, fontWeight: '800', color: COLORS.primaryLight, marginBottom: 8, letterSpacing: 0.4 },
  chipWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  chip: {
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
  chipText: { fontSize: 11, color: COLORS.textPrimary, fontWeight: '600' },
  chipNeutral: {
    backgroundColor: COLORS.bgElevated,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  chipTextNeutral: { fontSize: 11, color: COLORS.info, fontWeight: '600' },
  prefRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  prefLabel: { fontSize: 12, color: COLORS.textSecondary },
  prefVal: { fontSize: 11, fontWeight: '800', color: COLORS.accent },
  actionRow: { marginTop: 4 },
  resetBtn: {
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
  resetBtnText: { color: COLORS.danger, fontSize: 11, fontWeight: '700' },
});
