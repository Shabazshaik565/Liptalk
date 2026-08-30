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
import { ArrowLeft, Lock, User, Palette, Code, Shield, XCircle } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { coordinationApi } from '../../src/api/domain.api';
import { PersonalVaultReport } from '../../src/types';
import { COLORS, RADIUS, SPACING, SHADOWS } from '../../src/constants/theme';

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

  const getPersonaIcon = (type: string, color: string) => {
    switch (type) {
      case 'PERSONAL':
        return <User size={16} color={color} />;
      case 'CREATOR':
        return <Palette size={16} color={color} />;
      case 'DEVELOPER':
        return <Code size={16} color={color} />;
      default:
        return <Shield size={16} color={color} />;
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} activeOpacity={0.8}>
          <ArrowLeft size={20} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Personal Data Vault</Text>
          <Text style={styles.headerSubtitle}>Scoped Identity & Access Auditing</Text>
        </View>
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => Alert.alert('Vault Encrypted', 'Personal data vault is isolated with AES-256 local key escrow.')}
          activeOpacity={0.8}
        >
          <Lock size={18} color={COLORS.accent} />
        </TouchableOpacity>
      </View>

      {loading || !vaultData ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
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
                    activeOpacity={0.82}
                  >
                    <View style={styles.personaHead}>
                      {getPersonaIcon(p.contextType, isActive ? COLORS.primaryLight : COLORS.textMuted)}
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
              <Text style={[styles.controlVal, { color: COLORS.danger }]}>DISABLED</Text>
            </View>
            <View style={[styles.controlRow, { borderBottomWidth: 0 }]}>
              <Text style={styles.controlLabel}>Biometric Audio Storage</Text>
              <Text style={[styles.controlVal, { color: COLORS.danger }]}>ZERO-RETENTION</Text>
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
                    activeOpacity={0.82}
                  >
                    <XCircle size={13} color={COLORS.danger} />
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
  cardSectionHeader: { fontSize: 16, fontWeight: '800', color: COLORS.textPrimary, marginBottom: 4 },
  cardDesc: { fontSize: 12.5, color: COLORS.textSecondary, lineHeight: 18, marginBottom: 12 },
  personaGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  personaChip: {
    width: '48%',
    backgroundColor: COLORS.bgInput,
    borderRadius: RADIUS.md,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  personaChipActive: { borderColor: COLORS.primary, backgroundColor: 'rgba(139, 92, 246, 0.12)' },
  personaHead: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 },
  personaType: { fontSize: 10, fontWeight: '800', color: COLORS.textMuted },
  personaTypeActive: { color: COLORS.primaryLight },
  personaName: { fontSize: 12, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 4 },
  personaRep: { fontSize: 10.5, color: COLORS.accent, fontWeight: '700' },
  controlRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  controlLabel: { fontSize: 12.5, color: COLORS.textSecondary },
  controlVal: { fontSize: 11.5, fontWeight: '800', color: COLORS.accent },
  logCard: {
    backgroundColor: COLORS.bgInput,
    borderRadius: RADIUS.md,
    padding: 12,
    marginBottom: 10,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.info,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  logHead: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  accessorIdText: { fontSize: 13, fontWeight: '800', color: COLORS.textPrimary },
  logStatus: { fontSize: 10, fontWeight: '800', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  statusAuth: { backgroundColor: 'rgba(16, 185, 129, 0.15)', color: COLORS.accent },
  statusRevoked: { backgroundColor: 'rgba(239, 68, 68, 0.15)', color: COLORS.danger },
  scopeText: { fontSize: 12, color: COLORS.info, fontWeight: '600', marginBottom: 2 },
  purposeText: { fontSize: 11, color: COLORS.textMuted, fontStyle: 'italic', marginBottom: 8 },
  revokeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.25)',
  },
  revokeText: { color: COLORS.danger, fontSize: 11, fontWeight: '700' },
});
