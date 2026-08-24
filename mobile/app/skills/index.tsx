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
import { intelligenceApi } from '../../src/api/domain.api';
import { SkillGraphItem, ExpertProfileItem } from '../../src/types';

export default function SkillsScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'SKILLS' | 'EXPERTS' | 'GAP_ANALYSIS'>('SKILLS');
  const [skills, setSkills] = useState<SkillGraphItem[]>([]);
  const [experts, setExperts] = useState<ExpertProfileItem[]>([]);
  const [gapReport, setGapReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [sk, exp, gap] = await Promise.all([
        intelligenceApi.getSkillGraph(),
        intelligenceApi.getExperts(),
        intelligenceApi.getSkillGaps('PROJECT', 'proj_supply_01'),
      ]);
      setSkills(sk);
      setExperts(exp);
      setGapReport(gap);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleBookConsultation = (expert: ExpertProfileItem) => {
    Alert.alert(
      'Consultation Requested',
      `Your request to consult with ${expert.expertName} on "${expert.verifiedDomains[0]}" has been queued.`
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
          <Text style={styles.headerTitle}>Skill Graph & Expert Network</Text>
          <Text style={styles.headerSubtitle}>Verified Competencies & Public Contributions</Text>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabStrip}>
        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'SKILLS' && styles.tabBtnActive]}
          onPress={() => setActiveTab('SKILLS')}
        >
          <Text style={[styles.tabBtnText, activeTab === 'SKILLS' && styles.tabBtnTextActive]}>
            Skill Graph
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'GAP_ANALYSIS' && styles.tabBtnActive]}
          onPress={() => setActiveTab('GAP_ANALYSIS')}
        >
          <Text style={[styles.tabBtnText, activeTab === 'GAP_ANALYSIS' && styles.tabBtnTextActive]}>
            Skill Gap Analysis
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'EXPERTS' && styles.tabBtnActive]}
          onPress={() => setActiveTab('EXPERTS')}
        >
          <Text style={[styles.tabBtnText, activeTab === 'EXPERTS' && styles.tabBtnTextActive]}>
            Expert Network
          </Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color="#6366F1" />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* TAB 1: SKILL GRAPH */}
          {activeTab === 'SKILLS' && (
            <View>
              {skills.map((skill) => (
                <View key={skill.id} style={styles.card}>
                  <View style={styles.cardHeader}>
                    <View style={styles.catBadge}>
                      <Text style={styles.catBadgeText}>{skill.category}</Text>
                    </View>
                    <Text style={styles.levelsTag}>{skill.proficiencyLevelCount} Proficiency Tiers</Text>
                  </View>
                  <Text style={styles.cardTitle}>{skill.skillName}</Text>
                  <Text style={styles.cardDesc}>{skill.description}</Text>

                  <View style={styles.relatedBox}>
                    <Text style={styles.relatedLabel}>Related Skills & Pre-requisites:</Text>
                    <View style={styles.tagWrap}>
                      {skill.relatedSkillIds?.map((rId, rIdx) => (
                        <View key={rIdx} style={styles.tag}>
                          <Text style={styles.tagText}>{rId}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* TAB 2: SKILL GAP ANALYSIS */}
          {activeTab === 'GAP_ANALYSIS' && gapReport && (
            <View>
              <View style={styles.card}>
                <Text style={styles.cardTitle}>Project Skill Readiness</Text>
                <Text style={styles.cardDesc}>
                  AI analyzed prerequisites for Open FMCG Supply Chain Gateway milestones.
                </Text>

                <View style={styles.gapList}>
                  {gapReport.requiredSkills?.map((req: any, idx: number) => (
                    <View key={idx} style={styles.gapRow}>
                      <View style={styles.gapHead}>
                        <Text style={styles.gapName}>{req.skillName}</Text>
                        <Text
                          style={[
                            styles.coverageVal,
                            { color: req.currentCoveragePercent < 50 ? '#EF4444' : '#10B981' },
                          ]}
                        >
                          {req.currentCoveragePercent}% Ready
                        </Text>
                      </View>
                      <View style={styles.barBg}>
                        <View
                          style={[
                            styles.barFill,
                            {
                              width: `${req.currentCoveragePercent}%`,
                              backgroundColor: req.currentCoveragePercent < 50 ? '#EF4444' : '#10B981',
                            },
                          ]}
                        />
                      </View>
                    </View>
                  ))}
                </View>

                <View style={styles.summaryBox}>
                  <Ionicons name="bulb-outline" size={16} color="#38BDF8" />
                  <Text style={styles.summaryText}>{gapReport.aiSkillGapSummary}</Text>
                </View>
              </View>
            </View>
          )}

          {/* TAB 3: EXPERTS */}
          {activeTab === 'EXPERTS' && (
            <View>
              {experts.map((exp) => (
                <View key={exp.id} style={styles.card}>
                  <View style={styles.cardHeader}>
                    <View style={styles.availBadge}>
                      <Text style={styles.availText}>{exp.availabilityStatus.replace(/_/g, ' ')}</Text>
                    </View>
                    <Text style={styles.repText}>Trust {exp.reputationIndex}/100</Text>
                  </View>

                  <Text style={styles.expertNameText}>{exp.expertName}</Text>
                  <Text style={styles.expertTitleText}>{exp.titleHeadline}</Text>

                  {/* Verified Domains */}
                  <View style={styles.domainsWrap}>
                    {exp.verifiedDomains.map((dom, dIdx) => (
                      <View key={dIdx} style={styles.domainChip}>
                        <Ionicons name="checkmark-circle" size={12} color="#10B981" />
                        <Text style={styles.domainChipText}>{dom}</Text>
                      </View>
                    ))}
                  </View>

                  {/* Public Contributions */}
                  <View style={styles.contribBox}>
                    <Text style={styles.contribHeader}>Public Demonstrated Contributions:</Text>
                    {exp.demonstratedPublicContributions.map((c, cIdx) => (
                      <View key={cIdx} style={styles.contribRow}>
                        <Ionicons name="code-slash" size={12} color="#6366F1" />
                        <Text style={styles.contribTitle}>{c.title} ({c.year})</Text>
                      </View>
                    ))}
                  </View>

                  <TouchableOpacity
                    style={styles.bookBtn}
                    onPress={() => handleBookConsultation(exp)}
                  >
                    <Ionicons name="chatbubbles-outline" size={14} color="#FFFFFF" />
                    <Text style={styles.bookBtnText}>Request Consultation</Text>
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
  card: {
    backgroundColor: '#111827',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  catBadge: { backgroundColor: 'rgba(99, 102, 241, 0.15)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  catBadgeText: { color: '#6366F1', fontSize: 10, fontWeight: '700' },
  levelsTag: { fontSize: 11, color: '#94A3B8' },
  cardTitle: { fontSize: 16, fontWeight: '700', color: '#F8FAFC', marginBottom: 6 },
  cardDesc: { fontSize: 13, color: '#94A3B8', lineHeight: 18, marginBottom: 12 },
  relatedBox: { backgroundColor: '#0F172A', borderRadius: 8, padding: 10 },
  relatedLabel: { fontSize: 10, fontWeight: '700', color: '#94A3B8', marginBottom: 6 },
  tagWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  tag: { backgroundColor: '#1E293B', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  tagText: { color: '#38BDF8', fontSize: 10 },
  gapList: { gap: 12, marginBottom: 14 },
  gapRow: { backgroundColor: '#0F172A', padding: 10, borderRadius: 8 },
  gapHead: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  gapName: { fontSize: 12, fontWeight: '600', color: '#F1F5F9' },
  coverageVal: { fontSize: 11, fontWeight: '700' },
  barBg: { height: 6, backgroundColor: '#1E293B', borderRadius: 3, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 3 },
  summaryBox: {
    flexDirection: 'row',
    gap: 8,
    backgroundColor: 'rgba(56, 189, 248, 0.1)',
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
  },
  summaryText: { fontSize: 11, color: '#BAE6FD', flex: 1, lineHeight: 15 },
  availBadge: { backgroundColor: 'rgba(16, 185, 129, 0.15)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  availText: { color: '#10B981', fontSize: 10, fontWeight: '700' },
  repText: { color: '#38BDF8', fontSize: 11, fontWeight: '700' },
  expertNameText: { fontSize: 16, fontWeight: '700', color: '#F8FAFC', marginBottom: 2 },
  expertTitleText: { fontSize: 12, color: '#94A3B8', marginBottom: 10 },
  domainsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 12 },
  domainChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#0F172A',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  domainChipText: { fontSize: 11, color: '#E2E8F0' },
  contribBox: { backgroundColor: '#0F172A', borderRadius: 8, padding: 10, marginBottom: 12 },
  contribHeader: { fontSize: 10, fontWeight: '700', color: '#94A3B8', marginBottom: 6 },
  contribRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  contribTitle: { fontSize: 11, color: '#CBD5E1' },
  bookBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#6366F1',
    paddingVertical: 10,
    borderRadius: 8,
  },
  bookBtnText: { color: '#FFFFFF', fontSize: 12, fontWeight: '700' },
});
