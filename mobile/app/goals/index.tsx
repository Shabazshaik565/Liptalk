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
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { coordinationApi } from '../../src/api/domain.api';
import { GlobalGoalItem, GlobalInitiativeItem } from '../../src/types';

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
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Global Goals & Initiatives</Text>
          <Text style={styles.headerSubtitle}>Collective Coordination Layer</Text>
        </View>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => setShowCreateModal(true)}
        >
          <Ionicons name="add" size={24} color="#6366F1" />
        </TouchableOpacity>
      </View>

      {/* Segmented Tab */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'GOALS' && styles.tabItemActive]}
          onPress={() => setActiveTab('GOALS')}
        >
          <Ionicons
            name="flag-outline"
            size={16}
            color={activeTab === 'GOALS' ? '#6366F1' : '#94A3B8'}
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
        >
          <Ionicons
            name="globe-outline"
            size={16}
            color={activeTab === 'INITIATIVES' ? '#6366F1' : '#94A3B8'}
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
          <ActivityIndicator size="large" color="#6366F1" />
          <Text style={styles.loadingText}>Synchronizing global network...</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent}>
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
                        <Ionicons name="checkbox-outline" size={14} color="#6366F1" />
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
                      >
                        <Ionicons
                          name={m.isCompleted ? 'checkmark-circle' : 'ellipse-outline'}
                          size={20}
                          color={m.isCompleted ? '#10B981' : '#64748B'}
                        />
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
                    <Ionicons name="people" size={16} color="#94A3B8" />
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
                  <View style={[styles.badge, { backgroundColor: 'rgba(16, 185, 129, 0.15)' }]}>
                    <Text style={[styles.badgeText, { color: '#10B981' }]}>{init.category}</Text>
                  </View>
                  <Text style={styles.supportersBadge}>
                    <Ionicons name="heart" size={12} color="#EF4444" /> {init.supportersCount} Backers
                  </Text>
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
                          backgroundColor: '#10B981',
                          width: `${Math.min((init.fundingRaisedAmount / init.fundingGoalAmount) * 100, 100)}%`,
                        },
                      ]}
                    />
                  </View>
                </View>

                {/* Target Regions */}
                {init.targetRegions && (
                  <View style={styles.regionsRow}>
                    <Ionicons name="location-outline" size={14} color="#94A3B8" />
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
              placeholderTextColor="#64748B"
              value={newTitle}
              onChangeText={setNewTitle}
            />
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Description & Expected Impact"
              placeholderTextColor="#64748B"
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
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.submitBtn} onPress={handleCreateGoal}>
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
  addBtn: {
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
    padding: 6,
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 12,
  },
  tabItem: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
  },
  tabItemActive: { backgroundColor: '#1E293B' },
  tabText: { fontSize: 13, fontWeight: '600', color: '#94A3B8' },
  tabTextActive: { color: '#6366F1' },
  loadingBox: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 12, color: '#94A3B8', fontSize: 14 },
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
  statusBadge: {
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: { color: '#38BDF8', fontSize: 11, fontWeight: '600' },
  supportersBadge: { color: '#CBD5E1', fontSize: 12, fontWeight: '600' },
  cardTitle: { fontSize: 17, fontWeight: '700', color: '#F8FAFC', marginBottom: 6 },
  cardDesc: { fontSize: 13, color: '#94A3B8', lineHeight: 19, marginBottom: 14 },
  progressContainer: { marginBottom: 14 },
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  progressLabel: { fontSize: 12, color: '#94A3B8' },
  progressValue: { fontSize: 12, fontWeight: '700', color: '#F8FAFC' },
  progressBarBg: { height: 6, backgroundColor: '#1E293B', borderRadius: 3, overflow: 'hidden' },
  progressBarFill: { height: '100%', backgroundColor: '#6366F1', borderRadius: 3 },
  sectionBox: {
    backgroundColor: '#0F172A',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
  },
  sectionTitle: { fontSize: 12, fontWeight: '700', color: '#CBD5E1', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 },
  bulletRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  bulletText: { fontSize: 13, color: '#E2E8F0', flex: 1 },
  milestoneRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 6, gap: 10 },
  milestoneInfo: { flex: 1 },
  milestoneTitle: { fontSize: 13, color: '#F1F5F9', fontWeight: '500' },
  milestoneCompleted: { textDecorationLine: 'line-through', color: '#64748B' },
  milestoneDue: { fontSize: 11, color: '#64748B', marginTop: 2 },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#1E293B',
  },
  avatarStack: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  participantsCount: { fontSize: 12, color: '#94A3B8' },
  joinBtn: {
    backgroundColor: '#6366F1',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  joinBtnText: { color: '#FFFFFF', fontSize: 12, fontWeight: '700' },
  fundingBox: { marginBottom: 12 },
  regionsRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 14 },
  regionsText: { fontSize: 12, color: '#94A3B8' },
  pledgeBtn: {
    backgroundColor: '#10B981',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  pledgeBtnText: { color: '#FFFFFF', fontSize: 13, fontWeight: '700' },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    padding: 20,
  },
  modalCard: {
    backgroundColor: '#111827',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  modalHeader: { fontSize: 18, fontWeight: '700', color: '#F8FAFC', marginBottom: 16 },
  input: {
    backgroundColor: '#0F172A',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#1E293B',
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#F8FAFC',
    fontSize: 14,
    marginBottom: 12,
  },
  textArea: { height: 80, textAlignVertical: 'top' },
  scopeSelector: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 16 },
  scopeBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  scopeBtnActive: { backgroundColor: '#6366F1', borderColor: '#6366F1' },
  scopeText: { color: '#94A3B8', fontSize: 11, fontWeight: '600' },
  scopeTextActive: { color: '#FFFFFF' },
  modalActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10 },
  cancelBtn: { paddingVertical: 10, paddingHorizontal: 16 },
  cancelText: { color: '#94A3B8', fontSize: 14, fontWeight: '600' },
  submitBtn: {
    backgroundColor: '#6366F1',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
  },
  submitText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
});
