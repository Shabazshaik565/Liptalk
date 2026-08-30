import React, { useState, useEffect } from 'react';
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
  Brain,
  Bot,
  Code2,
  Share2,
  Compass,
  Command,
  Cpu,
  Bell,
  Shield,
  Users,
  Briefcase,
  CheckSquare,
  ChevronDown,
  Edit3,
  Save,
  Check,
  User as UserIcon,
} from 'lucide-react-native';
import { Header } from '../../src/components/common/Header';
import { Badge } from '../../src/components/common/Badge';
import { Button } from '../../src/components/common/Button';
import { Input } from '../../src/components/common/Input';
import { PillTabs, PillTabItem } from '../../src/components/common/PillTabs';
import { needsOffersApi, analyticsApi, usersApi, mediaApi } from '../../src/api/domain.api';
import { useAuthStore } from '../../src/store/auth.store';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../../src/constants/theme';

type ProfileTab = 'OVERVIEW' | 'EDIT_PROFILE' | 'NEEDS_OFFERS' | 'ANALYTICS';

interface EcosystemCategoryItem {
  title: string;
  sub: string;
  icon: any;
  color: string;
  bg: string;
  route: string;
}

interface EcosystemCategory {
  id: string;
  title: string;
  sub: string;
  badge: string;
  icon: any;
  color: string;
  bg: string;
  items: EcosystemCategoryItem[];
}

