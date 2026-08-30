import { apiClient } from './client';
import {
  NeedItem,
  OfferItem,
  MatchResult,
  OpportunityItem,
  LeadItem,
  LeadStatus,
  ConversationItem,
  ChatMessage,
  PartnerItem,
  AnalyticsSummary,
  NotificationItem,
  CommunityItem,
  CommunityPostItem,
  PostCommentItem,
  EventItem,
  MarketplaceListingItem,
  ReviewItem,
  RewardItem,
  RewardRedemptionItem,
  WalletSummary,
  ReferralInfo,
  MembershipInfo,
  PlanItem,
  SavedTargetType,
  AIAssistantResponse,
  SemanticSearchResults,
  SmartNeedSuggestion,
  SmartOfferSuggestion,
  SmartOpportunitySuggestion,
  ProfileIntelligenceReport,
  PersonalizedDiscoverFeed,
  CallSession,
  LiveRoomItem,
  LiveRoomMessageItem,
  ProfessionalContentItem,
  CreatorAnalytics,
  OrganizationItem,
  OrganizationMemberItem,
  TeamItem,
  EnterpriseAnalytics,
  ReportItem,
  TrustScoreReport,
  PrivacySettings,
  AuditLogItem,
  AdminPlatformMetrics,
  FeatureFlags,
  UserPreferences,
  LocalizationConfig,
  RegionalDiscoveryResult,
  AiUserPreference,
  AiUserMemoryItem,
  AiUsageSummary,
  AiGatewayConfig,
  AiActionItem,
  GlobalTrendItem,
  AgentItem,
  AgentWorkflowItem,
  AgentExecutionItem,
  KnowledgeCollectionItem,
  DeveloperAppItem,
  WebhookItem,
  AiTrustCenterInfo,
  ReputationProfileItem,
  ProjectWorkspaceItem,
  CreatorServiceItem,
  RevenueSplitItem,
  SubscriptionItem,
  AgentStoreListingItem,
  MentorProfileItem,
  PersonalGoalItem,
  PersonalTaskItem,
  LearningPathItem,
  UniversalCommandResult,
} from '../types';
import {
  INITIAL_NEEDS,
  INITIAL_OFFERS,
  MATCHES_DATA,
  OPPORTUNITIES_DATA,
  LEADS_DATA,
  CONVERSATIONS_DATA,
  CHAT_MESSAGES_DATA,
  PARTNERS_DATA,
  ANALYTICS_DATA,
  CURRENT_USER,
  COMMUNITIES_DATA,
  COMMUNITY_POSTS_DATA,
  EVENTS_DATA,
  MARKETPLACE_LISTINGS_DATA,
  REWARDS_DATA,
  WALLET_SUMMARY_DATA,
  REFERRAL_INFO_DATA,
  MEMBERSHIP_INFO_DATA,
  PLANS_DATA,
  CALL_HISTORY_DATA,
  LIVE_ROOMS_DATA,
  PROFESSIONAL_CONTENTS_DATA,
  CREATOR_ANALYTICS_DATA,
  ORGANIZATIONS_DATA,
  ORGANIZATION_MEMBERS_DATA,
  TEAMS_DATA,
  ENTERPRISE_ANALYTICS_DATA,
  TRUST_SCORE_DATA,
  PRIVACY_SETTINGS_DATA,
  AUDIT_LOGS_DATA,
  ADMIN_METRICS_DATA,
  FEATURE_FLAGS_DATA,
  USER_PREFERENCES_DATA,
  LOCALIZATION_CONFIG_DATA,
  AI_USER_PREFERENCES_DATA,
  AI_MEMORIES_DATA,
  AI_USAGE_DATA,
  MOCK_GRAPH_OVERVIEW,
  MOCK_DIGITAL_TWINS,
  MOCK_SIMULATIONS,
  MOCK_PREDICTIONS,
  MOCK_RECOMMENDATIONS,
  MOCK_SKILL_GRAPH,
  MOCK_EXPERTS,
  MOCK_WEEKLY_BRIEF,
  MOCK_IMPROVEMENT_PROPOSALS,
  MOCK_PLATFORM_EXPERIMENTS,
  MOCK_FEATURE_FLAGS,
  MOCK_UX_PROFILE,
  MOCK_AI_PLANS,
  MOCK_SECURITY_THREATS,
  MOCK_PLATFORM_HEALTH,
  MOCK_FEEDBACK_CLUSTERS,
  MOCK_IDEAS,
  MOCK_HUMAN_AI_TEAMS,
  MOCK_COLLABORATION_ROOMS,
  MOCK_RESOURCE_REQUESTS,
  MOCK_CONTRIBUTION_LISTINGS,
  MOCK_CERTIFIED_AGENTS,
  MOCK_HUMAN_APPROVAL_REQUESTS,
} from './mockData';

export const usersApi = {
  getMe: async () => {
    try {
      const res = await apiClient.get('/users/me');
      return res.data;
    } catch {
      return CURRENT_USER;
    }
  },
  getUsers: async (params?: { search?: string; role?: string; city?: string; page?: number; limit?: number }) => {
    try {
      const res = await apiClient.get('/users', { params });
      return res.data;
    } catch {
      return [];
    }
  },
  updateProfile: async (data: any) => {
    try {
      const res = await apiClient.put('/users/profile', data);
      return res.data;
    } catch {
      return data;
    }
  },
};

