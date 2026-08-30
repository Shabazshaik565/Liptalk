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
import { ArrowLeft, BarChart3, User, Cpu, CheckSquare, MessagesSquare } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { creationApi } from '../../src/api/domain.api';
import { HumanAiTeamItem, CollaborationRoomItem } from '../../src/types';
import { COLORS, RADIUS, SPACING, SHADOWS } from '../../src/constants/theme';

export default function HumanAiTeamsScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'TEAMS' | 'ROOMS'>('TEAMS');
  const [teams, setTeams] = useState<HumanAiTeamItem[]>([]);
  const [rooms, setRooms] = useState<CollaborationRoomItem[]>([]);
  const [pmReport, setPmReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [tList, rList, pm] = await Promise.all([
        creationApi.getTeams(),
        creationApi.getRooms(),
        creationApi.getAiProjectManagerReport('proj_supply_01'),
      ]);
      setTeams(tList);
      setRooms(rList);
      setPmReport(pm);
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
          <Text style={styles.headerTitle}>Human-AI Teams & Rooms</Text>
          <Text style={styles.headerSubtitle}>Hybrid Team Roster • AI Project Manager</Text>
        </View>
      </View>

      {/* Tab Strip */}
      <View style={styles.tabStrip}>
        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'TEAMS' && styles.tabBtnActive]}
          onPress={() => setActiveTab('TEAMS')}
          activeOpacity={0.82}
        >
          <Text style={[styles.tabBtnText, activeTab === 'TEAMS' && styles.tabBtnTextActive]}>
            Human-AI Team Squads
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'ROOMS' && styles.tabBtnActive]}
          onPress={() => setActiveTab('ROOMS')}
          activeOpacity={0.82}
        >
          <Text style={[styles.tabBtnText, activeTab === 'ROOMS' && styles.tabBtnTextActive]}>
            Collaboration Rooms
          </Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {activeTab === 'TEAMS' ? (
            <View>
              {/* AI Project Manager Telemetry Banner */}
              {pmReport && (
                <View style={styles.pmCard}>
                  <View style={styles.pmHeader}>
                    <BarChart3 size={16} color={COLORS.accent} />
                    <Text style={styles.pmTitle}>{pmReport.reportHeadline}</Text>
                  </View>
                  <Text style={styles.pmRec}>
                    <Text style={{ fontWeight: '800', color: COLORS.textPrimary }}>Recommendation: </Text>
                    {pmReport.aiRecommendation}
                  </Text>
                  <View style={styles.blockerBox}>
                    <Text style={styles.blockerHead}>Identified Active Blockers:</Text>
                    {pmReport.blockersSummary.map((b: string, idx: number) => (
                      <Text key={idx} style={styles.blockerText}>• {b}</Text>
                    ))}
                  </View>
                </View>
              )}

              {teams.map((team) => (
                <View key={team.id} style={styles.card}>
                  <Text style={styles.teamTitle}>{team.teamName}</Text>
                  <Text style={styles.missionText}>{team.missionStatement}</Text>

                  {/* Human Members */}
                  <View style={styles.memberSection}>
                    <Text style={styles.sectionHeader}>Human Members ({team.humanMembers.length}):</Text>
                    <View style={styles.memberList}>
                      {team.humanMembers.map((h, hIdx) => (
                        <View key={hIdx} style={styles.memberRow}>
                          <User size={15} color={COLORS.info} />
                          <Text style={styles.memberName}>{h.userId}</Text>
                          <View style={styles.roleBadge}>
                            <Text style={styles.roleText}>{h.role}</Text>
                          </View>
                        </View>
                      ))}
                    </View>
                  </View>

                  {/* AI Agent Members */}
                  <View style={styles.memberSection}>
                    <Text style={styles.sectionHeader}>AI Agent Members ({team.aiMembers.length}):</Text>
                    <View style={styles.memberList}>
                      {team.aiMembers.map((a, aIdx) => (
                        <View key={aIdx} style={styles.memberRow}>
                          <Cpu size={15} color={COLORS.primaryLight} />
                          <View style={{ flex: 1 }}>
                            <Text style={styles.memberName}>{a.agentName}</Text>
                            <Text style={styles.agentScope}>
                              Role: {a.agentRole} • Budget: ${a.budgetLimitUsd}
                            </Text>
                          </View>
                        </View>
                      ))}
                    </View>
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <View>
              {rooms.map((room) => (
                <View key={room.id} style={styles.card}>
                  <View style={styles.roomHeader}>
                    <View style={styles.liveBadge}>
                      <Text style={styles.liveBadgeText}>● LIVE COLLABORATION</Text>
                    </View>
                    <Text style={styles.participantCount}>{room.activeParticipantIds?.length} Active Members</Text>
                  </View>

                  <Text style={styles.teamTitle}>{room.roomName}</Text>
                  <Text style={styles.missionText}>{room.topicFocus}</Text>

                  {/* Realtime Intelligence */}
                  {room.realtimeIntelligence && (
                    <View style={styles.intelBox}>
                      <Text style={styles.intelHead}>Real-Time Meeting Intelligence:</Text>
                      <Text style={styles.intelSummary}>
                        {room.realtimeIntelligence.liveMeetingSummary}
                      </Text>

                      <Text style={[styles.intelHead, { marginTop: 8 }]}>Extracted Action Items:</Text>
                      {room.realtimeIntelligence.extractedActionItems?.map((act, aIdx) => (
                        <View key={aIdx} style={styles.actionRow}>
                          <CheckSquare size={13} color={COLORS.accent} />
                          <Text style={styles.actionText}>{act}</Text>
                        </View>
                      ))}
                    </View>
                  )}

                  <TouchableOpacity
                    style={styles.joinBtn}
                    onPress={() => Alert.alert('Connected to Collaboration Room', 'Isolated context boundaries active.')}
                    activeOpacity={0.85}
                  >
                    <MessagesSquare size={15} color="#FFFFFF" />
                    <Text style={styles.joinBtnText}>Enter Collaboration Space</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
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
  tabStrip: {
    flexDirection: 'row',
    backgroundColor: COLORS.bgInput,
    paddingHorizontal: SPACING.lg,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    gap: 8,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.bgElevated,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  tabBtnActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primaryLight,
    ...SHADOWS.glowPrimary,
  },
  tabBtnText: { fontSize: 11, fontWeight: '700', color: COLORS.textMuted },
  tabBtnTextActive: { color: '#FFFFFF', fontWeight: '800' },
  loadingBox: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scrollContent: { padding: SPACING.lg, paddingBottom: 40 },
  pmCard: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.xl,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.25)',
    ...SHADOWS.sm,
  },
  pmHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 },
  pmTitle: { fontSize: 13, fontWeight: '800', color: COLORS.accent },
  pmRec: { fontSize: 11.5, color: COLORS.textSecondary, lineHeight: 16, marginBottom: 8 },
  blockerBox: { backgroundColor: COLORS.bgInput, borderRadius: RADIUS.md, padding: 8, borderWidth: 1, borderColor: 'rgba(239, 68, 68, 0.2)' },
  blockerHead: { fontSize: 10, fontWeight: '800', color: COLORS.danger, marginBottom: 2 },
  blockerText: { fontSize: 11, color: COLORS.textMuted },
  card: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
  },
  teamTitle: { fontSize: 16, fontWeight: '800', color: COLORS.textPrimary, marginBottom: 4 },
  missionText: { fontSize: 12.5, color: COLORS.textSecondary, lineHeight: 17, marginBottom: 14 },
  memberSection: { backgroundColor: COLORS.bgInput, borderRadius: RADIUS.md, padding: 12, marginBottom: 10, borderWidth: 1, borderColor: COLORS.borderLight },
  sectionHeader: { fontSize: 11, fontWeight: '800', color: COLORS.primaryLight, marginBottom: 8, letterSpacing: 0.4 },
  memberList: { gap: 6 },
  memberRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  memberName: { fontSize: 12, fontWeight: '700', color: COLORS.textPrimary },
  roleBadge: { backgroundColor: COLORS.bgElevated, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, borderWidth: 1, borderColor: COLORS.border },
  roleText: { color: COLORS.info, fontSize: 9.5, fontWeight: '800' },
  agentScope: { fontSize: 10.5, color: COLORS.textMuted, marginTop: 1 },
  roomHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  liveBadge: { backgroundColor: 'rgba(16, 185, 129, 0.15)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, borderWidth: 1, borderColor: 'rgba(16, 185, 129, 0.3)' },
  liveBadgeText: { color: COLORS.accent, fontSize: 9.5, fontWeight: '800' },
  participantCount: { fontSize: 11, color: COLORS.textMuted },
  intelBox: { backgroundColor: COLORS.bgInput, borderRadius: RADIUS.md, padding: 12, marginBottom: 12, borderWidth: 1, borderColor: COLORS.borderLight },
  intelHead: { fontSize: 10.5, fontWeight: '800', color: COLORS.primaryLight, marginBottom: 4, letterSpacing: 0.4 },
  intelSummary: { fontSize: 11.5, color: COLORS.textSecondary, lineHeight: 16 },
  actionRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
  actionText: { fontSize: 11.5, color: COLORS.textPrimary, flex: 1 },
  joinBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.primary,
    paddingVertical: 11,
    borderRadius: RADIUS.md,
    ...SHADOWS.glowPrimary,
  },
  joinBtnText: { color: '#FFFFFF', fontSize: 12.5, fontWeight: '800' },
});
