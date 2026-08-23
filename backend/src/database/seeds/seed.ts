import { DataSource } from 'typeorm';
import { User, UserRole, UserStatus } from '../entities/user.entity';
import { UserProfile } from '../entities/profile.entity';
import { Business } from '../entities/business.entity';
import { Category } from '../entities/category.entity';
import { Need, NeedPriority, NeedStatus } from '../entities/need.entity';
import { Offer, OfferPricing, OfferStatus } from '../entities/offer.entity';
import { Opportunity, OpportunityStatus } from '../entities/opportunity.entity';
import { OpportunityInterest, InterestStatus } from '../entities/opportunity-interest.entity';
import { Lead, LeadStatus, LeadSource } from '../entities/lead.entity';
import { LeadNote } from '../entities/lead-note.entity';
import { Conversation, ConversationContextType } from '../entities/conversation.entity';
import { Message } from '../entities/message.entity';
import { Partner } from '../entities/partner.entity';
import { PartnerOffer } from '../entities/partner-offer.entity';
import { Notification } from '../entities/notification.entity';
import { Connection, ConnectionStatus } from '../entities/connection.entity';
import { Community, CommunityVisibility } from '../entities/community.entity';
import { CommunityMember, CommunityMemberRole, CommunityMemberStatus } from '../entities/community-member.entity';
import { CommunityPost, PostType } from '../entities/community-post.entity';
import { PostComment } from '../entities/post-comment.entity';
import { PostReaction, ReactionType } from '../entities/post-reaction.entity';
import { Event, EventLocationType, EventStatus } from '../entities/event.entity';
import { EventRegistration, RegistrationStatus } from '../entities/event-registration.entity';
import { CommunityReport } from '../entities/community-report.entity';
import {
  MarketplaceListing,
  ListingPricingType,
  ListingStatus,
  ListingPromotionType,
} from '../entities/marketplace-listing.entity';
import { SavedItem, SavedTargetType } from '../entities/saved-item.entity';
import { Review } from '../entities/review.entity';
import {
  RewardTransaction,
  RewardTransactionType,
  RewardAction,
} from '../entities/reward-transaction.entity';
import { Reward } from '../entities/reward.entity';
import { RewardRedemption, RedemptionStatus } from '../entities/reward-redemption.entity';
import { Referral, ReferralStatus } from '../entities/referral.entity';
import { Membership, MembershipTier, MembershipStatus } from '../entities/membership.entity';
import { Call, CallType, CallStatus } from '../entities/call.entity';
import { LiveRoom, LiveRoomType, LiveRoomStatus } from '../entities/live-room.entity';
import { LiveRoomMessage } from '../entities/live-room-message.entity';
import { ProfessionalContent, ContentType } from '../entities/professional-content.entity';
import { Follow } from '../entities/follow.entity';
import { Organization, OrganizationVerificationStatus } from '../entities/organization.entity';
import { OrganizationMember, OrganizationRole } from '../entities/organization-member.entity';
import { OrganizationInvitation, InvitationStatus } from '../entities/organization-invitation.entity';
import { Team } from '../entities/team.entity';
import { Report, ReportTargetType, ReportReason, ReportStatus } from '../entities/report.entity';
import { UserBlock } from '../entities/user-block.entity';
import { AuditLog, AuditAction } from '../entities/audit-log.entity';
import * as bcrypt from 'bcryptjs';

const isPostgres = process.env.DATABASE_TYPE === 'postgres';

const ALL_ENTITIES = [
  User,
  UserProfile,
  Business,
  Category,
  Need,
  Offer,
  Opportunity,
  OpportunityInterest,
  Lead,
  LeadNote,
  Conversation,
  Message,
  Partner,
  PartnerOffer,
  Notification,
  Connection,
  Community,
  CommunityMember,
  CommunityPost,
  PostComment,
  PostReaction,
  Event,
  EventRegistration,
  CommunityReport,
  MarketplaceListing,
  SavedItem,
  Review,
  RewardTransaction,
  Reward,
  RewardRedemption,
  Referral,
  Membership,
  Call,
  LiveRoom,
  LiveRoomMessage,
  ProfessionalContent,
  Follow,
  Organization,
  OrganizationMember,
  OrganizationInvitation,
  Team,
  Report,
  UserBlock,
  AuditLog,
];

const AppDataSource = new DataSource(
  isPostgres
    ? {
        type: 'postgres',
        host: process.env.DATABASE_HOST || 'localhost',
        port: parseInt(process.env.DATABASE_PORT || '5432', 10),
        username: process.env.DATABASE_USER || 'postgres',
        password: process.env.DATABASE_PASSWORD || 'postgrespassword',
        database: process.env.DATABASE_NAME || 'liptalk_db',
        entities: ALL_ENTITIES,
        synchronize: true,
      }
    : {
        type: 'sqlite',
        database: 'liptalk.sqlite',
        entities: ALL_ENTITIES,
        synchronize: true,
      },
);

