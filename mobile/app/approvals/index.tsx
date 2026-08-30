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
import { ArrowLeft, Lock, Lightbulb, XCircle, CheckCircle2 } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { creationApi } from '../../src/api/domain.api';
import { HumanApprovalRequestItem } from '../../src/types';
import { COLORS, RADIUS, SPACING, SHADOWS } from '../../src/constants/theme';

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
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} activeOpacity={0.8}>
          <ArrowLeft size={20} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Human Approval Gate</Text>
          <Text style={styles.headerSubtitle}>Consequential Action Control • Decision Intelligence</Text>
        </View>
        <View style={styles.gateBadge}>
          <Lock size={14} color={COLORS.warning} />
        </View>
      </View>

      {loading ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Decision Intelligence Briefing Card */}
          {decisionBriefing && (
            <View style={styles.briefCard}>
              <View style={styles.briefHead}>
                <Lightbulb size={16} color={COLORS.primaryLight} />
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
                <Text style={{ fontWeight: '800', color: COLORS.accent }}>Recommended Next Step: </Text>
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
                    { color: req.riskRating === 'HIGH' ? COLORS.danger : COLORS.warning },
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
                  <Text style={{ fontWeight: '800', color: COLORS.info }}>Expected Outcome: </Text>
                  {req.expectedOutcome}
                </Text>
              </View>

              {req.status === 'PENDING' ? (
                <View style={styles.btnRow}>
                  <TouchableOpacity
                    style={styles.rejectBtn}
                    onPress={() => handleResolve(req.id, false)}
                    activeOpacity={0.82}
                  >
                    <XCircle size={14} color={COLORS.danger} />
                    <Text style={styles.rejectBtnText}>Reject</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.approveBtn}
                    onPress={() => handleResolve(req.id, true)}
                    activeOpacity={0.85}
                  >
                    <CheckCircle2 size={14} color="#FFFFFF" />
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
  gateBadge: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
  },
  loadingBox: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scrollContent: { padding: SPACING.lg, paddingBottom: 40 },
  briefCard: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.25)',
    ...SHADOWS.sm,
  },
  briefHead: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  briefTitle: { fontSize: 12, fontWeight: '800', color: COLORS.primaryLight },
  briefProposal: { fontSize: 15, fontWeight: '800', color: COLORS.textPrimary, marginBottom: 4 },
  briefSum: { fontSize: 12, color: COLORS.textSecondary, lineHeight: 17, marginBottom: 10 },
  argBox: { backgroundColor: COLORS.bgInput, borderRadius: RADIUS.md, padding: 10, borderWidth: 1, borderColor: COLORS.borderLight },
  argHeadPositive: { fontSize: 10.5, fontWeight: '800', color: COLORS.accent, marginBottom: 4 },
  argHeadNegative: { fontSize: 10.5, fontWeight: '800', color: COLORS.danger, marginBottom: 4 },
  argText: { fontSize: 11, color: COLORS.textSecondary, lineHeight: 16 },
  recText: { fontSize: 11.5, color: COLORS.textSecondary, marginTop: 8, lineHeight: 16 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, marginTop: 4 },
  sectionTitle: { fontSize: 14.5, fontWeight: '800', color: COLORS.textPrimary },
  countBadge: { backgroundColor: COLORS.primary, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 },
  countBadgeText: { color: '#FFFFFF', fontSize: 10, fontWeight: '800' },
  card: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  actionTypeBadge: {
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
  },
  actionTypeText: { color: COLORS.primaryLight, fontSize: 10, fontWeight: '800' },
  riskTag: { fontSize: 10, fontWeight: '800' },
  cardTitle: { fontSize: 15, fontWeight: '800', color: COLORS.textPrimary, marginBottom: 4 },
  cardDesc: { fontSize: 12, color: COLORS.textSecondary, lineHeight: 17, marginBottom: 10 },
  metaBox: { backgroundColor: COLORS.bgInput, borderRadius: RADIUS.md, padding: 10, marginBottom: 12, gap: 3, borderWidth: 1, borderColor: COLORS.borderLight },
  metaLbl: { fontSize: 10.5, color: COLORS.textDim },
  metaOutcome: { fontSize: 11, color: COLORS.textPrimary, marginTop: 4, lineHeight: 16 },
  btnRow: { flexDirection: 'row', gap: 10 },
  rejectBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
    paddingVertical: 11,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  rejectBtnText: { color: COLORS.danger, fontSize: 11.5, fontWeight: '800' },
  approveBtn: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    backgroundColor: COLORS.accent,
    paddingVertical: 11,
    borderRadius: RADIUS.md,
    ...SHADOWS.glowAccent,
  },
  approveBtnText: { color: '#000000', fontSize: 11.5, fontWeight: '900' },
  resolvedTag: { backgroundColor: COLORS.bgInput, paddingVertical: 6, paddingHorizontal: 8, borderRadius: 6, alignSelf: 'flex-start' },
  resolvedText: { color: COLORS.textMuted, fontSize: 10, fontWeight: '700' },
});
