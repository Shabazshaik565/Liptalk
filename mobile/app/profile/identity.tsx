import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  ShieldCheck,
  Award,
  CheckCircle2,
  Lock,
  ExternalLink,
  Code2,
  Users,
  ShoppingBag,
  Sparkles,
} from 'lucide-react-native';
import { useEcosystemStore } from '../../src/store/ecosystem.store';
import { useAgentsStore } from '../../src/store/agents.store';
import { Badge } from '../../src/components/common/Badge';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../../src/constants/theme';

export default function DigitalIdentityScreen() {
  const router = useRouter();
  const { reputation, init } = useEcosystemStore();
  const { apps, init: initApps } = useAgentsStore();

  useEffect(() => {
    init();
    initApps();
  }, []);

  return (
    <View style={styles.container}>
      {/* Top Navigation */}
      <View style={styles.topNav}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={20} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.topNavTitle}>DIGITAL IDENTITY & REPUTATION</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Trust Tier Banner */}
        <View style={styles.bannerCard}>
          <View style={styles.bannerTop}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: SPACING.sm }}>
              <ShieldCheck size={28} color="#10B981" />
              <View>
                <Text style={styles.bannerTitle}>Verified Ecosystem Entity</Text>
                <Text style={styles.bannerSub}>Tier 1 Cryptographically Verified Participant</Text>
              </View>
            </View>
            <Badge label={`${reputation?.overallTrustScore || 92}/100`} variant="success" size="md" />
          </View>

          {/* Badges */}
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: SPACING.md }}>
            {(reputation?.badges || ['VERIFIED_DEVELOPER', 'COMMUNITY_MENTOR', 'TOP_CONTRIBUTOR']).map((b, i) => (
              <Badge key={i} label={`✓ ${b}`} variant="purple" size="sm" />
            ))}
          </View>
        </View>

        {/* Multi-Context Reputation Scores */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Context-Specific Reputation Scores</Text>
          <View style={styles.card}>
            {[
              { label: 'B2B Marketplace & Trade', score: reputation?.marketplaceReputation || 92, icon: <ShoppingBag size={15} color="#10B981" /> },
              { label: 'Community Guild Contributions', score: reputation?.communityReputation || 95, icon: <Users size={15} color="#60A5FA" /> },
              { label: 'Creator Content & Teardowns', score: reputation?.creatorReputation || 88, icon: <Sparkles size={15} color="#EC4899" /> },
              { label: 'Developer Platform & API Reliability', score: reputation?.developerReputation || 94, icon: <Code2 size={15} color="#F59E0B" /> },
              { label: 'Knowledge Hub & Open Source', score: reputation?.contributorReputation || 90, icon: <Award size={15} color={COLORS.primaryLight} /> },
            ].map((item, idx) => (
              <View key={idx}>
                <View style={styles.repRow}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: SPACING.xs, flex: 1 }}>
                    {item.icon}
                    <Text style={styles.repLabel}>{item.label}</Text>
                  </View>
                  <Text style={styles.repScore}>{item.score}%</Text>
                </View>
                {idx < 4 && <View style={styles.rowDivider} />}
              </View>
            ))}
          </View>
        </View>

        {/* Connected OAuth Applications */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Authorized Connected Applications ({apps.length})</Text>
          {apps.map((app) => (
            <View key={app.id} style={styles.appCard}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <Text style={styles.appName}>{app.name}</Text>
                <Badge label="AUTHORIZED" variant="success" size="sm" />
              </View>
              <Text style={styles.appScopes}>Scopes: {app.scopes?.join(', ')}</Text>
            </View>
          ))}
        </View>
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
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.lg,
    paddingBottom: SPACING.tabBarClearance,
  },
  bannerCard: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.xl,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
    marginBottom: SPACING.lg,
    ...SHADOWS.md,
  },
  bannerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bannerTitle: {
    color: COLORS.textPrimary,
    fontSize: 14.5,
    fontWeight: '900',
  },
  bannerSub: {
    color: COLORS.textMuted,
    fontSize: 11,
    marginTop: 1,
  },
  section: {
    marginBottom: SPACING.lg,
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
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
  repRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.md,
  },
  repLabel: {
    color: COLORS.textPrimary,
    fontSize: 12.5,
    fontWeight: '700',
  },
  repScore: {
    color: '#10B981',
    fontSize: 13,
    fontWeight: '900',
  },
  rowDivider: {
    height: 1,
    backgroundColor: COLORS.border,
  },
  appCard: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.xs,
  },
  appName: {
    color: COLORS.textPrimary,
    fontSize: 13,
    fontWeight: '800',
  },
  appScopes: {
    color: COLORS.textDim,
    fontSize: 10.5,
    marginTop: 2,
    fontFamily: 'monospace',
  },
});
