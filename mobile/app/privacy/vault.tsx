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
import { coordinationApi } from '../../src/api/domain.api';
import { PersonalVaultReport } from '../../src/types';

export default function PrivacyVaultScreen() {
  const router = useRouter();
  const [vaultData, setVaultData] = useState<PersonalVaultReport | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await coordinationApi.getPersonalVault();
      setVaultData(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleRevoke = async (logId: string) => {
    await coordinationApi.revokeDataAccess(logId);
    setVaultData((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        recentAccessEvents: prev.recentAccessEvents.map((evt) =>
          evt.id === logId ? { ...evt, status: 'REVOKED' } : evt
        ),
      };
    });
    Alert.alert('Scope Revoked', 'Third-party agent / application data access permission has been permanently revoked.');
  };

  const handleSwitchContext = async (contextType: string) => {
    await coordinationApi.switchIdentityContext(contextType);
    setVaultData((prev) => (prev ? { ...prev, activeContext: contextType as any } : null));
    Alert.alert('Identity Context Switched', `Active Persona changed to: [${contextType}]. Permissions scoped.`);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Personal Data Vault</Text>
          <Text style={styles.headerSubtitle}>Scoped Identity & Access Auditing</Text>
        </View>
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => Alert.alert('Vault Encrypted', 'Personal data vault is isolated with AES-256 local key escrow.')}
        >
          <Ionicons name="lock-closed" size={18} color="#10B981" />
        </TouchableOpacity>
      </View>

      {loading || !vaultData ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color="#6366F1" />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Identity Context Switcher Card */}
          <View style={styles.card}>
            <Text style={styles.cardSectionHeader}>Active Identity Persona</Text>
            <Text style={styles.cardDesc}>
              Switch contexts to scope permissions between personal, creator, developer, or community duties.
            </Text>

            <View style={styles.personaGrid}>
              {vaultData.availablePersonas?.map((p: any) => {
                const isActive = vaultData.activeContext === p.contextType;
                return (
                  <TouchableOpacity
                    key={p.contextType}
                    style={[styles.personaChip, isActive && styles.personaChipActive]}
                    onPress={() => handleSwitchContext(p.contextType)}
                  >
                    <View style={styles.personaHead}>
                      <Ionicons
                        name={
                          p.contextType === 'PERSONAL'
                            ? 'person-outline'
                            : p.contextType === 'CREATOR'
                            ? 'color-palette-outline'
                            : p.contextType === 'DEVELOPER'
                            ? 'code-slash-outline'
                            : 'shield-outline'
                        }
                        size={16}
                        color={isActive ? '#6366F1' : '#94A3B8'}
                      />
                      <Text style={[styles.personaType, isActive && styles.personaTypeActive]}>
                        {p.contextType}
                      </Text>
                    </View>
                    <Text style={styles.personaName} numberOfLines={1}>
                      {p.entityName}
                    </Text>
                    <Text style={styles.personaRep}>Trust Score: {p.reputationScore}/100</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Privacy Controls Dashboard */}
          <View style={styles.card}>
            <Text style={styles.cardSectionHeader}>Privacy-Preserving Telemetry</Text>
            <View style={styles.controlRow}>
              <Text style={styles.controlLabel}>Proactive Intelligence Feed</Text>
              <Text style={styles.controlVal}>ACTIVE</Text>
            </View>
            <View style={styles.controlRow}>
              <Text style={styles.controlLabel}>AI Working Memory Retained</Text>
              <Text style={styles.controlVal}>{vaultData.retainedMemoriesCount} items</Text>
            </View>
            <View style={styles.controlRow}>
              <Text style={styles.controlLabel}>Third-Party Tracking Sharing</Text>
              <Text style={[styles.controlVal, { color: '#EF4444' }]}>DISABLED</Text>
            </View>
            <View style={styles.controlRow}>
              <Text style={styles.controlLabel}>Biometric Audio Storage</Text>
              <Text style={[styles.controlVal, { color: '#EF4444' }]}>ZERO-RETENTION</Text>
            </View>
          </View>

          {/* Auditable Data Access Log */}
          <View style={styles.card}>
            <Text style={styles.cardSectionHeader}>Auditable Access Log</Text>
            <Text style={styles.cardDesc}>
              Inspect every AI agent or developer application that accessed your data scopes.
            </Text>

            {vaultData.recentAccessEvents?.map((evt) => (
              <View key={evt.id} style={styles.logCard}>
                <View style={styles.logHead}>
                  <Text style={styles.accessorIdText}>{evt.accessorId}</Text>
                  <Text
                    style={[
                      styles.logStatus,
                      evt.status === 'AUTHORIZED' ? styles.statusAuth : styles.statusRevoked,
                    ]}
                  >
                    {evt.status}
                  </Text>
                </View>
                <Text style={styles.scopeText}>Scope: {evt.dataScopeAccessed}</Text>
                {evt.purpose && <Text style={styles.purposeText}>Purpose: "{evt.purpose}"</Text>}

                {evt.status === 'AUTHORIZED' && evt.canRevoke && (
                  <TouchableOpacity
                    style={styles.revokeBtn}
                    onPress={() => handleRevoke(evt.id)}
                  >
                    <Ionicons name="close-circle-outline" size={14} color="#EF4444" />
                    <Text style={styles.revokeText}>Revoke Permission</Text>
                  </TouchableOpacity>
                )}
              </View>
            ))}
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
  cardSectionHeader: { fontSize: 16, fontWeight: '700', color: '#F8FAFC', marginBottom: 4 },
  cardDesc: { fontSize: 13, color: '#94A3B8', lineHeight: 18, marginBottom: 12 },
  personaGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  personaChip: {
    width: '48%',
    backgroundColor: '#0F172A',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  personaChipActive: { borderColor: '#6366F1', backgroundColor: 'rgba(99, 102, 241, 0.1)' },
  personaHead: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 },
  personaType: { fontSize: 10, fontWeight: '700', color: '#94A3B8' },
  personaTypeActive: { color: '#6366F1' },
  personaName: { fontSize: 12, fontWeight: '600', color: '#F1F5F9', marginBottom: 4 },
  personaRep: { fontSize: 10, color: '#10B981' },
  controlRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  controlLabel: { fontSize: 13, color: '#CBD5E1' },
  controlVal: { fontSize: 12, fontWeight: '700', color: '#10B981' },
  logCard: {
    backgroundColor: '#0F172A',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    borderLeftWidth: 3,
    borderLeftColor: '#38BDF8',
  },
  logHead: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  accessorIdText: { fontSize: 13, fontWeight: '700', color: '#F1F5F9' },
  logStatus: { fontSize: 10, fontWeight: '700', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  statusAuth: { backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#10B981' },
  statusRevoked: { backgroundColor: 'rgba(239, 68, 68, 0.15)', color: '#EF4444' },
  scopeText: { fontSize: 12, color: '#38BDF8', fontWeight: '500', marginBottom: 2 },
  purposeText: { fontSize: 11, color: '#94A3B8', fontStyle: 'italic', marginBottom: 8 },
  revokeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  revokeText: { color: '#EF4444', fontSize: 11, fontWeight: '600' },
});
