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
import { adaptationApi } from '../../src/api/domain.api';
import { SecurityThreatItem } from '../../src/types';

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
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Continuous Security Hub</Text>
          <Text style={styles.headerSubtitle}>Threat Containment • Privacy Simulator • Data Lifecycle</Text>
        </View>
      </View>

      {loading ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color="#6366F1" />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Section: Live Contained Security Threats */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Continuous Threat Monitoring</Text>
            <View style={styles.safeBadge}>
              <Ionicons name="shield-checkmark" size={12} color="#10B981" />
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
                  Action: <Text style={{ color: '#10B981', fontWeight: '700' }}>{threat.automatedBoundedResponse?.actionTaken}</Text> on target {threat.automatedBoundedResponse?.targetId}
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
                    <Ionicons name="checkmark-circle-outline" size={14} color="#10B981" />
                    <Text style={styles.simText}>{item.impact}</Text>
                  </View>
                ))}
              </View>

              <View style={styles.simSection}>
                <Text style={styles.simHead}>Explicitly Prohibited Operations:</Text>
                {privacySim.prohibitedActions.map((action: string, idx: number) => (
                  <View key={idx} style={styles.simRow}>
                    <Ionicons name="close-circle-outline" size={14} color="#EF4444" />
                    <Text style={styles.simText}>{action}</Text>
                  </View>
                ))}
              </View>

              <View style={styles.simPolicyBox}>
                <Text style={styles.simPolicyText}>
                  <Text style={{ fontWeight: '700', color: '#38BDF8' }}>Revocation Behavior: </Text>
                  {privacySim.revocationBehavior}
                </Text>
              </View>

              <TouchableOpacity style={styles.verifyBtn} onPress={handleTestSimulation}>
                <Ionicons name="shield-outline" size={14} color="#FFFFFF" />
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
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    marginTop: 4,
  },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: '#F8FAFC' },
  safeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  safeBadgeText: { color: '#10B981', fontSize: 10, fontWeight: '700' },
  card: {
    backgroundColor: '#111827',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  threatTypeBadge: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  threatTypeText: { color: '#EF4444', fontSize: 10, fontWeight: '700' },
  statusContained: { color: '#10B981', fontSize: 11, fontWeight: '700' },
  cardTitle: { fontSize: 15, fontWeight: '700', color: '#F8FAFC', marginBottom: 4 },
  cardDesc: { fontSize: 12, color: '#94A3B8', lineHeight: 17, marginBottom: 10 },
  autoActionBox: { backgroundColor: '#0F172A', borderRadius: 8, padding: 10 },
  autoActionHeader: { fontSize: 10, fontWeight: '700', color: '#64748B', marginBottom: 2 },
  autoActionText: { fontSize: 11, color: '#CBD5E1' },
  simSection: { backgroundColor: '#0F172A', borderRadius: 8, padding: 10, marginBottom: 8 },
  simHead: { fontSize: 11, fontWeight: '700', color: '#94A3B8', marginBottom: 6 },
  simRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  simText: { fontSize: 11, color: '#E2E8F0', flex: 1 },
  simPolicyBox: {
    backgroundColor: 'rgba(56, 189, 248, 0.1)',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  simPolicyText: { fontSize: 11, color: '#BAE6FD', lineHeight: 15 },
  verifyBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#10B981',
    paddingVertical: 10,
    borderRadius: 8,
  },
  verifyBtnText: { color: '#FFFFFF', fontSize: 12, fontWeight: '700' },
  lifecycleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  lifecycleLbl: { fontSize: 12, color: '#CBD5E1' },
  lifecycleVal: { fontSize: 11, fontWeight: '700', color: '#38BDF8' },
});
