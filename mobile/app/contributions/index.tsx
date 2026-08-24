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
import { ContributionListingItem, ResourceRequestItem } from '../../src/types';

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
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
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
        >
          <Text style={[styles.tabBtnText, activeTab === 'CONTRIBUTIONS' && styles.tabBtnTextActive]}>
            Open Contribution Calls ({listings.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'RESOURCE_REQUESTS' && styles.tabBtnActive]}
          onPress={() => setActiveTab('RESOURCE_REQUESTS')}
        >
          <Text style={[styles.tabBtnText, activeTab === 'RESOURCE_REQUESTS' && styles.tabBtnTextActive]}>
            Resource Matching ({requests.length})
          </Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color="#6366F1" />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent}>
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
                      { color: item.status === 'OPEN_CALL' ? '#10B981' : '#38BDF8' },
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
                      <Ionicons name="checkmark-circle-outline" size={14} color="#38BDF8" />
                      <Text style={styles.delivText}>{d}</Text>
                    </View>
                  ))}
                </View>

                {item.status === 'OPEN_CALL' ? (
                  <TouchableOpacity
                    style={styles.applyBtn}
                    onPress={() => handleApplyContribution(item)}
                  >
                    <Ionicons name="hand-right-outline" size={14} color="#FFFFFF" />
                    <Text style={styles.applyBtnText}>Apply to Contribute</Text>
                  </TouchableOpacity>
                ) : (
                  <View style={styles.assignedNotice}>
                    <Ionicons name="person-check" size={14} color="#38BDF8" />
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
  card: {
    backgroundColor: '#111827',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  typeBadge: { backgroundColor: 'rgba(99, 102, 241, 0.15)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  typeBadgeText: { color: '#6366F1', fontSize: 10, fontWeight: '700' },
  statusText: { fontSize: 11, fontWeight: '700' },
  matchTag: { color: '#10B981', fontSize: 11, fontWeight: '700' },
  cardTitle: { fontSize: 15, fontWeight: '700', color: '#F8FAFC', marginBottom: 4 },
  cardDesc: { fontSize: 12, color: '#94A3B8', lineHeight: 17, marginBottom: 12 },
  delivBox: { backgroundColor: '#0F172A', borderRadius: 8, padding: 10, marginBottom: 12 },
  delivHead: { fontSize: 10, fontWeight: '700', color: '#64748B', marginBottom: 6 },
  delivRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  delivText: { fontSize: 11, color: '#E2E8F0', flex: 1 },
  criteriaText: { fontSize: 11, color: '#CBD5E1', marginBottom: 6 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  chip: { backgroundColor: '#1E293B', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  chipText: { fontSize: 10, color: '#38BDF8' },
  applyBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#6366F1',
    paddingVertical: 10,
    borderRadius: 8,
  },
  applyBtnText: { color: '#FFFFFF', fontSize: 12, fontWeight: '700' },
  assignedNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(56, 189, 248, 0.1)',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  assignedNoticeText: { color: '#38BDF8', fontSize: 11, fontWeight: '600' },
});
