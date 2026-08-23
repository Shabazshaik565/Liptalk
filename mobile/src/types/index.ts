export type UserRole = 'INDIVIDUAL' | 'BUSINESS' | 'PARTNER' | 'ADMIN';

export type NeedPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
export type NeedStatus = 'ACTIVE' | 'FULFILLED' | 'PAUSED';
export type OfferPricing = 'HOURLY' | 'FIXED' | 'RETAINER' | 'CUSTOM';
export type OfferStatus = 'ACTIVE' | 'PAUSED';

export type OpportunityStatus = 'OPEN' | 'IN_DISCUSSION' | 'CLOSED' | 'EXPIRED';
export type LeadStatus = 'NEW' | 'CONTACTED' | 'IN_DISCUSSION' | 'QUALIFIED' | 'CONVERTED' | 'LOST';
export type LeadSource = 'MATCH' | 'OPPORTUNITY' | 'DIRECT_NETWORK' | 'PARTNER' | 'COMMUNITY' | 'MARKETPLACE';

export type ConnectionStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'BLOCKED';
export type ConversationContextType = 'OPPORTUNITY' | 'NEED_OFFER_MATCH' | 'DIRECT_LEAD' | 'GENERAL' | 'COMMUNITY' | 'MARKETPLACE';

export interface User {
  id: string;
  email: string;
  phoneNumber?: string;
  role: UserRole;
  isPhoneVerified: boolean;
  isEmailVerified: boolean;
  needsOnboarding: boolean;
  createdAt: string;
  profile?: UserProfile;
  business?: BusinessProfile;
  partner?: PartnerProfile;
}

export interface UserProfile {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  fullName: string;
  avatarUrl?: string;
  headline?: string;
  bio?: string;
  city: string;
  country: string;
  skills: string[];
  interests: string[];
  profileCompletionPercentage: number;
}

export interface BusinessProfile {
  id: string;
  ownerUserId: string;
  businessName: string;
  logoUrl?: string;
  categoryId?: string;
  categoryName?: string;
  description: string;
  websiteUrl?: string;
  city: string;
  country: string;
  isVerified: boolean;
  employeeCountRange?: string;
  services: string[];
  products: string[];
}

export interface PartnerProfile {
  id: string;
  userId: string;
  name: string;
  logoUrl?: string;
  categoryId?: string;
  categoryName?: string;
  description: string;
  coverageArea: string;
  websiteUrl?: string;
  offersCount: number;
}

export interface NeedItem {
  id: string;
  ownerType: 'USER' | 'BUSINESS';
  ownerId: string;
  ownerName: string;
  ownerAvatar?: string;
  ownerRole: UserRole;
  categoryId: string;
  categoryName: string;
  title: string;
  description?: string;
  tags: string[];
  priority: NeedPriority;
  city: string;
  budgetMin?: number;
  budgetMax?: number;
  currency?: string;
  status: NeedStatus;
  createdAt: string;
}

export interface OfferItem {
  id: string;
  ownerType: 'USER' | 'BUSINESS';
  ownerId: string;
  ownerName: string;
  ownerAvatar?: string;
  ownerRole: UserRole;
  categoryId: string;
  categoryName: string;
  title: string;
  description?: string;
  tags: string[];
  pricingModel: OfferPricing;
  city: string;
  status: OfferStatus;
  createdAt: string;
}

export interface MatchFactorBreakdown {
  factor: string;
  description: string;
  scoreContribution: number;
}

export interface MatchResult {
  id: string;
  targetId: string;
  targetType: 'USER' | 'BUSINESS';
  targetName: string;
  targetAvatar?: string;
  targetHeadline?: string;
  targetCity: string;
  targetRole: UserRole;
  matchedNeedTitle?: string;
  matchedOfferTitle?: string;
  matchScore: number;
  matchScorePercent: string;
  primaryReason: string;
  reasons: MatchFactorBreakdown[];
  isReciprocal: boolean;
  reciprocalDetail?: string;
}

