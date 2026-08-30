import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Modal,
  Alert,
} from 'react-native';
import { ArrowLeft, Plus, Flag, Globe, CheckSquare, CheckCircle2, Circle, Users, Heart, MapPin } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { coordinationApi } from '../../src/api/domain.api';
import { GlobalGoalItem, GlobalInitiativeItem } from '../../src/types';
import { COLORS, RADIUS, SPACING, SHADOWS } from '../../src/constants/theme';

export default function GoalsScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'GOALS' | 'INITIATIVES'>('GOALS');
  const [goals, setGoals] = useState<GlobalGoalItem[]>([]);
  const [initiatives, setInitiatives] = useState<GlobalInitiativeItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Create Goal Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newScope, setNewScope] = useState<'COMMUNITY' | 'CREATOR' | 'ORGANIZATION' | 'INDIVIDUAL'>('COMMUNITY');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [g, i] = await Promise.all([
        coordinationApi.getGoals(),
        coordinationApi.getInitiatives(),
      ]);
      setGoals(g);
      setInitiatives(i);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleMilestone = async (goalId: string, milestoneId: string) => {
    await coordinationApi.toggleMilestone(milestoneId);
    setGoals((prev) =>
      prev.map((g) => {
        if (g.id !== goalId) return g;
        const updatedMilestones = g.milestones?.map((m) =>
          m.id === milestoneId ? { ...m, isCompleted: !m.isCompleted } : m
        );
        const completedCount = updatedMilestones?.filter((m) => m.isCompleted).length || 0;
        const total = updatedMilestones?.length || 1;
        return {
          ...g,
          milestones: updatedMilestones,
          progressPercent: Math.round((completedCount / total) * 100),
        };
      })
    );
  };

  const handleCreateGoal = async () => {
    if (!newTitle.trim()) {
      Alert.alert('Required', 'Please enter a goal title.');
      return;
    }
    const created = await coordinationApi.createGoal({
      title: newTitle,
      description: newDescription,
      scope: newScope,
      objectives: ['Establish milestones and resource map', 'Onboard community contributors'],
    });
    setGoals([created, ...goals]);
    setShowCreateModal(false);
    setNewTitle('');
    setNewDescription('');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} activeOpacity={0.8}>
          <ArrowLeft size={20} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Global Goals & Initiatives</Text>
          <Text style={styles.headerSubtitle}>Collective Coordination Layer</Text>
        </View>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => setShowCreateModal(true)}
          activeOpacity={0.8}
        >
          <Plus size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Segmented Tab */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'GOALS' && styles.tabItemActive]}
          onPress={() => setActiveTab('GOALS')}
          activeOpacity={0.82}
        >
          <Flag
            size={15}
            color={activeTab === 'GOALS' ? COLORS.primaryLight : COLORS.textMuted}
          />
          <Text
            style={[styles.tabText, activeTab === 'GOALS' && styles.tabTextActive]}
          >
            Active Goals ({goals.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'INITIATIVES' && styles.tabItemActive]}
          onPress={() => setActiveTab('INITIATIVES')}
          activeOpacity={0.82}
        >
          <Globe
            size={15}
            color={activeTab === 'INITIATIVES' ? COLORS.primaryLight : COLORS.textMuted}
          />
          <Text
            style={[
              styles.tabText,
              activeTab === 'INITIATIVES' && styles.tabTextActive,
            ]}
          >
            Public Initiatives ({initiatives.length})
          </Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Synchronizing global network...</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {activeTab === 'GOALS' ? (
            goals.map((g) => (
              <View key={g.id} style={styles.card}>
                <View style={styles.cardHeader}>
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{g.scope}</Text>
                  </View>
                  <View style={styles.statusBadge}>
                    <Text style={styles.statusText}>{g.status}</Text>
                  </View>
                </View>

                <Text style={styles.cardTitle}>{g.title}</Text>
                <Text style={styles.cardDesc}>{g.description}</Text>

                {/* Progress Bar */}
                <View style={styles.progressContainer}>
                  <View style={styles.progressHeader}>
                    <Text style={styles.progressLabel}>Overall Completion</Text>
                    <Text style={styles.progressValue}>{g.progressPercent}%</Text>
                  </View>
                  <View style={styles.progressBarBg}>
                    <View
                      style={[
                        styles.progressBarFill,
                        { width: `${Math.min(g.progressPercent, 100)}%` },
                      ]}
                    />
                  </View>
                </View>

                {/* Objectives */}
                {g.objectives && g.objectives.length > 0 && (
                  <View style={styles.sectionBox}>
                    <Text style={styles.sectionTitle}>Key Objectives</Text>
                    {g.objectives.map((obj, idx) => (
                      <View key={idx} style={styles.bulletRow}>
                        <CheckSquare size={13} color={COLORS.primaryLight} />
                        <Text style={styles.bulletText}>{obj}</Text>
                      </View>
                    ))}
                  </View>
                )}

                {/* Milestones */}
                {g.milestones && g.milestones.length > 0 && (
                  <View style={styles.sectionBox}>
                    <Text style={styles.sectionTitle}>Milestone Deliverables</Text>
                    {g.milestones.map((m) => (
                      <TouchableOpacity
                        key={m.id}
                        style={styles.milestoneRow}
                        onPress={() => handleToggleMilestone(g.id, m.id)}
                        activeOpacity={0.8}
                      >
                        {m.isCompleted ? (
                          <CheckCircle2 size={18} color={COLORS.accent} />
                        ) : (
                          <Circle size={18} color={COLORS.textMuted} />
                        )}
                        <View style={styles.milestoneInfo}>
                          <Text
                            style={[
                              styles.milestoneTitle,
                              m.isCompleted && styles.milestoneCompleted,
                            ]}
                          >
                            {m.title}
                          </Text>
                          {m.dueDate && (
                            <Text style={styles.milestoneDue}>Due: {m.dueDate}</Text>
                          )}
                        </View>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}

                {/* Participants Footer */}
                <View style={styles.cardFooter}>
                  <View style={styles.avatarStack}>
                    <Users size={15} color={COLORS.textMuted} />
                    <Text style={styles.participantsCount}>
                      {g.participants?.length || 2} Contributors active
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.joinBtn}
                    onPress={() => {
                      coordinationApi.joinGoal(g.id);
                      Alert.alert('Joined', 'You joined this global goal as a Contributor.');
                    }}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.joinBtnText}>Contribute</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          ) : (
            initiatives.map((init) => (
              <View key={init.id} style={styles.card}>
                <View style={styles.cardHeader}>
                  <View style={[styles.badge, { backgroundColor: 'rgba(16, 185, 129, 0.15)', borderColor: 'rgba(16, 185, 129, 0.3)' }]}>
                    <Text style={[styles.badgeText, { color: COLORS.accent }]}>{init.category}</Text>
                  </View>
                  <View style={styles.supportersRow}>
                    <Heart size={12} color={COLORS.danger} />
                    <Text style={styles.supportersBadge}>{init.supportersCount} Backers</Text>
                  </View>
                </View>

                <Text style={styles.cardTitle}>{init.title}</Text>
                <Text style={styles.cardDesc}>{init.mission}</Text>

                {/* Funding Progress */}
                <View style={styles.fundingBox}>
                  <View style={styles.progressHeader}>
                    <Text style={styles.progressLabel}>Pledged Capital Pool</Text>
                    <Text style={styles.progressValue}>
                      ₹{(init.fundingRaisedAmount / 100000).toFixed(1)}L / ₹{(init.fundingGoalAmount / 100000).toFixed(1)}L
                    </Text>
                  </View>
                  <View style={styles.progressBarBg}>
                    <View
                      style={[
                        styles.progressBarFill,
                        {
                          backgroundColor: COLORS.accent,
                          width: `${Math.min((init.fundingRaisedAmount / init.fundingGoalAmount) * 100, 100)}%`,
                        },
                      ]}
                    />
                  </View>
                </View>

                {/* Target Regions */}
                {init.targetRegions && (
                  <View style={styles.regionsRow}>
                    <MapPin size={13} color={COLORS.textMuted} />
                    <Text style={styles.regionsText}>
                      Impact: {init.targetRegions.join(' • ')}
                    </Text>
                  </View>
                )}

                <TouchableOpacity
                  style={styles.pledgeBtn}
                  onPress={() => {
                    coordinationApi.getInitiatives();
                    Alert.alert('Pledge Recorded', 'Thank you for backing this public initiative.');
                  }}
                  activeOpacity={0.85}
                >
                  <Text style={styles.pledgeBtnText}>Support Initiative</Text>
                </TouchableOpacity>
              </View>
            ))
          )}
        </ScrollView>
      )}

      {/* Create Modal */}
      <Modal visible={showCreateModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalHeader}>Create Global Goal</Text>
            <TextInput
              style={styles.input}
              placeholder="Goal Title"
              placeholderTextColor={COLORS.textDim}
              value={newTitle}
              onChangeText={setNewTitle}
            />
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Description & Expected Impact"
              placeholderTextColor={COLORS.textDim}
              multiline
              numberOfLines={3}
              value={newDescription}
              onChangeText={setNewDescription}
            />

            <View style={styles.scopeSelector}>
              {(['COMMUNITY', 'CREATOR', 'ORGANIZATION', 'INDIVIDUAL'] as const).map((s) => (
                <TouchableOpacity
                  key={s}
                  style={[styles.scopeBtn, newScope === s && styles.scopeBtnActive]}
                  onPress={() => setNewScope(s)}
                  activeOpacity={0.82}
                >
                  <Text style={[styles.scopeText, newScope === s && styles.scopeTextActive]}>
                    {s}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setShowCreateModal(false)}
                activeOpacity={0.8}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.submitBtn} onPress={handleCreateGoal} activeOpacity={0.85}>
                <Text style={styles.submitText}>Launch Goal</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  addBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.glowPrimary,
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
  tabItem: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 9,
    borderRadius: RADIUS.sm,
    gap: 6,
  },
  tabItemActive: { backgroundColor: COLORS.bgElevated },
  tabText: { fontSize: 11.5, fontWeight: '700', color: COLORS.textMuted },
  tabTextActive: { color: COLORS.primaryLight, fontWeight: '800' },
  loadingBox: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 12, color: COLORS.textMuted, fontSize: 13 },
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
    paddingVertical: 3,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
  },
  badgeText: { color: COLORS.primaryLight, fontSize: 10, fontWeight: '800' },
  statusBadge: {
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.3)',
  },
  statusText: { color: COLORS.info, fontSize: 10, fontWeight: '800' },
  supportersRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  supportersBadge: { color: COLORS.textSecondary, fontSize: 11.5, fontWeight: '700' },
  cardTitle: { fontSize: 16, fontWeight: '800', color: COLORS.textPrimary, marginBottom: 6 },
  cardDesc: { fontSize: 13, color: COLORS.textSecondary, lineHeight: 18, marginBottom: 12 },
  progressContainer: { marginBottom: 14 },
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  progressLabel: { fontSize: 11.5, color: COLORS.textMuted },
  progressValue: { fontSize: 11.5, fontWeight: '800', color: COLORS.textPrimary },
  progressBarBg: { height: 6, backgroundColor: COLORS.bgElevated, borderRadius: 3, overflow: 'hidden' },
  progressBarFill: { height: '100%', backgroundColor: COLORS.primary, borderRadius: 3 },
  sectionBox: {
    backgroundColor: COLORS.bgInput,
    borderRadius: RADIUS.md,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  sectionTitle: { fontSize: 11, fontWeight: '800', color: COLORS.primaryLight, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 },
  bulletRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  bulletText: { fontSize: 12, color: COLORS.textSecondary, flex: 1 },
  milestoneRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 6, gap: 10 },
  milestoneInfo: { flex: 1 },
  milestoneTitle: { fontSize: 12.5, color: COLORS.textPrimary, fontWeight: '600' },
  milestoneCompleted: { textDecorationLine: 'line-through', color: COLORS.textDim },
  milestoneDue: { fontSize: 10.5, color: COLORS.textMuted, marginTop: 2 },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
  },
  avatarStack: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  participantsCount: { fontSize: 12, color: COLORS.textMuted },
  joinBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: RADIUS.md,
    ...SHADOWS.glowPrimary,
  },
  joinBtnText: { color: '#FFFFFF', fontSize: 12, fontWeight: '800' },
  fundingBox: { marginBottom: 12 },
  regionsRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 14 },
  regionsText: { fontSize: 11.5, color: COLORS.textMuted },
  pledgeBtn: {
    backgroundColor: COLORS.accent,
    paddingVertical: 11,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    ...SHADOWS.glowAccent,
  },
  pledgeBtnText: { color: '#000000', fontSize: 12.5, fontWeight: '900' },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'center',
    padding: 20,
  },
  modalCard: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.xl,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  modalHeader: { fontSize: 18, fontWeight: '800', color: COLORS.textPrimary, marginBottom: 16 },
  input: {
    backgroundColor: COLORS.bgInput,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: COLORS.textPrimary,
    fontSize: 13,
    marginBottom: 12,
  },
  textArea: { height: 80, textAlignVertical: 'top' },
  scopeSelector: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 16 },
  scopeBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.bgElevated,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  scopeBtnActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primaryLight },
  scopeText: { color: COLORS.textMuted, fontSize: 11, fontWeight: '700' },
  scopeTextActive: { color: '#FFFFFF', fontWeight: '800' },
  modalActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10 },
  cancelBtn: { paddingVertical: 10, paddingHorizontal: 16 },
  cancelText: { color: COLORS.textMuted, fontSize: 13.5, fontWeight: '700' },
  submitBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: RADIUS.md,
    ...SHADOWS.glowPrimary,
  },
  submitText: { color: '#FFFFFF', fontSize: 13.5, fontWeight: '800' },
});
