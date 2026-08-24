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
import { HumanApprovalRequestItem } from '../../src/types';

export default function ApprovalsScreen() {
  const router = useRouter();
  const [approvals, setApprovals] = useState<HumanApprovalRequestItem[]>([]);
  const [decisionBriefing, setDecisionBriefing] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [appList, brief] = await Promise.all([
        creationApi.getApprovals(),
        creationApi.getDecisionBriefing(
          'AgTech BLE Escrow Gateway 14-Mandi Rollout',
          'Evaluating rollout of offline mesh escrow commitments across South India.'
        ),
      ]);
      setApprovals(appList);
      setDecisionBriefing(brief);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleResolve = async (id: string, approved: boolean) => {
    Alert.alert(
      approved ? 'Authorize Consequential Action?' : 'Reject Consequential Action?',
      approved
        ? 'You are granting explicit authorization to enact this operation. This action will be immutably recorded in the security audit trail.'
        : 'This action will be cancelled and blocked.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: approved ? 'Authorize' : 'Reject',
          style: approved ? 'default' : 'destructive',
          onPress: async () => {
            await creationApi.resolveApproval(id, approved);
            Alert.alert(
              approved ? 'Action Authorized' : 'Action Blocked',
              `Approval request marked as ${approved ? 'APPROVED' : 'REJECTED'}.`
            );
            loadData();
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Human Approval Gate</Text>
          <Text style={styles.headerSubtitle}>Consequential Action Control • Decision Intelligence</Text>
        </View>
        <View style={styles.gateBadge}>
          <Ionicons name="lock-closed" size={14} color="#F59E0B" />
        </View>
      </View>

      {loading ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color="#6366F1" />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Decision Intelligence Briefing Card */}
          {decisionBriefing && (
            <View style={styles.briefCard}>
              <View style={styles.briefHead}>
                <Ionicons name="bulb-outline" size={16} color="#A855F7" />
                <Text style={styles.briefTitle}>AI Decision Intelligence Briefing</Text>
              </View>
              <Text style={styles.briefProposal}>{decisionBriefing.proposalTitle}</Text>
              <Text style={styles.briefSum}>{decisionBriefing.executiveSummary}</Text>

              {/* Arguments in Favor */}
              <View style={styles.argBox}>
                <Text style={styles.argHeadPositive}>Arguments in Favor:</Text>
                {decisionBriefing.argumentsInFavor?.map((arg: string, idx: number) => (
                  <Text key={idx} style={styles.argText}>• {arg}</Text>
                ))}
              </View>

              {/* Risks & Counterarguments */}
              <View style={[styles.argBox, { marginTop: 6 }]}>
                <Text style={styles.argHeadNegative}>Identified Risks & Counterarguments:</Text>
                {decisionBriefing.counterargumentsAndRisks?.map((risk: string, idx: number) => (
                  <Text key={idx} style={styles.argText}>• {risk}</Text>
                ))}
              </View>

              <Text style={styles.recText}>
                <Text style={{ fontWeight: '700', color: '#10B981' }}>Recommended Next Step: </Text>
                {decisionBriefing.recommendedNextStep}
              </Text>
            </View>
          )}

          {/* Section: Pending Human Authorization Requests */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Pending Consequential Action Requests</Text>
            <View style={styles.countBadge}>
              <Text style={styles.countBadgeText}>{approvals.length}</Text>
            </View>
          </View>

          {approvals.map((req) => (
            <View key={req.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.actionTypeBadge}>
                  <Text style={styles.actionTypeText}>{req.actionType.replace(/_/g, ' ')}</Text>
                </View>
                <Text
                  style={[
                    styles.riskTag,
                    { color: req.riskRating === 'HIGH' ? '#EF4444' : '#F59E0B' },
                  ]}
                >
                  {req.riskRating} RISK
                </Text>
              </View>

              <Text style={styles.cardTitle}>{req.title}</Text>
              <Text style={styles.cardDesc}>{req.reasonAndContext}</Text>

              <View style={styles.metaBox}>
                <Text style={styles.metaLbl}>Requester: {req.requesterAgentOrUserId}</Text>
                <Text style={styles.metaLbl}>Target: {req.targetEntityId}</Text>
                <Text style={styles.metaOutcome}>
                  <Text style={{ fontWeight: '700', color: '#38BDF8' }}>Expected Outcome: </Text>
                  {req.expectedOutcome}
                </Text>
              </View>

              {req.status === 'PENDING' ? (
                <View style={styles.btnRow}>
                  <TouchableOpacity
                    style={styles.rejectBtn}
                    onPress={() => handleResolve(req.id, false)}
                  >
                    <Ionicons name="close-circle-outline" size={14} color="#EF4444" />
                    <Text style={styles.rejectBtnText}>Reject</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.approveBtn}
                    onPress={() => handleResolve(req.id, true)}
                  >
                    <Ionicons name="checkmark-circle-outline" size={14} color="#FFFFFF" />
                    <Text style={styles.approveBtnText}>Authorize Action</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.resolvedTag}>
                  <Text style={styles.resolvedText}>● Status: {req.status}</Text>
                </View>
              )}
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
  gateBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingBox: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scrollContent: { padding: 16, paddingBottom: 40 },
  briefCard: {
    backgroundColor: '#111827',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(168, 85, 247, 0.2)',
  },
  briefHead: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  briefTitle: { fontSize: 12, fontWeight: '700', color: '#A855F7' },
  briefProposal: { fontSize: 15, fontWeight: '700', color: '#F8FAFC', marginBottom: 4 },
  briefSum: { fontSize: 12, color: '#94A3B8', lineHeight: 16, marginBottom: 10 },
  argBox: { backgroundColor: '#0F172A', borderRadius: 8, padding: 10 },
  argHeadPositive: { fontSize: 10, fontWeight: '700', color: '#10B981', marginBottom: 4 },
  argHeadNegative: { fontSize: 10, fontWeight: '700', color: '#EF4444', marginBottom: 4 },
  argText: { fontSize: 11, color: '#CBD5E1', lineHeight: 16 },
  recText: { fontSize: 11, color: '#CBD5E1', marginTop: 8, lineHeight: 15 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, marginTop: 4 },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: '#F8FAFC' },
  countBadge: { backgroundColor: '#6366F1', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 },
  countBadgeText: { color: '#FFFFFF', fontSize: 10, fontWeight: '700' },
  card: {
    backgroundColor: '#111827',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  actionTypeBadge: { backgroundColor: 'rgba(99, 102, 241, 0.15)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  actionTypeText: { color: '#6366F1', fontSize: 10, fontWeight: '700' },
  riskTag: { fontSize: 10, fontWeight: '700' },
  cardTitle: { fontSize: 15, fontWeight: '700', color: '#F8FAFC', marginBottom: 4 },
  cardDesc: { fontSize: 12, color: '#94A3B8', lineHeight: 17, marginBottom: 10 },
  metaBox: { backgroundColor: '#0F172A', borderRadius: 8, padding: 10, marginBottom: 12, gap: 2 },
  metaLbl: { fontSize: 10, color: '#64748B' },
  metaOutcome: { fontSize: 11, color: '#E2E8F0', marginTop: 4, lineHeight: 15 },
  btnRow: { flexDirection: 'row', gap: 10 },
  rejectBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    paddingVertical: 10,
    borderRadius: 8,
  },
  rejectBtnText: { color: '#EF4444', fontSize: 11, fontWeight: '700' },
  approveBtn: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    backgroundColor: '#10B981',
    paddingVertical: 10,
    borderRadius: 8,
  },
  approveBtnText: { color: '#FFFFFF', fontSize: 11, fontWeight: '700' },
  resolvedTag: { backgroundColor: '#0F172A', paddingVertical: 6, paddingHorizontal: 8, borderRadius: 6, alignSelf: 'flex-start' },
  resolvedText: { color: '#94A3B8', fontSize: 10, fontWeight: '600' },
});
