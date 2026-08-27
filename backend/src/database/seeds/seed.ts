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
import { UserPreference } from '../entities/user-preference.entity';
import * as bcrypt from 'bcryptjs';
import * as path from 'path';
import * as fs from 'fs';

const isPostgres = process.env.DATABASE_TYPE === 'postgres';

// Dynamically discover and load all entity classes from entities directory
const entitiesDir = path.join(__dirname, '../entities');
const entityFiles = fs
  .readdirSync(entitiesDir)
  .filter((f) => f.endsWith('.entity.ts') || f.endsWith('.entity.js'));

const ALL_ENTITIES: any[] = [];
for (const file of entityFiles) {
  try {
    const mod = require(path.join(entitiesDir, file));
    for (const key of Object.keys(mod)) {
      const exported = mod[key];
      if (typeof exported === 'function' && exported.name && !ALL_ENTITIES.includes(exported)) {
        ALL_ENTITIES.push(exported);
      }
    }
  } catch (err) {
    // Ignore non-entity helper modules
  }
}

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

  // ==========================================
  // 3.5. DEMO NETWORK & VALUE LOOP SEEDS
  // ==========================================
  const needRepo = AppDataSource.getRepository(Need);
  const offerRepo = AppDataSource.getRepository(Offer);
  const oppRepo = AppDataSource.getRepository(Opportunity);
  const leadRepo = AppDataSource.getRepository(Lead);
  const leadNoteRepo = AppDataSource.getRepository(LeadNote);
  const partnerRepo = AppDataSource.getRepository(Partner);
  const partnerOfferRepo = AppDataSource.getRepository(PartnerOffer);

  // Helper: Create demo partner users & businesses if they don't exist
  let vikram = await userRepo.findOne({ where: { email: 'vikram.singh@finflow.io' } });
  if (!vikram) {
    vikram = await userRepo.save(
      userRepo.create({
        id: 'usr_vikram_01',
        email: 'vikram.singh@finflow.io',
        phoneNumber: '+91 98765 43212',
        role: UserRole.BUSINESS,
        status: UserStatus.ACTIVE,
        isEmailVerified: true,
        isPhoneVerified: true,
        needsOnboarding: false,
        passwordHash: await bcrypt.hash('password123', 10),
      }),
    );
    await profileRepo.save(
      profileRepo.create({
        user: vikram,
        firstName: 'Vikram',
        lastName: 'Singh',
        avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
        headline: 'Co-Founder & COO @ FinFlow Logistics Tech',
        city: 'Bangalore',
        skills: ['Logistics', 'Supply Chain', 'FinTech', 'Fleet Operations'],
        interests: ['React Native', 'B2B Logistics', 'SaaS'],
      }),
    );
    const vikramBiz = await bizRepo.save(
      bizRepo.create({
        id: 'biz_finflow',
        owner: vikram,
        businessName: 'FinFlow Logistics Tech',
        logoUrl: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=150',
        categoryName: 'IT & Software Development',
        description: 'Next-gen dispatch and cross-docking tracking platform for commercial fleets.',
        city: 'Bangalore',
        isVerified: true,
      }),
    );

    // Seed Open Opportunities
    await oppRepo.save([
      oppRepo.create({
        creator: vikram,
        business: vikramBiz,
        title: 'Looking for React Native Dev Team to build B2B Delivery App',
        description: 'We are seeking an experienced mobile development agency to build our driver dispatch and proof-of-delivery cross-platform app. Must have real-time GPS tracking and offline sync capabilities.',
        categoryName: 'IT & Software Development',
        tags: ['React Native', 'TypeScript', 'Offline Sync', 'GPS Tracking', 'Mobile App'],
        budgetAmount: 350000,
        currency: 'INR',
        deadline: '2026-09-30',
        city: 'Bangalore',
        status: OpportunityStatus.OPEN,
      }),
      oppRepo.create({
        creator: vikram,
        business: vikramBiz,
        title: 'Regional B2B Grain Discovery Engine & Supply Chain Gateway',
        description: 'Enterprise integration requirement connecting 500+ grain mills with regional Kirana merchant networks.',
        categoryName: 'IT & Software Development',
        tags: ['Supply Chain', 'API Integration', 'Full-Stack', 'NestJS'],
        budgetAmount: 280000,
        currency: 'INR',
        deadline: '2026-10-15',
        city: 'Bangalore',
        status: OpportunityStatus.OPEN,
      }),
    ]);
  }

  let priya = await userRepo.findOne({ where: { email: 'priya.nair@healthfirst.io' } });
  if (!priya) {
    priya = await userRepo.save(
      userRepo.create({
        id: 'usr_priya_nair',
        email: 'priya.nair@healthfirst.io',
        phoneNumber: '+91 98765 43213',
        role: UserRole.BUSINESS,
        status: UserStatus.ACTIVE,
        isEmailVerified: true,
        isPhoneVerified: true,
        needsOnboarding: false,
        passwordHash: await bcrypt.hash('password123', 10),
      }),
    );
    await profileRepo.save(
      profileRepo.create({
        user: priya,
        firstName: 'Priya',
        lastName: 'Nair',
        avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150',
        headline: 'VP Product @ HealthFirst Telemed',
        city: 'Mumbai',
        skills: ['HealthTech', 'Product Design', 'Telemedicine'],
      }),
    );
    const priyaBiz = await bizRepo.save(
      bizRepo.create({
        id: 'biz_health_first',
        owner: priya,
        businessName: 'HealthFirst Telemed',
        logoUrl: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=150',
        categoryName: 'UI/UX & Product Design',
        description: 'Modern telemedicine consultation and clinical management software.',
        city: 'Mumbai',
        isVerified: true,
      }),
    );

    await oppRepo.save([
      oppRepo.create({
        creator: priya,
        business: priyaBiz,
        title: 'Senior UI/UX Designer for Patient Health Dashboard',
        description: 'Complete redesign of our patient consultation mobile app and clinic scheduling web portal. Seeking high-fidelity Figma components and user testing experience.',
        categoryName: 'UI/UX & Product Design',
        tags: ['UI/UX Design', 'Figma', 'Healthcare', 'Design Systems'],
        budgetAmount: 180000,
        currency: 'INR',
        deadline: '2026-09-15',
        city: 'Mumbai',
        status: OpportunityStatus.OPEN,
      }),
      oppRepo.create({
        creator: priya,
        business: priyaBiz,
        title: 'Enterprise ISO 27001 Security Audit & Cloud Hardening',
        description: 'Need certified compliance consultant to audit HIPAA and ISO 27001 telemetry for clinical mobile apps.',
        categoryName: 'Legal & Corporate Compliance',
        tags: ['ISO 27001', 'Security', 'Compliance', 'Audit'],
        budgetAmount: 220000,
        currency: 'INR',
        deadline: '2026-10-30',
        city: 'Mumbai',
        status: OpportunityStatus.OPEN,
      }),
    ]);
  }

  // Seed Alex's Needs & Offers for live matching algorithm
  const alexNeedsCount = await needRepo.count({ where: { user: { id: alex.id } } });
  if (alexNeedsCount === 0) {
    await needRepo.save([
      needRepo.create({
        user: alex,
        ownerType: 'BUSINESS',
        ownerId: 'biz_01',
        title: 'Performance Marketing & Lead Gen Agency',
        description: 'Looking for a verified digital marketing partner to run B2B LinkedIn & Google search campaigns for our SaaS clients.',
        categoryName: 'Digital Marketing & Growth',
        tags: ['B2B Marketing', 'Google Ads', 'LinkedIn Campaigns', 'Lead Generation'],
        priority: NeedPriority.HIGH,
        city: 'Bangalore',
        status: NeedStatus.ACTIVE,
      }),
      needRepo.create({
        user: alex,
        ownerType: 'BUSINESS',
        ownerId: 'biz_01',
        title: 'Corporate Legal Advisor for Tech Contracts',
        description: 'Need legal consultation for enterprise MSA contracts, IP protection, and client master service agreements.',
        categoryName: 'Legal & Corporate Compliance',
        tags: ['Corporate Law', 'Tech Contracts', 'IP Protection', 'Compliance'],
        priority: NeedPriority.MEDIUM,
        city: 'Bangalore',
        status: NeedStatus.ACTIVE,
      }),
    ]);

    await offerRepo.save([
      offerRepo.create({
        user: alex,
        ownerType: 'BUSINESS',
        ownerId: 'biz_01',
        title: 'Custom Mobile & Web Application Engineering',
        description: 'End-to-end production development with React Native, TypeScript, NestJS, and scalable cloud deployment.',
        categoryName: 'IT & Software Development',
        tags: ['React Native', 'TypeScript', 'NestJS', 'Mobile Apps', 'PostgreSQL'],
        pricingModel: OfferPricing.FIXED,
        city: 'Bangalore',
        status: OfferStatus.ACTIVE,
      }),
      offerRepo.create({
        user: alex,
        ownerType: 'BUSINESS',
        ownerId: 'biz_01',
        title: 'High-Converting B2B UI/UX Design & Prototyping',
        description: 'Complete Figma design systems, user flows, interactive prototypes, and design-to-code handover.',
        categoryName: 'UI/UX & Product Design',
        tags: ['UI/UX Design', 'Figma', 'Design Systems', 'Mobile UI'],
        pricingModel: OfferPricing.HOURLY,
        city: 'Bangalore',
        status: OfferStatus.ACTIVE,
      }),
    ]);
  }

  // Seed CRM Leads for Alex
  const alexBiz = await bizRepo.findOne({ where: { owner: { id: alex.id } } });
  if (alexBiz && vikram && priya) {
    const alexLeadsCount = await leadRepo.count({ where: { business: { id: alexBiz.id } } });
    if (alexLeadsCount === 0) {
      const l1 = await leadRepo.save(
        leadRepo.create({
          business: alexBiz,
          contactUser: vikram,
          title: 'B2B Fleet Mobile App Architecture',
          status: LeadStatus.QUALIFIED,
          source: LeadSource.MATCH,
          estimatedValue: 350000,
          currency: 'INR',
        }),
      );
      await leadNoteRepo.save(
        leadNoteRepo.create({
          lead: l1,
          author: alex,
          noteText: 'Shared architecture wireframes and milestone timeline. Client agreed on 45-day deliverable scope.',
        }),
      );

      const l2 = await leadRepo.save(
        leadRepo.create({
          business: alexBiz,
          contactUser: priya,
          title: 'Patient Portal Figma Design System',
          status: LeadStatus.IN_DISCUSSION,
          source: LeadSource.OPPORTUNITY,
          estimatedValue: 180000,
          currency: 'INR',
        }),
      );
      await leadNoteRepo.save(
        leadNoteRepo.create({
          lead: l2,
          author: alex,
          noteText: 'Introductory design sync call completed. Preparing Figma component tokens sample.',
        }),
      );
    }
  }

  // Seed Ecosystem Partners
  const partnerCount = await partnerRepo.count();
  if (partnerCount === 0) {
    const p1 = await partnerRepo.save(
      partnerRepo.create({
        name: 'Amazon Web Services (AWS Activate)',
        logoUrl: 'https://images.unsplash.com/photo-1523474253243-401a6949753f?w=150',
        categoryName: 'Cloud Infrastructure & Hosting',
        description: 'Scalable cloud computing credits, premium enterprise support, and technical training.',
        websiteUrl: 'https://aws.amazon.com/activate/',
        exclusiveBadge: 'FEATURED',
      }),
    );
    await partnerOfferRepo.save(
      partnerOfferRepo.create({
        partner: p1,
        title: '$5,000 AWS Cloud Credits Package',
        description: 'Valid for 2 years across all EC2, RDS, and S3 resources for LipTalk member startups.',
        discountCode: 'LIPTALK-AWS-5K',
        discountValue: '$5,000 USD',
        validUntil: '2027-12-31',
      }),
    );

    const p2 = await partnerRepo.save(
      partnerRepo.create({
        name: 'Razorpay Rize Founder Program',
        logoUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=150',
        categoryName: 'Payments & Banking',
        description: 'Instant corporate banking accounts, zero setup fees, and priority merchant onboarding.',
        websiteUrl: 'https://razorpay.com/rize/',
        exclusiveBadge: 'FEATURED',
      }),
    );
    await partnerOfferRepo.save(
      partnerOfferRepo.create({
        partner: p2,
        title: 'Zero Gateway Transaction Fees on first ₹2,00,000',
        description: 'Full waiver on payment gateway fees for all UPI, Netbanking, and Credit Card payments.',
        discountCode: 'LIPTALK-RIZE',
        discountValue: '100% Fee Waiver',
        validUntil: '2027-12-31',
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
  // PHASE 5: GUILDS & COMMUNITIES SEED
  // ==========================================
  const commRepo = AppDataSource.getRepository(Community);
  const commMemberRepo = AppDataSource.getRepository(CommunityMember);
  const commPostRepo = AppDataSource.getRepository(CommunityPost);

  let c1 = await commRepo.findOne({ where: { slug: 'bangalore-tech-founders' } });
  if (!c1) {
    c1 = await commRepo.save(
      commRepo.create({
        name: 'Bangalore Tech Founders & CTOs',
        slug: 'bangalore-tech-founders',
        description: 'Exclusive hub for technology executives, full-stack builders, and SaaS architects in Bangalore.',
        category: 'IT & Software Development',
        coverImageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600',
        avatarUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=150',
        visibility: CommunityVisibility.PUBLIC,
        owner: alex,
        memberCount: 428,
        postCount: 34,
        isVerified: true,
        rules: [
          'Share real technical insights and architectures.',
          'Post high-budget business opportunities and hiring demands.',
          'Maintain a collaborative and helpful professional environment.',
        ],
      }),
    );

    await commMemberRepo.save(
      commMemberRepo.create({
        community: c1,
        user: alex,
        role: CommunityMemberRole.OWNER,
        status: CommunityMemberStatus.ACTIVE,
      }),
    );

    await commPostRepo.save([
      commPostRepo.create({
        community: c1,
        author: alex,
        type: PostType.ANNOUNCEMENT,
        title: 'Best practices for React Native offline-first SQLite sync',
        content: 'We recently transitioned our client architecture from standard REST caching to SQLite local tables with background sync workers. Reduced network payload by 65% and app start latency to 120ms. Anyone else experimenting with WatermelonDB or native TurboModules?',
        likesCount: 19,
        commentsCount: 6,
        isPinned: true,
      }),
      commPostRepo.create({
        community: c1,
        author: alex,
        type: PostType.TEXT,
        title: 'NestJS WebSocket gateway scaling recommendations',
        content: 'Sharing our benchmark results on scaling socket.io adapters across multi-region Redis clusters. Memory usage stays under 80MB for 10k concurrent channels.',
        likesCount: 12,
        commentsCount: 3,
        isPinned: false,
      }),
    ]);
  }

  let c2 = await commRepo.findOne({ where: { slug: 'b2b-growth-marketing' } });
  if (!c2) {
    c2 = await commRepo.save(
      commRepo.create({
        name: 'B2B Growth & Lead Gen Guild',
        slug: 'b2b-growth-marketing',
        description: 'Performance marketers, LinkedIn outbound specialists, and acquisition strategists sharing proven playbooks.',
        category: 'Digital Marketing & Growth',
        coverImageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600',
        avatarUrl: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=150',
        visibility: CommunityVisibility.PUBLIC,
        owner: vikram || alex,
        memberCount: 312,
        postCount: 22,
        isVerified: true,
        rules: [
          'Focus on data-backed acquisition strategies.',
          'No spam or unauthorized promotional links.',
        ],
      }),
    );

    await commMemberRepo.save(
      commMemberRepo.create({
        community: c2,
        user: alex,
        role: CommunityMemberRole.MEMBER,
        status: CommunityMemberStatus.ACTIVE,
      }),
    );
  }

  let c3 = await commRepo.findOne({ where: { slug: 'product-design-architects' } });
  if (!c3) {
    c3 = await commRepo.save(
      commRepo.create({
        name: 'Product Design & UI/UX Architects',
        slug: 'product-design-architects',
        description: 'Figma token masters, design system specialists, and UX researchers discussing interaction design and mobile patterns.',
        category: 'UI/UX & Product Design',
        coverImageUrl: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=600',
        avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150',
        visibility: CommunityVisibility.PUBLIC,
        owner: priya || alex,
        memberCount: 265,
        postCount: 18,
        isVerified: true,
      }),
    );

    await commMemberRepo.save(
      commMemberRepo.create({
        community: c3,
        user: alex,
        role: CommunityMemberRole.MEMBER,
        status: CommunityMemberStatus.ACTIVE,
      }),
    );
  }

  let c4 = await commRepo.findOne({ where: { slug: 'saas-legal-compliance' } });
  if (!c4) {
    c4 = await commRepo.save(
      commRepo.create({
        name: 'SaaS Legal & Corporate Compliance Hub',
        slug: 'saas-legal-compliance',
        description: 'Corporate retainers, cross-border MSA contracts, and DPDP compliance advisors for Indian startups.',
        category: 'Legal & Corporate Compliance',
        coverImageUrl: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=600',
        avatarUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=150',
        visibility: CommunityVisibility.PUBLIC,
        owner: alex,
        memberCount: 184,
        postCount: 14,
        isVerified: true,
      }),
    );
  }

  // ==========================================
  // PHASE 6: LIVE ROOMS & CREATOR SEED
  // ==========================================
  const roomRepo = AppDataSource.getRepository(LiveRoom);
  const contentRepo = AppDataSource.getRepository(ProfessionalContent);

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
