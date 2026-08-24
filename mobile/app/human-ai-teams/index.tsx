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
import { creationApi } from '../../src/api/domain.api';
import { HumanAiTeamItem, CollaborationRoomItem } from '../../src/types';

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
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
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
        >
          <Text style={[styles.tabBtnText, activeTab === 'TEAMS' && styles.tabBtnTextActive]}>
            Human-AI Team Squads
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'ROOMS' && styles.tabBtnActive]}
          onPress={() => setActiveTab('ROOMS')}
        >
          <Text style={[styles.tabBtnText, activeTab === 'ROOMS' && styles.tabBtnTextActive]}>
            Collaboration Rooms
          </Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color="#6366F1" />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {activeTab === 'TEAMS' ? (
            <View>
              {/* AI Project Manager Telemetry Banner */}
              {pmReport && (
                <View style={styles.pmCard}>
                  <View style={styles.pmHeader}>
                    <Ionicons name="stats-chart" size={16} color="#10B981" />
                    <Text style={styles.pmTitle}>{pmReport.reportHeadline}</Text>
                  </View>
                  <Text style={styles.pmRec}>
                    <Text style={{ fontWeight: '700', color: '#F1F5F9' }}>Recommendation: </Text>
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
                          <Ionicons name="person-circle-outline" size={16} color="#38BDF8" />
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
                          <Ionicons name="hardware-chip-outline" size={16} color="#A855F7" />
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
                          <Ionicons name="checkbox-outline" size={14} color="#10B981" />
                          <Text style={styles.actionText}>{act}</Text>
                        </View>
                      ))}
                    </View>
                  )}

                  <TouchableOpacity
                    style={styles.joinBtn}
                    onPress={() => Alert.alert('Connected to Collaboration Room', 'Isolated context boundaries active.')}
                  >
                    <Ionicons name="chatbubbles-outline" size={14} color="#FFFFFF" />
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
  tabStrip: {
    flexDirection: 'row',
    backgroundColor: '#111827',
    paddingHorizontal: 16,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
    gap: 8,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: '#0F172A',
  },
  tabBtnActive: { backgroundColor: '#6366F1' },
  tabBtnText: { fontSize: 11, fontWeight: '600', color: '#94A3B8' },
  tabBtnTextActive: { color: '#FFFFFF' },
  loadingBox: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scrollContent: { padding: 16, paddingBottom: 40 },
  pmCard: {
    backgroundColor: '#111827',
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.2)',
  },
  pmHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 },
  pmTitle: { fontSize: 13, fontWeight: '700', color: '#10B981' },
  pmRec: { fontSize: 11, color: '#CBD5E1', lineHeight: 16, marginBottom: 8 },
  blockerBox: { backgroundColor: '#0F172A', borderRadius: 8, padding: 8 },
  blockerHead: { fontSize: 10, fontWeight: '700', color: '#EF4444', marginBottom: 2 },
  blockerText: { fontSize: 11, color: '#94A3B8' },
  card: {
    backgroundColor: '#111827',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  teamTitle: { fontSize: 16, fontWeight: '700', color: '#F8FAFC', marginBottom: 4 },
  missionText: { fontSize: 12, color: '#94A3B8', lineHeight: 17, marginBottom: 14 },
  memberSection: { backgroundColor: '#0F172A', borderRadius: 10, padding: 12, marginBottom: 10 },
  sectionHeader: { fontSize: 11, fontWeight: '700', color: '#94A3B8', marginBottom: 8 },
  memberList: { gap: 6 },
  memberRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  memberName: { fontSize: 12, fontWeight: '600', color: '#F1F5F9' },
  roleBadge: { backgroundColor: '#1E293B', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  roleText: { color: '#38BDF8', fontSize: 9, fontWeight: '700' },
  agentScope: { fontSize: 10, color: '#64748B', marginTop: 1 },
  roomHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  liveBadge: { backgroundColor: 'rgba(16, 185, 129, 0.15)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  liveBadgeText: { color: '#10B981', fontSize: 9, fontWeight: '700' },
  participantCount: { fontSize: 11, color: '#94A3B8' },
  intelBox: { backgroundColor: '#0F172A', borderRadius: 10, padding: 12, marginBottom: 12 },
  intelHead: { fontSize: 10, fontWeight: '700', color: '#64748B', marginBottom: 4 },
  intelSummary: { fontSize: 11, color: '#CBD5E1', lineHeight: 16 },
  actionRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
  actionText: { fontSize: 11, color: '#F1F5F9', flex: 1 },
  joinBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#6366F1',
    paddingVertical: 10,
    borderRadius: 8,
  },
  joinBtnText: { color: '#FFFFFF', fontSize: 12, fontWeight: '700' },
});