export const mediaApi = {
  uploadImage: async (formData: FormData): Promise<{ url: string; filename: string }> => {
    try {
      const res = await apiClient.post('/media/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return res.data?.data;
    } catch (e) {
      // Fallback demo avatar if backend media endpoint is unreachable
      return {
        url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300',
        filename: 'avatar.jpg',
      };
    }
  },
};

export const needsOffersApi = {
  getNeeds: async (): Promise<NeedItem[]> => {
    try {
      const res = await apiClient.get('/needs');
      if (Array.isArray(res.data) && res.data.length > 0) return res.data;
      return INITIAL_NEEDS;
    } catch {
      return INITIAL_NEEDS;
    }
  },
  createNeed: async (data: Partial<NeedItem>): Promise<NeedItem> => {
    try {
      const res = await apiClient.post('/needs', data);
      return res.data;
    } catch {
      return {
        id: 'need_' + Date.now(),
        ownerType: 'BUSINESS',
        ownerId: 'biz_01',
        ownerName: 'Nexas Digital Solutions',
        ownerRole: 'BUSINESS',
        categoryId: data.categoryId || 'cat_custom',
        categoryName: data.categoryName || 'General Service',
        title: data.title || 'New Business Requirement',
        description: data.description,
        tags: data.tags || [],
        priority: data.priority || 'MEDIUM',
        city: data.city || 'Bangalore',
        budgetMin: data.budgetMin,
        budgetMax: data.budgetMax,
        currency: data.currency || 'INR',
        status: 'ACTIVE',
        createdAt: new Date().toISOString(),
      };
    }
  },
  getOffers: async (): Promise<OfferItem[]> => {
    try {
      const res = await apiClient.get('/offers');
      if (Array.isArray(res.data) && res.data.length > 0) return res.data;
      return INITIAL_OFFERS;
    } catch {
      return INITIAL_OFFERS;
    }
  },
  createOffer: async (data: Partial<OfferItem>): Promise<OfferItem> => {
    try {
      const res = await apiClient.post('/offers', data);
      return res.data;
    } catch {
      return {
        id: 'off_' + Date.now(),
        ownerType: 'BUSINESS',
        ownerId: 'biz_01',
        ownerName: 'Nexas Digital Solutions',
        ownerRole: 'BUSINESS',
        categoryId: data.categoryId || 'cat_custom',
        categoryName: data.categoryName || 'General Service',
        title: data.title || 'New Service Offer',
        description: data.description,
        tags: data.tags || [],
        pricingModel: data.pricingModel || 'FIXED',
        city: data.city || 'Bangalore',
        status: 'ACTIVE',
        createdAt: new Date().toISOString(),
      };
    }
  },
};

export const matchesApi = {
  getMatches: async (): Promise<MatchResult[]> => {
    try {
      const res = await apiClient.get('/matches');
      if (Array.isArray(res.data) && res.data.length > 0) return res.data;
      return MATCHES_DATA;
    } catch {
      return MATCHES_DATA;
    }
  },
  getMatchById: async (id: string): Promise<MatchResult | undefined> => {
    try {
      const res = await apiClient.get(`/matches/${id}`);
      return res.data;
    } catch {
      return MATCHES_DATA.find((m) => m.id === id) || MATCHES_DATA[0];
    }
  },
};

let USER_MY_POSTS: OpportunityItem[] = [
  {
    id: 'opp_my_01',
    creatorId: 'usr_curr_01',
    creatorName: 'Alex Morgan',
    creatorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    creatorRole: 'BUSINESS',
    businessId: 'biz_01',
    businessName: 'Nexas Digital Solutions',
    categoryId: 'cat_it_soft',
    categoryName: 'IT & Software Development',
    title: 'Looking for Senior React Native & NestJS Full-Stack Developer',
    description: 'We require an experienced developer to help scale our real-time WebSocket architecture and offline-first mobile sync engine. 3-month contract with extension possibility.',
    tags: ['React Native', 'NestJS', 'WebSockets', 'TypeORM'],
    budgetAmount: 250000,
    currency: 'INR',
    deadline: '2026-10-15',
    city: 'Bangalore (Hybrid)',
    status: 'OPEN',
    interestsCount: 6,
    hasExpressedInterest: false,
    matchScore: 98,
    createdAt: '2026-08-28T10:00:00Z',
  },
  {
    id: 'opp_my_02',
    creatorId: 'usr_curr_01',
    creatorName: 'Alex Morgan',
    creatorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    creatorRole: 'BUSINESS',
    businessId: 'biz_01',
    businessName: 'Nexas Digital Solutions',
    categoryId: 'cat_design',
    categoryName: 'UI/UX & Product Design',
    title: 'Mobile UI/UX Designer for Glassmorphism Brand Redesign',
    description: 'Looking for a talented UI designer with Figma and design system expertise to craft clean micro-interactions and dark theme components for our mobile product.',
    tags: ['UI/UX', 'Figma', 'Glassmorphism', 'Design System'],
    budgetAmount: 120000,
    currency: 'INR',
    deadline: '2026-10-30',
    city: 'Remote',
    status: 'OPEN',
    interestsCount: 4,
    hasExpressedInterest: false,
    matchScore: 94,
    createdAt: '2026-08-25T14:30:00Z',
  },
];

export const opportunitiesApi = {
  getOpportunities: async (params?: {
    search?: string;
    category?: string;
    city?: string;
    status?: string;
    minBudget?: number;
    maxBudget?: number;
  }): Promise<OpportunityItem[]> => {
    try {
      const res = await apiClient.get('/opportunities', { params });
      if (Array.isArray(res.data) && res.data.length > 0) {
        return [...USER_MY_POSTS, ...res.data];
      }
      return [...USER_MY_POSTS, ...OPPORTUNITIES_DATA];
    } catch {
      return [...USER_MY_POSTS, ...OPPORTUNITIES_DATA];
    }
  },
  getMyOpportunities: async (): Promise<OpportunityItem[]> => {
    try {
      const res = await apiClient.get('/opportunities/my-posts');
      if (Array.isArray(res.data) && res.data.length > 0) return res.data;
      return USER_MY_POSTS;
    } catch {
      return USER_MY_POSTS;
    }
  },
  getOpportunityById: async (id: string): Promise<OpportunityItem | undefined> => {
    const all = [...USER_MY_POSTS, ...OPPORTUNITIES_DATA];
    try {
      const res = await apiClient.get(`/opportunities/${id}`);
      return res.data || all.find((o) => o.id === id);
    } catch {
      return all.find((o) => o.id === id) || all[0];
    }
  },
  createOpportunity: async (data: Partial<OpportunityItem>): Promise<OpportunityItem> => {
    const newOpp: OpportunityItem = {
      id: 'opp_my_' + Date.now(),
      creatorId: 'usr_curr_01',
      creatorName: 'Alex Morgan',
      creatorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      creatorRole: 'BUSINESS',
      businessId: 'biz_01',
      businessName: 'Nexas Digital Solutions',
      categoryId: data.categoryId || 'cat_it_soft',
      categoryName: data.categoryName || 'IT & Software Development',
      title: data.title || 'New Requirement',
      description: data.description || '',
      tags: data.tags || ['General'],
      budgetAmount: data.budgetAmount,
      currency: data.currency || 'INR',
      deadline: data.deadline || '2026-10-31',
      city: data.city || 'Bangalore',
      status: 'OPEN',
      interestsCount: 0,
      hasExpressedInterest: false,
      matchScore: 99,
      createdAt: new Date().toISOString(),
    };

    USER_MY_POSTS = [newOpp, ...USER_MY_POSTS];

    try {
      await apiClient.post('/opportunities', data);
    } catch {
      // local store already updated
    }
    return newOpp;
  },
  deleteOpportunity: async (id: string): Promise<boolean> => {
    USER_MY_POSTS = USER_MY_POSTS.filter((o) => o.id !== id);
    try {
      await apiClient.delete(`/opportunities/${id}`);
    } catch {
      // local store updated
    }
    return true;
  },
  expressInterest: async (oppId: string, pitch: string): Promise<boolean> => {
    try {
      await apiClient.post(`/opportunities/${oppId}/interest`, { pitch });
      return true;
    } catch {
      return true;
    }
  },
};

export const leadsApi = {
  getLeads: async (): Promise<LeadItem[]> => {
    try {
      const res = await apiClient.get('/leads');
      if (Array.isArray(res.data) && res.data.length > 0) return res.data;
      return LEADS_DATA;
    } catch {
      return LEADS_DATA;
    }
  },
  updateLeadStatus: async (leadId: string, status: LeadStatus): Promise<boolean> => {
    try {
      await apiClient.put(`/leads/${leadId}/status`, { status });
      return true;
    } catch {
      return true;
    }
  },
  addLeadNote: async (leadId: string, noteText: string): Promise<boolean> => {
    try {
      await apiClient.post(`/leads/${leadId}/notes`, { noteText });
      return true;
    } catch {
      return true;
    }
  },
  createLead: async (data: Partial<LeadItem>): Promise<LeadItem> => {
    try {
      const res = await apiClient.post('/leads', data);
      return res.data;
    } catch {
      return {
        id: 'lead_' + Date.now(),
        businessId: 'biz_01',
        contactUserId: data.contactUserId || 'usr_unknown',
        contactName: data.contactName || 'New Prospect',
        title: data.title || 'New Lead Opportunity',
        source: data.source || 'OPPORTUNITY',
        status: 'NEW',
        estimatedValue: data.estimatedValue || 100000,
        currency: 'INR',
        notesCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }
  },
};

export const chatApi = {
  getConversations: async (): Promise<ConversationItem[]> => {
    try {
      const res = await apiClient.get('/chat/conversations');
      return res.data;
    } catch {
      return CONVERSATIONS_DATA;
    }
  },
  getMessages: async (convId: string): Promise<ChatMessage[]> => {
    try {
      const res = await apiClient.get(`/chat/conversations/${convId}/messages`);
      return res.data;
    } catch {
      return CHAT_MESSAGES_DATA[convId] || [];
    }
  },
  sendMessage: async (convId: string, text: string): Promise<ChatMessage> => {
    try {
      const res = await apiClient.post(`/chat/conversations/${convId}/messages`, { text });
      return res.data;
    } catch {
      return {
        id: 'msg_' + Date.now(),
        conversationId: convId,
        senderId: 'usr_curr_01',
        senderName: 'Alex Morgan',
        text,
        isRead: false,
        createdAt: new Date().toISOString(),
      };
    }
  },
};

export const notificationsApi = {
  getNotifications: async (): Promise<NotificationItem[]> => {
    try {
      const res = await apiClient.get('/notifications');
      return res.data;
    } catch {
      return [
        {
          id: 'notif_01',
          type: 'MATCH',
          title: 'New 94% Deterministic Match Found',
          body: 'GrowthPulse Media offers Performance Marketing matching your High-Priority need.',
          deepLink: '/(tabs)',
          isRead: false,
          createdAt: '10m ago',
        },
        {
          id: 'notif_02',
          type: 'OPP_INTEREST',
          title: 'Proposal on Opportunity',
          body: 'HealthFirst Telemed accepted your initial portfolio pitch for Patient Health Dashboard.',
          deepLink: '/leads',
          isRead: false,
          createdAt: '2h ago',
        },
        {
          id: 'notif_03',
          type: 'LEAD_STATUS',
          title: 'Lead Pipeline Stage Update',
          body: 'FinFlow Driver Dispatch App moved to stage: QUALIFIED in your CRM.',
          deepLink: '/leads',
          isRead: true,
          createdAt: '1d ago',
        },
        {
          id: 'notif_04',
          type: 'MESSAGE',
          title: 'New Message from Vikram Singh',
          body: 'Thanks Alex! We reviewed your team portfolio for offline sync...',
          deepLink: '/chat',
          isRead: true,
          createdAt: '2d ago',
        },
      ];
    }
  },
  markAsRead: async (id: string): Promise<boolean> => {
    try {
      await apiClient.patch(`/notifications/${id}/read`);
      return true;
    } catch {
      return true;
    }
  },
  markAllAsRead: async (): Promise<boolean> => {
    try {
      await apiClient.patch('/notifications/read-all');
      return true;
    } catch {
      return true;
    }
  },
};

export const partnersApi = {
  getPartners: async (): Promise<PartnerItem[]> => {
    try {
      const res = await apiClient.get('/partners');
      return res.data;
    } catch {
      return PARTNERS_DATA;
    }
  },
};

export const analyticsApi = {
  getSummary: async (): Promise<AnalyticsSummary> => {
    try {
      const res = await apiClient.get('/analytics/dashboard');
      return res.data;
    } catch {
      return ANALYTICS_DATA;
    }
  },
};

export const communitiesApi = {
  getCommunities: async (params?: { search?: string; category?: string; page?: number; limit?: number }): Promise<CommunityItem[]> => {
    try {
      const res = await apiClient.get('/communities', { params });
      const items = res.data?.items || res.data;
      if (Array.isArray(items) && items.length > 0) return items;
      return COMMUNITIES_DATA;
    } catch {
      return COMMUNITIES_DATA;
    }
  },
  getRecommended: async (): Promise<CommunityItem[]> => {
    try {
      const res = await apiClient.get('/communities/recommended');
      if (Array.isArray(res.data) && res.data.length > 0) return res.data;
      return COMMUNITIES_DATA;
    } catch {
      return COMMUNITIES_DATA;
    }
  },
  getCommunityById: async (idOrSlug: string): Promise<CommunityItem | null> => {
    try {
      const res = await apiClient.get(`/communities/${idOrSlug}`);
      return res.data;
    } catch {
      return COMMUNITIES_DATA.find((c) => c.id === idOrSlug || c.slug === idOrSlug) || COMMUNITIES_DATA[0];
    }
  },
  createCommunity: async (data: Partial<CommunityItem>): Promise<CommunityItem> => {
    try {
      const res = await apiClient.post('/communities', data);
      return res.data;
    } catch {
      const newComm: CommunityItem = {
        id: 'comm_' + Date.now(),
        name: data.name || 'New Community',
        slug: (data.name || 'new-community').toLowerCase().replace(/\s+/g, '-'),
        description: data.description || '',
        category: data.category || 'General',
        coverImageUrl: data.coverImageUrl || 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600',
        avatarUrl: data.avatarUrl || 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=150',
        visibility: data.visibility || 'PUBLIC',
        memberCount: 1,
        postCount: 0,
        isVerified: true,
        isJoined: true,
        userRole: 'OWNER',
        rules: data.rules || ['Be professional and collaborative.'],
        createdAt: new Date().toISOString(),
      };
      return newComm;
    }
  },
  joinCommunity: async (communityId: string) => {
    try {
      const res = await apiClient.post(`/communities/${communityId}/join`);
      return res.data;
    } catch {
      return { success: true, status: 'ACTIVE' };
    }
  },
  leaveCommunity: async (communityId: string) => {
    try {
      const res = await apiClient.delete(`/communities/${communityId}/leave`);
      return res.data;
    } catch {
      return { success: true };
    }
  },
  getMembers: async (communityId: string, page = 1) => {
    try {
      const res = await apiClient.get(`/communities/${communityId}/members`, { params: { page } });
      return res.data?.items || res.data || [];
    } catch {
      return [];
    }
  },
};

export const postsApi = {
  getCommunityPosts: async (communityId: string, page = 1): Promise<CommunityPostItem[]> => {
    try {
      const res = await apiClient.get(`/communities/${communityId}/posts`, { params: { page } });
      const items = res.data?.items || res.data;
      if (Array.isArray(items) && items.length > 0) return items;
      return COMMUNITY_POSTS_DATA;
    } catch {
      return COMMUNITY_POSTS_DATA;
    }
  },
  getPostById: async (postId: string): Promise<CommunityPostItem | null> => {
    try {
      const res = await apiClient.get(`/posts/${postId}`);
      return res.data;
    } catch {
      return COMMUNITY_POSTS_DATA.find((p) => p.id === postId) || COMMUNITY_POSTS_DATA[0];
    }
  },
  createPost: async (communityId: string, data: { title?: string; content: string; type?: string; mediaUrls?: string[] }): Promise<CommunityPostItem> => {
    try {
      const res = await apiClient.post(`/communities/${communityId}/posts`, data);
      return res.data;
    } catch {
      const newPost: CommunityPostItem = {
        id: 'post_' + Date.now(),
        type: (data.type as any) || 'TEXT',
        title: data.title,
        content: data.content,
        mediaUrls: data.mediaUrls || [],
        likesCount: 0,
        commentsCount: 0,
        isPinned: false,
        hasLiked: false,
        createdAt: new Date().toISOString(),
        author: {
          id: 'usr_curr_01',
          role: 'BUSINESS',
          profile: {
            fullName: 'Alex Morgan',
            avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
            headline: 'Founder & Head of Tech @ Nexas Digital',
          },
        },
      };
      return newPost;
    }
  },
  deletePost: async (postId: string) => {
    try {
      await apiClient.delete(`/posts/${postId}`);
      return true;
    } catch {
      return true;
    }
  },
  reactPost: async (postId: string, reactionType = 'LIKE') => {
    try {
      const res = await apiClient.post(`/posts/${postId}/react`, { reactionType });
      return res.data;
    } catch {
      return { success: true, reacted: true };
    }
  },
  getComments: async (postId: string): Promise<PostCommentItem[]> => {
    try {
      const res = await apiClient.get(`/posts/${postId}/comments`);
      return res.data || [];
    } catch {
      return [];
    }
  },
  addComment: async (postId: string, content: string, parentCommentId?: string): Promise<PostCommentItem> => {
    try {
      const res = await apiClient.post(`/posts/${postId}/comments`, { content, parentCommentId });
      return res.data;
    } catch {
      return {
        id: 'comm_' + Date.now(),
        content,
        parentCommentId,
        createdAt: new Date().toISOString(),
        author: {
          id: 'usr_curr_01',
          role: 'BUSINESS',
          profile: {
            fullName: 'Alex Morgan',
            avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
          },
        },
      };
    }
  },
};

export const eventsApi = {
  getEvents: async (params?: { communityId?: string; category?: string; page?: number }): Promise<EventItem[]> => {
    try {
      const res = await apiClient.get('/events', { params });
      const items = res.data?.items || res.data;
      if (Array.isArray(items) && items.length > 0) return items;
      return EVENTS_DATA;
    } catch {
      return EVENTS_DATA;
    }
  },
  getEventById: async (eventId: string): Promise<EventItem | null> => {
    try {
      const res = await apiClient.get(`/events/${eventId}`);
      return res.data;
    } catch {
      return EVENTS_DATA.find((e) => e.id === eventId) || EVENTS_DATA[0];
    }
  },
  createEvent: async (data: Partial<EventItem>): Promise<EventItem> => {
    try {
      const res = await apiClient.post('/events', data);
      return res.data;
    } catch {
      const newEvent: EventItem = {
        id: 'event_' + Date.now(),
        title: data.title || 'New Business Meetup',
        description: data.description || '',
        category: data.category || 'Networking',
        eventDate: data.eventDate || '2026-10-15',
        startTime: data.startTime || '06:00 PM',
        endTime: data.endTime || '08:00 PM',
        locationType: data.locationType || 'ONLINE',
        locationUrlOrAddress: data.locationUrlOrAddress || 'https://meet.google.com/liptalk',
        coverImageUrl: data.coverImageUrl || 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=600',
        capacity: data.capacity || 100,
        registeredCount: 1,
        status: 'UPCOMING',
        isRegistered: true,
        createdAt: new Date().toISOString(),
      };
      return newEvent;
    }
  },
  registerEvent: async (eventId: string) => {
    try {
      const res = await apiClient.post(`/events/${eventId}/register`);
      return res.data;
    } catch {
      return { success: true, status: 'REGISTERED' };
    }
  },
  cancelRegistration: async (eventId: string) => {
    try {
      const res = await apiClient.delete(`/events/${eventId}/register`);
      return res.data;
    } catch {
      return { success: true };
    }
  },
};

export const reportsApi = {
  createReport: async (data: { targetType: string; targetId: string; reason: string; details?: string }) => {
    try {
      const res = await apiClient.post('/reports', data);
      return res.data;
    } catch {
      return { success: true };
    }
  },
};

export const marketplaceApi = {
  getListings: async (params?: { search?: string; category?: string; pricingType?: string; location?: string; page?: number; limit?: number }): Promise<MarketplaceListingItem[]> => {
    try {
      const res = await apiClient.get('/marketplace', { params });
      const items = res.data?.items || res.data;
      if (Array.isArray(items) && items.length > 0) return items;
      return MARKETPLACE_LISTINGS_DATA;
    } catch {
      return MARKETPLACE_LISTINGS_DATA;
    }
  },
  getRecommended: async (): Promise<MarketplaceListingItem[]> => {
    try {
      const res = await apiClient.get('/marketplace/recommended');
      if (Array.isArray(res.data) && res.data.length > 0) return res.data;
      return MARKETPLACE_LISTINGS_DATA;
    } catch {
      return MARKETPLACE_LISTINGS_DATA;
    }
  },
  getListingById: async (idOrSlug: string): Promise<MarketplaceListingItem | null> => {
    try {
      const res = await apiClient.get(`/marketplace/${idOrSlug}`);
      return res.data;
    } catch {
      return MARKETPLACE_LISTINGS_DATA.find((l) => l.id === idOrSlug || l.slug === idOrSlug) || MARKETPLACE_LISTINGS_DATA[0];
    }
  },
  createListing: async (data: Partial<MarketplaceListingItem>): Promise<MarketplaceListingItem> => {
    try {
      const res = await apiClient.post('/marketplace', data);
      return res.data;
    } catch {
      const newListing: MarketplaceListingItem = {
        id: 'list_' + Date.now(),
        title: data.title || 'New Service Listing',
        slug: (data.title || 'new-service').toLowerCase().replace(/\s+/g, '-'),
        description: data.description || '',
        category: data.category || 'General Services',
        pricingType: data.pricingType || 'FIXED',
        price: data.price || 0,
        currency: data.currency || 'INR',
        location: data.location || 'Bangalore',
        tags: data.tags || ['Verified Provider'],
        imageUrls: data.imageUrls || ['https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600'],
        status: 'PUBLISHED',
        promotionType: 'NORMAL',
        averageRating: 5.0,
        reviewsCount: 0,
        requestsCount: 0,
        createdAt: new Date().toISOString(),
        provider: {
          id: 'usr_curr_01',
          role: 'BUSINESS',
          profile: {
            id: 'prof_01',
            userId: 'usr_curr_01',
            firstName: 'Alex',
            lastName: 'Morgan',
            fullName: 'Alex Morgan',
            avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
            headline: 'Founder & Head of Tech @ Nexas Digital',
            bio: 'Building enterprise mobile & cloud architectures.',
            city: 'Bangalore',
            country: 'India',
            skills: ['Mobile Development'],
            interests: ['B2B Networking'],
            profileCompletionPercentage: 95,
          },
        },
      };
      return newListing;
    }
  },
  requestService: async (listingId: string, data: { message: string; estimatedBudget?: number; timeline?: string }) => {
    try {
      const res = await apiClient.post(`/marketplace/${listingId}/request`, data);
      return res.data;
    } catch {
      return { success: true, message: 'Service request sent! Conversation opened with provider.' };
    }
  },
};

export const savedApi = {
  getSavedItems: async (targetType?: SavedTargetType): Promise<any[]> => {
    try {
      const res = await apiClient.get('/saved', { params: { targetType } });
      return res.data || [];
    } catch {
      return [];
    }
  },
  toggleSave: async (targetType: SavedTargetType, targetId: string) => {
    try {
      const res = await apiClient.post('/saved/toggle', { targetType, targetId });
      return res.data;
    } catch {
      return { isSaved: true };
    }
  },
};

export const reviewsApi = {
  getListingReviews: async (listingId: string): Promise<ReviewItem[]> => {
    try {
      const res = await apiClient.get(`/reviews/listing/${listingId}`);
      return res.data || [];
    } catch {
      return [
        {
          id: 'rev_01',
          rating: 5,
          comment: 'Incredible execution on our offline sync TurboModule. Delivered ahead of schedule with complete documentation.',
          createdAt: '1w ago',
          reviewer: {
            id: 'usr_vikram_01',
            profile: {
              fullName: 'Vikram Singh',
              avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
            },
          },
        },
      ];
    }
  },
  createReview: async (data: { providerId: string; listingId?: string; rating: number; comment: string }) => {
    try {
      const res = await apiClient.post('/reviews', data);
      return res.data;
    } catch {
      return { success: true };
    }
  },
};

export const rewardsApi = {
  getWallet: async (): Promise<WalletSummary> => {
    try {
      const res = await apiClient.get('/rewards/wallet');
      return res.data;
    } catch {
      return WALLET_SUMMARY_DATA;
    }
  },
  getTransactions: async (page = 1) => {
    try {
      const res = await apiClient.get('/rewards/transactions', { params: { page } });
      return res.data?.items || WALLET_SUMMARY_DATA.recentTransactions;
    } catch {
      return WALLET_SUMMARY_DATA.recentTransactions;
    }
  },
  getCatalog: async (): Promise<RewardItem[]> => {
    try {
      const res = await apiClient.get('/rewards/catalog');
      return res.data || [];
    } catch {
      return REWARDS_DATA;
    }
  },
  redeemReward: async (rewardId: string) => {
    try {
      const res = await apiClient.post(`/rewards/redeem/${rewardId}`);
      return res.data;
    } catch {
      return { success: true, claimedCode: 'LIPREWARD-7491', message: 'Reward redeemed successfully!' };
    }
  },
  getReferrals: async (): Promise<ReferralInfo> => {
    try {
      const res = await apiClient.get('/rewards/referrals');
      return res.data;
    } catch {
      return REFERRAL_INFO_DATA;
    }
  },
};

export const membershipApi = {
  getCurrentMembership: async (): Promise<MembershipInfo> => {
    try {
      const res = await apiClient.get('/membership/current');
      return res.data;
    } catch {
      return MEMBERSHIP_INFO_DATA;
    }
  },
  getPlans: async (): Promise<PlanItem[]> => {
    try {
      const res = await apiClient.get('/membership/plans');
      return res.data;
    } catch {
      return PLANS_DATA;
    }
  },
};

export const aiApi = {
  assist: async (query: string): Promise<AIAssistantResponse> => {
    try {
      const res = await apiClient.post('/ai/assist', { query });
      return res.data;
    } catch {
      return {
        reply: `I searched the LipTalk ecosystem for "${query}". Here are verified connections, opportunities, and guild resources matching your requirements.`,
        action: 'GENERAL_REPLY',
      };
    }
  },
  searchSemantic: async (query: string): Promise<SemanticSearchResults> => {
    try {
      const res = await apiClient.post('/ai/search', { query });
      return res.data;
    } catch {
      return {
        query,
        people: [{ user: CURRENT_USER, score: 95 }],
        services: MARKETPLACE_LISTINGS_DATA.map((l) => ({ listing: l, score: 92 })),
        opportunities: OPPORTUNITIES_DATA.map((o) => ({ opportunity: o, score: 90 })),
        communities: COMMUNITIES_DATA.map((c) => ({ community: c, score: 88 })),
      };
    }
  },
  smartNeed: async (draftText: string): Promise<SmartNeedSuggestion> => {
    try {
      const res = await apiClient.post('/ai/smart-need', { draftText });
      return res.data;
    } catch {
      return {
        title: draftText.slice(0, 50),
        category: 'IT & Software Development',
        tags: ['React Native', 'Mobile App', 'TypeScript'],
        suggestedSkills: ['React Native', 'Mobile Architecture'],
        descriptionOutline: draftText,
        priority: 'HIGH',
      };
    }
  },
  smartOffer: async (draftText: string): Promise<SmartOfferSuggestion> => {
    try {
      const res = await apiClient.post('/ai/smart-offer', { draftText });
      return res.data;
    } catch {
      return {
        title: draftText.slice(0, 50),
        category: 'IT & Software Development',
        tags: ['React Native', 'Expo', 'Cloud APIs'],
        skills: ['React Native', 'NestJS'],
        pricingModel: 'FIXED',
        description: draftText,
      };
    }
  },
  smartOpportunity: async (draftText: string): Promise<SmartOpportunitySuggestion> => {
    try {
      const res = await apiClient.post('/ai/smart-opportunity', { draftText });
      return res.data;
    } catch {
      return {
        title: draftText.slice(0, 60),
        category: 'IT & Software Development',
        tags: ['Enterprise Mobile', 'Cloud Backend', 'MVP Delivery'],
        description: draftText,
        suggestedMilestones: ['Phase 1: Architecture & Prototyping', 'Phase 2: Core Engineering', 'Phase 3: UAT & Production Launch'],
      };
    }
  },
  profileIntelligence: async (): Promise<ProfileIntelligenceReport> => {
    try {
      const res = await apiClient.get('/ai/profile-intelligence');
      return res.data;
    } catch {
      return {
        completenessScore: 85,
        missingFields: ['Video Introduction', 'Tax ID Verification'],
        suggestions: [
          'Add specialized capabilities (e.g. React Native, Cloud Architecture) to increase synergy match score by up to 25%.',
          'Enhance your headline with your core value proposition to attract enterprise opportunity creators.',
        ],
        status: 'OPTIMIZED',
      };
    }
  },
  chatAssist: async (mode: 'PROFESSIONAL' | 'SHORTEN' | 'PROPOSAL_PITCH', originalText: string) => {
    try {
      const res = await apiClient.post('/ai/chat-assist', { mode, originalText });
      return res.data;
    } catch {
      return {
        original: originalText,
        suggested: `Thank you for connecting. We would love to discuss your project requirements and scope alignment in detail.`,
      };
    }
  },
};

export const recommendationsApi = {
  getPersonalizedDiscover: async (): Promise<PersonalizedDiscoverFeed> => {
    try {
      const res = await apiClient.get('/recommendations/discover');
      return res.data;
    } catch {
      return {
        communities: COMMUNITIES_DATA,
        opportunities: OPPORTUNITIES_DATA,
        services: MARKETPLACE_LISTINGS_DATA,
      };
    }
  },
  recordFeedback: async (targetType: string, targetId: string, feedback: 'RELEVANT' | 'NOT_RELEVANT') => {
    try {
      const res = await apiClient.post('/recommendations/feedback', { targetType, targetId, feedback });
      return res.data;
    } catch {
      return { success: true };
    }
  },
};

// ==========================================
// PHASE 6: REAL-TIME & LIVE ECOSYSTEM APIS
// ==========================================

export const callsApi = {
  getHistory: async (): Promise<CallSession[]> => {
    try {
      const res = await apiClient.get('/calls/history');
      return res.data;
    } catch {
      return CALL_HISTORY_DATA;
    }
  },
  initiateCall: async (receiverId: string, callType: 'VOICE' | 'VIDEO' = 'VOICE'): Promise<CallSession> => {
    try {
      const res = await apiClient.post('/calls/initiate', { receiverId, callType });
      return res.data;
    } catch {
      return {
        id: 'call_' + Date.now(),
        caller: CURRENT_USER,
        receiver: {
          id: receiverId,
          email: 'peer@ecosystem.io',
          role: 'BUSINESS',
          isPhoneVerified: true,
          isEmailVerified: true,
          needsOnboarding: false,
          createdAt: new Date().toISOString(),
          profile: {
            id: 'prof_peer',
            userId: receiverId,
            firstName: 'Verified',
            lastName: 'Peer',
            fullName: 'Verified Peer',
            headline: 'Ecosystem Partner',
            city: 'Bangalore',
            country: 'India',
            bio: 'Verified partner',
            skills: ['Engineering'],
            interests: ['Tech'],
            profileCompletionPercentage: 90,
          },
        },
        callType,
        status: 'RINGING',
        durationSeconds: 0,
        createdAt: new Date().toISOString(),
      };
    }
  },
  endCall: async (callId: string, durationSeconds: number) => {
    try {
      const res = await apiClient.post(`/calls/${callId}/end`, { durationSeconds });
      return res.data;
    } catch {
      return { success: true };
    }
  },
};

export const liveRoomsApi = {
  getRooms: async (): Promise<LiveRoomItem[]> => {
    try {
      const res = await apiClient.get('/live-rooms');
      return res.data;
    } catch {
      return LIVE_ROOMS_DATA;
    }
  },
  getRoomById: async (id: string): Promise<LiveRoomItem> => {
    try {
      const res = await apiClient.get(`/live-rooms/${id}`);
      return res.data;
    } catch {
      return LIVE_ROOMS_DATA.find((r) => r.id === id) || LIVE_ROOMS_DATA[0];
    }
  },
  createRoom: async (data: Partial<LiveRoomItem>): Promise<LiveRoomItem> => {
    try {
      const res = await apiClient.post('/live-rooms', data);
      return res.data;
    } catch {
      return {
        id: 'room_' + Date.now(),
        host: CURRENT_USER,
        title: data.title || 'Live Networking Stage',
        description: data.description || 'Community live session',
        category: data.category || 'Tech & Networking',
        roomType: data.roomType || 'NETWORKING',
        status: 'LIVE',
        audienceCount: 1,
        coverImageUrl: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=600',
        startedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      };
    }
  },
  endRoom: async (id: string) => {
    try {
      const res = await apiClient.post(`/live-rooms/${id}/end`);
      return res.data;
    } catch {
      return { success: true };
    }
  },
};

export const creatorApi = {
  getFeed: async (): Promise<ProfessionalContentItem[]> => {
    try {
      const res = await apiClient.get('/creator/feed');
      return res.data;
    } catch {
      return PROFESSIONAL_CONTENTS_DATA;
    }
  },
  getAnalytics: async (): Promise<CreatorAnalytics> => {
    try {
      const res = await apiClient.get('/creator/analytics');
      return res.data;
    } catch {
      return CREATOR_ANALYTICS_DATA;
    }
  },
  publish: async (data: {
    title: string;
    body: string;
    contentType?: string;
    mediaUrls?: string[];
    tags?: string[];
    linkedOpportunityId?: string;
    linkedListingId?: string;
  }): Promise<ProfessionalContentItem> => {
    try {
      const res = await apiClient.post('/creator/publish', data);
      return res.data;
    } catch {
      return {
        id: 'content_' + Date.now(),
        author: CURRENT_USER,
        contentType: (data.contentType as any) || 'ANNOUNCEMENT',
        title: data.title,
        body: data.body,
        mediaUrls: data.mediaUrls || [],
        tags: data.tags || ['Verified Broadcaster'],
        likesCount: 0,
        viewsCount: 1,
        isFollowing: true,
        createdAt: new Date().toISOString(),
      };
    }
  },
  toggleFollow: async (userId: string): Promise<{ isFollowing: boolean }> => {
    try {
      const res = await apiClient.post(`/creator/follow/${userId}`);
      return res.data;
    } catch {
      return { isFollowing: true };
    }
  },
};

// ==========================================
// Phase 7 APIs
// ==========================================
export const enterpriseApi = {
  getMyOrganizations: async (): Promise<Array<{ organization: OrganizationItem; userRole: string; department: string; jobTitle: string }>> => {
    try {
      const res = await apiClient.get('/enterprise/my-organizations');
      return res.data;
    } catch {
      return [
        {
          organization: ORGANIZATIONS_DATA[0],
          userRole: 'OWNER',
          department: 'Executive Leadership',
          jobTitle: 'Chief Technology Officer',
        },
      ];
    }
  },
  getOrganization: async (id: string): Promise<OrganizationItem> => {
    try {
      const res = await apiClient.get(`/enterprise/organizations/${id}`);
      return res.data;
    } catch {
      return ORGANIZATIONS_DATA[0];
    }
  },
  getMembers: async (orgId: string): Promise<OrganizationMemberItem[]> => {
    try {
      const res = await apiClient.get(`/enterprise/organizations/${orgId}/members`);
      return res.data;
    } catch {
      return ORGANIZATION_MEMBERS_DATA;
    }
  },
  getTeams: async (orgId: string): Promise<TeamItem[]> => {
    try {
      const res = await apiClient.get(`/enterprise/organizations/${orgId}/teams`);
      return res.data;
    } catch {
      return TEAMS_DATA;
    }
  },
  getAnalytics: async (orgId: string): Promise<EnterpriseAnalytics> => {
    try {
      const res = await apiClient.get(`/enterprise/organizations/${orgId}/analytics`);
      return res.data;
    } catch {
      return ENTERPRISE_ANALYTICS_DATA;
    }
  },
  inviteMember: async (orgId: string, email: string, role: string) => {
    try {
      const res = await apiClient.post(`/enterprise/organizations/${orgId}/invite`, { email, role });
      return res.data;
    } catch {
      return { success: true, message: `Invitation dispatched to ${email}` };
    }
  },
};

export const trustSafetyApi = {
  getTrustScore: async (userId?: string): Promise<TrustScoreReport> => {
    try {
      const url = userId ? `/trust-safety/trust-score/${userId}` : '/trust-safety/my-trust-score';
      const res = await apiClient.get(url);
      return res.data;
    } catch {
      return TRUST_SCORE_DATA;
    }
  },
  createReport: async (data: {
    targetType: string;
    targetId: string;
    reason: string;
    description?: string;
  }) => {
    try {
      const res = await apiClient.post('/trust-safety/reports', data);
      return res.data;
    } catch {
      return { success: true, id: 'rep_' + Date.now() };
    }
  },
  blockUser: async (userId: string) => {
    try {
      const res = await apiClient.post(`/trust-safety/blocks/${userId}`);
      return res.data;
    } catch {
      return { success: true };
    }
  },
  unblockUser: async (userId: string) => {
    try {
      const res = await apiClient.post(`/trust-safety/unblock/${userId}`);
      return res.data;
    } catch {
      return { success: true };
    }
  },
};

export const privacyApi = {
  getSettings: async (): Promise<PrivacySettings> => {
    try {
      const res = await apiClient.get('/privacy/settings');
      return res.data;
    } catch {
      return PRIVACY_SETTINGS_DATA;
    }
  },
  updateSettings: async (settings: Partial<PrivacySettings>): Promise<PrivacySettings> => {
    try {
      const res = await apiClient.put('/privacy/settings', settings);
      return res.data;
    } catch {
      return { ...PRIVACY_SETTINGS_DATA, ...settings };
    }
  },
  exportData: async () => {
    try {
      const res = await apiClient.get('/privacy/export');
      return res.data;
    } catch {
      return { success: true, exportedAt: new Date().toISOString(), user: CURRENT_USER };
    }
  },
  deactivateAccount: async (reason?: string) => {
    try {
      const res = await apiClient.post('/privacy/deactivate', { reason });
      return res.data;
    } catch {
      return { success: true };
    }
  },
};

export const adminApi = {
  getMetrics: async (): Promise<AdminPlatformMetrics> => {
    try {
      const res = await apiClient.get('/admin/overview');
      return res.data;
    } catch {
      return ADMIN_METRICS_DATA;
    }
  },
  getAuditLogs: async (): Promise<AuditLogItem[]> => {
    try {
      const res = await apiClient.get('/admin/audit-logs');
      return res.data;
    } catch {
      return AUDIT_LOGS_DATA;
    }
  },
  getFeatureFlags: async (): Promise<FeatureFlags> => {
    try {
      const res = await apiClient.get('/admin/feature-flags');
      return res.data;
    } catch {
      return FEATURE_FLAGS_DATA;
    }
  },
  toggleFeatureFlag: async (flag: string, value: boolean) => {
    try {
      const res = await apiClient.post('/admin/feature-flags', { flag, value });
      return res.data;
    } catch {
      return { [flag]: value };
    }
  },
};

export const localizationApi = {
  getConfig: async (): Promise<LocalizationConfig> => {
    try {
      const res = await apiClient.get('/localization/config');
      return res.data;
    } catch {
      return LOCALIZATION_CONFIG_DATA;
    }
  },
  getRegionalDiscovery: async (params: {
    country?: string;
    region?: string;
    city?: string;
    language?: string;
  }): Promise<RegionalDiscoveryResult> => {
    try {
      const res = await apiClient.get('/localization/discovery/regional', { params });
      return res.data;
    } catch {
      return {
        filtersApplied: params,
        regionalCommunitiesCount: COMMUNITIES_DATA.length,
        communities: COMMUNITIES_DATA,
        marketplaceListings: MARKETPLACE_LISTINGS_DATA,
      };
    }
  },
};

export const userPreferencesApi = {
  getPreferences: async (): Promise<UserPreferences> => {
    try {
      const res = await apiClient.get('/user/preferences');
      return res.data;
    } catch {
      return USER_PREFERENCES_DATA;
    }
  },
  updatePreferences: async (data: Partial<UserPreferences>): Promise<UserPreferences> => {
    try {
      const res = await apiClient.patch('/user/preferences', data);
      return res.data;
    } catch {
      return { ...USER_PREFERENCES_DATA, ...data };
    }
  },
};

export const aiGatewayApi = {
  getConfig: async (): Promise<AiGatewayConfig> => {
    try {
      const res = await apiClient.get('/ai/config');
      return res.data;
    } catch {
      return {
        version: '9.1.0',
        activeGateway: 'LIPTALK_CENTRAL_AI_GATEWAY',
        supportedProviders: ['GEMINI', 'OPENAI', 'HEURISTIC'],
        supportedScopes: [
          'ai.read',
          'ai.search',
          'ai.recommend',
          'ai.summarize',
          'ai.translate',
          'ai.draft',
          'ai.save',
          'ai.message',
          'ai.publish',
          'ai.purchase',
        ],
        privacyLevels: ['STANDARD', 'MINIMAL', 'STRICT_ANONYMIZED'],
        memoryCategories: ['PREFERENCE', 'INTEREST', 'INTERACTION', 'SAVED_CONTEXT', 'EXPLICIT_MEMORY'],
      };
    }
  },
  getMemories: async (): Promise<AiUserMemoryItem[]> => {
    try {
      const res = await apiClient.get('/ai/memory');
      return res.data || [];
    } catch {
      return AI_MEMORIES_DATA;
    }
  },
  saveMemory: async (key: string, value: string, category: any = 'PREFERENCE', isPinned = false): Promise<AiUserMemoryItem> => {
    try {
      const res = await apiClient.post('/ai/memory', { key, value, category, isPinned });
      return res.data;
    } catch {
      const newMem: AiUserMemoryItem = {
        id: 'mem_' + Date.now(),
        userId: 'usr_curr_01',
        category,
        key,
        value,
        confidence: 1.0,
        isPinned,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      return newMem;
    }
  },
  deleteMemory: async (id: string): Promise<{ success: boolean }> => {
    try {
      const res = await apiClient.delete(`/ai/memory/${id}`);
      return res.data;
    } catch {
      return { success: true };
    }
  },
  clearAllMemories: async (): Promise<{ success: boolean; clearedCount: number }> => {
    try {
      const res = await apiClient.delete('/ai/memory');
      return res.data;
    } catch {
      return { success: true, clearedCount: AI_MEMORIES_DATA.length };
    }
  },
  getUsage: async (): Promise<AiUsageSummary> => {
    try {
      const res = await apiClient.get('/ai/usage');
      return res.data;
    } catch {
      return AI_USAGE_DATA;
    }
  },
  translate: async (text: string, targetLanguage: string, locale = 'en'): Promise<{ original: string; targetLanguage: string; translated: string }> => {
    try {
      const res = await apiClient.post('/ai/translate', { text, targetLanguage, locale });
      return res.data;
    } catch {
      return {
        original: text,
        targetLanguage,
        translated: `[${targetLanguage.toUpperCase()}]: ${text}`,
      };
    }
  },
  getActions: async (): Promise<AiActionItem[]> => {
    try {
      const res = await apiClient.get('/ai/actions');
      return res.data || [];
    } catch {
      return [
        {
          id: 'act_01',
          userId: 'usr_curr_01',
          actionType: 'DRAFT',
          status: 'EXECUTED',
          targetEntity: 'NEED',
          payload: { title: 'React Native & Offline Sync Developer', category: 'IT & Software Development' },
          confirmationRequired: false,
          executedAt: '2026-08-23T16:30:00Z',
          createdAt: '2026-08-23T16:30:00Z',
        },
      ];
    }
  },
  planAction: async (dto: { actionType: any; targetEntity: string; payload: Record<string, any> }): Promise<AiActionItem> => {
    try {
      const res = await apiClient.post('/ai/actions/plan', dto);
      return res.data;
    } catch {
      const action: AiActionItem = {
        id: 'act_' + Date.now(),
        userId: 'usr_curr_01',
        actionType: dto.actionType,
        status: ['PUBLISH', 'PURCHASE', 'DELETE', 'MESSAGE'].includes(dto.actionType) ? 'PENDING_CONFIRMATION' : 'EXECUTED',
        targetEntity: dto.targetEntity,
        payload: dto.payload,
        confirmationRequired: ['PUBLISH', 'PURCHASE', 'DELETE', 'MESSAGE'].includes(dto.actionType),
        createdAt: new Date().toISOString(),
      };
      return action;
    }
  },
  confirmAction: async (id: string): Promise<AiActionItem> => {
    try {
      const res = await apiClient.post(`/ai/actions/${id}/confirm`);
      return res.data;
    } catch {
      return {
        id,
        userId: 'usr_curr_01',
        actionType: 'DRAFT',
        status: 'EXECUTED',
        targetEntity: 'NEED',
        payload: {},
        confirmationRequired: true,
        confirmedAt: new Date().toISOString(),
        executedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      };
    }
  },
  rejectAction: async (id: string): Promise<AiActionItem> => {
    try {
      const res = await apiClient.post(`/ai/actions/${id}/reject`);
      return res.data;
    } catch {
      return {
        id,
        userId: 'usr_curr_01',
        actionType: 'DRAFT',
        status: 'REJECTED',
        targetEntity: 'NEED',
        payload: {},
        confirmationRequired: true,
        createdAt: new Date().toISOString(),
      };
    }
  },
  getTrends: async (params?: { scope?: string; country?: string; language?: string }): Promise<GlobalTrendItem[]> => {
    try {
      const res = await apiClient.get('/ai/trends', { params });
      return res.data || [];
    } catch {
      return [
        {
          id: 'trend_01',
          topic: 'Cross-Border FMCG Supply Chain',
          category: 'General Trade & Commerce',
          scope: 'GLOBAL',
          velocityScore: 98,
          postCount: 1420,
          searchCount: 5200,
          createdAt: new Date().toISOString(),
        },
        {
          id: 'trend_02',
          topic: 'AI Voice Translation & Regional Dialects',
          category: 'AI & Communication',
          scope: 'GLOBAL',
          velocityScore: 94,
          postCount: 1180,
          searchCount: 4600,
          createdAt: new Date().toISOString(),
        },
      ];
    }
  },
};

export const aiPreferencesApi = {
  getPreferences: async (): Promise<AiUserPreference> => {
    try {
      const res = await apiClient.get('/ai/preferences');
      return res.data;
    } catch {
      return AI_USER_PREFERENCES_DATA;
    }
  },
  updatePreferences: async (data: Partial<AiUserPreference>): Promise<AiUserPreference> => {
    try {
      const res = await apiClient.patch('/ai/preferences', data);
      return res.data;
    } catch {
      return { ...AI_USER_PREFERENCES_DATA, ...data };
    }
  },
};

export const agentApi = {
  getPersonalAgent: async (): Promise<AgentItem> => {
    try {
      const res = await apiClient.get('/ai/agent/me');
      return res.data;
    } catch {
      return {
        id: 'agent_pers_01',
        userId: 'usr_curr_01',
        name: 'My Personal LipTalk Assistant',
        description: 'Autonomous assistant for smart discovery, drafting, event digests, and knowledge organization.',
        type: 'PERSONAL',
        status: 'ACTIVE',
        allowedTools: ['search', 'read_content', 'summarize', 'translate', 'save_content', 'create_draft'],
        allowedScopes: ['ai.read', 'ai.search', 'ai.recommend', 'ai.summarize', 'ai.translate', 'ai.draft'],
        maxDailyExecutions: 100,
        monthlyBudgetUsd: 2.0,
        currentMonthSpendUsd: 0.01,
        requireHighImpactConfirmation: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }
  },
  updateAgent: async (id: string, data: Partial<AgentItem>): Promise<AgentItem> => {
    try {
      const res = await apiClient.patch(`/ai/agent/${id}`, data);
      return res.data;
    } catch {
      return {
        id,
        userId: 'usr_curr_01',
        name: data.name || 'My Personal LipTalk Assistant',
        type: 'PERSONAL',
        status: data.status || 'ACTIVE',
        allowedTools: data.allowedTools || ['search', 'read_content', 'summarize'],
        allowedScopes: data.allowedScopes || ['ai.read', 'ai.search'],
        maxDailyExecutions: data.maxDailyExecutions || 100,
        monthlyBudgetUsd: data.monthlyBudgetUsd || 2.0,
        currentMonthSpendUsd: 0.01,
        requireHighImpactConfirmation: data.requireHighImpactConfirmation ?? true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }
  },
  executeTask: async (id: string, prompt: string): Promise<AgentExecutionItem> => {
    try {
      const res = await apiClient.post(`/ai/agent/${id}/execute`, { prompt });
      return res.data;
    } catch {
      return {
        id: 'exec_' + Date.now(),
        userId: 'usr_curr_01',
        status: 'COMPLETED',
        initialPromptOrTrigger: prompt,
        stepsLog: [
          {
            stepIndex: 1,
            toolName: 'search',
            input: { query: prompt },
            output: 'Retrieved 4 relevant ecosystem matches.',
            status: 'SUCCESS',
            latencyMs: 120,
          },
          {
            stepIndex: 2,
            toolName: 'summarize',
            input: {},
            output: 'Synthesized high-value synergy overview.',
            status: 'SUCCESS',
            latencyMs: 90,
          },
        ],
        finalResultText: `Agent executed goal "${prompt}". Synthesized 4 verified ecosystem opportunities matching your capabilities.`,
        tokensUsed: 140,
        costUsd: 0.0001,
        executionTimeMs: 420,
        createdAt: new Date().toISOString(),
      };
    }
  },
  getWorkflows: async (): Promise<AgentWorkflowItem[]> => {
    try {
      const res = await apiClient.get('/ai/workflows');
      return res.data || [];
    } catch {
      return [
        {
          id: 'wf_01',
          userId: 'usr_curr_01',
          title: 'Sunday AI Community Digest',
          description: 'Summarizes top discussion threads and opportunities across followed guilds every Sunday morning.',
          triggerType: 'SCHEDULE',
          scheduleCron: '0 9 * * 0',
          actionsPlan: [
            { step: 1, tool: 'read_content', inputTemplate: { scope: 'followed_communities' }, riskLevel: 'LOW' },
            { step: 2, tool: 'summarize', inputTemplate: {}, riskLevel: 'LOW' },
          ],
          isActive: true,
          lastRunAt: '2026-08-17T09:00:00Z',
          createdAt: '2026-08-01T10:00:00Z',
        },
        {
          id: 'wf_02',
          userId: 'usr_curr_01',
          title: 'Daily Tech Events Radar',
          description: 'Surfaces newly published technology and founder events in Bangalore & Dubai.',
          triggerType: 'SCHEDULE',
          scheduleCron: '0 8 * * *',
          actionsPlan: [
            { step: 1, tool: 'search', inputTemplate: { category: 'Technology' }, riskLevel: 'LOW' },
          ],
          isActive: true,
          lastRunAt: '2026-08-23T08:00:00Z',
          createdAt: '2026-08-05T10:00:00Z',
        },
      ];
    }
  },
  toggleWorkflow: async (id: string, isActive: boolean): Promise<{ success: boolean }> => {
    try {
      await apiClient.patch(`/ai/workflows/${id}/toggle`, { isActive });
      return { success: true };
    } catch {
      return { success: true };
    }
  },
  getKnowledge: async (): Promise<KnowledgeCollectionItem[]> => {
    try {
      const res = await apiClient.get('/ai/knowledge');
      return res.data || [];
    } catch {
      return [
        {
          id: 'coll_01',
          userId: 'usr_curr_01',
          title: 'Core Technology & Partnerships',
          category: 'Engineering & B2B',
          tags: ['React Native', 'NestJS', 'B2B Trade', 'AI Agents'],
          items: [
            {
              id: 'item_01',
              itemType: 'NOTE',
              title: 'Cross-Border FMCG Partnership Notes',
              content: 'Direct mill procurement hubs in Bangalore and Dubai reduce wholesale latency by 40%.',
              addedAt: '2026-08-20T10:00:00Z',
            },
            {
              id: 'item_02',
              itemType: 'POST',
              title: 'High-Ticket React Native Architectures',
              content: 'Offline-first sync combined with TurboModules yields 60fps scrolling on low-end devices.',
              addedAt: '2026-08-21T14:30:00Z',
            },
          ],
          isPublic: false,
          createdAt: '2026-08-15T10:00:00Z',
        },
      ];
    }
  },
  addKnowledgeItem: async (collectionId: string, item: { title: string; content: string; itemType: any }): Promise<KnowledgeCollectionItem> => {
    try {
      const res = await apiClient.post(`/ai/knowledge/${collectionId}/items`, item);
      return res.data;
    } catch {
      return {
        id: collectionId,
        userId: 'usr_curr_01',
        title: 'Core Technology & Partnerships',
        category: 'Engineering & B2B',
        isPublic: false,
        createdAt: new Date().toISOString(),
      };
    }
  },
  synthesizeKnowledge: async (query: string): Promise<{ synthesis: string; sources: string[] }> => {
    try {
      const res = await apiClient.post('/ai/knowledge/synthesize', { query });
      return res.data;
    } catch {
      return {
        synthesis: `Synthesized Knowledge Overview: Based on your saved notes on Cross-Border FMCG and React Native TurboModules, offline-first sync enables 60fps responsiveness across regional supply-chain operations.`,
        sources: ['Core Technology & Partnerships'],
      };
    }
  },
  getTrustCenter: async (): Promise<AiTrustCenterInfo> => {
    try {
      const res = await apiClient.get('/ai/trust');
      return res.data;
    } catch {
      return {
        title: 'LipTalk AI Trust & Safety Governance Center',
        version: '10.0',
        principles: [
          {
            title: 'Human Authority & Control',
            description: 'High-impact actions (publishing, payments, deletions) strictly require explicit user approval.',
          },
          {
            title: 'Zero Credential Leakage',
            description: 'Bearer tokens, passwords, and sensitive credentials are automatically redacted before model transmission.',
          },
          {
            title: 'User-Governed Memory Vault',
            description: 'Users have full visibility to view, edit, or purge all learned AI context at any time.',
          },
          {
            title: 'Transparent Multi-Model Routing',
            description: 'Independent model failover ensures zero downtime while tracking token consumption and cost per request.',
          },
        ],
        safetyThresholds: {
          maxStepLimit: 5,
          maxDailyBudgetUsd: 10.0,
          rateLimitPerMinute: 60,
          emergencyKillSwitchActive: false,
        },
      };
    }
  },
};

export const developerApi = {
  getApps: async (): Promise<DeveloperAppItem[]> => {
    try {
      const res = await apiClient.get('/developer/apps');
      return res.data || [];
    } catch {
      return [
        {
          id: 'app_01',
          developerId: 'usr_curr_01',
          name: 'Nexas B2B Enterprise Connector',
          description: 'Syncs marketplace opportunities and lead pipelines to internal CRM tools.',
          apiKey: 'ltk_live_nx99a8b7c6d5e4f3a2b1c0',
          redirectUri: 'https://nexastech.com/oauth/callback',
          scopes: ['read:profile', 'read:marketplace', 'write:opportunities', 'read:leads'],
          rateLimitPerMinute: 1200,
          isActive: true,
          createdAt: '2026-08-10T10:00:00Z',
        },
      ];
    }
  },
  createApp: async (data: { name: string; description?: string; redirectUri?: string; scopes?: string[] }): Promise<DeveloperAppItem> => {
    try {
      const res = await apiClient.post('/developer/apps', data);
      return res.data;
    } catch {
      return {
        id: 'app_' + Date.now(),
        developerId: 'usr_curr_01',
        name: data.name,
        description: data.description,
        apiKey: 'ltk_live_' + Math.random().toString(36).substring(2, 15),
        redirectUri: data.redirectUri,
        scopes: data.scopes || ['read:profile', 'read:marketplace'],
        rateLimitPerMinute: 1000,
        isActive: true,
        createdAt: new Date().toISOString(),
      };
    }
  },
  rollApiKey: async (id: string): Promise<{ apiKey: string }> => {
    try {
      const res = await apiClient.post(`/developer/apps/${id}/roll-key`);
      return res.data;
    } catch {
      return { apiKey: 'ltk_live_' + Math.random().toString(36).substring(2, 15) };
    }
  },
  getWebhooks: async (appId: string): Promise<WebhookItem[]> => {
    try {
      const res = await apiClient.get(`/developer/apps/${appId}/webhooks`);
      return res.data || [];
    } catch {
      return [
        {
          id: 'wh_01',
          targetUrl: 'https://api.nexastech.com/webhooks/liptalk',
          secretToken: 'whsec_secret_9988776655',
          subscribedEvents: ['user.created', 'opportunity.created', 'order.completed'],
          isActive: true,
          deliveriesCount: 412,
          failuresCount: 0,
          createdAt: '2026-08-12T10:00:00Z',
        },
      ];
    }
  },
  createWebhook: async (appId: string, targetUrl: string, subscribedEvents: string[]): Promise<WebhookItem> => {
    try {
      const res = await apiClient.post(`/developer/apps/${appId}/webhooks`, { targetUrl, subscribedEvents });
      return res.data;
    } catch {
      return {
        id: 'wh_' + Date.now(),
        targetUrl,
        secretToken: 'whsec_' + Math.random().toString(36).substring(2, 15),
        subscribedEvents,
        isActive: true,
        deliveriesCount: 0,
        failuresCount: 0,
        createdAt: new Date().toISOString(),
      };
    }
  },
};

export const ecosystemApi = {
  getReputation: async (userId = 'usr_curr_01'): Promise<ReputationProfileItem> => {
    try {
      const res = await apiClient.get('/ecosystem/reputation');
      return res.data;
    } catch {
      return {
        id: 'rep_01',
        userId,
        marketplaceReputation: 92,
        communityReputation: 95,
        creatorReputation: 88,
        developerReputation: 94,
        contributorReputation: 90,
        overallTrustScore: 92,
        trustTier: 'TIER_1_VERIFIED',
        badges: ['VERIFIED_DEVELOPER', 'COMMUNITY_MENTOR', 'TOP_CONTRIBUTOR', 'ESCROW_VERIFIED'],
      };
    }
  },
  getProjects: async (): Promise<ProjectWorkspaceItem[]> => {
    try {
      const res = await apiClient.get('/ecosystem/projects');
      return res.data || [];
    } catch {
      return [
        {
          id: 'proj_01',
          ownerId: 'usr_curr_01',
          title: 'Open FMCG Supply Chain Gateway',
          description: 'Collaborative initiative to connect independent Kirana merchants with national mill hubs.',
          scope: 'COMMUNITY_OPEN_SOURCE',
          progressPercent: 65,
          members: [
            { userId: 'usr_curr_01', role: 'LEAD', joinedAt: '2026-08-01T10:00:00Z' },
            { userId: 'usr_sarah_02', role: 'CONTRIBUTOR', joinedAt: '2026-08-05T10:00:00Z' },
          ],
          milestones: [
            { id: 'm1', title: 'Phase 1: Architecture Blueprint', dueDate: '2026-08-15', completed: true },
            { id: 'm2', title: 'Phase 2: Live Prototype Arena', dueDate: '2026-09-01', completed: false },
          ],
          tasks: [
            { id: 't1', title: 'Build GT vs MT interactive arena', status: 'DONE', priority: 'HIGH' },
            { id: 't2', title: 'Implement automated revenue split engine', status: 'IN_PROGRESS', priority: 'HIGH' },
          ],
          createdAt: '2026-08-01T10:00:00Z',
        },
      ];
    }
  },
  getCreatorServices: async (): Promise<CreatorServiceItem[]> => {
    try {
      const res = await apiClient.get('/ecosystem/creator/services');
      return res.data || [];
    } catch {
      return [
        {
          id: 'cserv_01',
          creatorId: 'usr_curr_01',
          title: 'Enterprise React Native & Cloud Architecture Audit',
          description: 'Comprehensive 1-on-1 teardown of mobile performance, TurboModules, and offline sync resilience.',
          category: 'Architecture Review',
          price: 25000,
          currency: 'INR',
          pricingModel: 'FIXED',
          averageRating: 5.0,
          completedOrdersCount: 14,
          isActive: true,
          createdAt: '2026-08-01T10:00:00Z',
        },
      ];
    }
  },
  calculateRevenueSplit: async (amount: number, currency = 'INR', hasCollaborator = false, hasCommunity = false): Promise<RevenueSplitItem> => {
    try {
      const res = await apiClient.post('/ecosystem/creator/revenue-split', { amount, currency, hasCollaborator, hasCommunity });
      return res.data;
    } catch {
      const platformFee = Number((amount * 0.05).toFixed(2));
      let remainder = amount - platformFee;
      let collab = 0;
      let comm = 0;
      if (hasCollaborator) {
        collab = Number((remainder * 0.2).toFixed(2));
        remainder -= collab;
      }
      if (hasCommunity) {
        comm = Number((remainder * 0.05).toFixed(2));
        remainder -= comm;
      }
      return {
        id: 'split_' + Date.now(),
        transactionId: 'tx_' + Date.now(),
        totalGrossAmount: amount,
        currency,
        platformFeeAmount: platformFee,
        creatorNetAmount: Number(remainder.toFixed(2)),
        collaboratorNetAmount: collab,
        communityShareAmount: comm,
        status: 'SETTLED',
        createdAt: new Date().toISOString(),
      };
    }
  },
  getSubscriptions: async (): Promise<SubscriptionItem[]> => {
    try {
      const res = await apiClient.get('/ecosystem/subscriptions');
      return res.data || [];
    } catch {
      return [
        {
          id: 'sub_01',
          userId: 'usr_curr_01',
          targetEntityId: 'lip_platform',
          subscriptionType: 'PLATFORM_PRO',
          planName: 'LipTalk Executive Pro (Annual)',
          amount: 4999,
          currency: 'INR',
          billingInterval: 'ANNUAL',
          status: 'ACTIVE',
          currentPeriodEnd: '2027-08-23T10:00:00Z',
        },
      ];
    }
  },
  getAgentStore: async (category?: string): Promise<AgentStoreListingItem[]> => {
    try {
      const res = await apiClient.get('/ecosystem/agent-store', { params: { category } });
      return res.data || [];
    } catch {
      return [
        {
          id: 'agent_store_01',
          developerId: 'dev_nexas_01',
          name: 'B2B Wholesale Procurement Radar',
          description: 'Autonomous agent that monitors regional FMCG commodity price drops and flags wholesale arbitrage deals.',
          category: 'B2B Sourcing',
          pricingModel: 'FREE',
          price: 0,
          requiredScopes: ['ai.search', 'ai.read'],
          certificationStatus: 'CERTIFIED',
          rating: 4.9,
          installsCount: 840,
          isActive: true,
        },
        {
          id: 'agent_store_02',
          developerId: 'dev_apex_02',
          name: 'Enterprise Contract Proposal Synthesizer',
          description: 'Prepares structured executive proposals and milestone SLA schedules from chat discussions.',
          category: 'Productivity',
          pricingModel: 'FREE',
          price: 0,
          requiredScopes: ['ai.draft', 'ai.summarize'],
          certificationStatus: 'CERTIFIED',
          rating: 4.8,
          installsCount: 1210,
          isActive: true,
        },
      ];
    }
  },
  getMentors: async (expertise?: string): Promise<MentorProfileItem[]> => {
    try {
      const res = await apiClient.get('/ecosystem/mentorship', { params: { expertise } });
      return res.data || [];
    } catch {
      return [
        {
          id: 'mentor_01',
          mentorId: 'usr_curr_01',
          headline: 'Founder & Head of Tech @ Nexas Digital',
          bio: 'Mentoring engineering founders on building high-scale React Native mobile apps and B2B marketplace platforms.',
          expertiseAreas: ['React Native Architecture', 'NestJS Backend', 'B2B Trade'],
          availabilityStatus: 'OPEN',
          menteesHelpedCount: 28,
          rating: 5.0,
        },
        {
          id: 'mentor_02',
          mentorId: 'usr_sarah_02',
          headline: 'VP of Product @ Apex Cloud Solutions',
          bio: 'Specializing in creator monetization, pricing strategies, and cross-border SaaS expansion.',
          expertiseAreas: ['Product Strategy', 'Creator Monetization', 'Global Expansion'],
          availabilityStatus: 'OPEN',
          menteesHelpedCount: 19,
          rating: 4.9,
        },
      ];
    }
  },
  matchOpportunities: async () => {
    try {
      const res = await apiClient.get('/ecosystem/opportunities/match');
      return res.data || [];
    } catch {
      return [
        {
          matchScore: 96,
          matchReason: 'High synergy with your verified React Native and Cloud Architecture capabilities.',
          opportunity: {
            id: 'opp_match_01',
            title: 'Lead Architect for Cross-Border Kirana B2B Procurement App',
            description: 'Looking for a senior mobile architect to lead TurboModules and offline sync design.',
            categoryName: 'IT & Software Development',
            city: 'Bangalore',
            country: 'India',
          },
        },
      ];
    }
  },
};

export const universalApi = {
  executeCommand: async (input: string, context?: Record<string, any>): Promise<UniversalCommandResult> => {
    try {
      const res = await apiClient.post('/universal/command', { input, context });
      return res.data;
    } catch {
      const raw = input.toLowerCase().trim();
      let intent: any = 'SEARCH';
      let route = '/search';
      if (raw.includes('agent') || raw.includes('workflow')) {
        intent = 'NAVIGATE';
        route = '/agents';
      } else if (raw.includes('trade') || raw.includes('marketplace')) {
        intent = 'NAVIGATE';
        route = '/marketplace';
      } else if (raw.includes('personal') || raw.includes('goal') || raw.includes('task')) {
        intent = 'NAVIGATE';
        route = '/personal';
      }
      return {
        intent,
        query: input,
        suggestedRoute: route,
        results: {
          opportunities: [
            { id: 'opp_res_01', title: 'Kirana FMCG Wholesale Direct Supply' },
          ],
          communities: [
            { id: 'comm_res_01', name: 'Retail Supply Chain Guild' },
          ],
          marketplace: [
            { id: 'mkt_res_01', title: 'Grade-A Basmati Rice Bulk 500kg' },
          ],
        },
      };
    }
  },
  getDashboard: async (): Promise<{
    goals: PersonalGoalItem[];
    tasks: PersonalTaskItem[];
    learningPaths: LearningPathItem[];
    aiSummary: string;
  }> => {
    try {
      const res = await apiClient.get('/universal/dashboard');
      return res.data;
    } catch {
      return {
        goals: [
          {
            id: 'goal_01',
            userId: 'usr_curr_01',
            title: 'Master Cross-Border B2B Supply Chain',
            category: 'COMMERCE_EXPANSION',
            progressPercent: 40,
            status: 'IN_PROGRESS',
          },
        ],
        tasks: [
          {
            id: 'task_01',
            userId: 'usr_curr_01',
            title: 'Review GT vs MT Price Index report',
            priority: 'HIGH',
            status: 'TODO',
          },
          {
            id: 'task_02',
            userId: 'usr_curr_01',
            title: 'Complete Autonomous Agent allowlist security check',
            priority: 'CRITICAL',
            status: 'IN_PROGRESS',
          },
        ],
        learningPaths: [
          {
            id: 'lp_01',
            userId: 'usr_curr_01',
            title: 'Modern B2B Supply Chain & Digital Trade',
            description: 'Comprehensive curriculum to master procurement forecasting and trade contracts.',
            category: 'Commerce Strategy',
            progressPercent: 60,
            modules: [
              { id: 'm1', title: 'Kirana Wholesale Sourcing Fundamentals', completed: true, estimatedMinutes: 25 },
              { id: 'm2', title: 'Smart Contracts & Escrow Settlements', completed: true, estimatedMinutes: 40 },
              { id: 'm3', title: 'AI-Driven Multi-Tier Inventory Forecasting', completed: false, estimatedMinutes: 30 },
            ],
          },
        ],
        aiSummary: 'You have 2 high-priority tasks and are 60% through the Digital Trade mastery track.',
      };
    }
  },
  createGoal: async (data: Partial<PersonalGoalItem>): Promise<PersonalGoalItem> => {
    try {
      const res = await apiClient.post('/universal/goals', data);
      return res.data;
    } catch {
      return {
        id: 'goal_' + Date.now(),
        userId: 'usr_curr_01',
        title: data.title || 'New Goal',
        category: data.category || 'SKILL_GROWTH',
        progressPercent: 0,
        status: 'IN_PROGRESS',
      };
    }
  },
  createTask: async (data: Partial<PersonalTaskItem>): Promise<PersonalTaskItem> => {
    try {
      const res = await apiClient.post('/universal/tasks', data);
      return res.data;
    } catch {
      return {
        id: 'task_' + Date.now(),
        userId: 'usr_curr_01',
        title: data.title || 'New Task',
        priority: data.priority || 'MEDIUM',
        status: 'TODO',
      };
    }
  },
  toggleTask: async (id: string): Promise<void> => {
    try {
      await apiClient.patch(`/universal/tasks/${id}/toggle`);
    } catch {
      // Ignore
    }
  },
  queryAmbientContext: async (screenContext: string, query: string) => {
    try {
      const res = await apiClient.post('/universal/ambient-query', { screenContext, query });
      return res.data;
    } catch {
      return {
        screenContext,
        query,
        answer: `Contextual assistance for ${screenContext}: Grounded recommendations and verified actions prepared.`,
        tokensUsed: 140,
      };
    }
  },
  simulateWorkflow: async (workflowConfig: { title: string; trigger: string; steps: string[] }) => {
    try {
      const res = await apiClient.post('/universal/simulate-workflow', workflowConfig);
      return res.data;
    } catch {
      return {
        workflowTitle: workflowConfig.title,
        triggerType: workflowConfig.trigger,
        simulatedSteps: workflowConfig.steps.map((step, idx) => ({
          stepNumber: idx + 1,
          tool: step,
          riskLevel: step === 'publish' || step === 'purchase' ? 'HIGH' : 'LOW',
          requiresApproval: step === 'publish' || step === 'purchase',
          estimatedLatencyMs: 180 + idx * 60,
        })),
        estimatedTokensTotal: workflowConfig.steps.length * 150,
        estimatedCostUsd: 0.004,
        safetyCheck: 'PASSED_ZERO_LOOP_RISK',
      };
    }
  },
};

// ==========================================
// PHASE 13: GLOBAL COORDINATION API CLIENT
// ==========================================

export const coordinationApi = {
  // 1. Global Goals & Initiatives
  getGoals: async (params?: { scope?: string; status?: string }) => {
    try {
      const res = await apiClient.get('/coordination/goals', { params });
      return res.data;
    } catch {
      return [
        {
          id: 'goal_01',
          ownerId: 'usr_curr_01',
          scope: 'COMMUNITY',
          title: 'Open FMCG Supply Chain Gateway',
          description: 'Global initiative to connect independent Kirana merchants with regional agricultural mills and transparent logistics.',
          objectives: [
            'Unify 500+ regional grain mills onto standard open escrow APIs',
            'Deploy verified B2B price discovery radar across 4 states',
            'Coordinate decentralized community delivery fleets',
          ],
          progressPercent: 68,
          status: 'ACTIVE',
          targetDate: '2026-11-30',
          milestones: [
            {
              id: 'm_01',
              goalId: 'goal_01',
              title: 'Publish open mill API & escrow contracts',
              dueDate: '2026-09-15',
              isCompleted: true,
              verifiedBy: 'usr_curr_01',
            },
            {
              id: 'm_02',
              goalId: 'goal_01',
              title: 'Deploy live arbitration dashboard in 10 hubs',
              dueDate: '2026-10-15',
              isCompleted: false,
            },
          ],
          participants: [
            { id: 'p_01', goalId: 'goal_01', userId: 'usr_curr_01', role: 'LEAD', contributionsCount: 14, joinedAt: '2026-08-01' },
            { id: 'p_02', goalId: 'goal_01', userId: 'usr_sarah_02', role: 'CONTRIBUTOR', contributionsCount: 6, joinedAt: '2026-08-05' },
          ],
        },
      ];
    }
  },
  getGoalById: async (id: string) => {
    try {
      const res = await apiClient.get(`/coordination/goals/${id}`);
      return res.data;
    } catch {
      const goals = await coordinationApi.getGoals();
      return goals.find((g: any) => g.id === id) || goals[0];
    }
  },
  createGoal: async (data: any) => {
    try {
      const res = await apiClient.post('/coordination/goals', data);
      return res.data;
    } catch {
      return { id: 'goal_' + Date.now(), ...data, progressPercent: 0, status: 'ACTIVE' };
    }
  },
  updateGoalProgress: async (id: string, progress: number) => {
    try {
      const res = await apiClient.patch(`/coordination/goals/${id}/progress`, { progress });
      return res.data;
    } catch {
      return { id, progressPercent: progress };
    }
  },
  toggleMilestone: async (id: string) => {
    try {
      const res = await apiClient.patch(`/coordination/milestones/${id}/toggle`);
      return res.data;
    } catch {
      return { id, isCompleted: true };
    }
  },
  joinGoal: async (id: string, role = 'CONTRIBUTOR') => {
    try {
      const res = await apiClient.post(`/coordination/goals/${id}/join`, { role });
      return res.data;
    } catch {
      return { id: 'p_' + Date.now(), goalId: id, role, contributionsCount: 1 };
    }
  },
  getInitiatives: async (category?: string) => {
    try {
      const res = await apiClient.get('/coordination/initiatives', { params: { category } });
      return res.data;
    } catch {
      return [
        {
          id: 'init_01',
          creatorId: 'usr_curr_01',
          title: 'Decentralized Micro-Grant & Mentorship Coalition',
          mission: 'Provide seed capital, engineering mentorship, and distribution access to 10,000 independent grassroot innovators.',
          category: 'Economic Empowerment',
          supportersCount: 4280,
          fundingGoalAmount: 5000000,
          currency: 'INR',
          fundingRaisedAmount: 3240000,
          status: 'ACTIVE',
        },
      ];
    }
  },

  // 2. Shared Workspaces & Contributions
  getWorkspaces: async () => {
    try {
      const res = await apiClient.get('/coordination/workspaces');
      return res.data;
    } catch {
      return [
        {
          id: 'ws_01',
          creatorId: 'usr_curr_01',
          name: 'Pan-India FMCG & Kirana Logistics Alliance',
          description: 'Cross-community workspace coordinating grain millers, warehouse managers, and Kirana merchants across 4 state federations.',
          type: 'CROSS_COMMUNITY',
          participatingCommunityIds: ['comm_kirana_01', 'comm_logistics_south', 'comm_mandi_north'],
          members: [
            { userId: 'usr_curr_01', role: 'ADMIN', joinedAt: '2026-08-01' },
            { userId: 'usr_sarah_02', role: 'MEMBER', joinedAt: '2026-08-05' },
          ],
          linkedProjectIds: ['proj_supply_01'],
          isActive: true,
        },
      ];
    }
  },
  getContributions: async (projectId: string) => {
    try {
      const res = await apiClient.get(`/coordination/projects/${projectId}/contributions`);
      return res.data;
    } catch {
      return [
        {
          id: 'contrib_01',
          projectId,
          contributorId: 'usr_curr_01',
          title: 'Zero-Knowledge Offline Batch Escrow Protocol Implementation',
          category: 'CODE',
          versionNumber: 2,
          isAiAssisted: true,
          status: 'VERIFIED',
          verifiedBy: 'usr_sarah_02',
        },
      ];
    }
  },

  // 3. Governance & Proposals
  getProposals: async (params?: { targetEntityId?: string; scope?: string }) => {
    try {
      const res = await apiClient.get('/coordination/proposals', { params });
      return res.data;
    } catch {
      return [
        {
          id: 'prop_01',
          creatorId: 'usr_curr_01',
          targetEntityId: 'comm_kirana_01',
          scope: 'COMMUNITY',
          title: 'Adopt Dynamic Escrow Fee Rebalancing for Small-Volume Farmers',
          description: 'Reduce standard 5% platform escrow fee to 2.5% for all micro-agricultural lots under ₹50,000 to encourage regional producer onboarding.',
          options: ['APPROVE', 'REJECT', 'NEED_FURTHER_ANALYSIS'],
          voteCounts: { APPROVE: 42, REJECT: 3, NEED_FURTHER_ANALYSIS: 5 },
          aiSummary: 'Proposal recommends a 50% discount on escrow fees for transactions under ₹50,000. Core benefit: Boosts onboarding speed of local farmers. Minor trade-off: Slight reduction in platform treasury revenue.',
          status: 'ACTIVE',
          votingDeadline: '2026-09-01T23:59:59Z',
        },
      ];
    }
  },
  castVote: async (proposalId: string, option: string, comment?: string) => {
    try {
      const res = await apiClient.post(`/coordination/proposals/${proposalId}/vote`, { option, comment });
      return res.data;
    } catch {
      return { proposalId, selectedOption: option, comment, status: 'VOTE_RECORDED' };
    }
  },
  getDecisionRecords: async () => {
    try {
      const res = await apiClient.get('/coordination/decision-records');
      return res.data;
    } catch {
      return [
        {
          id: 'dec_01',
          proposalId: 'prop_001',
          title: 'Approved Open Grain Pricing Telemetry Standard',
          decisionOutcome: 'PASSED',
          finalTally: { APPROVE: 88, REJECT: 4, ABSTAIN: 2 },
          resolutionSummary: 'Collective members overwhelmingly ratified the open telemetry schema for daily grain auction reporting.',
          governanceType: 'COMMUNITY_DEMOCRATIC_CONSENSUS',
        },
      ];
    }
  },

  // 4. Knowledge Network & Research
  getKnowledgeConflicts: async () => {
    try {
      const res = await apiClient.get('/coordination/knowledge/conflicts');
      return res.data;
    } catch {
      return [
        {
          id: 'conf_01',
          topic: 'Optimal Grain Moisture Tolerance for Long-Distance Bulk Rail Transit',
          conflictingSources: [
            { sourceName: 'Punjab Agricultural Logistics Paper', claim: 'Max 12.0% moisture content in non-AC boxcars.', confidenceScore: 0.92 },
            { sourceName: 'South India Warehouse Consortium', claim: 'Permits up to 13.5% with silica tarping.', confidenceScore: 0.89 },
          ],
          aiConflictExplanation: 'Discrepancy originates from regional humidity differentials during transit.',
          status: 'CONSENSUS_NOTE_ADDED',
        },
      ];
    }
  },
  getResearchProjects: async () => {
    try {
      const res = await apiClient.get('/coordination/research');
      return res.data;
    } catch {
      return [
        {
          id: 'res_01',
          leadUserId: 'usr_curr_01',
          title: 'Micro-Escrow Latency Optimization on Edge Hubs',
          researchQuestion: 'How can offline Kirana nodes securely validate trade commitments without constant 5G connectivity?',
          findingsNotes: ['Offline peer sync achieves sub-50ms token validation over local Wi-Fi / BLE beacons.'],
          aiSynthesizedReport: 'Research confirms edge-based cryptographic commitments allow reliable micro-trade settlement with deferred reconciliation once connectivity restores.',
          status: 'IN_PROGRESS',
        },
      ];
    }
  },

  // 5. Multi-Agent Project Teams
  getAgentTeams: async () => {
    try {
      const res = await apiClient.get('/coordination/agent-teams');
      return res.data;
    } catch {
      return [
        {
          id: 'team_01',
          ownerId: 'usr_curr_01',
          name: 'Autonomous FMCG Procurement & Arbitration Squad',
          mission: 'Coordinate multi-tier supplier price audits, contract drafting, and SLA compliance verification.',
          agents: [
            { agentRole: 'COORDINATOR', agentName: 'Orchestrator-Alpha', allowedTools: ['search', 'summarize'], maxTokensPerStep: 500 },
            { agentRole: 'RESEARCHER', agentName: 'Market-Radar-Agent', allowedTools: ['search', 'read_content'], maxTokensPerStep: 800 },
            { agentRole: 'DOCS', agentName: 'Contract-Synthesizer', allowedTools: ['create_draft', 'translate'], maxTokensPerStep: 1000 },
            { agentRole: 'QA', agentName: 'Quality-Gatekeeper', allowedTools: ['summarize'], maxTokensPerStep: 400 },
          ],
          maxDailySteps: 50,
          budgetUsdPerMonth: 15,
          requireHumanGateOnActions: true,
          status: 'ACTIVE',
        },
      ];
    }
  },
  executeAgentTeam: async (teamId: string, goalPrompt: string) => {
    try {
      const res = await apiClient.post(`/coordination/agent-teams/${teamId}/execute`, { goalPrompt });
      return res.data;
    } catch {
      return {
        id: 'exec_' + Date.now(),
        teamId,
        goalPrompt,
        collaborationTrail: [
          { stepIndex: 1, agentRole: 'RESEARCHER', actionTaken: 'Market price radar scan', outputSummary: 'Found 4 supplier lots with 12% price advantage.', qualityGatePassed: true },
          { stepIndex: 2, agentRole: 'DOCS', actionTaken: 'Draft B2B contract', outputSummary: 'Generated contract: 50MT Wheat @ ₹28.50/kg with escrow terms.', qualityGatePassed: true },
          { stepIndex: 3, agentRole: 'QA', actionTaken: 'Policy and escrow compliance audit', outputSummary: 'Quality Gate PASSED: Zero anomalies.', qualityGatePassed: true },
        ],
        finalSynthesisResult: `Mission complete for "${goalPrompt}". Optimal supplier lot identified with verified escrow proposal.`,
        status: 'COMPLETED',
        totalTokensUsed: 780,
        costUsd: 0.006,
      };
    }
  },

  // 6. Creator Collectives
  getCreatorCollectives: async () => {
    try {
      const res = await apiClient.get('/coordination/creator-collectives');
      return res.data;
    } catch {
      return [
        {
          id: 'col_01',
          name: 'Frontier Architecture & Systems Guild',
          description: 'Collective of senior engineering creators delivering high-tier system teardowns, masterclasses, and enterprise advisory.',
          members: [
            { creatorId: 'usr_curr_01', role: 'FOUNDER', revenueSplitPercentage: 50 },
            { creatorId: 'usr_sarah_02', role: 'CORE_CREATOR', revenueSplitPercentage: 50 },
          ],
          sharedSubscriptionPrice: 7999,
          currency: 'INR',
          totalCollectiveEarnings: 450000,
        },
      ];
    }
  },

  // 7. Privacy Vault & Identity Context
  getPersonalVault: async () => {
    try {
      const res = await apiClient.get('/coordination/privacy/vault');
      return res.data;
    } catch {
      return {
        userId: 'usr_curr_01',
        vaultStatus: 'ENCRYPTED_AND_ISOLATED',
        activeContext: 'PERSONAL',
        availablePersonas: [
          { contextType: 'PERSONAL', entityName: 'Personal Identity', role: 'INDIVIDUAL', reputationScore: 92 },
          { contextType: 'CREATOR', entityName: 'Nexas Cloud & Architecture Studio', role: 'FOUNDER_CREATOR', reputationScore: 88 },
          { contextType: 'DEVELOPER', entityName: 'B2B Open Trade Gateway Apps', role: 'VERIFIED_DEVELOPER', reputationScore: 94 },
          { contextType: 'COMMUNITY_MODERATOR', entityName: 'Kirana Wholesale Traders Guild', role: 'LEAD_MODERATOR', reputationScore: 96 },
        ],
        recentAccessEvents: [
          { id: 'log_1', accessorId: 'App_TradeRadar_01', dataScopeAccessed: 'projects.read', status: 'AUTHORIZED', canRevoke: true, accessedAt: '2026-08-23T10:00:00Z' },
          { id: 'log_2', accessorId: 'Agent_Contract_Drafter', dataScopeAccessed: 'knowledge.search', status: 'AUTHORIZED', canRevoke: true, accessedAt: '2026-08-23T12:00:00Z' },
        ],
        retainedMemoriesCount: 3,
        privacyControls: {
          proactiveIntelligence: true,
          aiMemoryAllowed: true,
          thirdPartySharing: false,
          biometricVoiceStorage: false,
        },
      };
    }
  },
  switchIdentityContext: async (contextType: string) => {
    try {
      const res = await apiClient.post('/coordination/identity/switch-context', { contextType });
      return res.data;
    } catch {
      return { activeContextType: contextType };
    }
  },
  revokeDataAccess: async (id: string) => {
    try {
      const res = await apiClient.patch(`/coordination/privacy/access-logs/${id}/revoke`);
      return res.data;
    } catch {
      return { id, status: 'REVOKED' };
    }
  },

  // 8. Voice & Multimodal
  processVoiceIntent: async (speech: string) => {
    try {
      const res = await apiClient.post('/coordination/voice/intent', { speech });
      return res.data;
    } catch {
      return {
        speechTranscription: speech,
        detectedIntent: 'GOAL_STATUS_CHECK',
        aiVoiceReplyText: `Your Open FMCG Supply Chain Gateway goal is on track at 68% progress with 1 milestone pending.`,
        suggestedActionPayload: { suggestedRoute: '/goals' },
        latencyMs: 145,
      };
    }
  },
  searchMultimodal: async (query: string) => {
    try {
      const res = await apiClient.get('/coordination/multimodal/search', { params: { q: query } });
      return res.data;
    } catch {
      return [
        {
          id: 'asset_01',
          title: 'Mysore Grain Mill Quality Inspection Certificate',
          modality: 'DOCUMENT',
          aiVisualSummary: 'Official agricultural test certificate with verified digital stamp and compliance score 98/100.',
          safetyScore: 1.0,
          moderationStatus: 'PASSED',
        },
      ];
    }
  },

  // 9. Operations & Incidents
  getSystemIncidents: async () => {
    try {
      const res = await apiClient.get('/coordination/operations/incidents');
      return res.data;
    } catch {
      return [
        {
          id: 'inc_01',
          category: 'INFRASTRUCTURE',
          title: 'Transient Webhook Delivery Spike on South Asia Edge Gateway',
          severity: 'LOW',
          status: 'HEALED_AUTOMATICALLY',
          aiOperationsRemediationNote: 'System self-recovered within 45 seconds. Zero payload drop recorded.',
        },
      ];
    }
  },
  getOperationsBriefing: async () => {
    try {
      const res = await apiClient.get('/coordination/operations/assistant-briefing');
      return res.data;
    } catch {
      return {
        systemHealthStatus: 'OPTIMAL_99.98%',
        activeIncidentsCount: 0,
        containedIncidentsCount: 2,
        selfHealingMetrics: {
          workerAutoRestarts24h: 3,
          automatedQueueRebalances: 7,
          zeroDowntimeFailovers: 1,
        },
        aiOperationsRecommendation: 'All regional edge routes are stable. Recommended action: Maintain standard automated recovery thresholds.',
      };
    }
  },
};

// ==========================================
// PHASE 14: GLOBAL INTELLIGENCE FABRIC & SIMULATION API
// ==========================================

export const intelligenceApi = {
  // 1. Dashboard & Graph
  getDashboard: async () => {
    try {
      const res = await apiClient.get('/intelligence/dashboard');
      return res.data;
    } catch {
      return {
        userId: 'usr_curr_01',
        fabricStatus: 'ONLINE_AND_HARMONIZED',
        crossDomainEntitiesCount: 7,
        crossDomainEdgesCount: 6,
        activeForecasts: MOCK_PREDICTIONS,
        topRecommendations: MOCK_RECOMMENDATIONS,
        personalWeeklyBrief: MOCK_WEEKLY_BRIEF,
      };
    }
  },
  getGraph: async (entityId?: string) => {
    try {
      const res = await apiClient.get('/intelligence/graph', { params: { entityId } });
      return res.data;
    } catch {
      return MOCK_GRAPH_OVERVIEW;
    }
  },
  traverseGraph: async (sourceEntityId: string, question: string) => {
    try {
      const res = await apiClient.post('/intelligence/graph/traverse', { sourceEntityId, question });
      return res.data;
    } catch {
      return {
        sourceEntityId,
        question,
        connectedNodesCount: 7,
        aiGraphReasoningSummary: `Graph traversal shows direct link between ${sourceEntityId} and 7 connected entities across Social, Projects, Commerce, and AI Agents.`,
      };
    }
  },

  // 2. Digital Twins
  getDigitalTwins: async () => {
    try {
      const res = await apiClient.get('/intelligence/digital-twins');
      return res.data;
    } catch {
      return MOCK_DIGITAL_TWINS;
    }
  },
  updateDigitalTwin: async (id: string, payload: any) => {
    try {
      const res = await apiClient.patch(`/intelligence/digital-twins/${id}`, payload);
      return res.data;
    } catch {
      return { id, updated: true, ...payload };
    }
  },
  resetDigitalTwin: async (id: string, action: 'RESET' | 'DELETE') => {
    try {
      const res = await apiClient.post(`/intelligence/digital-twins/${id}/reset`, { action });
      return res.data;
    } catch {
      return { id, actionTaken: action, status: action === 'RESET' ? 'MEMORY_PURGED_AND_RESET' : 'PERMANENTLY_DELETED' };
    }
  },

  // 3. Simulations
  getSimulations: async () => {
    try {
      const res = await apiClient.get('/intelligence/simulations');
      return res.data;
    } catch {
      return MOCK_SIMULATIONS;
    }
  },
  runSimulation: async (payload: {
    title: string;
    hypothesis: string;
    scope: string;
    variables: Array<{ variableName: string; baselineValue: any; simulatedValue: any }>;
  }) => {
    try {
      const res = await apiClient.post('/intelligence/simulations/run', payload);
      return res.data;
    } catch {
      return {
        id: `scen_sim_${Date.now()}`,
        title: payload.title,
        hypothesis: payload.hypothesis,
        scope: payload.scope,
        variables: payload.variables,
        status: 'COMPLETED',
        isIsolatedSnapshotOnly: true,
        simulationResults: {
          expectedOutcomes: [
            { metric: 'Primary KPI Impact', deltaPercent: 24.5, outcomeSummary: 'Projected +24.5% improvement' },
            { metric: 'Operational Resilience', deltaPercent: 12.0, outcomeSummary: 'Low latency and stable overhead' },
          ],
          riskFactors: [
            { riskTitle: 'Execution Lead Time', severity: 'LOW', description: 'Requires 3-5 days lead time for alignment.' },
          ],
          uncertaintyConfidencePercent: 86,
          aiSimulationExecutiveSummary: `Simulation estimated for "${payload.title}". Parameter perturbation shows positive net correlation.`,
        },
        disclaimer: 'SIMULATION_ONLY: No production data was modified. All projections are estimates.',
      };
    }
  },
  compareSimulations: async (scenarioIds: string[]) => {
    try {
      const res = await apiClient.post('/intelligence/simulations/compare', { scenarioIds });
      return res.data;
    } catch {
      return {
        comparedScenarioIds: scenarioIds,
        comparisonMetrics: [
          { metric: 'Expected KPI Delta', scenarioA: '+32.4%', scenarioB: '+114.0%', winningScenario: 'Scenario B' },
          { metric: 'Confidence Level', scenarioA: '88%', scenarioB: '82%', winningScenario: 'Scenario A' },
          { metric: 'Estimated Capital Delta', scenarioA: '+$150', scenarioB: '$0', winningScenario: 'Scenario B' },
          { metric: 'Operational Risk', scenarioA: 'LOW', scenarioB: 'MEDIUM', winningScenario: 'Scenario A' },
        ],
        aiComparativeSynthesis: 'Scenario A yields higher execution certainty with minimal friction, while Scenario B offers 3x growth potential with co-creator coordination overhead.',
      };
    }
  },

  // 4. Predictions & Recommendations
  getPredictions: async (domain?: string) => {
    try {
      const res = await apiClient.get('/intelligence/predictions', { params: { domain } });
      return res.data;
    } catch {
      return MOCK_PREDICTIONS;
    }
  },
  getRecommendations: async () => {
    try {
      const res = await apiClient.get('/intelligence/recommendations');
      return res.data;
    } catch {
      return MOCK_RECOMMENDATIONS;
    }
  },
  recordRecommendationFeedback: async (id: string, feedback: string) => {
    try {
      const res = await apiClient.post(`/intelligence/recommendations/${id}/feedback`, { feedback });
      return res.data;
    } catch {
      return { id, feedbackRecorded: feedback, status: 'APPLIED' };
    }
  },

  // 5. Skills & Experts
  getSkillGraph: async () => {
    try {
      const res = await apiClient.get('/intelligence/skills');
      return res.data;
    } catch {
      return MOCK_SKILL_GRAPH;
    }
  },
  getSkillGaps: async (targetType: 'PROJECT' | 'OPPORTUNITY', targetId: string) => {
    try {
      const res = await apiClient.get('/intelligence/skills/gaps', { params: { targetType, targetId } });
      return res.data;
    } catch {
      return {
        targetType,
        targetId,
        requiredSkills: [
          { skillName: 'Zero-Knowledge Batch Verification', importance: 'HIGH', currentCoveragePercent: 40 },
          { skillName: 'Cold-Chain & Mandi Grain Logistics', importance: 'HIGH', currentCoveragePercent: 85 },
        ],
        recommendedLearningPaths: [
          { id: 'path_zk_01', title: 'Edge Escrow & ZK Micro-Course', estimatedHours: 6 },
        ],
        recommendedPeerMentors: [
          { userId: 'usr_sarah_02', expertName: 'Dr. Sarah Chen', matchScore: 95 },
        ],
        aiSkillGapSummary: 'Primary gap identified in ZK Batch verification. Mentorship with Dr. Sarah Chen recommended to unblock milestone deliverables.',
      };
    }
  },
  getExperts: async (domain?: string) => {
    try {
      const res = await apiClient.get('/intelligence/experts', { params: { domain } });
      return res.data;
    } catch {
      return MOCK_EXPERTS;
    }
  },

  // 6. AI Optimizations & Weekly Brief
  getWorkflowOptimizations: async () => {
    try {
      const res = await apiClient.get('/intelligence/workflows/optimizations');
      return res.data;
    } catch {
      return [
        {
          workflowId: 'wf_fmcg_radar_01',
          workflowName: 'Autonomous Regional Grain Price Radar',
          totalExecutions: 340,
          averageLatencyMs: 420,
          failureRatePercent: 0.2,
          averageTokenCostUsd: 0.0018,
          optimizationProposals: [
            {
              proposalTitle: 'Enable Edge Response Caching for Static Mandi Tenders',
              description: 'Cache unchanged mandi price sheets at regional edge nodes to reduce repetitive LLM calls.',
              expectedLatencyReductionPercent: 45.0,
              expectedCostSavingsPercent: 38.0,
              riskScore: 'LOW',
              requiresHumanReview: true,
            },
          ],
          status: 'OPTIMIZATION_RECOMMENDED',
        },
      ];
    }
  },
  runRedTeam: async (modelIdentifier: string) => {
    try {
      const res = await apiClient.post('/intelligence/ai/red-team', { modelIdentifier });
      return res.data;
    } catch {
      return {
        modelIdentifier,
        testsRanCount: 48,
        redTeamResults: {
          promptInjectionResistancePercent: 99.4,
          hallucinationRatePercent: 1.2,
          toolAbuseResistancePercent: 100.0,
          dataLeakageTestsPassed: true,
        },
        routingReadinessStatus: 'CERTIFIED_SAFE_FOR_PRODUCTION',
        aiSafetyAuditSummary: 'All prompt injection jailbreak vectors successfully deflected by input guardrails and tool allowlists.',
      };
    }
  },
  getPersonalWeeklyBrief: async () => {
    try {
      const res = await apiClient.get('/intelligence/briefings/personal');
      return res.data;
    } catch {
      return MOCK_WEEKLY_BRIEF;
    }
  },
};

// ==========================================
// PHASE 15: ADAPTATION & CONTINUOUS EVOLUTION API
// ==========================================

export const adaptationApi = {
  getDashboard: async () => {
    try {
      const res = await apiClient.get('/adaptation/dashboard');
      return res.data;
    } catch {
      return {
        platformStatus: 'CONTINUOUSLY_ADAPTING',
        activeUxProfile: 'POWER_USER',
        activeExperimentsCount: 2,
        improvementProposalsCount: 2,
        platformHealthScore: 99.98,
        aiSafetyGovernance: 'ENFORCED_WITH_HUMAN_OVERSIGHT',
        disclaimer: 'AI is strictly prohibited from modifying its own permissions or safety boundaries.',
      };
    }
  },
  getImprovements: async (status?: string) => {
    try {
      const res = await apiClient.get('/adaptation/improvements', { params: { status } });
      return res.data;
    } catch {
      return MOCK_IMPROVEMENT_PROPOSALS;
    }
  },
  createImprovement: async (data: any) => {
    try {
      const res = await apiClient.post('/adaptation/improvements', data);
      return res.data;
    } catch {
      return { id: `prop_${Date.now()}`, status: 'PROPOSED', ...data };
    }
  },
  updateImprovementStatus: async (id: string, status: string) => {
    try {
      const res = await apiClient.patch(`/adaptation/improvements/${id}/status`, { status });
      return res.data;
    } catch {
      return { id, status };
    }
  },
  getExperiments: async (status?: string) => {
    try {
      const res = await apiClient.get('/adaptation/experiments', { params: { status } });
      return res.data;
    } catch {
      return MOCK_PLATFORM_EXPERIMENTS;
    }
  },
  toggleExperiment: async (id: string, status: string) => {
    try {
      const res = await apiClient.patch(`/adaptation/experiments/${id}/status`, { status });
      return res.data;
    } catch {
      return { id, status };
    }
  },
  getFeatureFlags: async () => {
    try {
      const res = await apiClient.get('/adaptation/feature-flags');
      return res.data;
    } catch {
      return MOCK_FEATURE_FLAGS;
    }
  },
  updateFeatureFlag: async (key: string, enabled: boolean, rolloutPercent: number) => {
    try {
      const res = await apiClient.patch(`/adaptation/feature-flags/${key}`, { enabled, rolloutPercent });
      return res.data;
    } catch {
      return { key, enabled, rolloutPercent };
    }
  },
  getUxProfile: async () => {
    try {
      const res = await apiClient.get('/adaptation/ux/profile');
      return res.data;
    } catch {
      return MOCK_UX_PROFILE;
    }
  },
  updateUxProfile: async (data: any) => {
    try {
      const res = await apiClient.patch('/adaptation/ux/profile', data);
      return res.data;
    } catch {
      return { ...MOCK_UX_PROFILE, ...data };
    }
  },
  toggleFocusMode: async (active: boolean) => {
    try {
      const res = await apiClient.post('/adaptation/ux/focus-mode', { active });
      return res.data;
    } catch {
      return { focusModeActive: active, status: active ? 'FOCUS_MODE_ENGAGED' : 'FOCUS_MODE_DISENGAGED' };
    }
  },
  getAiPlans: async () => {
    try {
      const res = await apiClient.get('/adaptation/ai/plans');
      return res.data;
    } catch {
      return MOCK_AI_PLANS;
    }
  },
  generatePlan: async (goalPrompt: string) => {
    try {
      const res = await apiClient.post('/adaptation/ai/plans/generate', { goalPrompt });
      return res.data;
    } catch {
      return {
        id: `plan_${Date.now()}`,
        goalTitle: goalPrompt,
        goalDescription: `Multi-agent plan generated for "${goalPrompt}".`,
        stepsBreakdown: [
          { stepIndex: 1, stepTitle: 'Domain & Context Research', agentRole: 'RESEARCH_AGENT', actionType: 'SEARCH', description: 'Analyze graph context.', requiresHumanReview: false, status: 'PENDING' },
          { stepIndex: 2, stepTitle: 'Draft Core Deliverables', agentRole: 'CREATOR_AGENT', actionType: 'DRAFT', description: 'Synthesize document drafts.', requiresHumanReview: true, status: 'PENDING' },
          { stepIndex: 3, stepTitle: 'Execute Consequential Action', agentRole: 'COORDINATOR_AGENT', actionType: 'PUBLISH', description: 'Enact changes with user confirmation.', requiresHumanReview: true, status: 'PENDING' },
        ],
        estimatedCostUsd: 0.015,
        status: 'PREVIEW',
      };
    }
  },
  executePlanStep: async (planId: string, index: number) => {
    try {
      const res = await apiClient.post(`/adaptation/ai/plans/${planId}/steps/${index}/execute`);
      return res.data;
    } catch {
      return { planId, stepIndex: index, status: 'COMPLETED' };
    }
  },
  cancelPlan: async (planId: string) => {
    try {
      const res = await apiClient.post(`/adaptation/ai/plans/${planId}/cancel`);
      return res.data;
    } catch {
      return { planId, status: 'CANCELLED' };
    }
  },
  getSecurityThreats: async () => {
    try {
      const res = await apiClient.get('/adaptation/security/threats');
      return res.data;
    } catch {
      return MOCK_SECURITY_THREATS;
    }
  },
  simulatePrivacy: async (targetApp: string, requestedScopes: string[]) => {
    try {
      const res = await apiClient.post('/adaptation/privacy/simulate', { targetApp, requestedScopes });
      return res.data;
    } catch {
      return {
        targetApp,
        requestedScopes,
        dataAccessedSummary: [
          { scope: 'projects.read', impact: 'Can view public titles and milestones of active projects.' },
          { scope: 'knowledge.search', impact: 'Can query public verified articles and research synthesis.' },
        ],
        prohibitedActions: [
          'Cannot access private personal messages',
          'Cannot execute financial payments or payouts',
          'Cannot alter profile security credentials',
        ],
        retentionPolicy: 'Data cached for active session only; zero permanent storage on external server.',
        revocationBehavior: 'One-tap immediate revocation permanently invalidates OAuth token.',
        recommendedAction: 'SAFE_TO_AUTHORIZE',
      };
    }
  },
  getPlatformHealth: async () => {
    try {
      const res = await apiClient.get('/adaptation/health/model');
      return res.data;
    } catch {
      return MOCK_PLATFORM_HEALTH;
    }
  },
  getFeedbackClusters: async () => {
    try {
      const res = await apiClient.get('/adaptation/feedback/clusters');
      return res.data;
    } catch {
      return MOCK_FEEDBACK_CLUSTERS;
    }
  },
};

// ==========================================
// PHASE 16: GLOBAL COLLECTIVE CREATION API
// ==========================================

export const creationApi = {
  getDashboard: async () => {
    try {
      const res = await apiClient.get('/creation/dashboard');
      return res.data;
    } catch {
      return {
        platformCreationStage: 'COLLECTIVE_CREATION_ACTIVE',
        discoverableIdeasCount: 2,
        activeHumanAiTeamsCount: 1,
        openContributionListingsCount: 2,
        pendingHumanApprovalsCount: 2,
        governanceStatus: 'HUMAN_AUTHORIZED_EXECUTION',
        pipelineHeadline: 'IDEA → PEOPLE → KNOWLEDGE → PLAN → TEAM → EXECUTION → IMPACT',
        disclaimer: 'AI agents amplify human capability and execute sandboxed tasks. Consequential financial, publishing, and security operations require human authorization.',
      };
    }
  },
  getIdeas: async (visibility?: string) => {
    try {
      const res = await apiClient.get('/creation/ideas', { params: { visibility } });
      return res.data;
    } catch {
      return MOCK_IDEAS;
    }
  },
  createIdea: async (data: any) => {
    try {
      const res = await apiClient.post('/creation/ideas', data);
      return res.data;
    } catch {
      return { id: `idea_${Date.now()}`, status: 'DISCOVERABLE', ...data };
    }
  },
  convertIdeaToProject: async (id: string) => {
    try {
      const res = await apiClient.post(`/creation/ideas/${id}/convert`);
      return res.data;
    } catch {
      return { ideaId: id, projectId: `proj_${Date.now()}`, status: 'CONVERTED_TO_PROJECT' };
    }
  },
  getTeams: async (projectId?: string) => {
    try {
      const res = await apiClient.get('/creation/teams', { params: { projectId } });
      return res.data;
    } catch {
      return MOCK_HUMAN_AI_TEAMS;
    }
  },
  getAiProjectManagerReport: async (projectId: string) => {
    try {
      const res = await apiClient.get(`/creation/teams/${projectId}/pm-report`);
      return res.data;
    } catch {
      return {
        projectId,
        reportHeadline: 'Sprint Status: On Track • 78.5% Milestones Achieved',
        activeBlockersCount: 1,
        blockersSummary: ['Awaiting Mysore depot physical BLE beacon verification.'],
        upcomingMilestones: [
          { title: 'BLE Mesh Payload Optimization', targetDate: '2026-08-28', status: 'IN_PROGRESS' },
        ],
        aiRecommendation: 'Schedule 15-minute sync with Dr. Sarah Chen to finalize cryptographic payload limits.',
      };
    }
  },
  getRooms: async (projectId?: string) => {
    try {
      const res = await apiClient.get('/creation/rooms', { params: { projectId } });
      return res.data;
    } catch {
      return MOCK_COLLABORATION_ROOMS;
    }
  },
  getResourceRequests: async (projectId?: string) => {
    try {
      const res = await apiClient.get('/creation/resources/requests', { params: { projectId } });
      return res.data;
    } catch {
      return MOCK_RESOURCE_REQUESTS;
    }
  },
  getContributionListings: async (projectId?: string) => {
    try {
      const res = await apiClient.get('/creation/contributions/listings', { params: { projectId } });
      return res.data;
    } catch {
      return MOCK_CONTRIBUTION_LISTINGS;
    }
  },
  applyForContribution: async (listingId: string) => {
    try {
      const res = await apiClient.post(`/creation/contributions/listings/${listingId}/apply`);
      return res.data;
    } catch {
      return { listingId, status: 'APPLICATION_SUBMITTED' };
    }
  },
  getCertifiedAgents: async (tier?: string) => {
    try {
      const res = await apiClient.get('/creation/agents/certified', { params: { tier } });
      return res.data;
    } catch {
      return MOCK_CERTIFIED_AGENTS;
    }
  },
  previewAgentPermissions: async (agentId: string) => {
    try {
      const res = await apiClient.get(`/creation/agents/${agentId}/permission-preview`);
      return res.data;
    } catch {
      return {
        agentId,
        previewHeadline: 'Permission & Sandbox Scope Preview',
        allowedTools: ['Marketplace Search', 'Public Knowledge Retrieval', 'Spot Rate Calculator'],
        prohibitedActions: [
          'Cannot initiate banking transactions or debit balances',
          'Cannot access private unencrypted chat histories',
          'Cannot modify security credentials',
        ],
        certificationBadge: 'ENTERPRISE_APPROVED',
      };
    }
  },
  getApprovals: async (status?: string) => {
    try {
      const res = await apiClient.get('/creation/approvals', { params: { status } });
      return res.data;
    } catch {
      return MOCK_HUMAN_APPROVAL_REQUESTS;
    }
  },
  resolveApproval: async (id: string, approved: boolean, comments?: string) => {
    try {
      const res = await apiClient.post(`/creation/approvals/${id}/resolve`, { approved, comments });
      return res.data;
    } catch {
      return { requestId: id, status: approved ? 'APPROVED' : 'REJECTED' };
    }
  },
  getDecisionBriefing: async (proposalTitle: string, contextSummary: string) => {
    try {
      const res = await apiClient.post('/creation/decisions/briefing', { proposalTitle, contextSummary });
      return res.data;
    } catch {
      return {
        proposalTitle,
        executiveSummary: `Structured decision intelligence synthesis for "${proposalTitle}".`,
        argumentsInFavor: [
          'Accelerates regional farmer adoption by 40% based on Mysore community survey.',
          'Zero cryptographic compromise risk verified by independent schema audit.',
        ],
        counterargumentsAndRisks: [
          'Requires 2 days of on-site hardware training for rural mill weighbridge operators.',
        ],
        identifiedUnknowns: [
          'Monsoon humidity impact on Bluetooth range inside corrugated steel warehouse sheds.',
        ],
        recommendedNextStep: 'Approve limited 2-week pilot with 10 test nodes before full-scale roll out.',
      };
    }
  },
};














