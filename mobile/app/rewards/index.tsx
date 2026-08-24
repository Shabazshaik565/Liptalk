import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Share,
  Alert,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Coins,
  ArrowLeft,
  Gift,
  Share2,
  Copy,
  TrendingUp,
  History,
  CheckCircle2,
  Sparkles,
  ArrowUpRight,
  ArrowDownLeft,
} from 'lucide-react-native';
import { Button } from '../../src/components/common/Button';
import { Badge } from '../../src/components/common/Badge';
import { RewardPerkCard } from '../../src/components/rewards/RewardPerkCard';
import { CardSkeleton } from '../../src/components/common/SkeletonLoader';
import { rewardsApi } from '../../src/api/domain.api';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../../src/constants/theme';

export default function RewardsScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [refreshing, setRefreshing] = useState(false);

  const { data: wallet, isLoading: loadingWallet, refetch: refetchWallet } = useQuery({
    queryKey: ['rewards_wallet'],
    queryFn: () => rewardsApi.getWallet(),
  });

  const { data: catalog = [], isLoading: loadingCatalog, refetch: refetchCatalog } = useQuery({
    queryKey: ['rewards_catalog'],
    queryFn: () => rewardsApi.getCatalog(),
  });

  const { data: referralInfo, refetch: refetchReferrals } = useQuery({
    queryKey: ['rewards_referrals'],
    queryFn: () => rewardsApi.getReferrals(),
  });

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([refetchWallet(), refetchCatalog(), refetchReferrals()]);
    setRefreshing(false);
  };

  const handleShareReferral = async () => {
    if (!referralInfo) return;
    try {
      await Share.share({
        message: `Join me on LipTalk — the verified business synergy and professional network. Use my referral code ${referralInfo.referralCode} to get 500 reward points: ${referralInfo.referralLink}`,
      });
    } catch {
      // Ignore
    }
  };

  const handleRedeem = async (rewardId: string) => {
    try {
      const res = await rewardsApi.redeemReward(rewardId);
      queryClient.invalidateQueries({ queryKey: ['rewards_wallet'] });
      queryClient.invalidateQueries({ queryKey: ['rewards_catalog'] });
      Alert.alert('Perk Claimed!', res.message || 'Reward redeemed successfully.');
    } catch (err: any) {
      Alert.alert('Redemption Failed', err.message || 'Unable to redeem reward.');
    }
  };

  const balance = wallet?.currentBalance || 0;

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={styles.topNav}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={20} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.topNavTitle}>REWARDS & WALLET</Text>
        <TouchableOpacity onPress={handleShareReferral} style={styles.backBtn}>
          <Share2 size={18} color="#FFF" />
        </TouchableOpacity>
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
        {/* Wallet Balance Card */}
        <View style={styles.walletCard}>
          <View style={styles.walletTopRow}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: SPACING.sm }}>
              <Image
                source={require('../../assets/mascot/mascot_default.png')}
                style={styles.walletMascot}
                resizeMode="contain"
              />
              <View style={styles.pointsBadge}>
                <Coins size={14} color={COLORS.accent} />
                <Text style={styles.pointsBadgeText}>POINTS LEDGER</Text>
              </View>
            </View>
            <Badge label="Verified Balance" variant="success" size="sm" />
          </View>

          <Text style={styles.balanceNumber}>
            {balance.toLocaleString()} <Text style={styles.ptsUnit}>Pts</Text>
          </Text>

          <View style={styles.statsRow}>
            <View style={styles.statCol}>
              <Text style={styles.statLabel}>LIFETIME EARNED</Text>
              <Text style={styles.statEarned}>
                +{wallet?.totalEarned?.toLocaleString() || '1,850'} Pts
              </Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statCol}>
              <Text style={styles.statLabel}>REDEEMED PERKS</Text>
              <Text style={styles.statRedeemed}>
                -{wallet?.totalRedeemed?.toLocaleString() || '0'} Pts
              </Text>
            </View>
          </View>
        </View>

        {/* Referral System Card */}
        {referralInfo && (
          <View style={styles.referralCard}>
            <View style={styles.referralHeader}>
              <Gift size={18} color={COLORS.primaryLight} />
              <View style={{ flex: 1 }}>
                <Text style={styles.referralTitle}>Invite Founders & Earn +500 Pts</Text>
                <Text style={styles.referralSub}>
                  Give 500 Pts, get 500 Pts when your invited contact completes their profile.
                </Text>
              </View>
            </View>

            <View style={styles.codeBox}>
              <Text style={styles.codeText}>{referralInfo.referralCode}</Text>
              <Button
                title="Share Link"
                variant="primary"
                size="sm"
                icon={<Share2 size={13} color="#FFF" />}
                onPress={handleShareReferral}
              />
            </View>
          </View>
        )}

        {/* Available Perks Catalog */}
        <Text style={styles.sectionHeading}>PARTNER PERKS & REDEMPTION STORE</Text>
        <Text style={styles.sectionSub}>
          Exchange your earned platform points for verified corporate benefits.
        </Text>

        {loadingCatalog ? (
          <CardSkeleton />
        ) : (
          catalog.map((reward) => (
            <RewardPerkCard
              key={reward.id}
              reward={reward}
              userBalance={balance}
              onRedeem={handleRedeem}
            />
          ))
        )}

        {/* Recent Ledger History */}
        <Text style={styles.sectionHeading}>RECENT POINTS ACTIVITY</Text>
        <View style={styles.historyCard}>
          {wallet?.recentTransactions && wallet.recentTransactions.length > 0 ? (
            wallet.recentTransactions.map((tx) => (
              <View key={tx.id} style={styles.txRow}>
                <View
                  style={[
                    styles.txIconBox,
                    tx.amount > 0 ? styles.txEarnedIcon : styles.txRedeemedIcon,
                  ]}
                >
                  {tx.amount > 0 ? (
                    <ArrowDownLeft size={16} color={COLORS.accent} />
                  ) : (
                    <ArrowUpRight size={16} color={COLORS.danger} />
                  )}
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.txDesc} numberOfLines={1}>
                    {tx.description}
                  </Text>
                  <Text style={styles.txTime}>{tx.createdAt}</Text>
                </View>
                <Text
                  style={[
                    styles.txAmount,
                    tx.amount > 0 ? styles.txAmountPlus : styles.txAmountMinus,
                  ]}
                >
                  {tx.amount > 0 ? `+${tx.amount}` : tx.amount} Pts
                </Text>
              </View>
            ))
          ) : (
            <Text style={styles.noHistoryText}>No transactions recorded yet.</Text>
          )}
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
    paddingHorizontal: SPACING.md,
    paddingTop: 48,
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
    fontSize: 14,
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
  walletCard: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.primaryDark,
    marginBottom: SPACING.md,
    ...SHADOWS.md,
  },
  walletTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  walletMascot: {
    width: 32,
    height: 32,
  },
  pointsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  pointsBadgeText: {
    color: COLORS.primaryLight,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  balanceNumber: {
    color: COLORS.textPrimary,
    fontSize: 34,
    fontWeight: '900',
    marginVertical: SPACING.sm,
  },
  ptsUnit: {
    fontSize: 18,
    color: COLORS.accent,
    fontWeight: '800',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.bgInput,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginTop: SPACING.xs,
  },
  statCol: {
    flex: 1,
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: COLORS.border,
    marginHorizontal: SPACING.md,
  },
  statLabel: {
    color: COLORS.textDim,
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  statEarned: {
    color: COLORS.accent,
    fontSize: 14,
    fontWeight: '800',
    marginTop: 2,
  },
  statRedeemed: {
    color: COLORS.textSecondary,
    fontSize: 14,
    fontWeight: '800',
    marginTop: 2,
  },
  referralCard: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.md,
  },
  referralHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.md,
    marginBottom: SPACING.md,
  },
  referralTitle: {
    color: COLORS.textPrimary,
    fontSize: 14.5,
    fontWeight: '800',
  },
  referralSub: {
    color: COLORS.textSecondary,
    fontSize: 11.5,
    marginTop: 2,
    lineHeight: 16,
  },
  codeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.bgInput,
    borderRadius: RADIUS.md,
    paddingLeft: SPACING.md,
    paddingRight: SPACING.xs,
    paddingVertical: SPACING.xs,
  },
  codeText: {
    color: COLORS.primaryLight,
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 1,
  },
  sectionHeading: {
    color: COLORS.textPrimary,
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0.8,
    marginTop: SPACING.md,
    marginBottom: 2,
  },
  sectionSub: {
    color: COLORS.textDim,
    fontSize: 11.5,
    marginBottom: SPACING.md,
  },
  historyCard: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.xl,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.lg,
  },
  txRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  txIconBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  txEarnedIcon: {
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
  },
  txRedeemedIcon: {
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
  },
  txDesc: {
    color: COLORS.textPrimary,
    fontSize: 12.5,
    fontWeight: '700',
  },
  txTime: {
    color: COLORS.textDim,
    fontSize: 10.5,
    marginTop: 1,
  },
  txAmount: {
    fontSize: 13,
    fontWeight: '900',
  },
  txAmountPlus: {
    color: COLORS.accent,
  },
  txAmountMinus: {
    color: COLORS.danger,
  },
  noHistoryText: {
    color: COLORS.textDim,
    fontSize: 12,
    textAlign: 'center',
    paddingVertical: SPACING.md,
  },
});
