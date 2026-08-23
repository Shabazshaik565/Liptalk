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
      return res.data;
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
      return res.data;
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
      return res.data;
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
      return res.data;
    } catch {
      return OPPORTUNITIES_DATA;
    }
  },
  getOpportunityById: async (id: string): Promise<OpportunityItem | undefined> => {
    try {
      const res = await apiClient.get(`/opportunities/${id}`);
      return res.data;
    } catch {
      return OPPORTUNITIES_DATA.find((o) => o.id === id) || OPPORTUNITIES_DATA[0];
    }
  },
  createOpportunity: async (data: Partial<OpportunityItem>): Promise<OpportunityItem> => {
    try {
      const res = await apiClient.post('/opportunities', data);
      return res.data;
    } catch {
      return {
        id: 'opp_' + Date.now(),
        creatorId: 'usr_curr_01',
        creatorName: 'Alex Morgan',
        creatorRole: 'BUSINESS',
        businessId: 'biz_01',
        businessName: 'Nexas Digital Solutions',
        categoryId: data.categoryId || 'cat_it_soft',
        categoryName: data.categoryName || 'IT & Software Development',
        title: data.title || 'New Requirement',
        description: data.description || '',
        tags: data.tags || [],
        budgetAmount: data.budgetAmount,
        currency: data.currency || 'INR',
        deadline: data.deadline || '2026-10-01',
        city: data.city || 'Bangalore',
        status: 'OPEN',
        interestsCount: 0,
        hasExpressedInterest: false,
        createdAt: new Date().toISOString(),
      };
    }
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
      return res.data;
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
      return res.data?.items || res.data || [];
    } catch {
      return COMMUNITIES_DATA;
    }
  },
  getRecommended: async (): Promise<CommunityItem[]> => {
    try {
      const res = await apiClient.get('/communities/recommended');
      return res.data || [];
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
      return res.data?.items || res.data || [];
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
      return res.data?.items || res.data || [];
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
      return res.data?.items || res.data || [];
    } catch {
      return MARKETPLACE_LISTINGS_DATA;
    }
  },
  getRecommended: async (): Promise<MarketplaceListingItem[]> => {
    try {
      const res = await apiClient.get('/marketplace/recommended');
      return res.data || [];
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