export interface OpportunityItem {
  id: string;
  creatorId: string;
  creatorName: string;
  creatorAvatar?: string;
  creatorRole: UserRole;
  businessId?: string;
  businessName?: string;
  title: string;
  categoryId: string;
  categoryName: string;
  description: string;
  tags: string[];
  budgetAmount?: number;
  currency?: string;
  deadline?: string;
  city: string;
  status: OpportunityStatus;
  interestCount?: number;
  interestsCount?: number;
  matchScore?: number;
  hasExpressedInterest?: boolean;
  createdAt: string;
}

export interface LeadItem {
  id: string;
  businessId: string;
  contactUserId: string;
  contactName: string;
  contactAvatar?: string;
  contactHeadline?: string;
  contactCity?: string;
  contactRole?: UserRole;
  opportunityId?: string;
  opportunityTitle?: string;
  title: string;
  status: LeadStatus;
  estimatedValue?: number;
  currency?: string;
  source: LeadSource;
  notesCount: number;
  lastContactedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LeadNoteItem {
  id: string;
  leadId: string;
  authorId: string;
  authorName: string;
  noteText: string;
  createdAt: string;
}

export interface ConversationItem {
  id: string;
  contextType: ConversationContextType;
  contextId?: string;
  contextTitle: string;
  otherParticipant: {
    id: string;
    name: string;
    avatarUrl?: string;
    role: UserRole;
    isOnline: boolean;
  };
  lastMessage?: {
    text: string;
    senderId: string;
    createdAt: string;
    isRead: boolean;
  };
  unreadCount: number;
  updatedAt: string;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  text: string;
  mediaUrl?: string;
  mediaType?: 'IMAGE' | 'DOCUMENT';
  isRead: boolean;
  createdAt: string;
}

export interface PartnerItem {
  id: string;
  name: string;
  logoUrl?: string;
  categoryName: string;
  description: string;
  coverageArea: string;
  websiteUrl?: string;
  exclusiveBadge?: string;
  offers: PartnerOffer[];
}

export interface PartnerOffer {
  id: string;
  partnerId: string;
  partnerName: string;
  title: string;
  description: string;
  bannerUrl?: string;
  discountCode?: string;
  discountValue?: string;
  validUntil?: string;
  ctaUrl: string;
}

export interface NotificationItem {
  id: string;
  type: 'MATCH' | 'CONNECTION_REQ' | 'CONNECTION_ACC' | 'OPP_INTEREST' | 'LEAD_STATUS' | 'MESSAGE' | 'EVENT' | 'COMMUNITY' | 'REWARD';
  title: string;
  body: string;
  deepLink?: string;
  isRead: boolean;
  createdAt: string;
}

export interface AnalyticsSummary {
  profileViews: number;
  totalConnections: number;
  activeMatches: number;
  opportunitiesPosted: number;
  leadsTotal: number;
  leadsConverted: number;
  conversionRatePercent: number;
  pipelineValue: number;
}

// ==========================================
// PHASE 3: COMMUNITY & EVENT TYPES
// ==========================================

export type CommunityVisibility = 'PUBLIC' | 'PRIVATE';
export type CommunityRole = 'OWNER' | 'MODERATOR' | 'MEMBER';
export type PostType = 'TEXT' | 'IMAGE' | 'QUESTION' | 'ANNOUNCEMENT';

export interface CommunityItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  coverImageUrl?: string;
  avatarUrl?: string;
  rules?: string[];
  visibility: CommunityVisibility;
  memberCount: number;
  postCount: number;
  isVerified: boolean;
  isJoined?: boolean;
  membershipStatus?: 'ACTIVE' | 'PENDING_APPROVAL' | null;
  userRole?: CommunityRole | null;
  recommendedReason?: string;
  synergyScore?: number;
  createdAt: string;
}

export interface CommunityMemberItem {
  id: string;
  role: CommunityRole;
  status: 'ACTIVE' | 'PENDING_APPROVAL';
  joinedAt: string;
  user: {
    id: string;
    role: UserRole;
    profile?: UserProfile;
    businesses?: BusinessProfile[];
  };
}

export interface CommunityPostItem {
  id: string;
  type: PostType;
  title?: string;
  content: string;
  mediaUrls?: string[];
  likesCount: number;
  commentsCount: number;
  isPinned: boolean;
  hasLiked?: boolean;
  userReaction?: string | null;
  createdAt: string;
  author: {
    id: string;
    role: UserRole;
    profile?: {
      firstName?: string;
      lastName?: string;
      fullName?: string;
      avatarUrl?: string;
      headline?: string;
    };
    businesses?: Array<{
      businessName: string;
      logoUrl?: string;
    }>;
  };
}

