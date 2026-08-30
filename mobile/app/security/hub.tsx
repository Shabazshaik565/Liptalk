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
import { ArrowLeft, ShieldCheck, CheckCircle2, XCircle, Shield } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { adaptationApi } from '../../src/api/domain.api';
import { SecurityThreatItem } from '../../src/types';
import { COLORS, RADIUS, SPACING, SHADOWS } from '../../src/constants/theme';

export default function SecurityHubScreen() {
  const router = useRouter();
  const [threats, setThreats] = useState<SecurityThreatItem[]>([]);
  const [privacySim, setPrivacySim] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [thList, pSim] = await Promise.all([
        adaptationApi.getSecurityThreats(),
        adaptationApi.simulatePrivacy('Regional AgriFlow Logistics Integration', [
          'projects.read',
          'knowledge.search',
        ]),
      ]);
      setThreats(thList);
      setPrivacySim(pSim);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleTestSimulation = () => {
    Alert.alert(
      'Privacy Scope Verification',
      'The requested integration cannot access private chats, cannot trigger payments, and retains zero data after session termination.'
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
          <Text style={styles.headerTitle}>Continuous Security Hub</Text>
          <Text style={styles.headerSubtitle}>Threat Containment • Privacy Simulator • Data Lifecycle</Text>
        </View>
      </View>

      {loading ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Section: Live Contained Security Threats */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Continuous Threat Monitoring</Text>
            <View style={styles.safeBadge}>
              <ShieldCheck size={12} color={COLORS.accent} />
              <Text style={styles.safeBadgeText}>Auto-Contained</Text>
            </View>
          </View>

          {threats.map((threat) => (
            <View key={threat.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.threatTypeBadge}>
                  <Text style={styles.threatTypeText}>{threat.threatType.replace(/_/g, ' ')}</Text>
                </View>
                <Text style={styles.statusContained}>● {threat.status.replace(/_/g, ' ')}</Text>
              </View>

              <Text style={styles.cardTitle}>{threat.title}</Text>
              <Text style={styles.cardDesc}>{threat.description}</Text>

              <View style={styles.autoActionBox}>
                <Text style={styles.autoActionHeader}>Bounded Automated Response Enacted:</Text>
                <Text style={styles.autoActionText}>
                  Action: <Text style={{ color: COLORS.accent, fontWeight: '800' }}>{threat.automatedBoundedResponse?.actionTaken}</Text> on target {threat.automatedBoundedResponse?.targetId}
                </Text>
              </View>
            </View>
          ))}

          {/* Section: Privacy Simulator */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Privacy Scope Simulator</Text>
          </View>

          {privacySim && (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>{privacySim.targetApp}</Text>
              <Text style={styles.cardDesc}>
                Simulating data access impact before granting third-party integration authorization.
              </Text>

              <View style={styles.simSection}>
                <Text style={styles.simHead}>Data Accessible Under Scopes:</Text>
                {privacySim.dataAccessedSummary.map((item: any, idx: number) => (
                  <View key={idx} style={styles.simRow}>
                    <CheckCircle2 size={13} color={COLORS.accent} />
                    <Text style={styles.simText}>{item.impact}</Text>
                  </View>
                ))}
              </View>

              <View style={styles.simSection}>
                <Text style={styles.simHead}>Explicitly Prohibited Operations:</Text>
                {privacySim.prohibitedActions.map((action: string, idx: number) => (
                  <View key={idx} style={styles.simRow}>
                    <XCircle size={13} color={COLORS.danger} />
                    <Text style={styles.simText}>{action}</Text>
                  </View>
                ))}
              </View>

              <View style={styles.simPolicyBox}>
                <Text style={styles.simPolicyText}>
                  <Text style={{ fontWeight: '800', color: COLORS.info }}>Revocation Behavior: </Text>
                  {privacySim.revocationBehavior}
                </Text>
              </View>

              <TouchableOpacity style={styles.verifyBtn} onPress={handleTestSimulation} activeOpacity={0.85}>
                <Shield size={14} color="#000000" />
                <Text style={styles.verifyBtnText}>Confirm Privacy Boundary</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Section: Data Lifecycle Rules */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Data Lifecycle & Auto-Purge Horizon</Text>
          </View>

          <View style={styles.card}>
            <View style={styles.lifecycleRow}>
              <Text style={styles.lifecycleLbl}>Agent Execution Telemetry</Text>
              <Text style={styles.lifecycleVal}>Auto-Purge 30d</Text>
            </View>
            <View style={styles.lifecycleRow}>
              <Text style={styles.lifecycleLbl}>Voice Session Audio Buffer</Text>
              <Text style={styles.lifecycleVal}>Zero Retention (0d)</Text>
            </View>
            <View style={[styles.lifecycleRow, { borderBottomWidth: 0 }]}>
              <Text style={styles.lifecycleLbl}>Prompt Minimization Records</Text>
              <Text style={styles.lifecycleVal}>Anonymized (14d)</Text>
            </View>
          </View>
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
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    marginTop: 6,
  },
  sectionTitle: { fontSize: 14, fontWeight: '800', color: COLORS.textPrimary },
  safeBadge: {
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
  safeBadgeText: { color: COLORS.accent, fontSize: 10, fontWeight: '800' },
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
  threatTypeBadge: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  threatTypeText: { color: COLORS.danger, fontSize: 10, fontWeight: '800' },
  statusContained: { color: COLORS.accent, fontSize: 11, fontWeight: '800' },
  cardTitle: { fontSize: 15, fontWeight: '800', color: COLORS.textPrimary, marginBottom: 4 },
  cardDesc: { fontSize: 12, color: COLORS.textSecondary, lineHeight: 17, marginBottom: 10 },
  autoActionBox: { backgroundColor: COLORS.bgInput, borderRadius: RADIUS.md, padding: 10, borderWidth: 1, borderColor: COLORS.borderLight },
  autoActionHeader: { fontSize: 10, fontWeight: '800', color: COLORS.primaryLight, marginBottom: 3, letterSpacing: 0.4 },
  autoActionText: { fontSize: 11.5, color: COLORS.textSecondary },
  simSection: { backgroundColor: COLORS.bgInput, borderRadius: RADIUS.md, padding: 10, marginBottom: 8, borderWidth: 1, borderColor: COLORS.borderLight },
  simHead: { fontSize: 11, fontWeight: '800', color: COLORS.primaryLight, marginBottom: 6, letterSpacing: 0.4 },
  simRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  simText: { fontSize: 11.5, color: COLORS.textSecondary, flex: 1 },
  simPolicyBox: {
    backgroundColor: 'rgba(56, 189, 248, 0.1)',
    borderRadius: RADIUS.md,
    padding: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.25)',
  },
  simPolicyText: { fontSize: 11.5, color: '#BAE6FD', lineHeight: 15 },
  verifyBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.accent,
    paddingVertical: 11,
    borderRadius: RADIUS.md,
    ...SHADOWS.glowAccent,
  },
  verifyBtnText: { color: '#000000', fontSize: 12.5, fontWeight: '900' },
  lifecycleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  lifecycleLbl: { fontSize: 12.5, color: COLORS.textSecondary },
  lifecycleVal: { fontSize: 11.5, fontWeight: '800', color: COLORS.info },
});
