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
import { ArrowLeft, CheckCircle2, Hand, UserCheck } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { creationApi } from '../../src/api/domain.api';
import { ContributionListingItem, ResourceRequestItem } from '../../src/types';
import { COLORS, RADIUS, SPACING, SHADOWS } from '../../src/constants/theme';

export default function ContributionsScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'CONTRIBUTIONS' | 'RESOURCE_REQUESTS'>('CONTRIBUTIONS');
  const [listings, setListings] = useState<ContributionListingItem[]>([]);
  const [requests, setRequests] = useState<ResourceRequestItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [lList, rList] = await Promise.all([
        creationApi.getContributionListings(),
        creationApi.getResourceRequests(),
      ]);
      setListings(lList);
      setRequests(rList);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyContribution = async (listing: ContributionListingItem) => {
    Alert.alert(
      'Submit Contribution Proposal?',
      `Apply to contribute on "${listing.title}" with verified attribution attestation.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Submit Application',
          onPress: async () => {
            await creationApi.applyForContribution(listing.id);
            Alert.alert('Application Submitted', 'Your profile and public contributions were sent to the project owner.');
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
          <Text style={styles.headerTitle}>Contribution Marketplace</Text>
          <Text style={styles.headerSubtitle}>Resource Matching • Attestation Attribution</Text>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabStrip}>
        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'CONTRIBUTIONS' && styles.tabBtnActive]}
          onPress={() => setActiveTab('CONTRIBUTIONS')}
          activeOpacity={0.82}
        >
          <Text style={[styles.tabBtnText, activeTab === 'CONTRIBUTIONS' && styles.tabBtnTextActive]}>
            Open Calls ({listings.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'RESOURCE_REQUESTS' && styles.tabBtnActive]}
          onPress={() => setActiveTab('RESOURCE_REQUESTS')}
          activeOpacity={0.82}
        >
          <Text style={[styles.tabBtnText, activeTab === 'RESOURCE_REQUESTS' && styles.tabBtnTextActive]}>
            Resource Matching ({requests.length})
          </Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {activeTab === 'CONTRIBUTIONS' ? (
            listings.map((item) => (
              <View key={item.id} style={styles.card}>
                <View style={styles.cardHeader}>
                  <View style={styles.typeBadge}>
                    <Text style={styles.typeBadgeText}>{item.contributionType}</Text>
                  </View>
                  <Text
                    style={[
                      styles.statusText,
                      { color: item.status === 'OPEN_CALL' ? COLORS.accent : COLORS.info },
                    ]}
                  >
                    ● {item.status.replace(/_/g, ' ')}
                  </Text>
                </View>

                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardDesc}>{item.description}</Text>

                {/* Deliverables */}
                <View style={styles.delivBox}>
                  <Text style={styles.delivHead}>Required Milestone Deliverables:</Text>
                  {item.deliverablesSummary?.map((d, dIdx) => (
                    <View key={dIdx} style={styles.delivRow}>
                      <CheckCircle2 size={13} color={COLORS.info} />
                      <Text style={styles.delivText}>{d}</Text>
                    </View>
                  ))}
                </View>

                {item.status === 'OPEN_CALL' ? (
                  <TouchableOpacity
                    style={styles.applyBtn}
                    onPress={() => handleApplyContribution(item)}
                    activeOpacity={0.85}
                  >
                    <Hand size={14} color="#FFFFFF" />
                    <Text style={styles.applyBtnText}>Apply to Contribute</Text>
                  </TouchableOpacity>
                ) : (
                  <View style={styles.assignedNotice}>
                    <UserCheck size={14} color={COLORS.info} />
                    <Text style={styles.assignedNoticeText}>
                      Assigned to Contributor (Impact: {item.attributionRecord?.impactScore}/100)
                    </Text>
                  </View>
                )}
              </View>
            ))
          ) : (
            requests.map((req) => (
              <View key={req.id} style={styles.card}>
                <View style={styles.cardHeader}>
                  <View style={styles.typeBadge}>
                    <Text style={styles.typeBadgeText}>{req.category.replace(/_/g, ' ')}</Text>
                  </View>
                  <Text style={styles.matchTag}>● {req.status.replace(/_/g, ' ')}</Text>
                </View>

                <Text style={styles.cardTitle}>{req.title}</Text>
                <Text style={styles.cardDesc}>{req.description}</Text>

                <View style={styles.delivBox}>
                  <Text style={styles.delivHead}>Matched Criteria & Estimated Effort:</Text>
                  <Text style={styles.criteriaText}>
                    Effort: ~{req.matchCriteria?.estimatedEffortHours} Hours • Scope: {req.matchCriteria?.locationScope}
                  </Text>
                  <View style={styles.chipRow}>
                    {req.matchCriteria?.skills?.map((sk, sIdx) => (
                      <View key={sIdx} style={styles.chip}>
                        <Text style={styles.chipText}>{sk}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              </View>
            ))
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
  typeBadge: {
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
  },
  typeBadgeText: { color: COLORS.primaryLight, fontSize: 10, fontWeight: '800' },
  statusText: { fontSize: 11, fontWeight: '800' },
  matchTag: { color: COLORS.accent, fontSize: 11, fontWeight: '800' },
  cardTitle: { fontSize: 15, fontWeight: '800', color: COLORS.textPrimary, marginBottom: 4 },
  cardDesc: { fontSize: 12, color: COLORS.textSecondary, lineHeight: 17, marginBottom: 12 },
  delivBox: { backgroundColor: COLORS.bgInput, borderRadius: RADIUS.md, padding: 10, marginBottom: 12, borderWidth: 1, borderColor: COLORS.borderLight },
  delivHead: { fontSize: 10, fontWeight: '800', color: COLORS.primaryLight, marginBottom: 6, letterSpacing: 0.4 },
  delivRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  delivText: { fontSize: 11, color: COLORS.textSecondary, flex: 1 },
  criteriaText: { fontSize: 11, color: COLORS.textMuted, marginBottom: 6 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  chip: {
    backgroundColor: COLORS.bgElevated,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  chipText: { fontSize: 10.5, color: COLORS.info, fontWeight: '700' },
  applyBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.primary,
    paddingVertical: 11,
    borderRadius: RADIUS.md,
    ...SHADOWS.glowPrimary,
  },
  applyBtnText: { color: '#FFFFFF', fontSize: 12.5, fontWeight: '800' },
  assignedNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(56, 189, 248, 0.12)',
    paddingVertical: 9,
    paddingHorizontal: 11,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.25)',
  },
  assignedNoticeText: { color: COLORS.info, fontSize: 11.5, fontWeight: '700' },
});