export interface PostCommentItem {
  id: string;
  content: string;
  parentCommentId?: string;
  createdAt: string;
  author: {
    id: string;
    role: UserRole;
    profile?: {
      fullName?: string;
      avatarUrl?: string;
    };
    businesses?: Array<{
      businessName: string;
    }>;
  };
}

export interface EventItem {
  id: string;
  title: string;
  description: string;
  category: string;
  eventDate: string;
  startTime?: string;
  endTime?: string;
  locationType: 'ONLINE' | 'IN_PERSON';
  locationUrlOrAddress?: string;
  coverImageUrl?: string;
  capacity: number;
  registeredCount: number;
  status: 'UPCOMING' | 'ONGOING' | 'COMPLETED' | 'CANCELLED';
  isRegistered?: boolean;
  community?: {
    id: string;
    name: string;
    avatarUrl?: string;
  };
  organizer?: {
    id: string;
    role: UserRole;
    profile?: {
      fullName?: string;
      avatarUrl?: string;
    };
    businesses?: Array<{
      businessName: string;
    }>;
  };
  createdAt: string;
}

// ==========================================
// PHASE 4: MARKETPLACE, REWARDS & MEMBERSHIP
// ==========================================

export type ListingPricingType = 'FIXED' | 'HOURLY' | 'NEGOTIABLE' | 'CONTACT_FOR_PRICE';
export type ListingStatus = 'DRAFT' | 'PUBLISHED' | 'PAUSED' | 'ARCHIVED';
export type ListingPromotionType = 'NORMAL' | 'PROMOTED' | 'FEATURED';
export type SavedTargetType = 'LISTING' | 'OPPORTUNITY' | 'COMMUNITY' | 'EVENT';
export type MembershipTier = 'FREE' | 'PRO' | 'BUSINESS';

export interface MarketplaceListingItem {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  pricingType: ListingPricingType;
  price?: number;
  currency: string;
  location: string;
  tags: string[];
  imageUrls: string[];
  status: ListingStatus;
  promotionType: ListingPromotionType;
  averageRating: number;
  reviewsCount: number;
  requestsCount: number;
  isSaved?: boolean;
  recommendedReason?: string;
  synergyScore?: number;
  createdAt: string;
  provider: {
    id: string;
    role: UserRole;
    profile?: UserProfile;
    businesses?: BusinessProfile[];
  };
}

export interface ReviewItem {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  reviewer: {
    id: string;
    profile?: {
      fullName?: string;
      avatarUrl?: string;
    };
  };
}

export interface RewardTransactionItem {
  id: string;
  amount: number;
  type: 'EARNED' | 'REDEEMED' | 'BONUS' | 'ADJUSTED';
  action: string;
  description: string;
  referenceId?: string;
  createdAt: string;
}

export interface RewardItem {
  id: string;
  title: string;
  description: string;
  pointsCost: number;
  category: string;
  discountValue?: string;
  promoCodeTemplate: string;
  bannerUrl?: string;
  isActive: boolean;
}

export interface RewardRedemptionItem {
  id: string;
  pointsSpent: number;
  claimedCode: string;
  status: 'ACTIVE' | 'USED' | 'EXPIRED';
  expiresAt?: string;
  createdAt: string;
  reward: RewardItem;
}

export interface WalletSummary {
  currentBalance: number;
  totalEarned: number;
  totalRedeemed: number;
  transactionCount: number;
  recentTransactions: RewardTransactionItem[];
}

export interface ReferralInfo {
  referralCode: string;
  referralLink: string;
  rewardPerReferral: number;
  totalReferrals: number;
  qualifiedReferrals: number;
  totalPointsFromReferrals: number;
}

export interface Entitlements {
  canCreateCommunity: boolean;
  canCreateListing: boolean;
  canPromoteListing: boolean;
  canViewAdvancedAnalytics: boolean;
  maxActiveDemands: number;
  featuredBadge: boolean;
  directLeadExport: boolean;
}

