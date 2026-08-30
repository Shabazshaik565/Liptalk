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
import { ArrowLeft, Edit3, Users, ShieldCheck, ArrowRight, Sparkles, CheckCheck } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { coordinationApi } from '../../src/api/domain.api';
import { SharedWorkspaceItem, ProjectContributionItem, CreatorCollectiveItem } from '../../src/types';
import { COLORS, RADIUS, SPACING, SHADOWS } from '../../src/constants/theme';

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
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} activeOpacity={0.8}>
          <ArrowLeft size={20} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Collective Workspaces</Text>
          <Text style={styles.headerSubtitle}>Cross-Community & Creator Alliances</Text>
        </View>
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => Alert.alert('New Workspace', 'Create shared workspace dialog opened.')}
          activeOpacity={0.8}
        >
          <Edit3 size={18} color={COLORS.primaryLight} />
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
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
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
                          <Users size={12} color={COLORS.info} />
                          <Text style={styles.fedTagText}>{cid}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                )}

                {/* Members list */}
                <View style={styles.membersRow}>
                  <ShieldCheck size={16} color={COLORS.accent} />
                  <Text style={styles.membersText}>
                    {ws.members?.length || 2} Authorized Workspace Admins & Members
                  </Text>
                </View>

                <TouchableOpacity
                  style={styles.openBtn}
                  onPress={() => Alert.alert('Workspace Opened', `Opened collaborative canvas for ${ws.name}`)}
                  activeOpacity={0.85}
                >
                  <Text style={styles.openBtnText}>Open Shared Canvas</Text>
                  <ArrowRight size={16} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            ))}

          {activeTab === 'CONTRIBUTIONS' &&
            contributions.map((cb) => (
              <View key={cb.id} style={styles.card}>
                <View style={styles.cardHeader}>
                  <View style={[styles.badge, { backgroundColor: 'rgba(56, 189, 248, 0.15)', borderColor: 'rgba(56, 189, 248, 0.3)' }]}>
                    <Text style={[styles.badgeText, { color: COLORS.info }]}>{cb.category}</Text>
                  </View>
                  <View style={[styles.badge, { backgroundColor: 'rgba(16, 185, 129, 0.15)', borderColor: 'rgba(16, 185, 129, 0.3)' }]}>
                    <Text style={[styles.badgeText, { color: COLORS.accent }]}>v{cb.versionNumber} {cb.status}</Text>
                  </View>
                </View>

                <Text style={styles.cardTitle}>{cb.title}</Text>
                {cb.description && <Text style={styles.cardDesc}>{cb.description}</Text>}

                {cb.isAiAssisted && (
                  <View style={styles.aiTagRow}>
                    <Sparkles size={14} color={COLORS.primaryLight} />
                    <Text style={styles.aiTagText}>
                      AI-Assisted Contribution (Audited & Human-Verified)
                    </Text>
                  </View>
                )}

                <View style={styles.verifierRow}>
                  <CheckCheck size={16} color={COLORS.accent} />
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
                  <View style={[styles.badge, { backgroundColor: 'rgba(139, 92, 246, 0.15)', borderColor: 'rgba(139, 92, 246, 0.3)' }]}>
                    <Text style={[styles.badgeText, { color: COLORS.primaryLight }]}>{col.category}</Text>
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
                  style={[styles.openBtn, { backgroundColor: COLORS.primary }]}
                  onPress={() => Alert.alert('Collective Joined', `Subscribed to ${col.name}`)}
                  activeOpacity={0.85}
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
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: COLORS.bgInput,
    padding: 4,
    marginHorizontal: SPACING.lg,
    marginTop: 12,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  tabItem: { flex: 1, paddingVertical: 9, alignItems: 'center', borderRadius: RADIUS.sm },
  tabItemActive: { backgroundColor: COLORS.bgElevated },
  tabText: { fontSize: 11.5, fontWeight: '700', color: COLORS.textMuted },
  tabTextActive: { color: COLORS.primaryLight, fontWeight: '800' },
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
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  badge: {
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
  },
  badgeText: { color: COLORS.primaryLight, fontSize: 11, fontWeight: '800' },
  activeTag: { color: COLORS.accent, fontSize: 11, fontWeight: '700' },
  earningsText: { color: COLORS.accent, fontSize: 12, fontWeight: '800' },
  cardTitle: { fontSize: 16, fontWeight: '800', color: COLORS.textPrimary, marginBottom: 6 },
  cardDesc: { fontSize: 13, color: COLORS.textSecondary, lineHeight: 18, marginBottom: 12 },
  federationBox: { backgroundColor: COLORS.bgInput, borderRadius: RADIUS.md, padding: 10, marginBottom: 12, borderWidth: 1, borderColor: COLORS.borderLight },
  federationTitle: { fontSize: 11, fontWeight: '800', color: COLORS.primaryLight, marginBottom: 6, letterSpacing: 0.4 },
  tagWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  fedTag: {
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
  fedTagText: { fontSize: 11, color: COLORS.info, fontWeight: '600' },
  membersRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 14 },
  membersText: { fontSize: 12, color: COLORS.textSecondary },
  openBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.primary,
    paddingVertical: 11,
    borderRadius: RADIUS.md,
    ...SHADOWS.glowPrimary,
  },
  openBtnText: { color: '#FFFFFF', fontSize: 13, fontWeight: '800' },
  aiTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(139, 92, 246, 0.12)',
    padding: 8,
    borderRadius: 6,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.25)',
  },
  aiTagText: { fontSize: 12, color: '#D8B4FE', fontWeight: '600' },
  verifierRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  verifierText: { fontSize: 12, color: COLORS.textMuted },
  membersBox: { backgroundColor: COLORS.bgInput, borderRadius: RADIUS.md, padding: 10, marginBottom: 12, borderWidth: 1, borderColor: COLORS.borderLight },
  memberSplitRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 3 },
  memberIdText: { fontSize: 12, color: COLORS.textPrimary },
  splitValText: { fontSize: 12, color: COLORS.primaryLight, fontWeight: '800' },
  pricingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  subPriceLabel: { fontSize: 12, color: COLORS.textMuted },
  subPriceVal: { fontSize: 14, fontWeight: '800', color: COLORS.textPrimary },
});
