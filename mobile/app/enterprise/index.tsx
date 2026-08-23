import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import {
  Building2,
  Users,
  Briefcase,
  TrendingUp,
  ShieldCheck,
  Plus,
  ChevronRight,
  Settings,
  Globe,
  MapPin,
  Layers,
  ArrowUpRight,
  UserPlus,
  BarChart3,
  Award,
} from 'lucide-react-native';
import { Header } from '../../src/components/common/Header';
import { Button } from '../../src/components/common/Button';
import { Badge } from '../../src/components/common/Badge';
import { CardSkeleton } from '../../src/components/common/SkeletonLoader';
import { enterpriseApi } from '../../src/api/domain.api';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../../src/constants/theme';

export default function EnterpriseWorkspaceScreen() {
  const router = useRouter();

  const { data: orgs, isLoading, refetch } = useQuery({
    queryKey: ['enterprise', 'my-orgs'],
    queryFn: () => enterpriseApi.getMyOrganizations(),
  });

  const activeOrgData = orgs?.[0];
  const org = activeOrgData?.organization;

  const { data: analytics } = useQuery({
    queryKey: ['enterprise', 'analytics', org?.id],
    queryFn: () => enterpriseApi.getAnalytics(org?.id || 'org_01'),
    enabled: !!org,
  });

  const { data: teams } = useQuery({
    queryKey: ['enterprise', 'teams', org?.id],
    queryFn: () => enterpriseApi.getTeams(org?.id || 'org_01'),
    enabled: !!org,
  });

  return (
    <View style={styles.container}>
      <Header
        title="Enterprise Workspace"
        showBack
        rightAction={
          <TouchableOpacity
            style={styles.headerBtn}
            onPress={() => router.push('/enterprise/members' as any)}
          >
            <Users size={18} color="#FFF" />
          </TouchableOpacity>
        }
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} tintColor={COLORS.primaryLight} />}
      >
        {/* Organization Card Banner */}
        {isLoading || !org ? (
          <CardSkeleton />
        ) : (
          <View style={styles.orgHeaderCard}>
            <View style={styles.orgTopRow}>
              <Image source={{ uri: org.logoUrl }} style={styles.orgLogo} />
              <View style={{ flex: 1 }}>
                <View style={styles.orgTitleRow}>
                  <Text style={styles.orgName}>{org.name}</Text>
                  <ShieldCheck size={16} color={COLORS.accent} />
                </View>
                <Text style={styles.orgIndustry}>{org.industry}</Text>
                <View style={styles.orgMetaRow}>
                  <View style={styles.metaBadge}>
                    <MapPin size={11} color={COLORS.textDim} />
                    <Text style={styles.metaText}>{org.location}</Text>
                  </View>
                  <View style={styles.metaBadge}>
                    <Users size={11} color={COLORS.textDim} />
                    <Text style={styles.metaText}>{org.employeeCountRange} emp</Text>
                  </View>
                </View>
              </View>
            </View>

            <Text style={styles.orgDescription}>{org.description}</Text>

            <View style={styles.orgRoleStrip}>
              <Text style={styles.roleLabel}>YOUR ROLE</Text>
              <Badge label={activeOrgData.userRole || 'OWNER'} variant="primary" size="sm" />
              <Text style={styles.jobTitleText}>• {activeOrgData.jobTitle}</Text>
            </View>
          </View>
        )}

        {/* Quick Enterprise Analytics */}
        <Text style={styles.sectionHeading}>ORGANIZATION METRICS & PIPELINE</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Active Team Seats</Text>
            <Text style={styles.statValue}>{analytics?.activeTeamSeats || 8} / {analytics?.allocatedSeats || 50}</Text>
            <Text style={styles.statSub}>42 seats remaining</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Ecosystem Pipeline</Text>
            <Text style={[styles.statValue, { color: COLORS.accent }]}>{analytics?.totalPipelineValue || '₹48.5L'}</Text>
            <Text style={styles.statSub}>{analytics?.collaborativeDealsActive || 14} active deals</Text>
          </View>
        </View>

        {/* Team Departments */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionHeading}>TEAMS & DIVISIONS ({teams?.length || 2})</Text>
          <TouchableOpacity
            style={styles.teamActionBtn}
            onPress={() => router.push('/enterprise/members' as any)}
          >
            <UserPlus size={14} color={COLORS.primaryLight} />
            <Text style={styles.teamActionText}>Manage Members</Text>
          </TouchableOpacity>
        </View>

        {teams?.map((team) => (
          <View key={team.id} style={styles.teamCard}>
            <View style={styles.teamIconBox}>
              <Layers size={18} color={COLORS.primaryLight} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.teamName}>{team.name}</Text>
              <Text style={styles.teamDescription}>{team.description}</Text>
              <Text style={styles.teamMeta}>{team.department} • {team.membersCount || 4} Members</Text>
            </View>
            <ChevronRight size={16} color={COLORS.textDim} />
          </View>
        ))}

        {/* Workspace Quick Actions */}
        <Text style={[styles.sectionHeading, { marginTop: SPACING.xl }]}>WORKSPACE MODULES</Text>
        <TouchableOpacity
          style={styles.moduleItem}
          onPress={() => router.push('/(tabs)/opportunities' as any)}
        >
          <View style={[styles.moduleIconCircle, { backgroundColor: 'rgba(139, 92, 246, 0.15)' }]}>
            <Briefcase size={16} color={COLORS.primaryLight} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.moduleTitle}>Team Demands & Procurement</Text>
            <Text style={styles.moduleSub}>Manage corporate needs and RFPs</Text>
          </View>
          <ArrowUpRight size={16} color={COLORS.textDim} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.moduleItem}
          onPress={() => router.push('/(tabs)/crm' as any)}
        >
          <View style={[styles.moduleIconCircle, { backgroundColor: 'rgba(16, 185, 129, 0.15)' }]}>
            <BarChart3 size={16} color={COLORS.accent} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.moduleTitle}>Shared B2B CRM Pipeline</Text>
            <Text style={styles.moduleSub}>Sync high-value leads across sales reps</Text>
          </View>
          <ArrowUpRight size={16} color={COLORS.textDim} />
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgDark,
  },
  scrollContent: {
    padding: SPACING.lg,
    paddingBottom: SPACING.xxxl,
  },
  headerBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.bgElevated,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  orgHeaderCard: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.lg,
    ...SHADOWS.sm,
  },
  orgTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    marginBottom: SPACING.sm,
  },
  orgLogo: {
    width: 54,
    height: 54,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.bgInput,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  orgTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  orgName: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '900',
  },
  orgIndustry: {
    color: COLORS.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },
  orgMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginTop: 6,
  },
  metaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.bgInput,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: RADIUS.sm,
  },
  metaText: {
    color: COLORS.textDim,
    fontSize: 10.5,
    fontWeight: '600',
  },
  orgDescription: {
    color: COLORS.textSecondary,
    fontSize: 12.5,
    lineHeight: 18,
    marginTop: SPACING.sm,
  },
  orgRoleStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: SPACING.md,
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  roleLabel: {
    color: COLORS.textDim,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  jobTitleText: {
    color: COLORS.textSecondary,
    fontSize: 11,
  },
  sectionHeading: {
    color: COLORS.textPrimary,
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.8,
    marginBottom: SPACING.sm,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: SPACING.md,
    marginBottom: SPACING.sm,
  },
  teamActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  teamActionText: {
    color: COLORS.primaryLight,
    fontSize: 11.5,
    fontWeight: '700',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  statLabel: {
    color: COLORS.textDim,
    fontSize: 10.5,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  statValue: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '900',
    marginTop: 4,
  },
  statSub: {
    color: COLORS.textDim,
    fontSize: 10.5,
    marginTop: 2,
  },
  teamCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.sm,
    gap: SPACING.md,
  },
  teamIconBox: {
    width: 38,
    height: 38,
    borderRadius: RADIUS.md,
    backgroundColor: 'rgba(124, 58, 237, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  teamName: {
    color: '#FFF',
    fontSize: 13.5,
    fontWeight: '800',
  },
  teamDescription: {
    color: COLORS.textDim,
    fontSize: 11,
    marginTop: 2,
  },
  teamMeta: {
    color: COLORS.primaryLight,
    fontSize: 10.5,
    fontWeight: '600',
    marginTop: 4,
  },
  moduleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.sm,
    gap: SPACING.md,
  },
  moduleIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  moduleTitle: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '800',
  },
  moduleSub: {
    color: COLORS.textDim,
    fontSize: 11,
    marginTop: 1,
  },
});
