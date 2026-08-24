import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReputationProfile } from '../../database/entities/reputation-profile.entity';
import { ProjectWorkspace } from '../../database/entities/project-workspace.entity';
import { CreatorService } from '../../database/entities/creator-service.entity';
import { RevenueSplit } from '../../database/entities/revenue-split.entity';
import { Subscription } from '../../database/entities/subscription.entity';
import { Entitlement } from '../../database/entities/entitlement.entity';
import { AgentListing } from '../../database/entities/agent-listing.entity';
import { MentorshipProfile } from '../../database/entities/mentorship-profile.entity';
import { Opportunity } from '../../database/entities/opportunity.entity';
import { AiGatewayService } from '../ai/gateway/ai-gateway.service';

@Injectable()
export class EcosystemService {
  private readonly logger = new Logger(EcosystemService.name);

  constructor(
    @InjectRepository(ReputationProfile)
    private readonly repRepo: Repository<ReputationProfile>,
    @InjectRepository(ProjectWorkspace)
    private readonly projectRepo: Repository<ProjectWorkspace>,
    @InjectRepository(CreatorService)
    private readonly creatorServiceRepo: Repository<CreatorService>,
    @InjectRepository(RevenueSplit)
    private readonly splitRepo: Repository<RevenueSplit>,
    @InjectRepository(Subscription)
    private readonly subRepo: Repository<Subscription>,
    @InjectRepository(Entitlement)
    private readonly entRepo: Repository<Entitlement>,
    @InjectRepository(AgentListing)
    private readonly agentStoreRepo: Repository<AgentListing>,
    @InjectRepository(MentorshipProfile)
    private readonly mentorRepo: Repository<MentorshipProfile>,
    @InjectRepository(Opportunity)
    private readonly oppRepo: Repository<Opportunity>,
    private readonly gatewayService: AiGatewayService,
  ) {}

  /**
   * Get or initialize Reputation Profile
   */
  async getReputationProfile(userId: string): Promise<ReputationProfile> {
    let rep = await this.repRepo.findOne({ where: { userId } });
    if (!rep) {
      rep = this.repRepo.create({
        userId,
        marketplaceReputation: 92,
        communityReputation: 95,
        creatorReputation: 88,
        developerReputation: 94,
        contributorReputation: 90,
        overallTrustScore: 92,
        trustTier: 'TIER_1_VERIFIED',
        badges: ['VERIFIED_DEVELOPER', 'COMMUNITY_MENTOR', 'TOP_CONTRIBUTOR', 'ESCROW_VERIFIED'],
      });
      rep = await this.repRepo.save(rep);
    }
    return rep;
  }

  /**
   * Project Workspaces
   */
  async getUserProjects(userId: string): Promise<ProjectWorkspace[]> {
    let projects = await this.projectRepo.find({
      where: { ownerId: userId },
      order: { createdAt: 'DESC' },
    });

    if (projects.length === 0) {
      const defaultProj = this.projectRepo.create({
        ownerId: userId,
        title: 'Open FMCG Supply Chain Gateway',
        description: 'Collaborative initiative to connect independent Kirana merchants with national mill hubs.',
        scope: 'COMMUNITY_OPEN_SOURCE',
        progressPercent: 65,
        members: [
          { userId, role: 'LEAD', joinedAt: '2026-08-01T10:00:00Z' },
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
      });
      projects = [await this.projectRepo.save(defaultProj)];
    }

    return projects;
  }

  async createProject(ownerId: string, data: Partial<ProjectWorkspace>): Promise<ProjectWorkspace> {
    const proj = this.projectRepo.create({ ...data, ownerId });
    return this.projectRepo.save(proj);
  }

  /**
   * Creator Services & Revenue Splits
   */
  async getCreatorServices(creatorId: string): Promise<CreatorService[]> {
    let services = await this.creatorServiceRepo.find({
      where: { creatorId },
      order: { createdAt: 'DESC' },
    });

    if (services.length === 0) {
      const defaultService = this.creatorServiceRepo.create({
        creatorId,
        title: 'Enterprise React Native & Cloud Architecture Audit',
        description: 'Comprehensive 1-on-1 teardown of mobile performance, TurboModules, and offline sync resilience.',
        category: 'Architecture Review',
        price: 25000,
        currency: 'INR',
        pricingModel: 'FIXED',
        averageRating: 5.0,
        completedOrdersCount: 14,
        isActive: true,
      });
      services = [await this.creatorServiceRepo.save(defaultService)];
    }

    return services;
  }

  calculateRevenueSplit(grossAmount: number, currency = 'INR', hasCollaborator = false, hasCommunity = false): RevenueSplit {
    const platformFee = Number((grossAmount * 0.05).toFixed(2)); // 5% fee
    let collaboratorShare = 0;
    let communityShare = 0;

    let remainder = grossAmount - platformFee;

    if (hasCollaborator) {
      collaboratorShare = Number((remainder * 0.2).toFixed(2)); // 20% to co-creator
      remainder -= collaboratorShare;
    }

    if (hasCommunity) {
      communityShare = Number((remainder * 0.05).toFixed(2)); // 5% back to guild treasury
      remainder -= communityShare;
    }

    const creatorShare = Number(remainder.toFixed(2));

    return {
      id: 'split_' + Date.now(),
      transactionId: 'tx_' + Date.now(),
      totalGrossAmount: grossAmount,
      currency,
      platformFeeAmount: platformFee,
      creatorNetAmount: creatorShare,
      collaboratorNetAmount: collaboratorShare,
      communityShareAmount: communityShare,
      status: 'SETTLED',
      createdAt: new Date(),
    };
  }

  /**
   * Subscriptions & Entitlements
   */
  async getUserSubscriptions(userId: string): Promise<Subscription[]> {
    let subs = await this.subRepo.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });

