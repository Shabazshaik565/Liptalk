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
import { ArrowLeft, Lightbulb, CheckCircle2, Code, MessageSquare } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { intelligenceApi } from '../../src/api/domain.api';
import { SkillGraphItem, ExpertProfileItem } from '../../src/types';
import { COLORS, RADIUS, SPACING, SHADOWS } from '../../src/constants/theme';

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
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} activeOpacity={0.8}>
          <ArrowLeft size={20} color="#FFFFFF" />
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
          activeOpacity={0.82}
        >
          <Text style={[styles.tabBtnText, activeTab === 'SKILLS' && styles.tabBtnTextActive]}>
            Skill Graph
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'GAP_ANALYSIS' && styles.tabBtnActive]}
          onPress={() => setActiveTab('GAP_ANALYSIS')}
          activeOpacity={0.82}
        >
          <Text style={[styles.tabBtnText, activeTab === 'GAP_ANALYSIS' && styles.tabBtnTextActive]}>
            Skill Gap Analysis
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'EXPERTS' && styles.tabBtnActive]}
          onPress={() => setActiveTab('EXPERTS')}
          activeOpacity={0.82}
        >
          <Text style={[styles.tabBtnText, activeTab === 'EXPERTS' && styles.tabBtnTextActive]}>
            Expert Network
          </Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
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
                            { color: req.currentCoveragePercent < 50 ? COLORS.danger : COLORS.accent },
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
                              backgroundColor: req.currentCoveragePercent < 50 ? COLORS.danger : COLORS.accent,
                            },
                          ]}
                        />
                      </View>
                    </View>
                  ))}
                </View>

                <View style={styles.summaryBox}>
                  <Lightbulb size={16} color={COLORS.info} />
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
                        <CheckCircle2 size={12} color={COLORS.accent} />
                        <Text style={styles.domainChipText}>{dom}</Text>
                      </View>
                    ))}
                  </View>

                  {/* Public Contributions */}
                  <View style={styles.contribBox}>
                    <Text style={styles.contribHeader}>Public Demonstrated Contributions:</Text>
                    {exp.demonstratedPublicContributions.map((c, cIdx) => (
                      <View key={cIdx} style={styles.contribRow}>
                        <Code size={12} color={COLORS.primaryLight} />
                        <Text style={styles.contribTitle}>{c.title} ({c.year})</Text>
                      </View>
                    ))}
                  </View>

                  <TouchableOpacity
                    style={styles.bookBtn}
                    onPress={() => handleBookConsultation(exp)}
                    activeOpacity={0.85}
                  >
                    <MessageSquare size={14} color="#FFFFFF" />
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
    backgroundColor: COLORS.bgCard,
    paddingHorizontal: SPACING.lg,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    gap: 8,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.bgInput,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  tabBtnActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primaryLight, ...SHADOWS.glowPrimary },
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
  catBadge: { backgroundColor: 'rgba(139, 92, 246, 0.15)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, borderWidth: 1, borderColor: 'rgba(139, 92, 246, 0.3)' },
  catBadgeText: { color: COLORS.primaryLight, fontSize: 10, fontWeight: '800' },
  levelsTag: { fontSize: 11, color: COLORS.textMuted, fontWeight: '600' },
  cardTitle: { fontSize: 16, fontWeight: '800', color: COLORS.textPrimary, marginBottom: 6 },
  cardDesc: { fontSize: 12.5, color: COLORS.textSecondary, lineHeight: 18, marginBottom: 12 },
  relatedBox: { backgroundColor: COLORS.bgInput, borderRadius: RADIUS.md, padding: 10, borderWidth: 1, borderColor: COLORS.borderLight },
  relatedLabel: { fontSize: 10, fontWeight: '800', color: COLORS.primaryLight, marginBottom: 6, letterSpacing: 0.4 },
  tagWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  tag: { backgroundColor: COLORS.bgElevated, paddingHorizontal: 8, paddingVertical: 3, borderRadius: RADIUS.sm, borderWidth: 1, borderColor: COLORS.border },
  tagText: { color: COLORS.info, fontSize: 10.5, fontWeight: '700' },
  gapList: { gap: 12, marginBottom: 14 },
  gapRow: { backgroundColor: COLORS.bgInput, padding: 10, borderRadius: RADIUS.md, borderWidth: 1, borderColor: COLORS.borderLight },
  gapHead: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  gapName: { fontSize: 12, fontWeight: '700', color: COLORS.textPrimary },
  coverageVal: { fontSize: 11, fontWeight: '800' },
  barBg: { height: 6, backgroundColor: COLORS.bgElevated, borderRadius: 3, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 3 },
  summaryBox: {
    flexDirection: 'row',
    gap: 8,
    backgroundColor: 'rgba(56, 189, 248, 0.1)',
    borderRadius: RADIUS.md,
    padding: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.25)',
  },
  summaryText: { fontSize: 11.5, color: '#BAE6FD', flex: 1, lineHeight: 15 },
  availBadge: { backgroundColor: 'rgba(16, 185, 129, 0.15)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, borderWidth: 1, borderColor: 'rgba(16, 185, 129, 0.3)' },
  availText: { color: COLORS.accent, fontSize: 10, fontWeight: '800' },
  repText: { color: COLORS.info, fontSize: 11, fontWeight: '800' },
  expertNameText: { fontSize: 16, fontWeight: '800', color: COLORS.textPrimary, marginBottom: 2 },
  expertTitleText: { fontSize: 12, color: COLORS.textMuted, marginBottom: 10 },
  domainsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 12 },
  domainChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.bgInput,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  domainChipText: { fontSize: 11, color: COLORS.textSecondary, fontWeight: '600' },
  contribBox: { backgroundColor: COLORS.bgInput, borderRadius: RADIUS.md, padding: 10, marginBottom: 12, borderWidth: 1, borderColor: COLORS.borderLight },
  contribHeader: { fontSize: 10, fontWeight: '800', color: COLORS.primaryLight, marginBottom: 6, letterSpacing: 0.4 },
  contribRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  contribTitle: { fontSize: 11, color: COLORS.textSecondary },
  bookBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.primary,
    paddingVertical: 11,
    borderRadius: RADIUS.md,
    ...SHADOWS.glowPrimary,
  },
  bookBtnText: { color: '#FFFFFF', fontSize: 12, fontWeight: '800' },
});