export interface MembershipInfo {
  tier: MembershipTier;
  status: 'ACTIVE' | 'EXPIRED';
  expiresAt?: string | null;
  entitlements: Entitlements;
}

export interface PlanItem {
  id: string;
  name: string;
  tier: MembershipTier;
  pricePerMonth: number;
  currency: string;
  badge?: string;
  features: string[];
}

// ==========================================
// PHASE 5: AI & INTELLIGENT DISCOVERY TYPES
// ==========================================

export interface AIAssistantResponse {
  reply: string;
  action: 'SHOW_OPPORTUNITIES' | 'SHOW_COMMUNITIES' | 'SHOW_MARKETPLACE' | 'GENERAL_REPLY';
  data?: any;
}

export interface SemanticRankedItem<T> {
  score: number;
  item: T;
}

export interface SemanticSearchResults {
  query: string;
  people: Array<{ user: User; score: number }>;
  services: Array<{ listing: MarketplaceListingItem; score: number }>;
  opportunities: Array<{ opportunity: OpportunityItem; score: number }>;
  communities: Array<{ community: CommunityItem; score: number }>;
}

export interface SmartNeedSuggestion {
  title: string;
  category: string;
  tags: string[];
  suggestedSkills: string[];
  descriptionOutline: string;
  priority: NeedPriority;
}

export interface SmartOfferSuggestion {
  title: string;
  category: string;
  tags: string[];
  skills: string[];
  pricingModel: OfferPricing;
  description: string;
}

export interface SmartOpportunitySuggestion {
  title: string;
  category: string;
  tags: string[];
  description: string;
  suggestedMilestones: string[];
}

export interface ProfileIntelligenceReport {
  completenessScore: number;
  missingFields: string[];
  suggestions: string[];
  status: 'OPTIMIZED' | 'GOOD' | 'NEEDS_ATTENTION';
}

export interface PersonalizedDiscoverFeed {
  communities: CommunityItem[];
  opportunities: OpportunityItem[];
  services: MarketplaceListingItem[];
}

// ==========================================
// PHASE 6: REAL-TIME & LIVE ECOSYSTEM TYPES
// ==========================================

export type PresenceStatus = 'ONLINE' | 'OFFLINE' | 'AWAY' | 'BUSY' | 'IN_CALL';

export type CallType = 'VOICE' | 'VIDEO';

export type CallStatus =
  | 'INITIATED'
  | 'RINGING'
  | 'ACCEPTED'
  | 'ACTIVE'
  | 'ENDED'
  | 'MISSED'
  | 'REJECTED';

export interface CallSession {
  id: string;
  caller: User;
  receiver: User;
  callType: CallType;
  status: CallStatus;
  channelId?: string;
  durationSeconds: number;
  startedAt?: string;
  endedAt?: string;
  createdAt: string;
}

export type LiveRoomType =
  | 'NETWORKING'
  | 'WORKSHOP'
  | 'AMA'
  | 'COMMUNITY'
  | 'BUSINESS'
  | 'EDUCATION';

export type LiveRoomStatus = 'SCHEDULED' | 'LIVE' | 'ENDED';

export interface LiveRoomItem {
  id: string;
  host: User;
  title: string;
  description?: string;
  category: string;
  roomType: LiveRoomType;
  status: LiveRoomStatus;
  coverImageUrl?: string;
  audienceCount: number;
  community?: CommunityItem;
  event?: EventItem;
  scheduledAt?: string;
  startedAt?: string;
  endedAt?: string;
  createdAt: string;
}

export interface LiveRoomMessageItem {
  id: string;
  roomId: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  text: string;
  createdAt: string;
}

export type ContentType =
  | 'ANNOUNCEMENT'
  | 'EDUCATIONAL'
  | 'WORKSHOP'
  | 'SHOWCASE';

export interface ProfessionalContentItem {
  id: string;
  author: User;
  contentType: ContentType;
  title: string;
  body: string;
  mediaUrls?: string[];
  tags?: string[];
  likesCount: number;
  viewsCount: number;
  isFollowing?: boolean;
  linkedOpportunity?: OpportunityItem;
  linkedListing?: MarketplaceListingItem;
  createdAt: string;
}