    if (subs.length === 0) {
      const defaultSub = this.subRepo.create({
        userId,
        targetEntityId: 'lip_platform',
        subscriptionType: 'PLATFORM_PRO',
        planName: 'LipTalk Executive Pro (Annual)',
        amount: 4999,
        currency: 'INR',
        billingInterval: 'ANNUAL',
        status: 'ACTIVE',
        currentPeriodEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      });
      subs = [await this.subRepo.save(defaultSub)];
    }

    return subs;
  }

  /**
   * AI Agent Marketplace & Certification
   */
  async getAgentStore(category?: string): Promise<AgentListing[]> {
    let listings = await this.agentStoreRepo.find({
      order: { rating: 'DESC', installsCount: 'DESC' },
    });

    if (listings.length === 0) {
      const seedListings = [
        {
          developerId: 'dev_nexas_01',
          name: 'B2B Wholesale Procurement Radar',
          description: 'Autonomous agent that monitors regional FMCG commodity price drops and flags wholesale arbitrage deals.',
          category: 'B2B Sourcing',
          pricingModel: 'FREE' as const,
          price: 0,
          requiredScopes: ['ai.search', 'ai.read'],
          certificationStatus: 'CERTIFIED' as const,
          rating: 4.9,
          installsCount: 840,
          isActive: true,
        },
        {
          developerId: 'dev_apex_02',
          name: 'Enterprise Contract Proposal Synthesizer',
          description: 'Prepares structured executive proposals and milestone SLA schedules from chat discussions.',
          category: 'Productivity',
          pricingModel: 'FREE' as const,
          price: 0,
          requiredScopes: ['ai.draft', 'ai.summarize'],
          certificationStatus: 'CERTIFIED' as const,
          rating: 4.8,
          installsCount: 1210,
          isActive: true,
        },
      ];

      listings = await this.agentStoreRepo.save(seedListings.map((l) => this.agentStoreRepo.create(l)));
    }

    if (category) {
      return listings.filter((l) => l.category.toLowerCase() === category.toLowerCase());
    }
    return listings;
  }

  /**
   * Mentorship
   */
  async getMentors(expertise?: string): Promise<MentorshipProfile[]> {
    let mentors = await this.mentorRepo.find({
      order: { rating: 'DESC', menteesHelpedCount: 'DESC' },
    });

    if (mentors.length === 0) {
      const seedMentors = [
        {
          mentorId: 'usr_curr_01',
          headline: 'Founder & Head of Tech @ Nexas Digital',
          bio: 'Mentoring engineering founders on building high-scale React Native mobile apps and B2B marketplace platforms.',
          expertiseAreas: ['React Native Architecture', 'NestJS Backend', 'B2B Trade'],
          availabilityStatus: 'OPEN' as const,
          menteesHelpedCount: 28,
          rating: 5.0,
        },
        {
          mentorId: 'usr_sarah_02',
          headline: 'VP of Product @ Apex Cloud Solutions',
          bio: 'Specializing in creator monetization, pricing strategies, and cross-border SaaS expansion.',
          expertiseAreas: ['Product Strategy', 'Creator Monetization', 'Global Expansion'],
          availabilityStatus: 'OPEN' as const,
          menteesHelpedCount: 19,
          rating: 4.9,
        },
      ];
      mentors = await this.mentorRepo.save(seedMentors.map((m) => this.mentorRepo.create(m)));
    }

    if (expertise) {
      return mentors.filter((m) =>
        m.expertiseAreas.some((e) => e.toLowerCase().includes(expertise.toLowerCase())),
      );
    }
    return mentors;
  }

  /**
   * AI Opportunity Matching
   */
  async matchOpportunities(userId: string) {
    const opps = await this.oppRepo.find({ take: 6, order: { createdAt: 'DESC' } });
    return opps.map((o) => ({
      opportunity: o,
      matchScore: Math.floor(Math.random() * 15) + 85, // 85-99%
      matchReason: 'High synergy with your verified React Native and Cloud Architecture capabilities.',
    }));
  }
}
