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
  businessName?: string;
  businessStage?: string;
  industry?: string;
  website?: string;
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
    phoneNumber?: string;
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
// PHASE 9: AI FOUNDATION & GLOBAL INTELLIGENCE
// ==========================================

export interface AiUserPreference {
  id?: string;
  userId: string;
  aiPersonalizationEnabled: boolean;
  aiMemoryEnabled: boolean;
  aiContentAssistanceEnabled: boolean;
  aiRecommendationsEnabled: boolean;
  aiTranslationEnabled: boolean;
  aiAutonomousReadEnabled: boolean;
  aiAutonomousWriteEnabled: boolean;
  aiHighImpactConfirmEnabled: boolean;
  dataClassificationLevel: 'STANDARD' | 'MINIMAL' | 'STRICT_ANONYMIZED';
  allowedScopes: string[];
}

export interface AiUserMemoryItem {
  id: string;
  userId: string;
  category: 'PREFERENCE' | 'INTEREST' | 'INTERACTION' | 'SAVED_CONTEXT' | 'EXPLICIT_MEMORY';
  key: string;
  value: string;
  confidence: number;
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AiUsageSummary {
  userId: string;
  recentRequests: Array<{
    id: string;
    feature: string;
    model: string;
    provider: string;
    inputTokens: number;
    outputTokens: number;
    estimatedCostUsd: number;
    latencyMs: number;
    status: string;
    createdAt: string;
  }>;
  totalRequests: number;
  totalTokens: number;
  estimatedCostUsd: number;
}

export interface AiGatewayConfig {
  version: string;
  activeGateway: string;
  supportedProviders: string[];
  supportedScopes: string[];
  privacyLevels: string[];
  memoryCategories: string[];
}

export interface AiActionItem {
  id: string;
  userId: string;
  actionType: 'SEARCH' | 'DRAFT' | 'MESSAGE' | 'PUBLISH' | 'PURCHASE' | 'DELETE' | 'TRANSLATE';
  status: 'PENDING_CONFIRMATION' | 'CONFIRMED' | 'EXECUTED' | 'REJECTED';
  targetEntity: string;
  payload: Record<string, any>;
  confirmationRequired: boolean;
  confirmedAt?: string;
  executedAt?: string;
  createdAt: string;
}

export interface GlobalTrendItem {
  id: string;
  topic: string;
  category: string;
  scope: 'GLOBAL' | 'COUNTRY' | 'REGIONAL' | 'LANGUAGE';
  country?: string;
  region?: string;
  language?: string;
  velocityScore: number;
  postCount: number;
  searchCount: number;
  createdAt: string;
}

// ==========================================
// PHASE 10: AUTONOMOUS AGENTS & DEVELOPER PLATFORM
// ==========================================

export interface AgentItem {
  id: string;
  userId: string;
  name: string;
  description?: string;
  type: 'PERSONAL' | 'COMMUNITY' | 'CREATOR' | 'SYSTEM';
  status: 'ACTIVE' | 'PAUSED' | 'SUSPENDED';
  allowedTools: string[];
  allowedScopes: string[];
  maxDailyExecutions: number;
  monthlyBudgetUsd: number;
  currentMonthSpendUsd: number;
  requireHighImpactConfirmation: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AgentWorkflowItem {
  id: string;
  userId: string;
  title: string;
  description?: string;
  triggerType: 'SCHEDULE' | 'EVENT' | 'MANUAL';
  scheduleCron?: string;
  eventTriggerName?: string;
  actionsPlan: Array<{
    step: number;
    tool: string;
    inputTemplate: Record<string, any>;
    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  }>;
  isActive: boolean;
  lastRunAt?: string;
  createdAt: string;
}

export interface AgentExecutionItem {
  id: string;
  userId: string;
  status: 'QUEUED' | 'RUNNING' | 'COMPLETED' | 'FAILED' | 'WAITING_CONFIRMATION' | 'CANCELLED';
  initialPromptOrTrigger: string;
  stepsLog: Array<{
    stepIndex: number;
    toolName: string;
    input: any;
    output: any;
    status: string;
    latencyMs: number;
  }>;
  finalResultText?: string;
  tokensUsed: number;
  costUsd: number;
  executionTimeMs: number;
  createdAt: string;
}

export interface KnowledgeCollectionItem {
  id: string;
  userId: string;
  title: string;
  description?: string;
  category: string;
  tags?: string[];
  items?: Array<{
    id: string;
    itemType: 'POST' | 'COMMUNITY' | 'EVENT' | 'NOTE' | 'LINK' | 'DOCUMENT';
    title: string;
    content: string;
    sourceUrl?: string;
    addedAt: string;
  }>;
  isPublic: boolean;
  createdAt: string;
}

export interface DeveloperAppItem {
  id: string;
  developerId: string;
  name: string;
  description?: string;
  apiKey: string;
  redirectUri?: string;
  scopes: string[];
  rateLimitPerMinute: number;
  isActive: boolean;
  createdAt: string;
}

export interface WebhookItem {
  id: string;
  targetUrl: string;
  secretToken: string;
  subscribedEvents: string[];
  isActive: boolean;
  deliveriesCount: number;
  failuresCount: number;
  createdAt: string;
}

export interface AiTrustCenterInfo {
  title: string;
  version: string;
  principles: Array<{ title: string; description: string }>;
  safetyThresholds: {
    maxStepLimit: number;
    maxDailyBudgetUsd: number;
    rateLimitPerMinute: number;
    emergencyKillSwitchActive: boolean;
  };
}

// ==========================================
// PHASE 11: PLATFORM ECONOMY & COLLECTIVE INTELLIGENCE
// ==========================================

export interface ReputationProfileItem {
  id: string;
  userId: string;
  marketplaceReputation: number;
  communityReputation: number;
  creatorReputation: number;
  developerReputation: number;
  contributorReputation: number;
  overallTrustScore: number;
  trustTier: 'TIER_1_VERIFIED' | 'TIER_2_ESTABLISHED' | 'TIER_3_RISING' | 'RESTRICTED';
  badges: string[];
}

export interface ProjectWorkspaceItem {
  id: string;
  ownerId: string;
  title: string;
  description?: string;
  scope: 'COMMUNITY_OPEN_SOURCE' | 'ORGANIZATION_PRIVATE' | 'CREATOR_COLLABORATION';
  members?: Array<{
    userId: string;
    role: 'LEAD' | 'CONTRIBUTOR' | 'REVIEWER' | 'OBSERVER';
    joinedAt: string;
  }>;
  milestones?: Array<{
    id: string;
    title: string;
    dueDate: string;
    completed: boolean;
  }>;
  tasks?: Array<{
    id: string;
    title: string;
    assigneeId?: string;
    status: 'TODO' | 'IN_PROGRESS' | 'IN_REVIEW' | 'DONE';
    priority: 'LOW' | 'MEDIUM' | 'HIGH';
  }>;
  progressPercent: number;
  createdAt: string;
}

export interface CreatorServiceItem {
  id: string;
  creatorId: string;
  title: string;
  description: string;
  category: string;
  price: number;
  currency: string;
  pricingModel: 'FIXED' | 'HOURLY' | 'MONTHLY_RETAINER';
  averageRating: number;
  completedOrdersCount: number;
  isActive: boolean;
  createdAt: string;
}

export interface RevenueSplitItem {
  id: string;
  transactionId: string;
  totalGrossAmount: number;
  currency: string;
  platformFeeAmount: number;
  creatorNetAmount: number;
  collaboratorNetAmount: number;
  communityShareAmount: number;
  status: 'PENDING_ESCROW' | 'SETTLED' | 'REFUNDED' | 'DISPUTED';
  createdAt: string;
}

export interface SubscriptionItem {
  id: string;
  userId: string;
  targetEntityId: string;
  subscriptionType: 'PLATFORM_PRO' | 'CREATOR_MEMBERSHIP' | 'COMMUNITY_TIER' | 'APP_ADDON';
  planName: string;
  amount: number;
  currency: string;
  billingInterval: 'MONTHLY' | 'ANNUAL';
  status: 'ACTIVE' | 'PAST_DUE' | 'CANCELLED' | 'EXPIRED';
  currentPeriodEnd: string;
}

export interface AgentStoreListingItem {
  id: string;
  developerId: string;
  name: string;
  description: string;
  category: string;
  pricingModel: 'FREE' | 'ONE_TIME' | 'MONTHLY_SUBSCRIPTION';
  price: number;
  requiredScopes: string[];
  certificationStatus: 'PENDING_REVIEW' | 'CERTIFIED' | 'REVOKED';
  rating: number;
  installsCount: number;
  isActive: boolean;
}

export interface MentorProfileItem {
  id: string;
  mentorId: string;
  headline: string;
  bio: string;
  expertiseAreas: string[];
  availabilityStatus: 'OPEN' | 'LIMITED' | 'FULL';
  menteesHelpedCount: number;
  rating: number;
}

// ==========================================
// PHASE 12: UNIFIED EXPERIENCE & AMBIENT INTELLIGENCE
// ==========================================

export interface PersonalGoalItem {
  id: string;
  userId: string;
  title: string;
  description?: string;
  category: 'SKILL_GROWTH' | 'COMMERCE_EXPANSION' | 'COMMUNITY_LEADERSHIP' | 'COLLABORATION';
  progressPercent: number;
  status: 'IN_PROGRESS' | 'COMPLETED' | 'PAUSED';
  targetDate?: string;
}

export interface PersonalTaskItem {
  id: string;
  userId: string;
  title: string;
  description?: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
  goalId?: string;
  dueDate?: string;
}

export interface LearningPathItem {
  id: string;
  userId: string;
  title: string;
  description: string;
  category: string;
  modules: Array<{
    id: string;
    title: string;
    completed: boolean;
    estimatedMinutes: number;
    resourceLink?: string;
  }>;
  progressPercent: number;
}

export interface UniversalCommandResult {
  intent: 'SEARCH' | 'NAVIGATE' | 'DISPATCH_AGENT' | 'CREATE_TASK' | 'SUMMARIZE';
  query?: string;
  message?: string;
  suggestedRoute?: string;
  results?: {
    opportunities?: any[];
    communities?: any[];
    marketplace?: any[];
    knowledgeHub?: any[];
  };
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
  globalization: boolean;
}

// Phase 8: Globalization & Regional Preferences Types
export interface UserPreferences {
  id?: string;
  userId?: string;
  language: string;
  country: string;
  region: string;
  city?: string;
  timezone: string;
  currency: string;
  locale: string;
  isLocationPublic: boolean;
  allowRegionalDiscovery: boolean;
  autoDetectTimezone: boolean;
}

export interface LocalizationConfig {
  defaultLanguage: string;
  defaultCountry: string;
  defaultCurrency: string;
  defaultTimezone: string;
  languages: {
    code: string;
    name: string;
    nativeName: string;
    direction: 'ltr' | 'rtl';
    isDefault?: boolean;
  }[];
  currencies: {
    code: string;
    name: string;
    symbol: string;
    symbolPosition: 'prefix' | 'suffix';
    decimalPlaces: number;
    exchangeRateToINR: number;
  }[];
  countries: {
    code: string;
    name: string;
    nativeName: string;
    defaultLanguage: string;
    defaultCurrency: string;
    defaultTimezone: string;
    regions: string[];
  }[];
  timezones: string[];
}

export interface RegionalDiscoveryResult {
  filtersApplied: {
    country?: string;
    region?: string;
    city?: string;
    language?: string;
  };
  regionalCommunitiesCount: number;
  communities: CommunityItem[];
  marketplaceListings: MarketplaceListingItem[];
}

// ==========================================
// PHASE 13: GLOBAL COORDINATION & FRONTIER ECOSYSTEM
// ==========================================

export type GoalScope = 'INDIVIDUAL' | 'COMMUNITY' | 'CREATOR' | 'ORGANIZATION' | 'PUBLIC_INITIATIVE';
export type GoalStatus = 'PLANNING' | 'ACTIVE' | 'PAUSED' | 'COMPLETED' | 'CANCELLED';

export interface GlobalGoalItem {
  id: string;
  ownerId: string;
  scope: GoalScope;
  title: string;
  description?: string;
  objectives: string[];
  resources?: Array<{ title: string; url?: string; type: string }>;
  assignedAgentIds?: string[];
  progressPercent: number;
  status: GoalStatus;
  targetDate?: string;
  milestones?: GoalMilestoneItem[];
  participants?: GoalParticipantItem[];
  createdAt: string;
}

export interface GoalMilestoneItem {
  id: string;
  goalId: string;
  title: string;
  description?: string;
  dueDate?: string;
  isCompleted: boolean;
  verifiedBy?: string;
  completedAt?: string;
}

export interface GoalParticipantItem {
  id: string;
  goalId: string;
  userId: string;
  role: 'LEAD' | 'MAINTAINER' | 'CONTRIBUTOR' | 'ADVISOR' | 'OBSERVER';
  contributionsCount: number;
  joinedAt: string;
}

export interface GlobalInitiativeItem {
  id: string;
  creatorId: string;
  title: string;
  mission: string;
  category: string;
  targetRegions?: string[];
  partnerCommunityIds?: string[];
  partnerOrganizationIds?: string[];
  supportersCount: number;
  fundingGoalAmount: number;
  currency: string;
  fundingRaisedAmount: number;
  status: 'PROPOSED' | 'ACTIVE' | 'PAUSED' | 'CONCLUDED';
  createdAt: string;
}

export interface SharedWorkspaceItem {
  id: string;
  creatorId: string;
  name: string;
  description?: string;
  type: 'CROSS_COMMUNITY' | 'ORGANIZATION_FEDERATED' | 'CREATOR_ALLIANCE' | 'OPEN_RESEARCH';
  participatingCommunityIds?: string[];
  members?: Array<{ userId: string; role: 'ADMIN' | 'MEMBER' | 'OBSERVER'; joinedAt: string }>;
  linkedProjectIds?: string[];
  linkedKnowledgeIds?: string[];
  assignedAgentTeamIds?: string[];
  isActive: boolean;
  createdAt: string;
}

export interface ProjectContributionItem {
  id: string;
  projectId: string;
  contributorId: string;
  title: string;
  description?: string;
  category: 'CODE' | 'DOCUMENTATION' | 'DESIGN' | 'CONTENT' | 'RESEARCH' | 'MODERATION' | 'FUNDING' | 'EVENT' | 'KNOWLEDGE';
  versionNumber: number;
  payloadUrlOrContent?: string;
  isAiAssisted: boolean;
  aiAssistedDetails?: string;
  status: 'SUBMITTED' | 'IN_REVIEW' | 'VERIFIED' | 'REJECTED';
  verifiedBy?: string;
  verifiedAt?: string;
  createdAt: string;
}

export interface GovernanceProposalItem {
  id: string;
  creatorId: string;
  targetEntityId: string;
  scope: 'COMMUNITY' | 'PROJECT' | 'CREATOR_COLLECTIVE' | 'GLOBAL_INITIATIVE';
  title: string;
  description: string;
  options: string[];
  voteCounts: Record<string, number>;
  aiSummary?: string;
  aiKeyTakeaways?: string[];
  status: 'ACTIVE' | 'PASSED' | 'REJECTED' | 'EXPIRED';
  votingDeadline: string;
  createdAt: string;
  recentVotes?: Array<{ userId: string; selectedOption: string; votedAt: string }>;
}

export interface DecisionRecordItem {
  id: string;
  proposalId: string;
  targetEntityId: string;
  title: string;
  decisionOutcome: 'PASSED' | 'REJECTED' | 'CONSENSUS_REACHED' | 'TIED';
  finalTally: Record<string, number>;
  resolutionSummary: string;
  actionItems?: string[];
  governanceType: string;
  resolvedAt: string;
}

export interface KnowledgeVersionItem {
  id: string;
  collectionId: string;
  editorId: string;
  versionNumber: number;
  title: string;
  contentSummary: string;
  deltaChanges?: string[];
  commitMessage?: string;
  createdAt: string;
}

export interface KnowledgeConflictItem {
  id: string;
  topic: string;
  conflictingSources: Array<{
    sourceName: string;
    claim: string;
    publishedDate: string;
    authorOrCommunity: string;
    confidenceScore: number;
  }>;
  aiConflictExplanation: string;
  status: 'UNRESOLVED' | 'CONSENSUS_NOTE_ADDED' | 'DISMISSED';
  detectedAt: string;
}

export interface ResearchProjectItem {
  id: string;
  leadUserId: string;
  title: string;
  researchQuestion: string;
  hypotheses?: string[];
  evidenceSources?: Array<{ title: string; summary: string; verified: boolean }>;
  findingsNotes?: string[];
  aiSynthesizedReport?: string;
  status: 'PLANNING' | 'IN_PROGRESS' | 'PEER_REVIEW' | 'PUBLISHED';
  createdAt: string;
}

export interface AgentTeamItem {
  id: string;
  ownerId: string;
  name: string;
  mission?: string;
  agents: Array<{
    agentRole: 'COORDINATOR' | 'RESEARCHER' | 'PLANNER' | 'DOCS' | 'ANALYSIS' | 'QA';
    agentName: string;
    allowedTools: string[];
    maxTokensPerStep: number;
  }>;
  maxDailySteps: number;
  budgetUsdPerMonth: number;
  requireHumanGateOnActions: boolean;
  status: 'ACTIVE' | 'PAUSED' | 'SUSPENDED';
  createdAt: string;
}

export interface AgentTeamExecutionItem {
  id: string;
  teamId: string;
  userId: string;
  goalPrompt: string;
  collaborationTrail: Array<{
    stepIndex: number;
    agentRole: string;
    actionTaken: string;
    inputSummary: string;
    outputSummary: string;
    qualityGatePassed: boolean;
    timestamp: string;
  }>;
  finalSynthesisResult?: string;
  status: 'RUNNING' | 'COMPLETED' | 'HALTED_QUALITY_GATE' | 'FAILED';
  totalTokensUsed: number;
  costUsd: number;
  executedAt: string;
}

export interface AgentIncidentItem {
  id: string;
  agentOrTeamId: string;
  incidentType: 'BUDGET_EXCEEDED' | 'UNAUTHORIZED_TOOL_ATTEMPT' | 'POLICY_VIOLATION' | 'RECURSION_DETECTED' | 'HALLUCINATION_FLAGGED';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  description: string;
  isolatedStatePayload?: Record<string, any>;
  status: 'DETECTED' | 'CONTAINED' | 'INVESTIGATING' | 'RESOLVED';
  isKillSwitchEngaged: boolean;
  createdAt: string;
}

export interface CreatorCollectiveItem {
  id: string;
  founderId: string;
  name: string;
  description: string;
  category: string;
  members: Array<{
    creatorId: string;
    role: 'FOUNDER' | 'CORE_CREATOR' | 'GUEST_ARTIST';
    revenueSplitPercentage: number;
    joinedAt: string;
  }>;
  sharedSubscriptionPrice: number;
  currency: string;
  jointOfferings?: string[];
  totalCollectiveEarnings: number;
  createdAt: string;
}

export interface CollaborativeShoppingListItem {
  id: string;
  ownerId: string;
  title: string;
  description?: string;
  items: Array<{
    id: string;
    name: string;
    estimatedPrice: number;
    currency: string;
    vendorName?: string;
    votes: number;
    addedBy: string;
    status: 'PROPOSED' | 'APPROVED' | 'PURCHASED';
  }>;
  collaboratorUserIds?: string[];
  totalEstimatedAmount: number;
  createdAt: string;
}

export type IdentityContextType = 'PERSONAL' | 'CREATOR' | 'DEVELOPER' | 'ORGANIZATION_MEMBER' | 'COMMUNITY_MODERATOR';

export interface IdentityContextItem {
  id: string;
  userId: string;
  activeContextType: IdentityContextType;
  availableContexts: Array<{
    contextType: IdentityContextType;
    entityName: string;
    role: string;
    reputationScore: number;
  }>;
  scopedPermissions?: string[];
}

export interface DataAccessLogItem {
  id: string;
  userId: string;
  accessorId: string;
  accessorType: 'DEVELOPER_APP' | 'AI_AGENT' | 'INTERNAL_SERVICE' | 'ORGANIZATION';
  dataScopeAccessed: string;
  purpose?: string;
  status: 'AUTHORIZED' | 'DENIED' | 'REVOKED';
  canRevoke: boolean;
  accessedAt: string;
}

export interface PersonalVaultReport {
  userId: string;
  vaultStatus: string;
  activeContext: IdentityContextType;
  availablePersonas: any[];
  recentAccessEvents: DataAccessLogItem[];
  retainedMemoriesCount: number;
  privacyControls: {
    proactiveIntelligence: boolean;
    aiMemoryAllowed: boolean;
    thirdPartySharing: boolean;
    biometricVoiceStorage: boolean;
  };
}

export interface MultimodalAssetItem {
  id: string;
  userId: string;
  title: string;
  modality: 'IMAGE' | 'AUDIO' | 'VIDEO' | 'DOCUMENT';
  mediaUrl: string;
  transcriptionOrOcrText?: string;
  aiVisualSummary?: string;
  detectedTags?: string[];
  safetyScore: number;
  moderationStatus: 'PASSED' | 'FLAGGED_HUMAN_REVIEW' | 'REJECTED';
  createdAt: string;
}

export interface VoiceSessionItem {
  id: string;
  userId: string;
  speechTranscription: string;
  detectedIntent: string;
  aiVoiceReplyText: string;
  synthesizedAudioUrl?: string;
  suggestedActionPayload?: Record<string, any>;
  latencyMs: number;
  createdAt: string;
}

export interface SystemIncidentItem {
  id: string;
  category: 'SECURITY' | 'FRAUD_ABUSE' | 'INFRASTRUCTURE' | 'AI_AGENT_FAILURE' | 'NETWORK_EDGE';
  title: string;
  description: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'OPEN' | 'CONTAINED' | 'HEALED_AUTOMATICALLY' | 'RESOLVED';
  affectedSubsystems?: string[];
  automatedRecoveryActions?: string[];
  aiOperationsRemediationNote?: string;
  createdAt: string;
}

// ==========================================
// PHASE 14: GLOBAL INTELLIGENCE FABRIC & SIMULATION
// ==========================================

export interface GraphNodeItem {
  id: string;
  type: string;
  label: string;
  domain: string;
}

export interface GraphEdgeItem {
  source: string;
  target: string;
  type: string;
  weight: number;
}

export interface GraphOverviewReport {
  centerNodeId: string;
  nodes: GraphNodeItem[];
  edges: GraphEdgeItem[];
  totalEntitiesCount: number;
  totalRelationshipsCount: number;
  permissionScope: string;
}

export interface DigitalTwinItem {
  id: string;
  ownerId: string;
  twinType: 'PERSONAL' | 'CREATOR' | 'COMMUNITY' | 'PROJECT' | 'ORGANIZATION';
  displayName: string;
  description: string;
  stateSnapshot: {
    goals?: string[];
    interests?: string[];
    projects?: string[];
    knowledgeTopics?: string[];
    communities?: string[];
    contentThemes?: string[];
    publishingCadence?: string;
    rulesSummary?: string;
  };
  preferences: {
    ambientBriefingsEnabled: boolean;
    recommendationAggressiveness: 'CONSERVATIVE' | 'BALANCED' | 'EXPLORATORY';
    allowAutonomousAgentAssistance: boolean;
  };
  privacyControls: {
    isDiscoverable: boolean;
    shareAggregatedMetricsOnly: boolean;
    retainEventMemoryDays: number;
    allowCrossDomainInference: boolean;
  };
  isActive: boolean;
}

export interface SimulationScenarioItem {
  id: string;
  creatorId: string;
  title: string;
  hypothesis: string;
  scope: string;
  startingStateSnapshot: Record<string, any>;
  variablePerturbations: Array<{
    variableName: string;
    baselineValue: any;
    simulatedValue: any;
    unit?: string;
  }>;
  timeHorizon: string;
  status: 'DRAFT' | 'RUNNING' | 'COMPLETED' | 'FAILED';
  simulationResults: {
    expectedOutcomes?: Array<{ metric: string; deltaPercent: number; outcomeSummary: string }>;
    riskFactors?: Array<{ riskTitle: string; severity: 'LOW' | 'MEDIUM' | 'HIGH'; description: string }>;
    estimatedCostDeltaUsd?: number;
    uncertaintyConfidencePercent?: number;
    aiSimulationExecutiveSummary?: string;
  };
  isIsolatedSnapshotOnly: boolean;
}

export interface EcosystemPredictionItem {
  id: string;
  domain: string;
  targetEntityId?: string;
  predictionTitle: string;
  forecastStatement: string;
  confidenceScore: number;
  uncertaintyBand: {
    lowerBound: number;
    expectedValue: number;
    upperBound: number;
    unit: string;
  };
  influencingSignals: Array<{
    signalName: string;
    weight: number;
    observation: string;
  }>;
  aiExplanationRationale: string;
  horizon: string;
}

export interface ExplainableRecommendationItem {
  id: string;
  itemType: string;
  itemId: string;
  itemTitle: string;
  explanationReason: string;
  relevanceScore: number;
  category: string;
}

export interface SkillGraphItem {
  id: string;
  skillName: string;
  category: string;
  description: string;
  relatedSkillIds: string[];
  learningPathIds: string[];
  proficiencyLevelCount: number;
}

export interface ExpertProfileItem {
  id: string;
  userId: string;
  expertName: string;
  titleHeadline: string;
  verifiedDomains: string[];
  demonstratedPublicContributions: Array<{
    title: string;
    contributionType: 'CODE' | 'RESEARCH' | 'GOVERNANCE' | 'CREATOR' | 'COMMUNITY_LEAD';
    year: number;
  }>;
  availabilityStatus: string;
  reputationIndex: number;
  consultationsCompletedCount: number;
  isPubliclyListed: boolean;
}

export interface PersonalWeeklyBriefItem {
  userId: string;
  period: string;
  executiveHeadline: string;
  keyHighlights: Array<{
    category: string;
    headline: string;
    details: string;
  }>;
  suggestedWeeklyPriorities: string[];
  aiBriefingGeneratedAt: string;
}

// ==========================================
// PHASE 15: ADAPTIVE GLOBAL OPERATING ECOSYSTEM TYPES
// ==========================================

export interface ImprovementProposalItem {
  id: string;
  category: string;
  title: string;
  problemDescription: string;
  evidenceMetrics?: {
    slowWorkflowLatencyMs?: number;
    errorRatePercent?: number;
    searchFailurePercent?: number;
    uxDropoffPercent?: number;
    observationsCount?: number;
  };
  proposedChange: string;
  expectedBenefit?: string;
  riskLevel: string;
  affectedSubsystems?: string[];
  experimentPlan?: string;
  rollbackPlan?: string;
  ownerId: string;
  status: 'PROPOSED' | 'EXPERIMENTING' | 'ACCEPTED' | 'REJECTED' | 'ROLLED_BACK';
}

export interface PlatformExperimentItem {
  id: string;
  experimentKey: string;
  title: string;
  hypothesis: string;
  ownerId: string;
  targetSurface: string;
  targetAudienceSegment: string;
  durationDays: number;
  primaryMetric: string;
  secondaryMetrics?: string[];
  guardrailMetrics?: Array<{
    metricName: string;
    thresholdValue: number;
    operator: 'LT' | 'GT';
  }>;
  rollbackCriteria?: string;
  liveResults?: {
    sampleSize?: number;
    primaryMetricLiftPercent?: number;
    guardrailViolationsCount?: number;
    statisticallySignificant?: boolean;
  };
  status: 'DRAFT' | 'ACTIVE' | 'PAUSED' | 'CONCLUDED_SUCCESS' | 'ROLLED_BACK';
}

export interface FeatureFlagItem {
  key: string;
  enabled: boolean;
  rolloutPercent: number;
  owner: string;
  description: string;
}

export interface AdaptiveUxProfileItem {
  id: string;
  userId: string;
  activeProfile: 'SIMPLE' | 'STANDARD' | 'POWER_USER' | 'CREATOR' | 'DEVELOPER' | 'COMMUNITY_MANAGER' | 'ORGANIZATION';
  frequentToolsPriority: string[];
  attentionPreferences: {
    smartNotificationBatching?: boolean;
    batchIntervalMinutes?: number;
    quietHoursStart?: string;
    quietHoursEnd?: string;
    focusModeActive?: boolean;
    priorityInboxEnabled?: boolean;
    digestModeFrequency?: 'NONE' | 'DAILY_MORNING' | 'WEEKLY_SUNDAY';
  };
  adaptiveNavigationOrder: string[];
}

export interface AiPlanStepItem {
  stepIndex: number;
  stepTitle: string;
  agentRole: string;
  actionType: string;
  description: string;
  requiresHumanReview: boolean;
  status: 'PENDING' | 'EXECUTING' | 'COMPLETED' | 'FAILED';
}

export interface AiPlanItem {
  id: string;
  userId: string;
  goalTitle: string;
  goalDescription?: string;
  stepsBreakdown: AiPlanStepItem[];
  estimatedCostUsd: number;
  dataAccessScopes: string[];
  status: 'DRAFT' | 'PREVIEW' | 'APPROVED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
}

export interface AgentVersionItem {
  id: string;
  agentId: string;
  versionNumber: string;
  modelIdentifier: string;
  toolAllowlist: string[];
  permissionScopes: string[];
  benchmarkScores: {
    accuracyPercent?: number;
    safetyCompliancePercent?: number;
    averageLatencyMs?: number;
    costEfficiencyIndex?: number;
  };
  rolloutStatus: string;
}

export interface MemoryConflictItem {
  id: string;
  userId: string;
  memoryKey: string;
  existingMemoryValue: string;
  divergentMemoryValue: string;
  evidenceContext?: string;
  status: 'DETECTED' | 'USER_CONFIRMED' | 'RESOLVED' | 'DISCARDED';
  resolvedValue?: string | null;
}

export interface SecurityThreatItem {
  id: string;
  threatType: string;
  title: string;
  description?: string;
  targetEntityId?: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  automatedBoundedResponse?: {
    actionTaken?: 'TOKEN_REVOKED' | 'API_KEY_SUSPENDED' | 'RATE_LIMITED' | 'SESSION_TERMINATED';
    targetId?: string;
    reversible?: boolean;
    executedAt?: string;
  };
  status: 'OPEN' | 'AUTO_CONTAINED' | 'REVIEWED' | 'RESOLVED';
}

export interface PlatformHealthModelItem {
  region: string;
  overallStatus: string;
  dimensions: {
    availability: { score: number; status: string; note?: string };
    performance: { score: number; averageLatencyMs: number; status: string };
    security: { score: number; activeThreatsContained: number; status: string };
    aiQuality: { score: number; promptInjectionResistance: number; status: string };
    dataQuality: { score: number; brokenReferencesCount: number; status: string };
    uxSatisfaction: { score: number; userDropoffRate: number; status: string };
    costEfficiency: { score: number; budgetUtilizationPercent: number; status: string };
    scalability: { score: number; standbyEdgeWorkers: number; status: string };
  };
  diagnosticWarnings: string[];
  recordedAt: string;
}

export interface FeedbackClusterItem {
  id: string;
  clusterCategory: string;
  clusterTheme: string;
  feedbackItemsCount: number;
  urgencyLevel: string;
  representativeQuotes: string[];
  aiRoadmapRecommendation?: string;
  status: string;
}

// ==========================================
// PHASE 16: GLOBAL COLLECTIVE CREATION TYPES
// ==========================================

export interface IdeaItem {
  id: string;
  authorId: string;
  title: string;
  description: string;
  problemStatement?: string;
  proposedSolution?: string;
  category: string;
  skillsRequired?: string[];
  resourcesRequired?: string[];
  relatedCommunityIds?: string[];
  relatedTopicTags?: string[];
  visibility: 'PRIVATE' | 'COMMUNITY' | 'COLLABORATIVE' | 'PUBLIC';
  aiValidationReport?: {
    factualPrecedents?: string[];
    sourceReferences?: string[];
    feasibilityInferences?: string[];
    growthPredictions?: string[];
    validationScore?: number;
  };
  convertedProjectId?: string | null;
  status: 'DRAFT' | 'DISCOVERABLE' | 'VALIDATING' | 'CONVERTED_TO_PROJECT' | 'ARCHIVED';
  createdAt: string;
}

export interface HumanAiTeamItem {
  id: string;
  projectId: string;
  teamName: string;
  missionStatement?: string;
  humanMembers: Array<{
    userId: string;
    role: 'OWNER' | 'MANAGER' | 'CONTRIBUTOR' | 'REVIEWER' | 'OBSERVER';
    joinedAt: string;
  }>;
  aiMembers: Array<{
    agentId: string;
    agentName: string;
    agentRole: 'RESEARCH_AGENT' | 'PLANNING_AGENT' | 'DOCUMENTATION_AGENT' | 'QA_AGENT' | 'COORDINATOR';
    toolAllowlist: string[];
    budgetLimitUsd: number;
  }>;
  aiProjectManagerTelemetry?: {
    activeMilestone?: string;
    identifiedBlockers?: string[];
    progressScore?: number;
    lastReportGeneratedAt?: string;
  };
  status: string;
}

export interface CollaborationRoomItem {
  id: string;
  projectId: string;
  roomName: string;
  topicFocus?: string;
  activeParticipantIds?: string[];
  assignedAgentIds?: string[];
  realtimeIntelligence?: {
    liveMeetingSummary?: string;
    extractedActionItems?: string[];
    unresolvedQuestions?: string[];
    suggestedKnowledgeResources?: string[];
  };
  status: string;
}

export interface ResourceRequestItem {
  id: string;
  projectId: string;
  title: string;
  description: string;
  category: 'PEOPLE_SKILL' | 'TOOLS_EQUIPMENT' | 'KNOWLEDGE_RESEARCH' | 'SERVICES' | 'COMMUNITY_PARTNER';
  matchCriteria?: {
    skills?: string[];
    locationScope?: string;
    estimatedEffortHours?: number;
  };
  matchedEntityIds?: string[];
  status: string;
}

export interface ContributionListingItem {
  id: string;
  projectId: string;
  title: string;
  description: string;
  contributionType: 'DEVELOPMENT' | 'DESIGN' | 'RESEARCH' | 'WRITING' | 'MARKETING' | 'MENTORING' | 'EVENT_ORGANIZATION' | 'DOCUMENTATION';
  deliverablesSummary?: string[];
  status: string;
  assignedContributorId?: string | null;
  attributionRecord?: {
    verifiedByOwner?: boolean;
    attestationHash?: string;
    impactScore?: number;
  };
}

export interface AgentCertificationItem {
  id: string;
  agentId: string;
  agentName: string;
  developer: string;
  certificationTier: 'COMMUNITY_TESTED' | 'PLATFORM_TESTED' | 'SECURITY_REVIEWED' | 'ENTERPRISE_APPROVED';
  toolAllowlist: string[];
  dataAccessScopes: string[];
  sandboxConstraints?: {
    maxExecutionTimeMs?: number;
    maxBudgetPerTaskUsd?: number;
    networkOutboundRestricted?: boolean;
    fileAccessRestrictedToProject?: boolean;
  };
  securityAuditSummary?: string;
  status: string;
}

export interface HumanApprovalRequestItem {
  id: string;
  requesterAgentOrUserId: string;
  actionType: 'PUBLISH_CONTENT' | 'EXECUTE_PAYMENT' | 'MODIFY_PERMISSIONS' | 'DELETE_RESOURCE' | 'CHANGE_SECURITY_POLICY';
  title: string;
  reasonAndContext: string;
  targetEntityId: string;
  riskRating: string;
  dataScopesAccessed?: string[];
  expectedOutcome?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'EXPIRED';
  reviewedByUserId?: string | null;
  reviewerComments?: string | null;
  createdAt: string;
}