async function runSeed() {
  console.log('🌱 Initializing Lip Talk Phase 4 Commercial & Marketplace Seeder...');
  await AppDataSource.initialize();

  // 1. Categories
  const categoryRepo = AppDataSource.getRepository(Category);
  const categories = [
    { name: 'IT & Software Development', slug: 'it-software', type: 'SERVICE', iconName: 'code' },
    { name: 'Digital Marketing & Growth', slug: 'digital-marketing', type: 'SERVICE', iconName: 'trending-up' },
    { name: 'UI/UX & Product Design', slug: 'ui-ux-design', type: 'SERVICE', iconName: 'layout' },
    { name: 'Legal & Corporate Compliance', slug: 'legal-compliance', type: 'SERVICE', iconName: 'shield' },
    { name: 'Finance & Accounting', slug: 'finance-accounting', type: 'SERVICE', iconName: 'dollar-sign' },
  ];

  for (const cat of categories) {
    const existing = await categoryRepo.findOne({ where: { slug: cat.slug } });
    if (!existing) {
      await categoryRepo.save(categoryRepo.create(cat));
    }
  }

  // 2. Main Test User (Alex Morgan)
  const userRepo = AppDataSource.getRepository(User);
  const profileRepo = AppDataSource.getRepository(UserProfile);
  const bizRepo = AppDataSource.getRepository(Business);
  const membershipRepo = AppDataSource.getRepository(Membership);

  let alex = await userRepo.findOne({ where: { email: 'alex.morgan@nexastech.com' } });
  if (!alex) {
    alex = userRepo.create({
      id: 'usr_curr_01',
      email: 'alex.morgan@nexastech.com',
      phoneNumber: '+91 98765 43210',
      role: UserRole.BUSINESS,
      status: UserStatus.ACTIVE,
      isEmailVerified: true,
      isPhoneVerified: true,
      needsOnboarding: false,
      passwordHash: await bcrypt.hash('password123', 10),
    });
    alex = await userRepo.save(alex);

    await profileRepo.save(
      profileRepo.create({
        user: alex,
        firstName: 'Alex',
        lastName: 'Morgan',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
        headline: 'Founder & Head of Tech @ Nexas Digital',
        bio: 'Building enterprise mobile & cloud architectures. Passionate about B2B growth and partnership ecosystems.',
        city: 'Bangalore',
        skills: ['Mobile Development', 'React Native', 'NestJS', 'Cloud Architecture'],
        interests: ['AI Automation', 'B2B Networking', 'SaaS Growth'],
        profileCompletionPercentage: 95,
      }),
    );

    await bizRepo.save(
      bizRepo.create({
        id: 'biz_01',
        owner: alex,
        businessName: 'Nexas Digital Solutions',
        logoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150',
        categoryName: 'IT & Software Development',
        description: 'Premier digital product studio specializing in high-performance cross-platform apps.',
        websiteUrl: 'https://nexasdigital.io',
        city: 'Bangalore',
        isVerified: true,
        services: ['Mobile App Development', 'Full-Stack Web Dev', 'Cloud DevOps'],
        products: ['Nexas Cloud Sync SDK'],
      }),
    );
  }

  // Ensure Membership
  let alexMembership = await membershipRepo.findOne({ where: { user: { id: alex.id } } });
  if (!alexMembership) {
    await membershipRepo.save(
      membershipRepo.create({
        user: alex,
        tier: MembershipTier.PRO,
        status: MembershipStatus.ACTIVE,
      }),
    );
  }

  // 3. Marketplace Listings Seed
  const listingRepo = AppDataSource.getRepository(MarketplaceListing);
  const l1 = await listingRepo.findOne({ where: { slug: 'custom-mobile-app-engineering' } });
  if (!l1) {
    await listingRepo.save(
      listingRepo.create({
        provider: alex,
        title: 'Custom React Native & Cloud App Engineering',
        slug: 'custom-mobile-app-engineering',
        description: 'End-to-end mobile architecture with offline SQLite synchronization, high-frequency WebSockets, and production NestJS backend deployment.',
        category: 'IT & Software Development',
        pricingType: ListingPricingType.FIXED,
        price: 250000,
        currency: 'INR',
        location: 'Bangalore (Hybrid)',
        tags: ['React Native', 'TypeScript', 'NestJS', 'Offline Sync'],
        imageUrls: [
          'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600',
        ],
        status: ListingStatus.PUBLISHED,
        promotionType: ListingPromotionType.FEATURED,
        averageRating: 4.9,
        reviewsCount: 14,
        requestsCount: 28,
      }),
    );

    await listingRepo.save(
      listingRepo.create({
        provider: alex,
        title: 'Enterprise Figma Design System & UX Audit',
        slug: 'enterprise-figma-design-system',
        description: 'Scalable multi-brand tokenized Figma library with WCAG 2.1 compliance and native component parity documentation.',
        category: 'UI/UX & Product Design',
        pricingType: ListingPricingType.HOURLY,
        price: 3500,
        currency: 'INR',
        location: 'Remote',
        tags: ['Figma Tokens', 'UX Research', 'Design Systems'],
        imageUrls: [
          'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=600',
        ],
        status: ListingStatus.PUBLISHED,
        promotionType: ListingPromotionType.NORMAL,
        averageRating: 5.0,
        reviewsCount: 8,
        requestsCount: 15,
      }),
    );
  }

  // 4. Rewards Catalog Seed
  const rewardRepo = AppDataSource.getRepository(Reward);
  const txRepo = AppDataSource.getRepository(RewardTransaction);

  const existingReward = await rewardRepo.findOne({ where: { title: '₹1,500 Rapido Business Fleet Voucher' } });
  if (!existingReward) {
    const r1 = await rewardRepo.save(
      rewardRepo.create({
        title: '₹1,500 Rapido Business Fleet Voucher',
        description: 'Redeemable for team corporate commute passes across all tier-1 cities.',
        pointsCost: 750,
        category: 'Corporate Travel',
        discountValue: '₹1,500 OFF',
        promoCodeTemplate: 'RAPIDO-BIZ',
        bannerUrl: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=600',
        isActive: true,
      }),
    );

    await rewardRepo.save(
      rewardRepo.create({
        title: '₹2,500 Blinkit Quick-Commerce Office Pantry Credit',
        description: 'Instant office replenishment credits on orders above ₹3,000.',
        pointsCost: 1200,
        category: 'Office & Supplies',
        discountValue: '₹2,500 Credits',
        promoCodeTemplate: 'BLINKIT-BIZ',
        bannerUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600',
        isActive: true,
      }),
    );

    await rewardRepo.save(
      rewardRepo.create({
        title: 'LipTalk Executive Pro Tier (1-Month Pass)',
        description: 'Unlock 2x priority matching algorithm and promoted business demands for 30 days.',
        pointsCost: 2000,
        category: 'Platform Perks',
        discountValue: '100% Free Month',
        promoCodeTemplate: 'LIPPRO-30D',
        bannerUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600',
        isActive: true,
      }),
    );

    // Initial Ledger Entries for Alex Morgan (+1,850 pts)
    await txRepo.save(
      txRepo.create({
        user: alex,
        amount: 1000,
        type: RewardTransactionType.EARNED,
        action: RewardAction.PROFILE_COMPLETED,
        description: 'Completed 95% Verified Business & Founder Profile',
      }),
    );

    await txRepo.save(
      txRepo.create({
        user: alex,
        amount: 500,
        type: RewardTransactionType.EARNED,
        action: RewardAction.REFERRAL_SUCCESS,
        description: 'Referred Vikram Singh (FinFlow Logistics Tech)',
      }),
    );

    await txRepo.save(
      txRepo.create({
        user: alex,
        amount: 350,
        type: RewardTransactionType.EARNED,
        action: RewardAction.COLLABORATION_COMPLETED,
        description: 'Completed B2B Synergy Deal with GrowthPulse Media',
      }),
    );
  }

  // ==========================================
  // PHASE 6: LIVE ROOMS & CREATOR SEED
  // ==========================================
  const roomRepo = AppDataSource.getRepository(LiveRoom);
  const contentRepo = AppDataSource.getRepository(ProfessionalContent);
  const commRepo = AppDataSource.getRepository(Community);

  const existingRoom = await roomRepo.findOne({ where: { title: 'Bangalore CTOs: Scaling High-Concurrency WebSockets & Offline Sync' } });
  if (!existingRoom) {
    const comm = await commRepo.findOne({ where: { slug: 'bangalore-tech-founders' } });

    await roomRepo.save(
      roomRepo.create({
        host: alex,
        title: 'Bangalore CTOs: Scaling High-Concurrency WebSockets & Offline Sync',
        description: 'Live interactive masterclass & architecture teardown on building real-time mobile sync with SQLite and NestJS.',
        category: 'Engineering & Architecture',
        roomType: LiveRoomType.WORKSHOP,
        status: LiveRoomStatus.LIVE,
        audienceCount: 38,
        community: comm || undefined,
        coverImageUrl: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=600',
        startedAt: new Date(),
      }),
    );

    await roomRepo.save(
      roomRepo.create({
        host: alex,
        title: 'B2B Founder Mixer: Closing Enterprise Contracts in Q4',
        description: 'Open mic networking session for SaaS founders and agency owners to share outbound strategies and active demands.',
        category: 'B2B Growth & Sales',
        roomType: LiveRoomType.NETWORKING,
        status: LiveRoomStatus.SCHEDULED,
        audienceCount: 14,
        coverImageUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=600',
        scheduledAt: new Date(Date.now() + 86400000),
      }),
    );

    await contentRepo.save(
      contentRepo.create({
        author: alex,
        title: 'How we architected 60fps offline synchronization in React Native',
        body: 'Deep dive into local SQLite caching, conflict-free state resolution, and binary WebSocket event streaming. Check out our verified marketplace listing for architecture retainers!',
        contentType: ContentType.EDUCATIONAL,
        mediaUrls: ['https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600'],
        tags: ['React Native', 'Mobile Architecture', 'Offline Sync'],
        viewsCount: 480,
        likesCount: 54,
      }),
    );
  }

  // ==========================================
  // Phase 7: Enterprise Multi-Tenancy & Teams
  // ==========================================
  const orgRepo = AppDataSource.getRepository(Organization);
  const orgMemberRepo = AppDataSource.getRepository(OrganizationMember);
  const teamRepo = AppDataSource.getRepository(Team);
  const reportRepo = AppDataSource.getRepository(Report);
  const auditRepo = AppDataSource.getRepository(AuditLog);

  let org = await orgRepo.findOne({ where: { slug: 'finflow-technologies' } });
    if (!org) {
      org = await orgRepo.save(
        orgRepo.create({
          name: 'FinFlow Technologies Pvt Ltd',
          slug: 'finflow-technologies',
          description: 'Enterprise fintech & cross-border payments infrastructure supporting 10,000+ merchants.',
          industry: 'Financial Technology & Enterprise SaaS',
          employeeCountRange: '100-500',
          location: 'Bangalore, India',
          websiteUrl: 'https://finflow.io',
          logoUrl: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=150',
          owner: alex,
          verificationStatus: OrganizationVerificationStatus.VERIFIED,
          maxSeats: 50,
        }),
      );

      const engTeam = await teamRepo.save(
        teamRepo.create({
          organization: org,
          name: 'Core Platform & Architecture',
          department: 'ENGINEERING',
          description: 'High-throughput payment gateway and distributed ledgers.',
        }),
      );

      const salesTeam = await teamRepo.save(
        teamRepo.create({
          organization: org,
          name: 'Enterprise Partnerships',
          department: 'SALES',
          description: 'Large enterprise logistics and banking deal pipeline.',
        }),
      );

      let colleague = await userRepo.findOne({ where: { email: 'priya.sharma@zenith.io' } });
      if (!colleague) {
        colleague = await userRepo.save(
          userRepo.create({
            id: 'usr_priya_01',
            email: 'priya.sharma@zenith.io',
            phoneNumber: '+91 98765 43211',
            role: UserRole.INDIVIDUAL,
            status: UserStatus.ACTIVE,
            isEmailVerified: true,
            isPhoneVerified: true,
            needsOnboarding: false,
            passwordHash: await bcrypt.hash('password123', 10),
          }),
        );
      }

      await orgMemberRepo.save([
        orgMemberRepo.create({
          organization: org,
          user: alex,
          role: OrganizationRole.OWNER,
          team: engTeam,
          department: 'Executive Leadership',
          jobTitle: 'Chief Technology Officer',
          isActive: true,
        }),
        orgMemberRepo.create({
          organization: org,
          user: colleague,
          role: OrganizationRole.MANAGER,
          team: salesTeam,
          department: 'Strategic Partnerships',
          jobTitle: 'Head of Enterprise Sales',
          isActive: true,
        }),
      ]);

      await auditRepo.save(
        auditRepo.create({
          actor: alex,
          action: AuditAction.ORG_CREATED,
          targetType: 'ORGANIZATION',
          targetId: org.id,
          description: 'Enterprise organization FinFlow Technologies workspace established',
          ipAddress: '127.0.0.1',
        }),
      );
    }

  console.log('✅ Lip Talk Phase 7 Enterprise & Trust Seeding Completed Successfully!');
  await AppDataSource.destroy();
}

runSeed().catch((err) => {
  console.error('❌ Seeding failed:', err);
  process.exit(1);
});
