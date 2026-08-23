import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Building,
  TrendingUp,
  HelpCircle,
  Gift,
  LogOut,
  Sparkles,
  Award,
  Layers,
  ChevronRight,
  ShieldCheck,
  MapPin,
  Globe,
  Plus,
  Camera,
  Coins,
  Crown,
  Bookmark,
  ShoppingBag,
  Radio,
  Building2,
  Lock,
  ShieldAlert,
} from 'lucide-react-native';
import { Header } from '../../src/components/common/Header';
import { Badge } from '../../src/components/common/Badge';
import { Button } from '../../src/components/common/Button';
import { PillTabs, PillTabItem } from '../../src/components/common/PillTabs';
import { needsOffersApi, analyticsApi, usersApi, mediaApi } from '../../src/api/domain.api';
import { useAuthStore } from '../../src/store/auth.store';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../../src/constants/theme';

type ProfileTab = 'OVERVIEW' | 'NEEDS_OFFERS' | 'ANALYTICS';

export default function ProfileScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user, setUser, logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState<ProfileTab>('OVERVIEW');
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const { data: needs } = useQuery({
    queryKey: ['needs'],
    queryFn: needsOffersApi.getNeeds,
  });

  const { data: offers } = useQuery({
    queryKey: ['offers'],
    queryFn: needsOffersApi.getOffers,
  });

  const { data: analytics } = useQuery({
    queryKey: ['analytics'],
    queryFn: analyticsApi.getSummary,
  });

  const profileTabs: PillTabItem<ProfileTab>[] = [
    { id: 'OVERVIEW', label: 'Identity' },
    { id: 'NEEDS_OFFERS', label: 'Needs & Offers', count: (needs?.length || 0) + (offers?.length || 0) },
    { id: 'ANALYTICS', label: 'Analytics' },
  ];

  const handleAvatarChange = async () => {
    setUploadingAvatar(true);
    try {
      // Rotate through avatar samples or upload avatar
      const demoAvatars = [
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300',
        'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300',
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300',
      ];
      const nextAvatar = demoAvatars[Math.floor(Math.random() * demoAvatars.length)];

      if (user) {
        const updatedProfile = {
          ...(user.profile || {}),
          avatarUrl: nextAvatar,
        };
        const updatedUser = { ...user, profile: updatedProfile };
        await setUser(updatedUser as any);
        await usersApi.updateProfile({ avatarUrl: nextAvatar });
        queryClient.invalidateQueries({ queryKey: ['user', 'profile'] });
      }
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.replace('/(auth)/login' as any);
  };

  return (
    <View style={styles.container}>
      <Header title="MY PROFILE" subtitle="CREDENTIALS & MATCHING PREFERENCES" showActions={false} />

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Identity Card */}
        <View style={styles.profileHeaderCard}>
          <TouchableOpacity
            style={styles.avatarWrapper}
            onPress={handleAvatarChange}
            activeOpacity={0.8}
          >
            <Image
              source={{
                uri:
                  user?.profile?.avatarUrl ||
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
              }}
              style={styles.avatar}
            />
            {uploadingAvatar ? (
              <View style={styles.uploadOverlay}>
                <ActivityIndicator color="#FFFFFF" size="small" />
              </View>
            ) : (
              <View style={styles.cameraIconBtn}>
                <Camera size={11} color="#000" />
              </View>
            )}
            <View style={styles.verifiedCheck}>
              <ShieldCheck size={14} color="#000" />
            </View>
          </TouchableOpacity>

          <Text style={styles.profileName}>{user?.profile?.fullName || 'Alex Morgan'}</Text>
          <Text style={styles.profileHeadline}>
            {user?.profile?.headline || 'Founder @ Nexas Digital Solutions'}
          </Text>

          <View style={styles.roleBadgeRow}>
            <Badge label={user?.role || 'BUSINESS'} variant="primary" size="sm" />
            <Badge label={user?.profile?.city || 'Bangalore'} variant="neutral" size="sm" />
            <Badge label="100% Verified" variant="accent" size="sm" />
          </View>
        </View>

        {/* Tab Navigation */}
        <PillTabs
          tabs={profileTabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {/* Tab 1: OVERVIEW */}
        {activeTab === 'OVERVIEW' && (
          <View>
            {user?.business && (
              <View style={styles.sectionCard}>
                <View style={styles.sectionTitleRow}>
                  <Building size={16} color={COLORS.primaryLight} />
                  <Text style={styles.sectionTitle}>Business Organization</Text>
                </View>
                <Text style={styles.bizName}>{user.business.businessName}</Text>
                <Text style={styles.bizDesc}>{user.business.description}</Text>

                <Text style={styles.fieldSubhead}>Verified Services</Text>
                <View style={styles.servicesGrid}>
                  {user.business.services.map((s, idx) => (
                    <Badge key={idx} label={s} variant="neutral" size="sm" />
                  ))}
                </View>
              </View>
            )}

            <View style={styles.sectionCard}>
              <View style={styles.sectionTitleRow}>
                <Layers size={16} color={COLORS.accent} />
                <Text style={styles.sectionTitle}>Core Skills & Competencies</Text>
              </View>
              <View style={styles.servicesGrid}>
                {(user?.profile?.skills || [
                  'Mobile Development',
                  'React Native',
                  'NestJS',
                  'Cloud Architecture',
                  'Product Strategy',
                ]).map((sk, i) => (
                  <Badge key={i} label={sk} variant="purple" size="sm" />
                ))}
              </View>
            </View>

            <Button
              title="Open CRM Lead Pipeline"
              variant="glass"
              icon={<TrendingUp size={16} color={COLORS.accent} />}
              onPress={() => router.push('/leads' as any)}
              style={{ marginBottom: SPACING.md }}
            />
          </View>
        )}

        {/* Tab 2: NEEDS & OFFERS */}
        {activeTab === 'NEEDS_OFFERS' && (
          <View>
            <View style={styles.subHeadingRow}>
              <Text style={styles.subHeading}>WHAT I NEED ({needs?.length || 0})</Text>
              <TouchableOpacity
                onPress={() => router.push('/opportunities/create' as any)}
                style={styles.addSmallBtn}
                activeOpacity={0.75}
              >
                <Plus size={13} color={COLORS.primaryLight} />
                <Text style={styles.addSmallBtnText}>Add Need</Text>
              </TouchableOpacity>
            </View>

            {needs?.map((need) => (
              <View key={need.id} style={styles.itemCard}>
                <View style={styles.itemHeader}>
                  <Text style={styles.itemTitle}>{need.title}</Text>
                  <Badge
                    label={need.priority}
                    variant={need.priority === 'HIGH' ? 'danger' : 'warning'}
                    size="sm"
                  />
                </View>
                <Text style={styles.itemCategory}>
                  {need.categoryName} • {need.city}
                </Text>
                <Text style={styles.itemDesc}>{need.description}</Text>
              </View>
            ))}

            <View style={[styles.subHeadingRow, { marginTop: SPACING.lg }]}>
              <Text style={styles.subHeading}>WHAT I OFFER ({offers?.length || 0})</Text>
            </View>

            {offers?.map((offer) => (
              <View key={offer.id} style={styles.itemCard}>
                <View style={styles.itemHeader}>
                  <Text style={styles.itemTitle}>{offer.title}</Text>
                  <Badge label={offer.pricingModel} variant="accent" size="sm" />
                </View>
                <Text style={styles.itemCategory}>
                  {offer.categoryName} • {offer.city}
                </Text>
                <Text style={styles.itemDesc}>{offer.description}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Tab 3: BUSINESS ANALYTICS */}
        {activeTab === 'ANALYTICS' && (
          <View>
            <View style={styles.analyticsGrid}>
              <View style={styles.statBox}>
                <Text style={styles.statVal}>{analytics?.profileViews || 482}</Text>
                <Text style={styles.statLbl}>Profile Views</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={[styles.statVal, { color: COLORS.primaryLight }]}>
                  {analytics?.activeMatches || 19}
                </Text>
                <Text style={styles.statLbl}>Synergy Matches</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={[styles.statVal, { color: COLORS.accent }]}>
                  {analytics?.leadsConverted || 4} / {analytics?.leadsTotal || 12}
                </Text>
                <Text style={styles.statLbl}>Deals Won / Active</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={[styles.statVal, { color: COLORS.accent }]}>
                  ₹{((analytics?.pipelineValue || 730000) / 1000).toFixed(0)}k
                </Text>
                <Text style={styles.statLbl}>Pipeline Volume</Text>
              </View>
            </View>

            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>Opportunity Conversion Efficiency</Text>
              <Text style={styles.conversionBig}>
                {analytics?.conversionRatePercent || 33.3}%
              </Text>
              <Text style={styles.conversionSub}>
                Percentage of responded opportunity pitches successfully converted to active CRM revenue deals.
              </Text>
            </View>
          </View>
        )}

        {/* Commercial Ecosystem & Rewards Settings */}
        <View style={styles.ecosystemSectionCard}>
          <Text style={styles.ecosystemHeading}>INTELLIGENCE & ECOSYSTEM</Text>

          <TouchableOpacity
            style={styles.ecosystemRowItem}
            onPress={() => router.push('/creator' as any)}
          >
            <View style={[styles.ecosystemIconCircle, { backgroundColor: 'rgba(124, 58, 237, 0.15)' }]}>
              <Sparkles size={16} color={COLORS.primaryLight} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.ecosystemItemTitle}>Creator Studio & Broadcasting</Text>
              <Text style={styles.ecosystemItemSub}>Publish Teardowns • 1.1k Impressions</Text>
            </View>
            <ChevronRight size={16} color={COLORS.textDim} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.ecosystemRowItem}
            onPress={() => router.push('/live' as any)}
          >
            <View style={[styles.ecosystemIconCircle, { backgroundColor: 'rgba(239, 68, 68, 0.15)' }]}>
              <Radio size={16} color={COLORS.danger} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.ecosystemItemTitle}>Live Stages & Audio Rooms</Text>
              <Text style={styles.ecosystemItemSub}>Host Stage • Join Founder Mixers</Text>
            </View>
            <ChevronRight size={16} color={COLORS.textDim} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.ecosystemRowItem}
            onPress={() => router.push('/profile/intelligence' as any)}
          >
            <View style={[styles.ecosystemIconCircle, { backgroundColor: 'rgba(139, 92, 246, 0.15)' }]}>
              <Sparkles size={16} color={COLORS.primaryLight} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.ecosystemItemTitle}>Profile Intelligence Audit</Text>
              <Text style={styles.ecosystemItemSub}>85% Optimized • +25% Synergy Boost Tips</Text>
            </View>
            <ChevronRight size={16} color={COLORS.textDim} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.ecosystemRowItem}
            onPress={() => router.push('/rewards' as any)}
          >
            <View style={[styles.ecosystemIconCircle, { backgroundColor: 'rgba(16, 185, 129, 0.15)' }]}>
              <Coins size={16} color={COLORS.accent} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.ecosystemItemTitle}>Rewards Ledger & Wallet</Text>
              <Text style={styles.ecosystemItemSub}>1,850 Pts Available • Redeem Perks</Text>
            </View>
            <ChevronRight size={16} color={COLORS.textDim} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.ecosystemRowItem}
            onPress={() => router.push('/membership' as any)}
          >
            <View style={[styles.ecosystemIconCircle, { backgroundColor: 'rgba(245, 158, 11, 0.15)' }]}>
              <Crown size={16} color="#FBBF24" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.ecosystemItemTitle}>Membership & Tier Entitlements</Text>
              <Text style={styles.ecosystemItemSub}>Executive Pro • 2x Priority Active</Text>
            </View>
            <ChevronRight size={16} color={COLORS.textDim} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.ecosystemRowItem}
            onPress={() => router.push('/marketplace' as any)}
          >
            <View style={[styles.ecosystemIconCircle, { backgroundColor: 'rgba(139, 92, 246, 0.15)' }]}>
              <ShoppingBag size={16} color={COLORS.primaryLight} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.ecosystemItemTitle}>B2B Marketplace Directory</Text>
              <Text style={styles.ecosystemItemSub}>Manage Offerings & Quotes</Text>
            </View>
            <ChevronRight size={16} color={COLORS.textDim} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.ecosystemRowItem}
            onPress={() => router.push('/enterprise' as any)}
          >
            <View style={[styles.ecosystemIconCircle, { backgroundColor: 'rgba(59, 130, 246, 0.15)' }]}>
              <Building2 size={16} color="#60A5FA" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.ecosystemItemTitle}>Enterprise Organization Workspace</Text>
              <Text style={styles.ecosystemItemSub}>FinFlow Technologies • 8 Team Seats</Text>
            </View>
            <ChevronRight size={16} color={COLORS.textDim} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.ecosystemRowItem}
            onPress={() => router.push('/trust' as any)}
          >
            <View style={[styles.ecosystemIconCircle, { backgroundColor: 'rgba(16, 185, 129, 0.15)' }]}>
              <ShieldCheck size={16} color={COLORS.accent} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.ecosystemItemTitle}>Trust & Safety Center</Text>
              <Text style={styles.ecosystemItemSub}>Score: 92/100 • Tier 1 Executive</Text>
            </View>
            <ChevronRight size={16} color={COLORS.textDim} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.ecosystemRowItem}
            onPress={() => router.push('/privacy' as any)}
          >
            <View style={[styles.ecosystemIconCircle, { backgroundColor: 'rgba(124, 58, 237, 0.15)' }]}>
              <Lock size={16} color={COLORS.primaryLight} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.ecosystemItemTitle}>Privacy & Data Governance</Text>
              <Text style={styles.ecosystemItemSub}>Export Data • Session Control</Text>
            </View>
            <ChevronRight size={16} color={COLORS.textDim} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.ecosystemRowItem, { borderBottomWidth: 0 }]}
            onPress={() => router.push('/admin' as any)}
          >
            <View style={[styles.ecosystemIconCircle, { backgroundColor: 'rgba(239, 68, 68, 0.15)' }]}>
              <ShieldAlert size={16} color={COLORS.danger} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.ecosystemItemTitle}>Platform Admin Console</Text>
              <Text style={styles.ecosystemItemSub}>Health: OK • Feature Flags • Audit</Text>
            </View>
            <ChevronRight size={16} color={COLORS.textDim} />
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <Button
          title="Sign Out of Lip Talk"
          variant="danger"
          size="md"
          icon={<LogOut size={16} color="#FFF" />}
          onPress={handleLogout}
          style={{ marginTop: SPACING.xl, marginBottom: SPACING.xxxl }}
        />
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
  profileHeaderCard: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    marginBottom: SPACING.md,
    ...SHADOWS.sm,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: SPACING.xs,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 2.5,
    borderColor: COLORS.primary,
    backgroundColor: COLORS.bgElevated,
  },
  uploadOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraIconBtn: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  verifiedCheck: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: COLORS.accent,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.bgCard,
  },
  profileName: {
    color: COLORS.textPrimary,
    fontSize: 19,
    fontWeight: '900',
    marginTop: 4,
  },
  profileHeadline: {
    color: COLORS.textSecondary,
    fontSize: 13,
    textAlign: 'center',
    marginTop: 2,
    marginBottom: SPACING.md,
  },
  roleBadgeRow: {
    flexDirection: 'row',
    gap: SPACING.xs,
  },
  sectionCard: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.md,
    ...SHADOWS.sm,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: SPACING.xs,
  },
  sectionTitle: {
    color: COLORS.textPrimary,
    fontSize: 14,
    fontWeight: '800',
  },
  bizName: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: '900',
    marginTop: 2,
  },
  bizDesc: {
    color: COLORS.textSecondary,
    fontSize: 13,
    lineHeight: 18,
    marginVertical: SPACING.xs,
  },
  fieldSubhead: {
    color: COLORS.primaryLight,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginTop: SPACING.sm,
    marginBottom: 4,
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 2,
  },
  subHeadingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  subHeading: {
    color: COLORS.primaryLight,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
  },
  addSmallBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  addSmallBtnText: {
    color: COLORS.primaryLight,
    fontSize: 11,
    fontWeight: '800',
  },
  itemCard: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.sm,
    ...SHADOWS.sm,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemTitle: {
    color: COLORS.textPrimary,
    fontSize: 14,
    fontWeight: '800',
    flex: 1,
    paddingRight: SPACING.xs,
  },
  itemCategory: {
    color: COLORS.textDim,
    fontSize: 11,
    marginTop: 2,
  },
  itemDesc: {
    color: COLORS.textSecondary,
    fontSize: 12,
    lineHeight: 16,
    marginTop: SPACING.xs,
  },
  analyticsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  statBox: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
  },
  statVal: {
    color: COLORS.textPrimary,
    fontSize: 22,
    fontWeight: '900',
  },
  statLbl: {
    color: COLORS.textDim,
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
  conversionBig: {
    color: COLORS.accent,
    fontSize: 32,
    fontWeight: '900',
    marginVertical: 4,
  },
  conversionSub: {
    color: COLORS.textMuted,
    fontSize: 12,
    lineHeight: 16,
  },
  ecosystemSectionCard: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.xl,
    padding: SPACING.md,
    marginTop: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
  },
  ecosystemHeading: {
    color: COLORS.textDim,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.8,
    marginBottom: SPACING.xs,
    paddingHorizontal: 4,
  },
  ecosystemRowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    paddingVertical: SPACING.sm,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  ecosystemIconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ecosystemItemTitle: {
    color: COLORS.textPrimary,
    fontSize: 13,
    fontWeight: '800',
  },
  ecosystemItemSub: {
    color: COLORS.textDim,
    fontSize: 11,
    marginTop: 1,
  },
});