const CATEGORIES: EcosystemCategory[] = [
  {
    id: 'creation',
    title: 'Collective Creation & Teams',
    sub: 'Idea Pipeline • Hybrid Teams • Sandboxes',
    badge: '5 Modules',
    icon: Sparkles,
    color: '#6366F1',
    bg: 'rgba(99, 102, 241, 0.15)',
    items: [
      {
        title: 'Idea Discovery Network',
        sub: 'Idea-to-Project Pipeline • AI Concept Validation',
        icon: Sparkles,
        color: '#6366F1',
        bg: 'rgba(99, 102, 241, 0.15)',
        route: '/ideas',
      },
      {
        title: 'Human-AI Teams & Rooms',
        sub: 'Hybrid Team Squads • AI Project Manager',
        icon: Users,
        color: '#38BDF8',
        bg: 'rgba(56, 189, 248, 0.15)',
        route: '/human-ai-teams',
      },
      {
        title: 'Contribution Marketplace',
        sub: 'Resource Matching • Attestation Attribution',
        icon: Briefcase,
        color: '#10B981',
        bg: 'rgba(16, 185, 129, 0.15)',
        route: '/contributions',
      },
      {
        title: 'Agent Marketplace 2.0',
        sub: 'Verified Certifications • Sandbox Isolation',
        icon: Bot,
        color: '#A855F7',
        bg: 'rgba(168, 85, 247, 0.15)',
        route: '/agent-marketplace',
      },
      {
        title: 'Human Approval Gate',
        sub: 'Consequential Action Control • Decision Intelligence',
        icon: CheckSquare,
        color: '#F59E0B',
        bg: 'rgba(245, 158, 11, 0.15)',
        route: '/approvals',
      },
    ],
  },
  {
    id: 'intelligence',
    title: 'Global Intelligence & Simulation',
    sub: 'Knowledge Graph • Forecasts • Digital Twins',
    badge: '5 Modules',
    icon: Brain,
    color: '#A855F7',
    bg: 'rgba(168, 85, 247, 0.15)',
    items: [
      {
        title: 'Global Intelligence Fabric & Graph',
        sub: 'Cross-Domain Knowledge Graph • Weekly Briefings',
        icon: Sparkles,
        color: '#6366F1',
        bg: 'rgba(99, 102, 241, 0.15)',
        route: '/intelligence',
      },
      {
        title: 'Predictive Intelligence & Forecasts',
        sub: 'Probabilistic Growth • Demand Surge • Capacity Signals',
        icon: TrendingUp,
        color: '#10B981',
        bg: 'rgba(16, 185, 129, 0.15)',
        route: '/predictions',
      },
      {
        title: 'Simulation Lab & Sandboxes',
        sub: 'What-If Scenario Planning • Multi-Scenario Comparison',
        icon: Layers,
        color: '#38BDF8',
        bg: 'rgba(56, 189, 248, 0.15)',
        route: '/simulation',
      },
      {
        title: 'Digital Twins Control Panel',
        sub: 'Cognitive Representation • Privacy Bounds & Reset',
        icon: Compass,
        color: '#F59E0B',
        bg: 'rgba(245, 158, 11, 0.15)',
        route: '/digital-twins',
      },
      {
        title: 'Skill Graph & Expert Network',
        sub: 'Skill Gap Analysis • Verified Public Contributions',
        icon: Brain,
        color: '#A855F7',
        bg: 'rgba(168, 85, 247, 0.15)',
        route: '/skills',
      },
    ],
  },
  {
    id: 'adaptive_os',
    title: 'Adaptive OS & AI Automation',
    sub: 'Planning Engine • Experiments • Agent Hub',
    badge: '9 Modules',
    icon: Cpu,
    color: '#38BDF8',
    bg: 'rgba(56, 189, 248, 0.15)',
    items: [
      {
        title: 'Adaptive Operating Hub',
        sub: 'Continuous Improvement • Telemetry Diagnostics',
        icon: Cpu,
        color: '#6366F1',
        bg: 'rgba(99, 102, 241, 0.15)',
        route: '/adaptive',
      },
      {
        title: 'AI Planning Engine',
        sub: 'Multi-Agent Coordination • Step Execution Monitor',
        icon: Layers,
        color: '#38BDF8',
        bg: 'rgba(56, 189, 248, 0.15)',
        route: '/ai-plans',
      },
      {
        title: 'Attention & UX Profile',
        sub: 'Focus Mode • Quiet Hours • Smart Batching',
        icon: Bell,
        color: '#F59E0B',
        bg: 'rgba(245, 158, 11, 0.15)',
        route: '/attention',
      },
      {
        title: 'Controlled Experiments',
        sub: 'Canary Rollouts • Guardrail Metrics • Feature Flags',
        icon: TrendingUp,
        color: '#10B981',
        bg: 'rgba(16, 185, 129, 0.15)',
        route: '/experiments',
      },
      {
        title: 'Autonomous Agent Hub',
        sub: 'Personal Agent • Workflows • Knowledge Hub',
        icon: Bot,
        color: '#60A5FA',
        bg: 'rgba(59, 130, 246, 0.15)',
        route: '/agents',
      },
      {
        title: 'Multi-Agent Project Teams',
        sub: 'Squad Orchestration • Quality Gatekeeper Audit',
        icon: Bot,
        color: '#60A5FA',
        bg: 'rgba(59, 130, 246, 0.15)',
        route: '/agent-teams',
      },
      {
        title: 'Universal Command & Search',
        sub: 'Natural Language Routing • Cross-Subsystem Search',
        icon: Command,
        color: '#A78BFA',
        bg: 'rgba(139, 92, 246, 0.15)',
        route: '/universal',
      },
      {
        title: 'Personal Operating System',
        sub: 'Goals • Smart Tasks • Learning Paths • Ambient AI',
        icon: Compass,
        color: '#60A5FA',
        bg: 'rgba(59, 130, 246, 0.15)',
        route: '/personal',
      },
      {
        title: 'Voice & Multimodal AI',
        sub: 'Frontier Speech Intents • Multimodal Document Search',
        icon: Sparkles,
        color: '#EF4444',
        bg: 'rgba(239, 68, 68, 0.15)',
        route: '/voice',
      },
    ],
  },
  {
    id: 'governance',
    title: 'Governance & Global Alliances',
    sub: 'Global Goals • Workspaces • Research Hub',
    badge: '5 Modules',
    icon: Globe,
    color: '#10B981',
    bg: 'rgba(16, 185, 129, 0.15)',
    items: [
      {
        title: 'Global Goals & Public Initiatives',
        sub: 'Large-Scale Coordination • Milestones • Capital Pools',
        icon: Sparkles,
        color: '#6366F1',
        bg: 'rgba(99, 102, 241, 0.15)',
        route: '/goals',
      },
      {
        title: 'Collective Workspaces & Collectives',
        sub: 'Cross-Community Federated Spaces • Creator Alliances',
        icon: Layers,
        color: '#38BDF8',
        bg: 'rgba(56, 189, 248, 0.15)',
        route: '/collaboration',
      },
      {
        title: 'Community Governance & Proposals',
        sub: 'Collective Decision Voting • AI Governance Summaries',
        icon: ShieldCheck,
        color: '#10B981',
        bg: 'rgba(16, 185, 129, 0.15)',
        route: '/governance',
      },
      {
        title: 'Collective Knowledge & Research',
        sub: 'Conflict Analysis Engine • Collaborative Research Hub',
        icon: Brain,
        color: '#A855F7',
        bg: 'rgba(168, 85, 247, 0.15)',
        route: '/knowledge-network',
      },
      {
        title: 'Global Ecosystem Hub',
        sub: 'Projects • Creator Splits • Agent Store • Mentors',
        icon: Share2,
        color: '#A78BFA',
        bg: 'rgba(139, 92, 246, 0.15)',
        route: '/ecosystem',
      },
    ],
  },
  {
    id: 'security',
    title: 'Trust, Privacy & Security',
    sub: 'Threat Defense • Data Vault • Identity Scores',
    badge: '7 Modules',
    icon: Shield,
    color: '#EF4444',
    bg: 'rgba(239, 68, 68, 0.15)',
    items: [
      {
        title: 'Continuous Security Hub',
        sub: 'Threat Containment • Privacy Simulator • Data Lifecycle',
        icon: Shield,
        color: '#EF4444',
        bg: 'rgba(239, 68, 68, 0.15)',
        route: '/security/hub',
      },
      {
        title: 'Personal Data Vault & Access Log',
        sub: 'Multi-Context Persona Switcher • Scope Revocation',
        icon: Lock,
        color: '#10B981',
        bg: 'rgba(16, 185, 129, 0.15)',
        route: '/privacy/vault',
      },
      {
        title: 'Trust & Safety Center',
        sub: 'Score: 92/100 • Tier 1 Executive',
        icon: ShieldCheck,
        color: COLORS.accent,
        bg: 'rgba(16, 185, 129, 0.15)',
        route: '/trust',
      },
      {
        title: 'AI Trust & Governance Center',
        sub: 'Safety Thresholds • Kill Switches • Policies',
        icon: ShieldCheck,
        color: '#FBBF24',
        bg: 'rgba(245, 158, 11, 0.15)',
        route: '/trust/ai-trust-center',
      },
      {
        title: 'Privacy & Data Governance',
        sub: 'Export Data • Session Control',
        icon: Lock,
        color: '#A78BFA',
        bg: 'rgba(124, 58, 237, 0.15)',
        route: '/privacy',
      },
      {
        title: 'AI & Intelligence Controls',
        sub: 'Central Gateway • Memory Vault • Privacy Scopes',
        icon: Brain,
        color: '#A78BFA',
        bg: 'rgba(139, 92, 246, 0.15)',
        route: '/profile/ai-settings',
      },
      {
        title: 'Digital Identity & Reputation',
        sub: '92/100 Overall Trust • Multi-Context Scores',
        icon: ShieldCheck,
        color: COLORS.accent,
        bg: 'rgba(16, 185, 129, 0.15)',
        route: '/profile/identity',
      },
    ],
  },
  {
    id: 'enterprise',
    title: 'Enterprise, Commerce & Creator',
    sub: 'Studio • Marketplace • Wallet & Developers',
    badge: '10 Modules',
    icon: Building2,
    color: '#F59E0B',
    bg: 'rgba(245, 158, 11, 0.15)',
    items: [
      {
        title: 'Profile Intelligence Audit',
        sub: '85% Optimized • +25% Synergy Boost Tips',
        icon: Sparkles,
        color: '#A78BFA',
        bg: 'rgba(139, 92, 246, 0.15)',
        route: '/profile/intelligence',
      },
      {
        title: 'Creator Studio & Broadcasting',
        sub: 'Publish Teardowns • 1.1k Impressions',
        icon: Sparkles,
        color: '#A78BFA',
        bg: 'rgba(124, 58, 237, 0.15)',
        route: '/creator',
      },
      {
        title: 'Live Stages & Audio Rooms',
        sub: 'Host Stage • Join Founder Mixers',
        icon: Radio,
        color: COLORS.danger,
        bg: 'rgba(239, 68, 68, 0.15)',
        route: '/live',
      },
      {
        title: 'My Published Posts & Demands',
        sub: 'Manage Active RFPs • Track Proposals & Bids',
        icon: FileText,
        color: '#10B981',
        bg: 'rgba(16, 185, 129, 0.15)',
        route: '/(tabs)/opportunities?tab=my_posts',
      },
      {
        title: 'B2B Marketplace Directory',
        sub: 'Manage Offerings & Quotes',
        icon: ShoppingBag,
        color: '#A78BFA',
        bg: 'rgba(139, 92, 246, 0.15)',
        route: '/marketplace',
      },
      {
        title: 'Enterprise Organization Workspace',
        sub: 'FinFlow Technologies • 8 Team Seats',
        icon: Building2,
        color: '#60A5FA',
        bg: 'rgba(59, 130, 246, 0.15)',
        route: '/enterprise',
      },
      {
        title: 'Rewards Ledger & Wallet',
        sub: '1,850 Pts Available • Redeem Perks',
        icon: Coins,
        color: COLORS.accent,
        bg: 'rgba(16, 185, 129, 0.15)',
        route: '/rewards',
      },
      {
        title: 'Membership & Tier Entitlements',
        sub: 'Executive Pro • 2x Priority Active',
        icon: Crown,
        color: '#FBBF24',
        bg: 'rgba(245, 158, 11, 0.15)',
        route: '/membership',
      },
      {
        title: 'Developer Platform & APIs',
        sub: 'Live API Keys • OAuth • Webhooks • Docs',
        icon: Code2,
        color: COLORS.accent,
        bg: 'rgba(16, 185, 129, 0.15)',
        route: '/developer',
      },
      {
        title: 'Language & Region',
        sub: 'English (US) • INR (₹) • Asia/Kolkata',
        icon: Globe,
        color: COLORS.accent,
        bg: 'rgba(16, 185, 129, 0.15)',
        route: '/profile/language-region',
      },
      {
        title: 'Platform Admin Console',
        sub: 'Health: OK • Feature Flags • Audit',
        icon: ShieldAlert,
        color: COLORS.danger,
        bg: 'rgba(239, 68, 68, 0.15)',
        route: '/admin',
      },
    ],
  },
];

