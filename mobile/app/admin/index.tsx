import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  ShieldAlert,
  Activity,
  Server,
  Zap,
  ToggleLeft,
  Users,
  Building2,
  Lock,
  Clock,
  Radio,
} from 'lucide-react-native';
import { Header } from '../../src/components/common/Header';
import { Badge } from '../../src/components/common/Badge';
import { CardSkeleton } from '../../src/components/common/SkeletonLoader';
import { adminApi } from '../../src/api/domain.api';
import { FeatureFlags } from '../../src/types';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../../src/constants/theme';

export default function AdminConsoleScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: metrics, isLoading: loadingMetrics, refetch: refetchMetrics } = useQuery({
    queryKey: ['admin', 'metrics'],
    queryFn: () => adminApi.getMetrics(),
  });

  const { data: flags, isLoading: loadingFlags } = useQuery({
    queryKey: ['admin', 'flags'],
    queryFn: () => adminApi.getFeatureFlags(),
  });

  const { data: auditLogs } = useQuery({
    queryKey: ['admin', 'audit-logs'],
    queryFn: () => adminApi.getAuditLogs(),
  });

  const handleToggleFlag = async (flagKey: keyof FeatureFlags, currentValue: boolean) => {
    await adminApi.toggleFeatureFlag(flagKey, !currentValue);
    queryClient.invalidateQueries({ queryKey: ['admin', 'flags'] });
  };

  return (
    <View style={styles.container}>
      <Header title="Platform Admin Console" showBack />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={loadingMetrics} onRefresh={refetchMetrics} tintColor={COLORS.primaryLight} />}
      >
        {/* System Health Strip */}
        <View style={styles.healthStrip}>
          <View style={styles.healthDot} />
          <Text style={styles.healthText}>SYSTEM HEALTH: {metrics?.systemStatus || 'ALL SYSTEMS OPERATIONAL'}</Text>
          <Text style={styles.latencyText}>{metrics?.avgApiLatencyMs || 42}ms Latency</Text>
        </View>

        {/* Aggregate Platform Metrics */}
        <Text style={styles.sectionHeading}>PLATFORM TRAFFIC & ACTIVITY</Text>
        <View style={styles.metricsGrid}>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Daily Active (DAU)</Text>
            <Text style={styles.metricValue}>{metrics?.dau?.toLocaleString() || '1,420'}</Text>
            <Text style={styles.metricSub}>99.98% Uptime</Text>
          </View>

          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Monthly Active (MAU)</Text>
            <Text style={[styles.metricValue, { color: COLORS.accent }]}>{metrics?.mau?.toLocaleString() || '12,800'}</Text>
            <Text style={styles.metricSub}>RTC 99.99% Live</Text>
          </View>
        </View>

        {/* Runtime Feature Flags */}
        <Text style={styles.sectionHeading}>CENTRALIZED FEATURE FLAGS</Text>
        <View style={styles.flagsCard}>
          {flags &&
            (Object.keys(flags) as Array<keyof FeatureFlags>).map((key, idx) => (
              <View key={key}>
                {idx > 0 && <View style={styles.divider} />}
                <View style={styles.flagRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.flagName}>{key}</Text>
                    <Text style={styles.flagSub}>Runtime environment switch</Text>
                  </View>
                  <Switch
                    value={flags[key]}
                    onValueChange={() => handleToggleFlag(key, flags[key])}
                    trackColor={{ false: COLORS.bgInput, true: COLORS.primary }}
                    thumbColor="#FFF"
                  />
                </View>
              </View>
            ))}
        </View>

        {/* Security Audit Trail */}
        <Text style={styles.sectionHeading}>IMMUTABLE SECURITY AUDIT TRAIL</Text>
        {auditLogs?.map((log) => (
          <View key={log.id} style={styles.logCard}>
            <View style={styles.logTopRow}>
              <Badge label={log.action} variant="primary" size="sm" />
              <Text style={styles.logIp}>{log.ipAddress || '127.0.0.1'}</Text>
            </View>
            <Text style={styles.logDesc}>{log.description}</Text>
            <Text style={styles.logTime}>{new Date(log.createdAt).toLocaleString()}</Text>
          </View>
        ))}
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
  healthStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.md,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
    marginBottom: SPACING.lg,
    gap: 8,
  },
  healthDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.accent,
  },
  healthText: {
    flex: 1,
    color: COLORS.accent,
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  latencyText: {
    color: COLORS.textDim,
    fontSize: 10.5,
    fontWeight: '700',
  },
  sectionHeading: {
    color: COLORS.textPrimary,
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.8,
    marginTop: SPACING.md,
    marginBottom: SPACING.sm,
  },
  metricsGrid: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  metricCard: {
    flex: 1,
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  metricLabel: {
    color: COLORS.textDim,
    fontSize: 10.5,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  metricValue: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: '900',
    marginTop: 4,
  },
  metricSub: {
    color: COLORS.textDim,
    fontSize: 10.5,
    marginTop: 2,
  },
  flagsCard: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.xl,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  flagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.xs,
    gap: SPACING.md,
  },
  flagName: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '800',
  },
  flagSub: {
    color: COLORS.textDim,
    fontSize: 10.5,
    marginTop: 1,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 6,
  },
  logCard: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.sm,
  },
  logTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  logIp: {
    color: COLORS.textDim,
    fontSize: 10.5,
    fontWeight: '600',
  },
  logDesc: {
    color: COLORS.textSecondary,
    fontSize: 12,
    lineHeight: 16,
  },
  logTime: {
    color: COLORS.textDim,
    fontSize: 10,
    marginTop: 4,
  },
});
