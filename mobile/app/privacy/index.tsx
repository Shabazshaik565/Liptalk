import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Lock,
  Eye,
  Shield,
  Smartphone,
  Download,
  Trash2,
  ChevronRight,
  CheckCircle2,
} from 'lucide-react-native';
import { Header } from '../../src/components/common/Header';
import { Button } from '../../src/components/common/Button';
import { privacyApi } from '../../src/api/domain.api';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../../src/constants/theme';

export default function PrivacyCenterScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: settings, isLoading } = useQuery({
    queryKey: ['privacy', 'settings'],
    queryFn: () => privacyApi.getSettings(),
  });

  const [searchDiscoverable, setSearchDiscoverable] = useState(true);
  const [aiOptIn, setAiOptIn] = useState(true);
  const [activityStatus, setActivityStatus] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  const handleExportData = async () => {
    setIsExporting(true);
    try {
      const data = await privacyApi.exportData();
      Alert.alert(
        'Data Export Ready',
        'Your profile, needs, offers, and transaction records have been compiled into a secure JSON archive.',
      );
    } catch {
      Alert.alert('Export Error', 'Failed to generate data archive.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleDeactivate = () => {
    Alert.alert(
      'Deactivate Account',
      'Are you sure you want to schedule your LipTalk account for deactivation? Your active listings will be paused.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Deactivate',
          style: 'destructive',
          onPress: async () => {
            await privacyApi.deactivateAccount();
            Alert.alert('Account Deactivated', 'Your account has been safely deactivated.');
          },
        },
      ],
    );
  };

  return (
    <View style={styles.container}>
      <Header title="Privacy & Data Control" showBack />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Profile Visibility Controls */}
        <Text style={styles.sectionHeading}>DISCOVERY & VISIBILITY</Text>
        <View style={styles.settingCard}>
          <View style={styles.settingRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.settingTitle}>Search Engine & Directory Discoverability</Text>
              <Text style={styles.settingSub}>Allow verified founders and recruiters to find your profile</Text>
            </View>
            <Switch
              value={searchDiscoverable}
              onValueChange={setSearchDiscoverable}
              trackColor={{ false: COLORS.bgInput, true: COLORS.primary }}
              thumbColor="#FFF"
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.settingRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.settingTitle}>AI Semantic Recommendation Engine</Text>
              <Text style={styles.settingSub}>Participate in AI partner and deal matchmaking</Text>
            </View>
            <Switch
              value={aiOptIn}
              onValueChange={setAiOptIn}
              trackColor={{ false: COLORS.bgInput, true: COLORS.primary }}
              thumbColor="#FFF"
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.settingRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.settingTitle}>Real-time Activity & Presence</Text>
              <Text style={styles.settingSub}>Display online/in-call status to direct connections</Text>
            </View>
            <Switch
              value={activityStatus}
              onValueChange={setActivityStatus}
              trackColor={{ false: COLORS.bgInput, true: COLORS.primary }}
              thumbColor="#FFF"
            />
          </View>
        </View>

        {/* Active Sessions */}
        <Text style={styles.sectionHeading}>ACTIVE DEVICES & SESSIONS</Text>
        <View style={styles.deviceCard}>
          <View style={styles.deviceRow}>
            <Smartphone size={18} color={COLORS.accent} />
            <View style={{ flex: 1 }}>
              <Text style={styles.deviceName}>Mobile Client (Expo App)</Text>
              <Text style={styles.deviceSub}>Bangalore, India • Current Active Session</Text>
            </View>
            <CheckCircle2 size={16} color={COLORS.accent} />
          </View>
        </View>

        {/* Data Governance */}
        <Text style={styles.sectionHeading}>DATA RIGHTS & GOVERNANCE</Text>
        <TouchableOpacity style={styles.actionRow} onPress={handleExportData} disabled={isExporting}>
          <Download size={18} color={COLORS.primaryLight} />
          <View style={{ flex: 1 }}>
            <Text style={styles.actionTitle}>Export My Ecosystem Data</Text>
            <Text style={styles.actionSub}>Download full machine-readable JSON archive</Text>
          </View>
          <ChevronRight size={16} color={COLORS.textDim} />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.actionRow, { borderColor: 'rgba(239, 68, 68, 0.3)', marginTop: SPACING.sm }]} onPress={handleDeactivate}>
          <Trash2 size={18} color={COLORS.danger} />
          <View style={{ flex: 1 }}>
            <Text style={[styles.actionTitle, { color: COLORS.danger }]}>Deactivate or Delete Account</Text>
            <Text style={styles.actionSub}>Compliant with GDPR & data privacy frameworks</Text>
          </View>
          <ChevronRight size={16} color={COLORS.textDim} />
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgDark,
  },
  scrollContent: {
    padding: SPACING.lg,
    paddingBottom: SPACING.xxxl,
  },
  sectionHeading: {
    color: COLORS.textPrimary,
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.8,
    marginTop: SPACING.md,
    marginBottom: SPACING.sm,
  },
  settingCard: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.xl,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    gap: SPACING.md,
  },
  settingTitle: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '800',
  },
  settingSub: {
    color: COLORS.textDim,
    fontSize: 11,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 4,
  },
  deviceCard: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  deviceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  deviceName: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '800',
  },
  deviceSub: {
    color: COLORS.textDim,
    fontSize: 11,
    marginTop: 2,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: SPACING.md,
  },
  actionTitle: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '800',
  },
  actionSub: {
    color: COLORS.textDim,
    fontSize: 11,
    marginTop: 1,
  },
});
