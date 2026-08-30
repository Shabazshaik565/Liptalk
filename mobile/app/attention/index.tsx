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
import { ArrowLeft, Moon, Mail, Star } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { adaptationApi } from '../../src/api/domain.api';
import { AdaptiveUxProfileItem } from '../../src/types';
import { COLORS, RADIUS, SPACING, SHADOWS } from '../../src/constants/theme';

export default function AttentionCenterScreen() {
  const router = useRouter();
  const [uxProfile, setUxProfile] = useState<AdaptiveUxProfileItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await adaptationApi.getUxProfile();
      setUxProfile(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFocus = async () => {
    if (!uxProfile) return;
    const nextState = !uxProfile.attentionPreferences.focusModeActive;
    await adaptationApi.toggleFocusMode(nextState);
    setUxProfile({
      ...uxProfile,
      attentionPreferences: {
        ...uxProfile.attentionPreferences,
        focusModeActive: nextState,
      },
    });
    Alert.alert(
      nextState ? 'Focus Mode Engaged' : 'Focus Mode Disengaged',
      nextState
        ? 'Non-critical notifications suppressed and batched into your next digest.'
        : 'Normal notification delivery resumed.'
    );
  };

  const handleSelectProfileTier = async (tier: any) => {
    if (!uxProfile) return;
    await adaptationApi.updateUxProfile({ activeProfile: tier });
    setUxProfile({ ...uxProfile, activeProfile: tier });
    Alert.alert('UX Profile Updated', `Interface preferences tailored for ${tier}.`);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} activeOpacity={0.8}>
          <ArrowLeft size={20} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Attention & UX Profile</Text>
          <Text style={styles.headerSubtitle}>User-Centric Attention Management • Quiet Hours</Text>
        </View>
      </View>

      {loading || !uxProfile ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Focus Mode Quick Toggle */}
          <View style={styles.focusCard}>
            <View style={styles.focusRow}>
              <View style={{ flex: 1, paddingRight: SPACING.md }}>
                <Text style={styles.focusTitle}>Focus Mode</Text>
                <Text style={styles.focusDesc}>
                  Silence non-essential notification badges and batch alerts into digests.
                </Text>
              </View>
              <Switch
                value={uxProfile.attentionPreferences.focusModeActive}
                onValueChange={handleToggleFocus}
                trackColor={{ false: COLORS.bgElevated, true: COLORS.warning }}
                thumbColor={uxProfile.attentionPreferences.focusModeActive ? '#FFFFFF' : COLORS.textMuted}
              />
            </View>
          </View>

          {/* Section: User Experience Profile */}
          <View style={styles.sectionBox}>
            <Text style={styles.sectionTitle}>User Experience Profile Mode</Text>
            <Text style={styles.sectionDesc}>
              Select your persona mode to customize default dashboard shortcuts.
            </Text>

            <View style={styles.tierGrid}>
              {['STANDARD', 'POWER_USER', 'CREATOR', 'DEVELOPER', 'COMMUNITY_MANAGER'].map((tier) => (
                <TouchableOpacity
                  key={tier}
                  style={[
                    styles.tierBtn,
                    uxProfile.activeProfile === tier && styles.tierBtnActive,
                  ]}
                  onPress={() => handleSelectProfileTier(tier)}
                  activeOpacity={0.82}
                >
                  <Text
                    style={[
                      styles.tierText,
                      uxProfile.activeProfile === tier && styles.tierTextActive,
                    ]}
                  >
                    {tier.replace(/_/g, ' ')}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Section: Attention Controls */}
          <View style={styles.sectionBox}>
            <Text style={styles.sectionTitle}>Attention & Batching Preferences</Text>

            <View style={styles.settingRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.settingLabel}>Smart Notification Batching</Text>
                <Text style={styles.settingSub}>Batch low-urgency notifications every 30m</Text>
              </View>
              <Text style={styles.settingVal}>
                {uxProfile.attentionPreferences.smartNotificationBatching ? 'ON' : 'OFF'}
              </Text>
            </View>

            <View style={styles.settingRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.settingLabel}>Quiet Hours Window</Text>
                <Text style={styles.settingSub}>
                  {uxProfile.attentionPreferences.quietHoursStart} - {uxProfile.attentionPreferences.quietHoursEnd}
                </Text>
              </View>
              <Moon size={18} color={COLORS.info} />
            </View>

            <View style={[styles.settingRow, { borderBottomWidth: 0 }]}>
              <View style={{ flex: 1 }}>
                <Text style={styles.settingLabel}>Personal Digest Frequency</Text>
                <Text style={styles.settingSub}>
                  {uxProfile.attentionPreferences.digestModeFrequency?.replace(/_/g, ' ')}
                </Text>
              </View>
              <Mail size={18} color={COLORS.accent} />
            </View>
          </View>

          {/* Section: Adaptive Navigation Priority */}
          <View style={styles.sectionBox}>
            <Text style={styles.sectionTitle}>Frequently Used Shortcut Order</Text>
            <Text style={styles.sectionDesc}>
              Adapts dynamically to your highest frequency workflows without hiding security controls.
            </Text>
            <View style={styles.tagWrap}>
              {uxProfile.frequentToolsPriority.map((tool, idx) => (
                <View key={idx} style={styles.tag}>
                  <Star size={12} color={COLORS.warning} />
                  <Text style={styles.tagText}>{tool}</Text>
                </View>
              ))}
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
  focusCard: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
  },
  focusRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  focusTitle: { fontSize: 16, fontWeight: '800', color: COLORS.textPrimary, marginBottom: 2 },
  focusDesc: { fontSize: 12, color: COLORS.textSecondary, lineHeight: 16 },
  sectionBox: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
  },
  sectionTitle: { fontSize: 15, fontWeight: '800', color: COLORS.textPrimary, marginBottom: 4 },
  sectionDesc: { fontSize: 12, color: COLORS.textMuted, lineHeight: 16, marginBottom: 12 },
  tierGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tierBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.bgInput,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  tierBtnActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primaryLight,
    ...SHADOWS.glowPrimary,
  },
  tierText: { fontSize: 11, fontWeight: '700', color: COLORS.textMuted },
  tierTextActive: { color: '#FFFFFF', fontWeight: '800' },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  settingLabel: { fontSize: 13, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 2 },
  settingSub: { fontSize: 11, color: COLORS.textMuted },
  settingVal: { fontSize: 11, fontWeight: '800', color: COLORS.accent },
  tagWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 4 },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: COLORS.bgInput,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  tagText: { color: COLORS.textSecondary, fontSize: 11, fontWeight: '600' },
});
