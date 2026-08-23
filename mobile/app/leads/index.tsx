import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { TrendingUp, CheckCircle2 } from 'lucide-react-native';
import { Header } from '../../src/components/common/Header';
import { LeadCard } from '../../src/components/lead/LeadCard';
import { PillTabs, PillTabItem } from '../../src/components/common/PillTabs';
import { EmptyState } from '../../src/components/common/EmptyState';
import { CardSkeleton } from '../../src/components/common/SkeletonLoader';
import { leadsApi } from '../../src/api/domain.api';
import { LeadStatus } from '../../src/types';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../../src/constants/theme';

type StageFilter = 'ALL' | 'NEW' | 'CONTACTED' | 'IN_DISCUSSION' | 'QUALIFIED' | 'CONVERTED';

export default function LeadsScreen() {
  const router = useRouter();
  const [selectedStatus, setSelectedStatus] = useState<StageFilter>('ALL');
  const [refreshing, setRefreshing] = useState(false);

  const { data: leads, isLoading, refetch } = useQuery({
    queryKey: ['leads'],
    queryFn: () => leadsApi.getLeads(),
  });

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const stageTabs: PillTabItem<StageFilter>[] = [
    { id: 'ALL', label: 'All Deals', count: leads?.length || 0 },
    { id: 'NEW', label: 'New' },
    { id: 'IN_DISCUSSION', label: 'In Discussion' },
    { id: 'QUALIFIED', label: 'Qualified' },
    { id: 'CONVERTED', label: 'Won / Converted' },
  ];

  const filteredLeads = (leads || []).filter((l) => {
    if (selectedStatus === 'ALL') return true;
    return l.status === selectedStatus;
  });

  const totalValue = (leads || []).reduce((acc, curr) => acc + (curr.estimatedValue || 0), 0);
  const wonValue = (leads || [])
    .filter((l) => l.status === 'CONVERTED')
    .reduce((acc, curr) => acc + (curr.estimatedValue || 0), 0);

  return (
    <View style={styles.container}>
      <Header
        title="CRM PIPELINE"
        subtitle="LEAD TRACKING & DEAL CLOSING"
        showBack
        onBack={() => router.back()}
      />

      {/* Pipeline Summary Bar */}
      <View style={styles.summaryBar}>
        <View>
          <Text style={styles.summaryLabel}>ACTIVE PIPELINE VOLUME</Text>
          <Text style={styles.summaryVal}>₹{totalValue.toLocaleString('en-IN')}</Text>
        </View>

        <View style={styles.summaryRight}>
          <View style={styles.wonPill}>
            <CheckCircle2 size={12} color={COLORS.accent} />
            <Text style={styles.wonText}>₹{(wonValue / 1000).toFixed(0)}k Won</Text>
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.primary}
            colors={[COLORS.primary, COLORS.accent]}
          />
        }
      >
        {/* Stage Filter Selector */}
        <PillTabs
          tabs={stageTabs}
          activeTab={selectedStatus}
          onTabChange={setSelectedStatus}
          scrollable
        />

        {/* Leads List */}
        {isLoading ? (
          <>
            <CardSkeleton />
            <CardSkeleton />
          </>
        ) : filteredLeads.length > 0 ? (
          filteredLeads.map((lead) => (
            <LeadCard key={lead.id} lead={lead} />
          ))
        ) : (
          <EmptyState
            icon={<TrendingUp size={24} color={COLORS.accent} />}
            title="No Deals in this Stage"
            description="Leads automatically generate from opportunity pitches and mutual synergy matches."
            actionTitle="View All Deals"
            onAction={() => setSelectedStatus('ALL')}
          />
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
  summaryBar: {
    backgroundColor: COLORS.bgCard,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  summaryLabel: {
    color: COLORS.primaryLight,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  summaryVal: {
    color: COLORS.accent,
    fontSize: 22,
    fontWeight: '900',
    marginTop: 2,
  },
  summaryRight: {
    alignItems: 'flex-end',
  },
  wonPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  wonText: {
    color: COLORS.accent,
    fontSize: 12,
    fontWeight: '800',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.lg,
    paddingBottom: SPACING.hero,
  },
});
