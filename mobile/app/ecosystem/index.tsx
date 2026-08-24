import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  Globe,
  Briefcase,
  Layers,
  Sparkles,
  Users,
  GraduationCap,
  Store,
  DollarSign,
  TrendingUp,
  Award,
  CheckCircle2,
  ChevronRight,
  ShieldCheck,
  Bot,
} from 'lucide-react-native';
import { useEcosystemStore } from '../../src/store/ecosystem.store';
import { Button } from '../../src/components/common/Button';
import { Badge } from '../../src/components/common/Badge';
import { PillTabs } from '../../src/components/common/PillTabs';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../../src/constants/theme';

export default function EcosystemPlatformScreen() {
  const router = useRouter();
  const {
    projects,
    creatorServices,
    agentStore,
    mentors,
    matchedOpportunities,
    init,
    calculateSplit,
  } = useEcosystemStore();

  const [activeTab, setActiveTab] = useState<'PROJECTS' | 'CREATOR_ECONOMY' | 'AGENT_MARKETPLACE' | 'MENTORSHIP' | 'MATCHES'>('PROJECTS');
  const [splitAmount, setSplitAmount] = useState('50000');
  const [splitResult, setSplitResult] = useState<any>(null);

  useEffect(() => {
    init();
  }, []);

  const handleComputeSplit = async () => {
    const amt = parseFloat(splitAmount) || 50000;
    const res = await calculateSplit(amt, 'INR', true, true);
    setSplitResult(res);
  };

  return (
    <View style={styles.container}>
      {/* Top Navigation */}
      <View style={styles.topNav}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={20} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.topNavTitle}>GLOBAL ECOSYSTEM PLATFORM</Text>
        <View style={{ width: 36 }} />
      </View>

      {/* Tabs */}
      <View style={styles.tabWrap}>
        <PillTabs
          tabs={[
            { id: 'PROJECTS', label: `Projects (${projects.length})` },
            { id: 'CREATOR_ECONOMY', label: 'Creator Services' },
            { id: 'AGENT_MARKETPLACE', label: `Agent Store (${agentStore.length})` },
            { id: 'MENTORSHIP', label: 'Mentors' },
            { id: 'MATCHES', label: 'AI Matches' },
          ]}
          activeTab={activeTab}
          onTabChange={(t) => setActiveTab(t as any)}
        />
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* TAB 1: COLLABORATIVE PROJECTS */}
        {activeTab === 'PROJECTS' && (
          <View>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>Community & Open Source Projects</Text>
              <Badge label="Active Workspace" variant="purple" size="sm" />
            </View>

            {projects.map((p) => (
              <View key={p.id} style={styles.card}>
                <View style={styles.projectHeader}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.projectTitle}>{p.title}</Text>
                    <Text style={styles.projectDesc}>{p.description}</Text>
                  </View>
                  <Badge label={`${p.progressPercent}% DONE`} variant="success" size="sm" />
                </View>

                {/* Progress bar */}
                <View style={styles.progressBarBg}>
                  <View style={[styles.progressBarFill, { width: `${p.progressPercent}%` }]} />
                </View>

                {/* Milestones */}
                <View style={{ marginTop: SPACING.sm }}>
                  <Text style={styles.subHeading}>MILESTONES</Text>
                  {p.milestones?.map((m) => (
                    <View key={m.id} style={styles.milestoneRow}>
                      <CheckCircle2 size={13} color={m.completed ? '#10B981' : COLORS.textDim} />
                      <Text style={[styles.milestoneText, m.completed && { color: COLORS.textPrimary }]}>
                        {m.title} ({m.dueDate})
                      </Text>
                    </View>
                  ))}
                </View>

                {/* Tasks */}
                <View style={{ marginTop: SPACING.sm }}>
                  <Text style={styles.subHeading}>ACTIVE WORKSPACE TASKS</Text>
                  {p.tasks?.map((t) => (
                    <View key={t.id} style={styles.taskRow}>
                      <Badge label={t.status} variant={t.status === 'DONE' ? 'neutral' : 'warning'} size="sm" />
                      <Text style={styles.taskTitle}>{t.title}</Text>
                    </View>
                  ))}
                </View>
              </View>
            ))}
          </View>
        )}

        {/* TAB 2: CREATOR ECONOMY & REVENUE SPLIT */}
        {activeTab === 'CREATOR_ECONOMY' && (
          <View>
            {/* Split Calculator */}
            <View style={styles.splitBox}>
              <Text style={styles.splitTitle}>Transparent Platform Revenue Split Engine</Text>
              <Text style={styles.splitSub}>
                Guarantees zero hidden fees with automatic escrow distribution.
              </Text>
              <View style={{ flexDirection: 'row', gap: SPACING.sm, marginTop: SPACING.xs }}>
                <TextInput
                  style={styles.splitInput}
                  placeholder="Deal Amount (₹)"
                  placeholderTextColor={COLORS.textDim}
                  value={splitAmount}
                  onChangeText={setSplitAmount}
                  keyboardType="numeric"
                />
                <Button title="Compute Split" variant="primary" size="sm" onPress={handleComputeSplit} />
              </View>

              {splitResult && (
                <View style={styles.splitResultCard}>
                  <View style={styles.splitRow}>
                    <Text style={styles.splitLbl}>Gross Transaction Amount</Text>
                    <Text style={styles.splitVal}>₹{splitResult.totalGrossAmount.toLocaleString()}</Text>
                  </View>
                  <View style={styles.splitRow}>
                    <Text style={styles.splitLbl}>Platform Fee (5%)</Text>
                    <Text style={[styles.splitVal, { color: COLORS.textDim }]}>-₹{splitResult.platformFeeAmount}</Text>
                  </View>
                  <View style={styles.splitRow}>
                    <Text style={styles.splitLbl}>Co-Creator Collaborator Share (20%)</Text>
                    <Text style={[styles.splitVal, { color: '#60A5FA' }]}>₹{splitResult.collaboratorNetAmount}</Text>
                  </View>
                  <View style={styles.splitRow}>
                    <Text style={styles.splitLbl}>Community Treasury Share (5%)</Text>
                    <Text style={[styles.splitVal, { color: '#F59E0B' }]}>₹{splitResult.communityShareAmount}</Text>
                  </View>
                  <View style={[styles.splitRow, { borderTopWidth: 1, borderTopColor: COLORS.border, paddingTop: 6, marginTop: 4 }]}>
                    <Text style={[styles.splitLbl, { fontWeight: '900', color: '#FFF' }]}>Creator Net Payout</Text>
                    <Text style={[styles.splitVal, { color: '#10B981', fontSize: 14 }]}>₹{splitResult.creatorNetAmount.toLocaleString()}</Text>
                  </View>
                </View>
              )}
            </View>

            {/* Creator Services */}
            <View style={{ marginTop: SPACING.md }}>
              <Text style={styles.sectionTitle}>High-Ticket Creator Offerings</Text>
              {creatorServices.map((cs) => (
                <View key={cs.id} style={styles.card}>
                  <View style={styles.serviceHeader}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.serviceTitle}>{cs.title}</Text>
                      <Text style={styles.serviceCategory}>{cs.category} • {cs.pricingModel}</Text>
                    </View>
                    <Text style={styles.servicePrice}>₹{cs.price.toLocaleString()}</Text>
                  </View>
                  <Text style={styles.serviceDesc}>{cs.description}</Text>
                  <View style={styles.serviceFooter}>
                    <Text style={styles.ratingText}>⭐ {cs.averageRating} ({cs.completedOrdersCount} orders completed)</Text>
                    <Button title="Book Consultation" variant="primary" size="sm" onPress={() => {}} />
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* TAB 3: AGENT STORE */}
        {activeTab === 'AGENT_MARKETPLACE' && (
          <View>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>Certified AI Agent Store</Text>
              <Badge label="Sandboxed & Verified" variant="success" size="sm" />
            </View>

            {agentStore.map((ag) => (
              <View key={ag.id} style={styles.card}>
                <View style={styles.agentHeader}>
                  <View style={styles.agentIconCircle}>
                    <Bot size={20} color={COLORS.primaryLight} />
                  </View>
                  <View style={{ flex: 1, marginLeft: SPACING.sm }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                      <Text style={styles.agentTitle}>{ag.name}</Text>
                      <Badge label={ag.certificationStatus} variant="success" size="sm" />
                    </View>
                    <Text style={styles.agentCategory}>{ag.category} • ⭐ {ag.rating} ({ag.installsCount} installs)</Text>
                  </View>
                </View>

                <Text style={styles.agentDesc}>{ag.description}</Text>

                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginTop: SPACING.xs }}>
                  {ag.requiredScopes?.map((sc, i) => (
                    <Badge key={i} label={sc} variant="neutral" size="sm" />
                  ))}
                </View>

                <View style={styles.agentFooter}>
                  <Text style={styles.agentPrice}>{ag.price === 0 ? 'FREE' : `₹${ag.price}`}</Text>
                  <Button title="Install Agent" variant="primary" size="sm" onPress={() => {}} />
                </View>
              </View>
            ))}
          </View>
        )}

        {/* TAB 4: MENTORSHIP */}
        {activeTab === 'MENTORSHIP' && (
          <View>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>Community Mentors & Domain Experts</Text>
              <Badge label="Peer Guidance" variant="purple" size="sm" />
            </View>

            {mentors.map((m) => (
              <View key={m.id} style={styles.card}>
                <Text style={styles.mentorHeadline}>{m.headline}</Text>
                <Text style={styles.mentorBio}>{m.bio}</Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginTop: SPACING.xs }}>
                  {m.expertiseAreas?.map((ex, i) => (
                    <Badge key={i} label={ex} variant="neutral" size="sm" />
                  ))}
                </View>
                <View style={styles.mentorFooter}>
                  <Text style={styles.mentorStats}>⭐ {m.rating} • {m.menteesHelpedCount} founders guided</Text>
                  <Button title="Request Session" variant="primary" size="sm" onPress={() => {}} />
                </View>
              </View>
            ))}
          </View>
        )}

        {/* TAB 5: AI MATCHES */}
        {activeTab === 'MATCHES' && (
          <View>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>AI Synergy Opportunity Matches</Text>
              <Badge label="Personalized" variant="purple" size="sm" />
            </View>

            {matchedOpportunities.map((m, idx) => (
              <View key={idx} style={styles.card}>
                <View style={styles.matchHeader}>
                  <Badge label={`${m.matchScore}% SYNERGY MATCH`} variant="success" size="sm" />
                  <Text style={styles.matchCity}>{m.opportunity?.city || 'Global'}</Text>
                </View>
                <Text style={styles.matchTitle}>{m.opportunity?.title}</Text>
                <Text style={styles.matchReason}>💡 {m.matchReason}</Text>
                <Text style={styles.matchDesc}>{m.opportunity?.description}</Text>
                <Button title="Open Contract Brief" variant="glass" size="sm" style={{ marginTop: SPACING.xs }} onPress={() => {}} />
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgDark,
  },
  topNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xl + 10,
    paddingBottom: SPACING.sm,
    backgroundColor: COLORS.bgDark,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.bgCard,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topNavTitle: {
    color: COLORS.textPrimary,
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  tabWrap: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.xs,
    backgroundColor: COLORS.bgDark,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.lg,
    paddingBottom: SPACING.tabBarClearance,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  sectionTitle: {
    color: COLORS.textPrimary,
    fontSize: 13.5,
    fontWeight: '800',
    marginBottom: SPACING.xs,
  },
  card: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.xl,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.sm,
    ...SHADOWS.sm,
  },
  projectHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  projectTitle: {
    color: COLORS.textPrimary,
    fontSize: 14,
    fontWeight: '800',
  },
  projectDesc: {
    color: COLORS.textMuted,
    fontSize: 11,
    marginTop: 2,
    lineHeight: 15,
  },
  progressBarBg: {
    height: 5,
    backgroundColor: COLORS.bgInput,
    borderRadius: 3,
    marginTop: SPACING.sm,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#10B981',
  },
  subHeading: {
    color: COLORS.textDim,
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  milestoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 3,
  },
  milestoneText: {
    color: COLORS.textMuted,
    fontSize: 11,
  },
  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  taskTitle: {
    color: COLORS.textPrimary,
    fontSize: 11.5,
  },
  splitBox: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
    marginBottom: SPACING.sm,
  },
  splitTitle: {
    color: COLORS.textPrimary,
    fontSize: 13.5,
    fontWeight: '800',
  },
  splitSub: {
    color: COLORS.textMuted,
    fontSize: 11,
    marginTop: 2,
  },
  splitInput: {
    flex: 1,
    backgroundColor: COLORS.bgInput,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    color: COLORS.textPrimary,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    fontSize: 12,
  },
  splitResultCard: {
    backgroundColor: COLORS.bgDark,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginTop: SPACING.sm,
    gap: 4,
  },
  splitRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  splitLbl: {
    color: COLORS.textMuted,
    fontSize: 11,
  },
  splitVal: {
    color: COLORS.textPrimary,
    fontSize: 11.5,
    fontWeight: '700',
  },
  serviceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  serviceTitle: {
    color: COLORS.textPrimary,
    fontSize: 13.5,
    fontWeight: '800',
  },
  serviceCategory: {
    color: COLORS.textDim,
    fontSize: 10.5,
    marginTop: 1,
  },
  servicePrice: {
    color: '#10B981',
    fontSize: 15,
    fontWeight: '900',
  },
  serviceDesc: {
    color: COLORS.textMuted,
    fontSize: 11.5,
    marginTop: SPACING.xs,
    lineHeight: 16,
  },
  serviceFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.sm,
    paddingTop: SPACING.xs,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
  },
  ratingText: {
    color: COLORS.textDim,
    fontSize: 10.5,
  },
  agentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  agentIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  agentTitle: {
    color: COLORS.textPrimary,
    fontSize: 13.5,
    fontWeight: '800',
  },
  agentCategory: {
    color: COLORS.textDim,
    fontSize: 10.5,
    marginTop: 1,
  },
  agentDesc: {
    color: COLORS.textMuted,
    fontSize: 11.5,
    marginTop: SPACING.xs,
    lineHeight: 16,
  },
  agentFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.sm,
  },
  agentPrice: {
    color: COLORS.primaryLight,
    fontSize: 13,
    fontWeight: '800',
  },
  mentorHeadline: {
    color: COLORS.textPrimary,
    fontSize: 13.5,
    fontWeight: '800',
  },
  mentorBio: {
    color: COLORS.textMuted,
    fontSize: 11.5,
    marginTop: 2,
    lineHeight: 16,
  },
  mentorFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.sm,
  },
  mentorStats: {
    color: COLORS.textDim,
    fontSize: 10.5,
  },
  matchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  matchCity: {
    color: COLORS.textDim,
    fontSize: 10.5,
  },
  matchTitle: {
    color: COLORS.textPrimary,
    fontSize: 13.5,
    fontWeight: '800',
  },
  matchReason: {
    color: '#60A5FA',
    fontSize: 11,
    fontWeight: '700',
    marginTop: 2,
  },
  matchDesc: {
    color: COLORS.textMuted,
    fontSize: 11,
    marginTop: 4,
    lineHeight: 15,
  },
});
