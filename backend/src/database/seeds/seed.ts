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
      phoneNumber: '+91 9962786367',
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
  const convRepo = AppDataSource.getRepository(Conversation);
  const msgRepo = AppDataSource.getRepository(Message);

  // 1. Vikram Singh (FinFlow Logistics Tech)
  let vikram = await userRepo.findOne({
    where: [{ id: 'usr_vikram_01' }, { id: 'usr_vikram_singh' }, { email: 'vikram.singh@finflow.io' }],
    relations: ['profile'],
  });
  if (!vikram) {
    vikram = userRepo.create({
      id: 'usr_vikram_01',
      email: 'vikram.singh@finflow.io',
      phoneNumber: '+91 7200317219',
      role: UserRole.BUSINESS,
      status: UserStatus.ACTIVE,
      isEmailVerified: true,
      isPhoneVerified: true,
      needsOnboarding: false,
      passwordHash: await bcrypt.hash('password123', 10),
    });
    vikram = await userRepo.save(vikram);
  }

  let vikramProfile = await profileRepo.findOne({ where: { user: { id: vikram.id } } });
  if (!vikramProfile) {
    vikramProfile = profileRepo.create({
      user: vikram,
      firstName: 'Vikram',
      lastName: 'Singh',
      avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
      headline: 'Co-Founder & COO @ FinFlow Logistics Tech',
      bio: 'Pioneering smart supply chain automation, cold chain monitoring, and intercity freight logistics.',
      city: 'Bangalore',
      skills: ['Logistics', 'Supply Chain', 'Fleet Management', 'Cold Chain', 'Enterprise Sales'],
      interests: ['Smart Warehousing', 'IoT Telematics', 'B2B Sourcing', 'Cross-border Trade'],
      profileCompletionPercentage: 92,
    });
  } else {
    vikramProfile.firstName = 'Vikram';
    vikramProfile.lastName = 'Singh';
    vikramProfile.avatarUrl = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150';
    vikramProfile.headline = 'Co-Founder & COO @ FinFlow Logistics Tech';
    vikramProfile.city = 'Bangalore';
  }
  await profileRepo.save(vikramProfile);

  let vikramBiz = await bizRepo.findOne({ where: { id: 'biz_finflow' } });
  if (!vikramBiz) {
    vikramBiz = bizRepo.create({
      id: 'biz_finflow',
      owner: vikram,
      businessName: 'FinFlow Logistics Tech',
      logoUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=150',
      categoryName: 'Logistics & Supply Chain',
      description: 'Autonomous freight distribution and intercity cargo routing platform connecting shippers with vetted fleet operators.',
      websiteUrl: 'https://finflow.io',
      city: 'Bangalore',
      isVerified: true,
      services: ['Fleet Aggregation', 'Intercity Logistics', 'Cold Chain Delivery', 'Warehouse Automation'],
      products: ['FinFlow Fleet Tracking SaaS', 'Smart Cargo Dispatch API'],
    });
  } else {
    vikramBiz.owner = vikram;
    vikramBiz.businessName = 'FinFlow Logistics Tech';
    vikramBiz.logoUrl = 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=150';
  }
  await bizRepo.save(vikramBiz);

  // 2. Kavita Menon (GrowthPulse Media) - matches mockData usr_growthpulse_founder
  // Clean up legacy rohan if exists
  try {
    await AppDataSource.query("DELETE FROM users WHERE email = 'rohan.mehta@growthpulse.io'");
  } catch {}

  try {
    await AppDataSource.query(
      "UPDATE users SET id = 'usr_growthpulse_founder' WHERE email = 'kavita.menon@growthpulse.io' OR phoneNumber = '+91 98765 43214'",
    );
  } catch {}

  let kavita = await userRepo.findOne({
    where: { id: 'usr_growthpulse_founder' },
    relations: ['profile'],
  });
  if (!kavita) {
    kavita = userRepo.create({
      id: 'usr_growthpulse_founder',
      email: 'kavita.menon@growthpulse.io',
      phoneNumber: '+91 98765 43214',
      role: UserRole.BUSINESS,
      status: UserStatus.ACTIVE,
      isEmailVerified: true,
      isPhoneVerified: true,
      needsOnboarding: false,
      passwordHash: await bcrypt.hash('password123', 10),
    });
    kavita = await userRepo.save(kavita);
  }

  let kavitaProfile = await profileRepo.findOne({ where: { user: { id: kavita.id } } });
  if (!kavitaProfile) {
    kavitaProfile = profileRepo.create({
      user: kavita,
      firstName: 'Kavita',
      lastName: 'Menon',
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
      headline: 'Managing Director @ GrowthPulse Media',
      bio: 'B2B Performance Marketing & Lead Acquisition Agency scaling high-growth SaaS pipelines.',
      city: 'Bangalore',
      skills: ['B2B Marketing', 'Google Ads', 'LinkedIn Outbound', 'Growth Hacking'],
      profileCompletionPercentage: 95,
    });
  } else {
    kavitaProfile.firstName = 'Kavita';
    kavitaProfile.lastName = 'Menon';
    kavitaProfile.avatarUrl = 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150';
    kavitaProfile.headline = 'Managing Director @ GrowthPulse Media';
  }
  await profileRepo.save(kavitaProfile);

  let kavitaBiz = await bizRepo.findOne({ where: { id: 'biz_growth_pulse' } });
  if (!kavitaBiz) {
    kavitaBiz = bizRepo.create({
      id: 'biz_growth_pulse',
      owner: kavita,
      businessName: 'GrowthPulse Media',
      logoUrl: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=150',
      categoryName: 'Digital Marketing & Growth',
      description: 'B2B Performance Marketing & Lead Acquisition Agency scaling SaaS pipelines.',
      city: 'Bangalore',
      isVerified: true,
      services: ['B2B Growth & Multi-Channel Lead Campaigns', 'LinkedIn Outbound Automation'],
      products: ['GrowthPulse Lead Funnel CRM'],
    });
  } else {
    kavitaBiz.owner = kavita;
    kavitaBiz.businessName = 'GrowthPulse Media';
    kavitaBiz.logoUrl = 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=150';
  }
  await bizRepo.save(kavitaBiz);

  // 3. Priya Nair (HealthFirst Telemed)
  let priya = await userRepo.findOne({
    where: [{ id: 'usr_priya_nair' }, { email: 'priya.nair@healthfirst.io' }],
    relations: ['profile'],
  });
  if (!priya) {
    priya = userRepo.create({
      id: 'usr_priya_nair',
      email: 'priya.nair@healthfirst.io',
      phoneNumber: '+91 98765 43213',
      role: UserRole.BUSINESS,
      status: UserStatus.ACTIVE,
      isEmailVerified: true,
      isPhoneVerified: true,
      needsOnboarding: false,
      passwordHash: await bcrypt.hash('password123', 10),
    });
    priya = await userRepo.save(priya);
  }

  let priyaProfile = await profileRepo.findOne({ where: { user: { id: priya.id } } });
  if (!priyaProfile) {
    priyaProfile = profileRepo.create({
      user: priya,
      firstName: 'Priya',
      lastName: 'Nair',
      avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150',
      headline: 'VP Product @ HealthFirst Telemed',
      city: 'Mumbai',
      skills: ['HealthTech', 'Product Design', 'Telemedicine', 'UI/UX'],
    });
    await profileRepo.save(priyaProfile);
  }

  let priyaBiz = await bizRepo.findOne({ where: { id: 'biz_health_first' } });
  if (!priyaBiz) {
    priyaBiz = bizRepo.create({
      id: 'biz_health_first',
      owner: priya,
      businessName: 'HealthFirst Telemed',
      logoUrl: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=150',
      categoryName: 'UI/UX & Product Design',
      description: 'Modern telemedicine consultation and clinical management software.',
      city: 'Mumbai',
      isVerified: true,
    });
    await bizRepo.save(priyaBiz);
  }

  // 4. Adv. Rajesh Verma (LexTech Advisors LLP)
  let rajesh = await userRepo.findOne({ where: { email: 'rajesh.verma@lextech.in' } });
  if (!rajesh) {
    rajesh = await userRepo.save(
      userRepo.create({
        id: 'usr_rajesh_01',
        email: 'rajesh.verma@lextech.in',
        phoneNumber: '+91 98765 43215',
        role: UserRole.BUSINESS,
        status: UserStatus.ACTIVE,
        isEmailVerified: true,
        isPhoneVerified: true,
        passwordHash: await bcrypt.hash('password123', 10),
      }),
    );
    await profileRepo.save(
      profileRepo.create({
        user: rajesh,
        firstName: 'Rajesh',
        lastName: 'Verma',
        avatarUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=150',
        headline: 'Managing Partner @ LexTech Advisors LLP',
        city: 'Bangalore',
        skills: ['Technology Law', 'IP Protection', 'Tech Contracts', 'DPDP Compliance'],
      }),
    );
  }
  let rajeshBiz = await bizRepo.findOne({ where: { id: 'biz_lex_tech' } });
  if (!rajeshBiz) {
    rajeshBiz = await bizRepo.save(
      bizRepo.create({
        id: 'biz_lex_tech',
        owner: rajesh,
        businessName: 'LexTech Advisors LLP',
        logoUrl: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=150',
        categoryName: 'Legal & Corporate Compliance',
        description: 'Technology Law, Startup IP Protection & Enterprise SaaS Contracts.',
        city: 'Bangalore',
        isVerified: true,
      }),
    );
  }

  // 5. Ananya Desai (PixelCraft Design Studio)
  let ananya = await userRepo.findOne({ where: { email: 'ananya.desai@pixelcraft.design' } });
  if (!ananya) {
    ananya = await userRepo.save(
      userRepo.create({
        id: 'usr_ananya_01',
        email: 'ananya.desai@pixelcraft.design',
        phoneNumber: '+91 98765 43216',
        role: UserRole.BUSINESS,
        status: UserStatus.ACTIVE,
        isEmailVerified: true,
        isPhoneVerified: true,
        passwordHash: await bcrypt.hash('password123', 10),
      }),
    );
    await profileRepo.save(
      profileRepo.create({
        user: ananya,
        firstName: 'Ananya',
        lastName: 'Desai',
        avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
        headline: 'Lead Product Designer @ PixelCraft Studio',
        city: 'Bangalore',
        skills: ['UI/UX Design', 'Figma Tokens', 'Design Systems', 'Mobile Interaction'],
      }),
    );
  }
  let ananyaBiz = await bizRepo.findOne({ where: { id: 'biz_pixel_craft' } });
  if (!ananyaBiz) {
    ananyaBiz = await bizRepo.save(
      bizRepo.create({
        id: 'biz_pixel_craft',
        owner: ananya,
        businessName: 'PixelCraft Design Studio',
        logoUrl: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=150',
        categoryName: 'UI/UX & Product Design',
        description: 'Award-winning product design and tokenized design systems agency.',
        city: 'Bangalore',
        isVerified: true,
      }),
    );
  }

  // 6. Seed Opportunities (opp_01, opp_02, opp_03 matching mockData exactly)
  let opp1 = await oppRepo.findOne({ where: { id: 'opp_01' } });
  if (!opp1) {
    opp1 = oppRepo.create({
      id: 'opp_01',
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
    });
    opp1 = await oppRepo.save(opp1);
  }

  let opp2 = await oppRepo.findOne({ where: { id: 'opp_02' } });
  if (!opp2) {
    opp2 = oppRepo.create({
      id: 'opp_02',
      creator: priya,
      business: priyaBiz,
      title: 'Senior UI/UX Designer for Patient Health Dashboard',
      description: 'Complete redesign of our patient consultation mobile app and clinic scheduling web portal. Seeking high-fidelity Figma components and user testing experience.',
      categoryName: 'UI/UX & Product Design',
      tags: ['UI/UX Design', 'Figma', 'Healthcare', 'Design Systems'],
      budgetAmount: 180000,
      currency: 'INR',
      deadline: '2026-09-15',
      city: 'Mumbai (Remote OK)',
      status: OpportunityStatus.OPEN,
    });
    opp2 = await oppRepo.save(opp2);
  }

  let opp3 = await oppRepo.findOne({ where: { id: 'opp_03' } });
  if (!opp3) {
    opp3 = oppRepo.create({
      id: 'opp_03',
      creator: ananya,
      business: ananyaBiz,
      title: 'Seeking B2B Content Writer & SEO Specialist',
      description: 'Need long-form technical blogs and whitepapers for AI fintech product launch over the next 3 months.',
      categoryName: 'Digital Marketing & Growth',
      tags: ['Content Marketing', 'SEO', 'Technical Writing', 'Fintech'],
      budgetAmount: 60000,
      currency: 'INR/mo',
      deadline: '2026-09-01',
      city: 'Remote',
      status: OpportunityStatus.IN_DISCUSSION,
    });
    opp3 = await oppRepo.save(opp3);
  }

  // 7. Seed Alex's Needs & Offers
  const alexNeeds = await needRepo.find({ where: { user: { id: alex.id } } });
  if (alexNeeds.length === 0) {
    await needRepo.save([
      needRepo.create({
        id: 'need_01',
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
        id: 'need_02',
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
  }

  const alexOffers = await offerRepo.find({ where: { user: { id: alex.id } } });
  if (alexOffers.length === 0) {
    await offerRepo.save([
      offerRepo.create({
        id: 'off_01',
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
        id: 'off_02',
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

  // Kavita's Reciprocal Offer & Need (match_01 synergy)
  const kavitaOffers = await offerRepo.find({ where: { user: { id: kavita.id } } });
  if (kavitaOffers.length === 0) {
    await offerRepo.save(
      offerRepo.create({
        user: kavita,
        ownerType: 'BUSINESS',
        ownerId: kavitaBiz.id,
        title: 'B2B Growth & Multi-Channel Lead Campaigns',
        description: 'High-converting inbound funnels, Google Search Ads, and targeted LinkedIn outbound campaigns.',
        categoryName: 'Digital Marketing & Growth',
        tags: ['B2B Marketing', 'Google Ads', 'LinkedIn Campaigns', 'Lead Generation'],
        pricingModel: OfferPricing.RETAINER,
        city: 'Bangalore',
        status: OfferStatus.ACTIVE,
      }),
    );
    await needRepo.save(
      needRepo.create({
        user: kavita,
        ownerType: 'BUSINESS',
        ownerId: kavitaBiz.id,
        title: 'React Native Mobile App Architecture',
        description: 'Seeking a verified mobile engineering team to develop our proprietary marketing attribution app.',
        categoryName: 'IT & Software Development',
        tags: ['React Native', 'Mobile Apps', 'TypeScript'],
        priority: NeedPriority.HIGH,
        city: 'Bangalore',
        status: NeedStatus.ACTIVE,
      }),
    );
  }

  // 8. CRM Leads & Notes for Alex (lead_01, lead_02, lead_03 matching mockData exactly)
  const alexBiz = await bizRepo.findOne({ where: { id: 'biz_01' } });
  if (alexBiz) {
    // Lead 01: Vikram Singh (FinFlow)
    let lead1 = await leadRepo.findOne({ where: { id: 'lead_01' } });
    if (!lead1) {
      lead1 = await leadRepo.save(
        leadRepo.create({
          id: 'lead_01',
          business: alexBiz,
          contactUser: vikram,
          opportunity: opp1,
          title: 'FinFlow Driver Dispatch App Project',
          status: LeadStatus.QUALIFIED,
          source: LeadSource.OPPORTUNITY,
          estimatedValue: 350000,
          currency: 'INR',
          lastContactedAt: new Date('2026-08-18T14:30:00Z'),
        }),
      );
      await leadNoteRepo.save([
        leadNoteRepo.create({
          lead: lead1,
          author: alex,
          noteText: 'Reviewed technical requirements for offline SQLite caching and real-time telemetry.',
        }),
        leadNoteRepo.create({
          lead: lead1,
          author: alex,
          noteText: 'Client confirmed budget allocation of ₹3,50,000 for milestone 1 & 2.',
        }),
        leadNoteRepo.create({
          lead: lead1,
          author: alex,
          noteText: 'Discussed foreground service battery optimization for delivery drivers.',
        }),
        leadNoteRepo.create({
          lead: lead1,
          author: alex,
          noteText: 'Discovery call scheduled for tomorrow at 3 PM.',
        }),
      ]);
    }

    // Lead 02: Kavita Menon (GrowthPulse)
    let lead2 = await leadRepo.findOne({ where: { id: 'lead_02' } });
    if (!lead2) {
      lead2 = await leadRepo.save(
        leadRepo.create({
          id: 'lead_02',
          business: alexBiz,
          contactUser: kavita,
          title: 'Reciprocal Growth & Client App Build Partnership',
          status: LeadStatus.IN_DISCUSSION,
          source: LeadSource.MATCH,
          estimatedValue: 200000,
          currency: 'INR',
          lastContactedAt: new Date('2026-08-17T17:00:00Z'),
        }),
      );
      await leadNoteRepo.save([
        leadNoteRepo.create({
          lead: lead2,
          author: alex,
          noteText: 'Initial match verified at 94% synergy between digital marketing and mobile app engineering.',
        }),
        leadNoteRepo.create({
          lead: lead2,
          author: alex,
          noteText: 'Kavita shared draft LinkedIn campaign deck over email.',
        }),
      ]);
    }

    // Lead 03: Priya Nair (HealthFirst)
    let lead3 = await leadRepo.findOne({ where: { id: 'lead_03' } });
    if (!lead3) {
      lead3 = await leadRepo.save(
        leadRepo.create({
          id: 'lead_03',
          business: alexBiz,
          contactUser: priya,
          opportunity: opp2,
          title: 'Telemedicine Dashboard Redesign Contract',
          status: LeadStatus.CONVERTED,
          source: LeadSource.OPPORTUNITY,
          estimatedValue: 180000,
          currency: 'INR',
          lastContactedAt: new Date('2026-08-18T10:15:00Z'),
        }),
      );
      await leadNoteRepo.save([
        leadNoteRepo.create({
          lead: lead3,
          author: alex,
          noteText: 'Expressed interest in patient consultation portal redesign.',
        }),
        leadNoteRepo.create({
          lead: lead3,
          author: alex,
          noteText: 'Portfolio presentation reviewed by clinical UX committee.',
        }),
        leadNoteRepo.create({
          lead: lead3,
          author: alex,
          noteText: 'Milestone scope agreed for Figma design system with tokens.',
        }),
        leadNoteRepo.create({
          lead: lead3,
          author: alex,
          noteText: 'Contract drafted and legal review completed.',
        }),
        leadNoteRepo.create({
          lead: lead3,
          author: alex,
          noteText: 'Master Service Agreement signed by VP Product.',
        }),
        leadNoteRepo.create({
          lead: lead3,
          author: alex,
          noteText: 'Kickoff sprint scheduled for next Monday.',
        }),
      ]);
    }
  }

  // 9. Pre-Initiated Contextual Conversations & Messages (conv_01, conv_02)
  let conv1 = await convRepo.findOne({ where: { id: 'conv_01' } });
  if (!conv1) {
    conv1 = await convRepo.save(
      convRepo.create({
        id: 'conv_01',
        contextType: ConversationContextType.OPPORTUNITY,
        contextId: 'opp_01',
        contextTitle: 'Opportunity: React Native B2B Delivery App',
        participantIds: ['usr_curr_01', vikram.id],
        createdAt: new Date('2026-08-16T14:00:00Z'),
        updatedAt: new Date('2026-08-18T14:30:00Z'),
      }),
    );

    await msgRepo.save([
      msgRepo.create({
        id: 'msg_01',
        conversation: conv1,
        sender: alex,
        text: 'Hi Vikram, saw your requirement for the B2B Delivery App. At Nexas, we have built 4 production logistics apps with background GPS and SQLite offline caching.',
        isRead: true,
        createdAt: new Date('2026-08-16T14:00:00Z'),
      }),
      msgRepo.create({
        id: 'msg_02',
        conversation: conv1,
        sender: vikram,
        text: 'Hi Alex! That matches our exact tech stack need. Do you support Android background location policies and low-power battery optimization?',
        isRead: true,
        createdAt: new Date('2026-08-16T14:15:00Z'),
      }),
      msgRepo.create({
        id: 'msg_03',
        conversation: conv1,
        sender: alex,
        text: 'Yes, we use native foreground services with batched geofence alerts to ensure compliance and sub-2% battery drain per 8h shift.',
        isRead: true,
        createdAt: new Date('2026-08-16T14:22:00Z'),
      }),
      msgRepo.create({
        id: 'msg_04',
        conversation: conv1,
        sender: vikram,
        text: 'Thanks Alex! We reviewed your team portfolio for offline sync and would like to schedule a technical discovery call tomorrow at 3 PM.',
        isRead: false,
        createdAt: new Date('2026-08-18T14:30:00Z'),
      }),
    ]);
  }

  let conv2 = await convRepo.findOne({ where: { id: 'conv_02' } });
  if (!conv2) {
    conv2 = await convRepo.save(
      convRepo.create({
        id: 'conv_02',
        contextType: ConversationContextType.NEED_OFFER_MATCH,
        contextId: 'match_01',
        contextTitle: 'Match (94%): B2B Lead Gen & Web App Development',
        participantIds: ['usr_curr_01', kavita.id],
        createdAt: new Date('2026-08-17T10:00:00Z'),
        updatedAt: new Date('2026-08-17T17:00:00Z'),
      }),
    );

    await msgRepo.save(
      msgRepo.create({
        id: 'msg_05',
        conversation: conv2,
        sender: kavita,
        text: 'Our team is ready with the LinkedIn campaign pitch deck for Nexas. Shared the draft over email.',
        isRead: true,
        createdAt: new Date('2026-08-17T17:00:00Z'),
      }),
    );
  }

  // 10. Ecosystem Partners (Rapido, Blinkit, RedBus matching mockData PARTNERS_DATA)
  let p1 = await partnerRepo.findOne({ where: { name: 'Rapido Enterprise Logistics' } });
  if (!p1) {
    p1 = await partnerRepo.save(
      partnerRepo.create({
        id: 'ptn_01',
        name: 'Rapido Enterprise Logistics',
        logoUrl: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=150',
        categoryName: 'Intra-City Logistics & Fleet',
        description: 'On-demand corporate parcel and express delivery fleet for local businesses and retail stores.',
        coverageArea: 'Pan-India (40+ Cities)',
        websiteUrl: 'https://rapido.bike',
        exclusiveBadge: 'Eco Partner',
      }),
    );
    await partnerOfferRepo.save(
      partnerOfferRepo.create({
        id: 'poff_01',
        partner: p1,
        title: '30% Off First 100 Business Deliveries',
        description: 'Exclusive B2B introductory credit for Lip Talk verified businesses.',
        discountCode: 'LIPTALK30',
        discountValue: '30% OFF',
        validUntil: '2026-12-31',
        ctaUrl: 'https://rapido.bike/business',
      }),
    );
  }

  let p2 = await partnerRepo.findOne({ where: { name: 'Blinkit Commerce For Work' } });
  if (!p2) {
    p2 = await partnerRepo.save(
      partnerRepo.create({
        id: 'ptn_02',
        name: 'Blinkit Commerce For Work',
        logoUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=150',
        categoryName: 'Instant Office Supplies & Pantry',
        description: '10-minute office pantry restocking, printer supplies, and team event essentials.',
        coverageArea: 'Metro Tier-1 & Tier-2',
        websiteUrl: 'https://blinkit.com',
        exclusiveBadge: 'Priority Supply',
      }),
    );
    await partnerOfferRepo.save(
      partnerOfferRepo.create({
        id: 'poff_02',
        partner: p2,
        title: '₹2,500 Monthly Office Pantry Credits',
        description: 'Complimentary restocking credits on quarterly enterprise agreements.',
        discountCode: 'LIPBIZ2500',
        discountValue: '₹2,500 Credits',
        validUntil: '2026-11-30',
        ctaUrl: 'https://blinkit.com/b2b',
      }),
    );
  }

  let p3 = await partnerRepo.findOne({ where: { name: 'RedBus Corporate Commute' } });
  if (!p3) {
    p3 = await partnerRepo.save(
      partnerRepo.create({
        id: 'ptn_03',
        name: 'RedBus Corporate Commute',
        logoUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=150',
        categoryName: 'Corporate Travel & Shuttles',
        description: 'Dedicated business employee commute passes and chartered inter-city buses for corporate retreats.',
        coverageArea: 'Nationwide',
        websiteUrl: 'https://redbus.in',
      }),
    );
    await partnerOfferRepo.save(
      partnerOfferRepo.create({
        id: 'poff_03',
        partner: p3,
        title: '15% Cashback on Executive Shuttle Passes',
        description: 'Available for team bookings above 10 members.',
        discountCode: 'LIPTRAVEL15',
        discountValue: '15% Cashback',
        validUntil: '2026-10-31',
        ctaUrl: 'https://redbus.in/corporate',
      }),
    );
  }

  let p4 = await partnerRepo.findOne({ where: { name: 'Amazon Web Services (AWS Activate)' } });
  if (!p4) {
    p4 = await partnerRepo.save(
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
        partner: p4,
        title: '$5,000 AWS Cloud Credits Package',
        description: 'Valid for 2 years across all EC2, RDS, and S3 resources for LipTalk member startups.',
        discountCode: 'LIPTALK-AWS-5K',
        discountValue: '$5,000 USD',
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
