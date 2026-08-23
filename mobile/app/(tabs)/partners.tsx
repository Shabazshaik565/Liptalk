import React from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { Handshake, ShieldCheck, Sparkles } from 'lucide-react-native';
import { Header } from '../../src/components/common/Header';
import { PartnerCard } from '../../src/components/partner/PartnerCard';
import { CardSkeleton } from '../../src/components/common/SkeletonLoader';
import { partnersApi } from '../../src/api/domain.api';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../../src/constants/theme';

export default function PartnersScreen() {
  const [refreshing, setRefreshing] = React.useState(false);

  const { data: partners, isLoading, refetch } = useQuery({
    queryKey: ['partners'],
    queryFn: () => partnersApi.getPartners(),
  });

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  return (
    <View style={styles.container}>
      <Header title="ECOSYSTEM PARTNERS" subtitle="EXCLUSIVE CORPORATE PERKS & CREDITS" />

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
        <View style={styles.banner}>
          <View style={styles.iconCircle}>
            <ShieldCheck size={24} color={COLORS.accent} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.bannerTitle}>Verified Corporate Ecosystem</Text>
            <Text style={styles.bannerSub}>
              Exclusive corporate credits, logistics tools, and growth infrastructure negotiated directly for Lip Talk members.
            </Text>
          </View>
        </View>

        {isLoading ? (
          <>
            <CardSkeleton />
            <CardSkeleton />
          </>
        ) : (
          partners &&
          partners.map((partner) => (
            <PartnerCard key={partner.id} partner={partner} />
          ))
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
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.lg,
    paddingBottom: SPACING.tabBarClearance,
  },
  banner: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    marginBottom: SPACING.lg,
    ...SHADOWS.sm,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  bannerTitle: {
    color: COLORS.textPrimary,
    fontSize: 15,
    fontWeight: '800',
  },
  bannerSub: {
    color: COLORS.textMuted,
    fontSize: 12,
    lineHeight: 16,
    marginTop: 2,
  },
});
