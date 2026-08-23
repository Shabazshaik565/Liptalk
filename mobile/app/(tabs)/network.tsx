import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import {
  Search,
  UserCheck,
  MessageSquare,
  Check,
  UserPlus,
  MapPin,
  Sparkles,
  ShieldCheck,
} from 'lucide-react-native';
import { Header } from '../../src/components/common/Header';
import { Input } from '../../src/components/common/Input';
import { Badge } from '../../src/components/common/Badge';
import { Button } from '../../src/components/common/Button';
import { PillTabs, PillTabItem } from '../../src/components/common/PillTabs';
import { EmptyState } from '../../src/components/common/EmptyState';
import { CardSkeleton } from '../../src/components/common/SkeletonLoader';
import { usersApi } from '../../src/api/domain.api';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../../src/constants/theme';

type FilterType = 'ALL' | 'BUSINESSES' | 'INDIVIDUALS' | 'CONNECTED';

const FALLBACK_MEMBERS = [
  {
    id: 'net_01',
    name: 'GrowthPulse Media',
    avatarUrl: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=150',
    role: 'BUSINESS' as const,
    category: 'Digital Marketing & Growth',
    headline: 'B2B Performance Marketing & Multi-Channel Lead Acquisition',
    city: 'Bangalore',
    offers: 'B2B Lead Gen, LinkedIn Ads',
    needs: 'React Native Dev Team',
    synergyMatch: 94,
  },
  {
    id: 'net_02',
    name: 'FinFlow Logistics Tech',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    role: 'BUSINESS' as const,
    category: 'IT & Software Development',
    headline: 'Fleet Telematics, Driver Dispatch & Route AI Software',
    city: 'Bangalore',
    offers: 'Fleet SaaS, Telematics API',
    needs: 'Cross-Platform Mobile App',
    synergyMatch: 96,
  },
  {
    id: 'net_03',
    name: 'LexTech Advisors LLP',
    avatarUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=150',
    role: 'BUSINESS' as const,
    category: 'Legal & Corporate Compliance',
    headline: 'Technology Law, Startup IP, SaaS Contracts & MSAs',
    city: 'Bangalore',
    offers: 'Corporate Retainer, MSA Contracts',
    needs: 'Accounting Software Advisory',
    synergyMatch: 89,
  },
  {
    id: 'net_04',
    name: 'Rohit Sharma',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    role: 'INDIVIDUAL' as const,
    category: 'Digital Marketing & Growth',
    headline: 'Senior Growth Strategist & Paid Ads Consultant',
    city: 'Bangalore',
    offers: 'Performance Ads & Meta/Google Funnels',
    needs: 'UI/UX Designer',
    synergyMatch: 86,
  },
  {
    id: 'net_05',
    name: 'Priya Nair',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150',
    role: 'INDIVIDUAL' as const,
    category: 'UI/UX & Product Design',
    headline: 'Principal Design Lead & Figma Design System Architect',
    city: 'Mumbai',
    offers: 'Mobile UI/UX, Design Systems',
    needs: 'Backend API Engineering',
    synergyMatch: 91,
  },
];