export default function ProfileScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user, setUser, logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState<ProfileTab>('OVERVIEW');
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const [formData, setFormData] = useState({
    fullName: user?.profile?.fullName || '',
    headline: user?.profile?.headline || '',
    bio: user?.profile?.bio || '',
    businessName: user?.business?.businessName || user?.profile?.businessName || '',
    businessStage: user?.profile?.businessStage || 'Growth Stage',
    industry: user?.profile?.industry || 'Software & AI',
    city: user?.profile?.city || 'Bangalore',
    country: user?.profile?.country || 'India',
    website: user?.profile?.website || '',
    skills: (user?.profile?.skills || [
      'Mobile Development',
      'React Native',
      'NestJS',
      'Cloud Architecture',
    ]).join(', '),
  });
  const [savingProfile, setSavingProfile] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (user?.profile) {
      setFormData({
        fullName: user.profile.fullName || '',
        headline: user.profile.headline || '',
        bio: user.profile.bio || '',
        businessName: user.business?.businessName || user.profile.businessName || '',
        businessStage: user.profile.businessStage || 'Growth Stage',
        industry: user.profile.industry || 'Software & AI',
        city: user.profile.city || 'Bangalore',
        country: user.profile.country || 'India',
        website: user.profile.website || '',
        skills: (user.profile.skills || [
          'Mobile Development',
          'React Native',
          'NestJS',
          'Cloud Architecture',
        ]).join(', '),
      });
    }
  }, [user]);

  const handleSaveProfile = async () => {
    setSavingProfile(true);
    setSaveSuccess(false);
    try {
      const skillsArray = formData.skills
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      const updatedProfile = {
        ...(user?.profile || {}),
        fullName: formData.fullName,
        headline: formData.headline,
        bio: formData.bio,
        businessName: formData.businessName,
        businessStage: formData.businessStage,
        industry: formData.industry,
        city: formData.city,
        country: formData.country,
        website: formData.website,
        skills: skillsArray,
      };

      if (user) {
        const updatedUser = {
          ...user,
          profile: updatedProfile,
          business: user.business
            ? { ...user.business, businessName: formData.businessName }
            : user.business,
        };
        await setUser(updatedUser as any);
      }

      await usersApi.updateProfile(updatedProfile);
      queryClient.invalidateQueries({ queryKey: ['user', 'profile'] });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (e) {
      console.warn('Failed to update profile:', e);
    } finally {
      setSavingProfile(false);
    }
  };

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
    { id: 'EDIT_PROFILE', label: 'Edit Profile' },
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

            <View style={{ flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.md }}>
              <View style={{ flex: 1 }}>
                <Button
                  title="Edit Profile"
                  variant="primary"
                  icon={<Edit3 size={15} color="#FFF" />}
                  onPress={() => setActiveTab('EDIT_PROFILE')}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Button
                  title="CRM Leads"
                  variant="glass"
                  icon={<TrendingUp size={15} color={COLORS.accent} />}
                  onPress={() => router.push('/leads' as any)}
                />
              </View>
            </View>
          </View>
        )}

        {/* Tab 2: EDIT PROFILE */}
        {activeTab === 'EDIT_PROFILE' && (
          <View>
            {saveSuccess && (
              <View style={styles.successBanner}>
                <Check size={16} color="#10B981" />
                <Text style={styles.successBannerText}>Profile updated successfully!</Text>
              </View>
            )}

            <View style={styles.sectionCard}>
              <View style={styles.sectionTitleRow}>
                <UserIcon size={16} color={COLORS.primaryLight} />
                <Text style={styles.sectionTitle}>Personal & Professional Identity</Text>
              </View>

              <Input
                label="Full Name"
                value={formData.fullName}
                onChangeText={(text) => setFormData({ ...formData, fullName: text })}
                placeholder="e.g. Alex Morgan"
                containerStyle={{ marginTop: SPACING.sm }}
              />

              <Input
                label="Professional Headline"
                value={formData.headline}
                onChangeText={(text) => setFormData({ ...formData, headline: text })}
                placeholder="e.g. Founder & CTO @ Nexas"
                containerStyle={{ marginTop: SPACING.sm }}
              />

              <Input
                label="Bio & Executive Summary"
                value={formData.bio}
                onChangeText={(text) => setFormData({ ...formData, bio: text })}
                placeholder="Tell others about your background, vision, and focus areas..."
                multiline
                numberOfLines={3}
                style={{ minHeight: 70, textAlignVertical: 'top' }}
                containerStyle={{ marginTop: SPACING.sm }}
              />
            </View>

            <View style={styles.sectionCard}>
              <View style={styles.sectionTitleRow}>
                <Building size={16} color={COLORS.primaryLight} />
                <Text style={styles.sectionTitle}>Business & Enterprise Info</Text>
              </View>

              <Input
                label="Business / Organization Name"
                value={formData.businessName}
                onChangeText={(text) => setFormData({ ...formData, businessName: text })}
                placeholder="e.g. Nexas Digital Solutions"
                containerStyle={{ marginTop: SPACING.sm }}
              />

              <Text style={styles.fieldSubhead}>Business Stage</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: SPACING.sm }}>
                {['Ideation', 'Early Stage', 'Growth Stage', 'Scaling', 'Enterprise'].map((stage) => {
                  const isSelected = formData.businessStage === stage;
                  return (
                    <TouchableOpacity
                      key={stage}
                      onPress={() => setFormData({ ...formData, businessStage: stage })}
                      style={[
                        styles.stageChip,
                        isSelected && styles.stageChipSelected,
                      ]}
                      activeOpacity={0.7}
                    >
                      <Text
                        style={[
                          styles.stageChipText,
                          isSelected && styles.stageChipTextSelected,
                        ]}
                      >
                        {stage}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <Input
                label="Industry & Sector"
                value={formData.industry}
                onChangeText={(text) => setFormData({ ...formData, industry: text })}
                placeholder="e.g. Artificial Intelligence, SaaS"
                containerStyle={{ marginTop: SPACING.sm }}
              />
            </View>

            <View style={styles.sectionCard}>
              <View style={styles.sectionTitleRow}>
                <MapPin size={16} color={COLORS.accent} />
                <Text style={styles.sectionTitle}>Location & Web Presence</Text>
              </View>

              <View style={{ flexDirection: 'row', gap: SPACING.sm }}>
                <View style={{ flex: 1 }}>
                  <Input
                    label="City"
                    value={formData.city}
                    onChangeText={(text) => setFormData({ ...formData, city: text })}
                    placeholder="e.g. Bangalore"
                    containerStyle={{ marginTop: SPACING.sm }}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Input
                    label="Country"
                    value={formData.country}
                    onChangeText={(text) => setFormData({ ...formData, country: text })}
                    placeholder="e.g. India"
                    containerStyle={{ marginTop: SPACING.sm }}
                  />
                </View>
              </View>

              <Input
                label="Website / Portfolio URL"
                value={formData.website}
                onChangeText={(text) => setFormData({ ...formData, website: text })}
                placeholder="https://example.com"
                containerStyle={{ marginTop: SPACING.sm }}
              />
            </View>

            <View style={styles.sectionCard}>
              <View style={styles.sectionTitleRow}>
                <Layers size={16} color={COLORS.primaryLight} />
                <Text style={styles.sectionTitle}>Skills & Competencies (comma-separated)</Text>
              </View>

              <Input
                label="Skills List"
                value={formData.skills}
                onChangeText={(text) => setFormData({ ...formData, skills: text })}
                placeholder="e.g. React Native, NestJS, TypeScript, AI Agents"
                containerStyle={{ marginTop: SPACING.sm }}
              />

              {formData.skills.trim().length > 0 && (
                <View style={[styles.servicesGrid, { marginTop: SPACING.sm }]}>
                  {formData.skills
                    .split(',')
                    .map((s) => s.trim())
                    .filter((s) => s.length > 0)
                    .map((sk, i) => (
                      <Badge key={i} label={sk} variant="purple" size="sm" />
                    ))}
                </View>
              )}
            </View>

            <Button
              title={savingProfile ? 'Saving Changes...' : 'Save Profile Changes'}
              variant="primary"
              icon={<Save size={16} color="#FFF" />}
              onPress={handleSaveProfile}
              loading={savingProfile}
              style={{ marginBottom: SPACING.md }}
            />
          </View>
        )}

        {/* Tab 3: NEEDS & OFFERS */}
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

        {/* Commercial Ecosystem & Rewards Settings Categorized */}
        <View style={styles.categoryFilterContainer}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={styles.ecosystemSectionMainHeading}>CATEGORIES & SUB-SYSTEMS</Text>
            {expandedCategory && (
              <TouchableOpacity onPress={() => setExpandedCategory(null)} activeOpacity={0.7}>
                <Text style={{ color: COLORS.primaryLight, fontSize: 11, fontWeight: '700' }}>Collapse All</Text>
              </TouchableOpacity>
            )}
          </View>
          <Text style={{ color: COLORS.textDim, fontSize: 11, marginTop: 2 }}>
            Tap any category card to open its specialized modules
          </Text>
        </View>

        {CATEGORIES.map((cat) => {
          const isExpanded = expandedCategory === cat.id;
          const CatIcon = cat.icon;

          return (
            <View key={cat.id} style={[styles.categoryCard, isExpanded && styles.categoryCardActive]}>
              <TouchableOpacity
                style={[
                  styles.categoryCardHeader,
                  !isExpanded && { borderBottomWidth: 0, paddingBottom: 0, marginBottom: 0 },
                ]}
                onPress={() => setExpandedCategory(isExpanded ? null : cat.id)}
                activeOpacity={0.7}
              >
                <View style={[styles.categoryHeaderIcon, { backgroundColor: cat.bg }]}>
                  <CatIcon size={16} color={cat.color} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.categoryCardTitle}>{cat.title}</Text>
                  <Text style={styles.categoryCardSub}>{cat.sub}</Text>
                </View>
                <View
                  style={[
                    styles.categoryCountBadge,
                    isExpanded && { backgroundColor: 'rgba(99, 102, 241, 0.25)' },
                  ]}
                >
                  <Text
                    style={[
                      styles.categoryCountText,
                      isExpanded && { color: COLORS.primaryLight },
                    ]}
                  >
                    {cat.badge}
                  </Text>
                </View>
                {isExpanded ? (
                  <ChevronDown size={16} color={COLORS.primaryLight} style={{ marginLeft: 4 }} />
                ) : (
                  <ChevronRight size={16} color={COLORS.textDim} style={{ marginLeft: 4 }} />
                )}
              </TouchableOpacity>

              {isExpanded && (
                <View style={{ marginTop: SPACING.xs }}>
                  {cat.items.map((item, idx) => {
                    const ItemIcon = item.icon;
                    const isLast = idx === cat.items.length - 1;
                    return (
                      <TouchableOpacity
                        key={item.title}
                        style={[styles.ecosystemRowItem, isLast && { borderBottomWidth: 0 }]}
                        onPress={() => router.push(item.route as any)}
                        activeOpacity={0.7}
                      >
                        <View style={[styles.ecosystemIconCircle, { backgroundColor: item.bg }]}>
                          <ItemIcon size={15} color={item.color} />
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={styles.ecosystemItemTitle}>{item.title}</Text>
                          <Text style={styles.ecosystemItemSub}>{item.sub}</Text>
                        </View>
                        <ChevronRight size={15} color={COLORS.textDim} />
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}
            </View>
          );
        })}

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
  categoryFilterContainer: {
    marginTop: SPACING.xl,
    marginBottom: SPACING.sm,
    paddingHorizontal: 4,
  },
  ecosystemSectionMainHeading: {
    color: COLORS.primaryLight,
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1.2,
  },
  categoryCard: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.xl,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
  },
  categoryCardActive: {
    borderColor: 'rgba(99, 102, 241, 0.4)',
    backgroundColor: '#1E2235',
  },
  categoryCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    paddingBottom: SPACING.sm,
    marginBottom: SPACING.xs,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.06)',
  },
  categoryHeaderIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryCardTitle: {
    color: COLORS.textPrimary,
    fontSize: 14,
    fontWeight: '800',
  },
  categoryCardSub: {
    color: COLORS.textDim,
    fontSize: 11,
    marginTop: 1,
  },
  categoryCountBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.07)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  categoryCountText: {
    color: COLORS.textMuted,
    fontSize: 10,
    fontWeight: '700',
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
  successBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  successBannerText: {
    color: '#10B981',
    fontSize: 13,
    fontWeight: '700',
  },
  stageChip: {
    backgroundColor: COLORS.bgElevated,
    borderRadius: RADIUS.full,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  stageChipSelected: {
    backgroundColor: 'rgba(99, 102, 241, 0.2)',
    borderColor: '#6366F1',
  },
  stageChipText: {
    color: COLORS.textDim,
    fontSize: 12,
    fontWeight: '700',
  },
  stageChipTextSelected: {
    color: '#A5B4FC',
  },
});