export interface CreatorAnalytics {
  profileViews: number;
  followersCount: number;
  contentImpressions: number;
  totalLikes: number;
  liveSessionsHosted: number;
  totalLiveAttendees: number;
  opportunitiesGenerated: number;
  dealConversions: number;
}

// ==========================================
// Phase 7: Enterprise, Trust & Safety, Privacy, Admin
// ==========================================
export type OrganizationRole = 'OWNER' | 'ADMIN' | 'MANAGER' | 'MEMBER' | 'ANALYST';
export type OrganizationVerificationStatus = 'UNVERIFIED' | 'PENDING' | 'VERIFIED' | 'SUSPENDED';

export interface OrganizationItem {
  id: string;
  name: string;
  slug: string;
  description?: string;
  logoUrl?: string;
  industry: string;
  employeeCountRange: string;
  location: string;
  websiteUrl?: string;
  verificationStatus: OrganizationVerificationStatus;
  owner?: User;
  maxSeats: number;
  userRole?: OrganizationRole;
  isMember?: boolean;
  createdAt: string;
}

export interface TeamItem {
  id: string;
  organizationId?: string;
  name: string;
  description?: string;
  department: string;
  membersCount?: number;
  createdAt: string;
}

export interface OrganizationMemberItem {
  id: string;
  user: User;
  role: OrganizationRole;
  team?: TeamItem;
  department: string;
  jobTitle: string;
  isActive: boolean;
  createdAt: string;
}

export interface EnterpriseAnalytics {
  activeTeamSeats: number;
  allocatedSeats: number;
  totalTeams: number;
  collaborativeDealsActive: number;
  totalPipelineValue: string;
  teamConversionRate: string;
  closedContractsThisQuarter: number;
}

export type ReportTargetType = 'USER' | 'COMMUNITY' | 'POST' | 'COMMENT' | 'OPPORTUNITY' | 'MARKETPLACE_LISTING' | 'LIVE_ROOM';
export type ReportReason = 'SPAM' | 'HARASSMENT' | 'FRAUD_SCAM' | 'MISINFORMATION' | 'POLICY_VIOLATION' | 'IMPERSONATION' | 'OTHER';
export type ReportStatus = 'OPEN' | 'UNDER_REVIEW' | 'ACTION_TAKEN' | 'DISMISSED' | 'ESCALATED' | 'CLOSED';

export interface ReportItem {
  id: string;
  reporter: User;
  targetType: ReportTargetType;
  targetId: string;
  reason: ReportReason;
  description?: string;
  status: ReportStatus;
  actionTaken?: string;
  createdAt: string;
}

export interface TrustScoreSignal {
  name: string;
  score: number;
  maxScore: number;
  status: 'VERIFIED' | 'PARTIAL' | 'PENDING';
  details: string;
}

export interface TrustScoreReport {
  userId: string;
  overallScore: number;
  maxScore: number;
  trustTier: string;
  verificationBadge: string;
  signals: TrustScoreSignal[];
}

export interface PrivacySettings {
  profileVisibility: 'PUBLIC' | 'NETWORK_ONLY' | 'ORGANIZATION_ONLY';
  searchDiscoverability: boolean;
  directMessaging: 'EVERYONE' | 'CONNECTIONS_ONLY' | 'VERIFIED_ONLY';
  allowCalling: 'EVERYONE' | 'CONNECTIONS_ONLY' | 'VERIFIED_ONLY';
  aiRecommendationsOptIn: boolean;
  activityStatusVisible: boolean;
}

export interface AuditLogItem {
  id: string;
  actor?: User;
  action: string;
  targetType: string;
  targetId?: string;
  description?: string;
  ipAddress?: string;
  createdAt: string;
}

export interface AdminPlatformMetrics {
  dau: number;
  wau: number;
  mau: number;
  totalUsers: number;
  totalOrganizations: number;
  activeCommunities: number;
  openOpportunities: number;
  pendingReports: number;
  systemStatus: string;
  apiUptime: string;
  rtcSignalingUptime: string;
  avgApiLatencyMs: number;
}

export interface FeatureFlags {
  aiAssistant: boolean;
  liveRooms: boolean;
  creatorMode: boolean;
  enterpriseWorkspaces: boolean;
  trustVerification: boolean;
  marketplaceMonetization: boolean;
  realtimeVoiceVideo: boolean;
}