export default function NetworkScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('ALL');
  const [refreshing, setRefreshing] = useState(false);

  const [connectionsState, setConnectionsState] = useState<Record<string, boolean>>({
    net_01: true,
  });

  const { data: serverUsers = [], isLoading, refetch } = useQuery({
    queryKey: ['network_users', searchQuery, selectedFilter],
    queryFn: () =>
      usersApi.getUsers({
        search: searchQuery || undefined,
        role:
          selectedFilter === 'BUSINESSES'
            ? 'BUSINESS'
            : selectedFilter === 'INDIVIDUALS'
            ? 'INDIVIDUAL'
            : undefined,
      }),
  });

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  // Merge server users or use fallback
  const rawList = serverUsers.length > 0
    ? serverUsers.map((u: any) => {
        const isBiz = u.role === 'BUSINESS' && u.businesses && u.businesses[0];
        return {
          id: u.id,
          name: isBiz
            ? u.businesses[0].businessName
            : u.profile?.fullName || `${u.profile?.firstName || ''} ${u.profile?.lastName || ''}`.trim() || 'Lip Talk Member',
          avatarUrl: isBiz
            ? u.businesses[0].logoUrl
            : u.profile?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
          role: u.role || 'INDIVIDUAL',
          category: isBiz ? u.businesses[0].categoryName : u.profile?.skills?.[0] || 'Professional',
          headline: isBiz ? u.businesses[0].description : u.profile?.headline || 'Verified Member',
          city: u.profile?.city || 'Bangalore',
          offers: (u.offers || []).map((o: any) => o.title).join(', ') || 'Custom Services',
          needs: (u.needs || []).map((n: any) => n.title).join(', ') || 'Strategic Partners',
          synergyMatch: 92,
        };
      })
    : FALLBACK_MEMBERS;

  const filterTabs: PillTabItem<FilterType>[] = [
    { id: 'ALL', label: 'All Members', count: rawList.length },
    { id: 'BUSINESSES', label: 'Businesses', count: rawList.filter((m: any) => m.role === 'BUSINESS').length },
    { id: 'INDIVIDUALS', label: 'Professionals', count: rawList.filter((m: any) => m.role === 'INDIVIDUAL').length },
    { id: 'CONNECTED', label: 'My Network', count: Object.values(connectionsState).filter(Boolean).length },
  ];

  const filteredMembers = rawList.filter((m: any) => {
    if (selectedFilter === 'BUSINESSES' && m.role !== 'BUSINESS') return false;
    if (selectedFilter === 'INDIVIDUALS' && m.role !== 'INDIVIDUAL') return false;
    if (selectedFilter === 'CONNECTED' && !connectionsState[m.id]) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        m.name.toLowerCase().includes(q) ||
        m.category.toLowerCase().includes(q) ||
        m.offers.toLowerCase().includes(q) ||
        m.needs.toLowerCase().includes(q) ||
        m.headline.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const toggleConnect = (id: string) => {
    setConnectionsState((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <View style={styles.container}>
      <Header title="NETWORK DISCOVERY" subtitle="VERIFIED PROFILES & ENTITIES" />

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
        {/* Search Bar */}
        <Input
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search by skill, need, offer, category, or founder..."
          icon={<Search size={18} color={COLORS.textDim} />}
          containerStyle={{ marginBottom: SPACING.sm }}
        />

        {/* Filter Pills */}
        <PillTabs
          tabs={filterTabs}
          activeTab={selectedFilter}
          onTabChange={setSelectedFilter}
          scrollable
        />

        {/* Member Cards List */}
        <View style={styles.listContainer}>
          {isLoading ? (
            <>
              <CardSkeleton />
              <CardSkeleton />
            </>
          ) : filteredMembers.length > 0 ? (
            filteredMembers.map((m: any) => {
              const isConnected = connectionsState[m.id];
              return (
                <View key={m.id} style={styles.memberCard}>
                  {/* Top Bar with Avatar, Name, and Synergy Badge */}
                  <View style={styles.memberTop}>
                    <Image source={{ uri: m.avatarUrl }} style={styles.avatar} />
                    <View style={styles.nameCol}>
                      <View style={styles.nameRow}>
                        <Text style={styles.name} numberOfLines={1}>
                          {m.name}
                        </Text>
                        <Badge
                          label={m.role}
                          variant={m.role === 'BUSINESS' ? 'primary' : 'neutral'}
                          size="sm"
                        />
                      </View>
                      <View style={styles.cityRow}>
                        <MapPin size={11} color={COLORS.textDim} />
                        <Text style={styles.cityText}>
                          {m.city} • {m.category}
                        </Text>
                      </View>
                    </View>

                    {m.synergyMatch && (
                      <View style={styles.synergyMatchPill}>
                        <Sparkles size={11} color={COLORS.accent} />
                        <Text style={styles.synergyMatchText}>{m.synergyMatch}%</Text>
                      </View>
                    )}
                  </View>

                  {/* Headline */}
                  <Text style={styles.headline} numberOfLines={2}>
                    {m.headline}
                  </Text>

                  {/* Offers & Needs Synergy Grid */}
                  <View style={styles.synergyGrid}>
                    <View style={styles.synergyRow}>
                      <Text style={styles.synergyOfferLabel}>OFFERS</Text>
                      <Text style={styles.synergyVal} numberOfLines={1}>
                        {m.offers}
                      </Text>
                    </View>
                    <View style={styles.synergyRow}>
                      <Text style={styles.synergyNeedLabel}>NEEDS</Text>
                      <Text style={styles.synergyVal} numberOfLines={1}>
                        {m.needs}
                      </Text>
                    </View>
                  </View>

                  {/* Action Buttons */}
                  <View style={styles.cardActions}>
                    <Button
                      title={isConnected ? 'Connected' : 'Connect'}
                      variant={isConnected ? 'glass' : 'primary'}
                      size="sm"
                      icon={
                        isConnected ? (
                          <Check size={14} color={COLORS.accent} />
                        ) : (
                          <UserPlus size={14} color="#FFF" />
                        )
                      }
                      onPress={() => toggleConnect(m.id)}
                      style={{ flex: 1 }}
                    />
                    <Button
                      title="Message"
                      variant="glass"
                      size="sm"
                      icon={<MessageSquare size={14} color={COLORS.purpleLight} />}
                      onPress={() => router.push('/chat' as any)}
                      style={{ flex: 1 }}
                    />
                  </View>
                </View>
              );
            })
          ) : (
            <EmptyState
              icon={<UserCheck size={24} color={COLORS.primaryLight} />}
              title="No Members Found"
              description="No members match your current filter or search criteria. Try adjusting your keywords."
              actionTitle="Clear Filters"
              onAction={() => {
                setSearchQuery('');
                setSelectedFilter('ALL');
              }}
            />
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
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.lg,
    paddingBottom: SPACING.tabBarClearance,
  },
  listContainer: {
    gap: SPACING.md,
  },
  memberCard: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
  },
  memberTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    marginBottom: SPACING.xs,
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: COLORS.bgElevated,
    borderWidth: 1.5,
    borderColor: COLORS.borderLight,
  },
  nameCol: {
    flex: 1,
    paddingRight: SPACING.xs,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  name: {
    color: COLORS.textPrimary,
    fontSize: 15,
    fontWeight: '800',
    flexShrink: 1,
  },
  cityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 2,
  },
  cityText: {
    color: COLORS.textDim,
    fontSize: 11,
    fontWeight: '500',
  },
  synergyMatchPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  synergyMatchText: {
    color: COLORS.accent,
    fontSize: 11,
    fontWeight: '900',
  },
  headline: {
    color: COLORS.textSecondary,
    fontSize: 13,
    lineHeight: 18,
    marginVertical: SPACING.xs,
  },
  synergyGrid: {
    backgroundColor: COLORS.bgInput,
    borderRadius: RADIUS.md,
    padding: SPACING.sm,
    marginVertical: SPACING.sm,
    gap: 6,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  synergyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  synergyOfferLabel: {
    color: COLORS.accent,
    fontSize: 9,
    fontWeight: '900',
    width: 52,
    letterSpacing: 0.5,
  },
  synergyNeedLabel: {
    color: COLORS.primaryLight,
    fontSize: 9,
    fontWeight: '900',
    width: 52,
    letterSpacing: 0.5,
  },
  synergyVal: {
    color: COLORS.textPrimary,
    fontSize: 12,
    fontWeight: '600',
    flex: 1,
  },
  cardActions: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginTop: SPACING.xs,
  },
});
