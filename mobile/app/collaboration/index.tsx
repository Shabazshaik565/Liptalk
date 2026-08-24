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
import { SharedWorkspaceItem, ProjectContributionItem, CreatorCollectiveItem } from '../../src/types';

export default function CollaborationScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'WORKSPACES' | 'CONTRIBUTIONS' | 'COLLECTIVES'>('WORKSPACES');
  const [workspaces, setWorkspaces] = useState<SharedWorkspaceItem[]>([]);
  const [contributions, setContributions] = useState<ProjectContributionItem[]>([]);
  const [collectives, setCollectives] = useState<CreatorCollectiveItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [ws, cb, col] = await Promise.all([
        coordinationApi.getWorkspaces(),
        coordinationApi.getContributions('proj_supply_01'),
        coordinationApi.getCreatorCollectives(),
      ]);
      setWorkspaces(ws);
      setContributions(cb);
      setCollectives(col);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Collective Workspaces</Text>
          <Text style={styles.headerSubtitle}>Cross-Community & Creator Alliances</Text>
        </View>
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => Alert.alert('New Workspace', 'Create shared workspace dialog opened.')}
        >
          <Ionicons name="create-outline" size={20} color="#6366F1" />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'WORKSPACES' && styles.tabItemActive]}
          onPress={() => setActiveTab('WORKSPACES')}
        >
          <Text style={[styles.tabText, activeTab === 'WORKSPACES' && styles.tabTextActive]}>
            Workspaces ({workspaces.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'CONTRIBUTIONS' && styles.tabItemActive]}
          onPress={() => setActiveTab('CONTRIBUTIONS')}
        >
          <Text style={[styles.tabText, activeTab === 'CONTRIBUTIONS' && styles.tabTextActive]}>
            Attributions ({contributions.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'COLLECTIVES' && styles.tabItemActive]}
          onPress={() => setActiveTab('COLLECTIVES')}
        >
          <Text style={[styles.tabText, activeTab === 'COLLECTIVES' && styles.tabTextActive]}>
            Collectives ({collectives.length})
          </Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color="#6366F1" />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {activeTab === 'WORKSPACES' &&
            workspaces.map((ws) => (
              <View key={ws.id} style={styles.card}>
                <View style={styles.cardHeader}>
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{ws.type}</Text>
                  </View>
                  <Text style={styles.activeTag}>● Synchronized</Text>
                </View>

                <Text style={styles.cardTitle}>{ws.name}</Text>
                <Text style={styles.cardDesc}>{ws.description}</Text>

                {/* Communities Federated */}
                {ws.participatingCommunityIds && (
                  <View style={styles.federationBox}>
                    <Text style={styles.federationTitle}>Federated Communities:</Text>
                    <View style={styles.tagWrap}>
                      {ws.participatingCommunityIds.map((cid, i) => (
                        <View key={i} style={styles.fedTag}>
                          <Ionicons name="people-circle-outline" size={14} color="#38BDF8" />
                          <Text style={styles.fedTagText}>{cid}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                )}

                {/* Members list */}
                <View style={styles.membersRow}>
                  <Ionicons name="shield-checkmark-outline" size={16} color="#10B981" />
                  <Text style={styles.membersText}>
                    {ws.members?.length || 2} Authorized Workspace Admins & Members
                  </Text>
                </View>

                <TouchableOpacity
                  style={styles.openBtn}
                  onPress={() => Alert.alert('Workspace Opened', `Opened collaborative canvas for ${ws.name}`)}
                >
                  <Text style={styles.openBtnText}>Open Shared Canvas</Text>
                  <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            ))}

          {activeTab === 'CONTRIBUTIONS' &&
            contributions.map((cb) => (
              <View key={cb.id} style={styles.card}>
                <View style={styles.cardHeader}>
                  <View style={[styles.badge, { backgroundColor: 'rgba(56, 189, 248, 0.15)' }]}>
                    <Text style={[styles.badgeText, { color: '#38BDF8' }]}>{cb.category}</Text>
                  </View>
                  <View style={[styles.badge, { backgroundColor: 'rgba(16, 185, 129, 0.15)' }]}>
                    <Text style={[styles.badgeText, { color: '#10B981' }]}>v{cb.versionNumber} {cb.status}</Text>
                  </View>
                </View>

                <Text style={styles.cardTitle}>{cb.title}</Text>
                {cb.description && <Text style={styles.cardDesc}>{cb.description}</Text>}

                {cb.isAiAssisted && (
                  <View style={styles.aiTagRow}>
                    <Ionicons name="sparkles" size={14} color="#A855F7" />
                    <Text style={styles.aiTagText}>
                      AI-Assisted Contribution (Audited & Human-Verified)
                    </Text>
                  </View>
                )}

                <View style={styles.verifierRow}>
                  <Ionicons name="checkmark-done" size={16} color="#10B981" />
                  <Text style={styles.verifierText}>
                    Verified by {cb.verifiedBy || 'Project Maintainer'}
                  </Text>
                </View>
              </View>
            ))}

          {activeTab === 'COLLECTIVES' &&
            collectives.map((col) => (
              <View key={col.id} style={styles.card}>
                <View style={styles.cardHeader}>
                  <View style={[styles.badge, { backgroundColor: 'rgba(168, 85, 247, 0.15)' }]}>
                    <Text style={[styles.badgeText, { color: '#A855F7' }]}>{col.category}</Text>
                  </View>
                  <Text style={styles.earningsText}>
                    ₹{(col.totalCollectiveEarnings / 1000).toFixed(0)}k Earned
                  </Text>
                </View>

                <Text style={styles.cardTitle}>{col.name}</Text>
                <Text style={styles.cardDesc}>{col.description}</Text>

                <View style={styles.membersBox}>
                  <Text style={styles.federationTitle}>Founding Creators & Splits:</Text>
                  {col.members?.map((m, idx) => (
                    <View key={idx} style={styles.memberSplitRow}>
                      <Text style={styles.memberIdText}>Creator {m.creatorId}</Text>
                      <Text style={styles.splitValText}>{m.revenueSplitPercentage}% Revenue Split</Text>
                    </View>
                  ))}
                </View>

                <View style={styles.pricingRow}>
                  <Text style={styles.subPriceLabel}>Collective Pass:</Text>
                  <Text style={styles.subPriceVal}>₹{col.sharedSubscriptionPrice}/mo</Text>
                </View>

                <TouchableOpacity
                  style={[styles.openBtn, { backgroundColor: '#A855F7' }]}
                  onPress={() => Alert.alert('Collective Joined', `Subscribed to ${col.name}`)}
                >
                  <Text style={styles.openBtnText}>Join Creator Collective</Text>
                </TouchableOpacity>
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
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#0F172A',
    padding: 4,
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 10,
  },
  tabItem: { flex: 1, paddingVertical: 9, alignItems: 'center', borderRadius: 8 },
  tabItemActive: { backgroundColor: '#1E293B' },
  tabText: { fontSize: 12, fontWeight: '600', color: '#94A3B8' },
  tabTextActive: { color: '#6366F1' },
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
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  badge: {
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: { color: '#6366F1', fontSize: 11, fontWeight: '700' },
  activeTag: { color: '#10B981', fontSize: 11, fontWeight: '600' },
  earningsText: { color: '#10B981', fontSize: 12, fontWeight: '700' },
  cardTitle: { fontSize: 16, fontWeight: '700', color: '#F8FAFC', marginBottom: 6 },
  cardDesc: { fontSize: 13, color: '#94A3B8', lineHeight: 18, marginBottom: 12 },
  federationBox: { backgroundColor: '#0F172A', borderRadius: 8, padding: 10, marginBottom: 12 },
  federationTitle: { fontSize: 11, fontWeight: '700', color: '#94A3B8', marginBottom: 6 },
  tagWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  fedTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#1E293B',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  fedTagText: { fontSize: 11, color: '#38BDF8', fontWeight: '500' },
  membersRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 14 },
  membersText: { fontSize: 12, color: '#CBD5E1' },
  openBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#6366F1',
    paddingVertical: 10,
    borderRadius: 8,
  },
  openBtnText: { color: '#FFFFFF', fontSize: 13, fontWeight: '700' },
  aiTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(168, 85, 247, 0.1)',
    padding: 8,
    borderRadius: 6,
    marginBottom: 10,
  },
  aiTagText: { fontSize: 12, color: '#D8B4FE', fontWeight: '500' },
  verifierRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  verifierText: { fontSize: 12, color: '#94A3B8' },
  membersBox: { backgroundColor: '#0F172A', borderRadius: 8, padding: 10, marginBottom: 12 },
  memberSplitRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 3 },
  memberIdText: { fontSize: 12, color: '#E2E8F0' },
  splitValText: { fontSize: 12, color: '#A855F7', fontWeight: '700' },
  pricingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  subPriceLabel: { fontSize: 12, color: '#94A3B8' },
  subPriceVal: { fontSize: 14, fontWeight: '700', color: '#F8FAFC' },
});
