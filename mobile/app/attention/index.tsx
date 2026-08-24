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
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { adaptationApi } from '../../src/api/domain.api';
import { AdaptiveUxProfileItem } from '../../src/types';

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
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Attention & UX Profile</Text>
          <Text style={styles.headerSubtitle}>User-Centric Attention Management • Quiet Hours</Text>
        </View>
      </View>

      {loading || !uxProfile ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color="#6366F1" />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Focus Mode Quick Toggle */}
          <View style={styles.focusCard}>
            <View style={styles.focusRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.focusTitle}>Focus Mode</Text>
                <Text style={styles.focusDesc}>
                  Silence non-essential notification badges and batch alerts into digests.
                </Text>
              </View>
              <Switch
                value={uxProfile.attentionPreferences.focusModeActive}
                onValueChange={handleToggleFocus}
                trackColor={{ false: '#1E293B', true: '#F59E0B' }}
                thumbColor={uxProfile.attentionPreferences.focusModeActive ? '#FFFFFF' : '#94A3B8'}
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
              <Ionicons name="moon-outline" size={18} color="#38BDF8" />
            </View>

            <View style={[styles.settingRow, { borderBottomWidth: 0 }]}>
              <View style={{ flex: 1 }}>
                <Text style={styles.settingLabel}>Personal Digest Frequency</Text>
                <Text style={styles.settingSub}>
                  {uxProfile.attentionPreferences.digestModeFrequency?.replace(/_/g, ' ')}
                </Text>
              </View>
              <Ionicons name="mail-unread-outline" size={18} color="#10B981" />
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
                  <Ionicons name="star-outline" size={12} color="#F59E0B" />
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
  focusCard: {
    backgroundColor: '#111827',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  focusRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  focusTitle: { fontSize: 16, fontWeight: '700', color: '#F8FAFC', marginBottom: 2 },
  focusDesc: { fontSize: 12, color: '#94A3B8', lineHeight: 16, maxWidth: '85%' },
  sectionBox: {
    backgroundColor: '#111827',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: '#F8FAFC', marginBottom: 4 },
  sectionDesc: { fontSize: 12, color: '#94A3B8', lineHeight: 16, marginBottom: 12 },
  tierGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tierBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  tierBtnActive: { backgroundColor: '#6366F1', borderColor: '#6366F1' },
  tierText: { fontSize: 11, fontWeight: '600', color: '#94A3B8' },
  tierTextActive: { color: '#FFFFFF' },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  settingLabel: { fontSize: 13, fontWeight: '600', color: '#F1F5F9', marginBottom: 2 },
  settingSub: { fontSize: 11, color: '#94A3B8' },
  settingVal: { fontSize: 11, fontWeight: '700', color: '#10B981' },
  tagWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 4 },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#0F172A',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  tagText: { color: '#CBD5E1', fontSize: 11 },
});
