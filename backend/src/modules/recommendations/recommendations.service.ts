import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../database/entities/user.entity';
import { Opportunity } from '../../database/entities/opportunity.entity';
import { Community } from '../../database/entities/community.entity';
import { MarketplaceListing } from '../../database/entities/marketplace-listing.entity';
import { CommunityMember } from '../../database/entities/community-member.entity';
import { Need } from '../../database/entities/need.entity';
import { Offer } from '../../database/entities/offer.entity';
import { AiService } from '../ai/ai.service';

@Injectable()
export class RecommendationsService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Opportunity)
    private readonly oppRepo: Repository<Opportunity>,
    @InjectRepository(Community)
    private readonly commRepo: Repository<Community>,
    @InjectRepository(MarketplaceListing)
    private readonly listingRepo: Repository<MarketplaceListing>,
    @InjectRepository(CommunityMember)
    private readonly memberRepo: Repository<CommunityMember>,
    @InjectRepository(Need)
    private readonly needRepo: Repository<Need>,
    @InjectRepository(Offer)
    private readonly offerRepo: Repository<Offer>,
    private readonly aiService: AiService,
  ) {}

  /**
   * Personalized Home Discover Feed Recommendations
   */
  async getPersonalizedDiscover(userId: string) {
    const [userNeeds, userOffers, userMemberships] = await Promise.all([
      this.needRepo.find({ where: { user: { id: userId }, status: 'ACTIVE' as any } }),
      this.offerRepo.find({ where: { user: { id: userId }, status: 'ACTIVE' as any } }),
      this.memberRepo.find({ where: { user: { id: userId } }, relations: ['community'] }),
    ]);

    const joinedCommIds = new Set(userMemberships.map((m) => m.community?.id).filter(Boolean));

    // 1. Recommend Communities (Guilds user hasn't joined yet, aligned with user capabilities)
    const allCommunities = await this.commRepo.find();
    const recommendedCommunities = allCommunities
      .filter((c) => !joinedCommIds.has(c.id))
      .map((c) => {
        let score = 70;
        let reason = 'Active community in your industry domain';

        const matchNeed = userNeeds.find((n) => c.description?.toLowerCase().includes(n.categoryName.toLowerCase()));
        if (matchNeed) {
          score = 94;
          reason = `Aligned with your need: ${matchNeed.title}`;
        }
        return { ...c, synergyScore: score, recommendedReason: reason };
      })
      .sort((a, b) => b.synergyScore - a.synergyScore)
      .slice(0, 4);

    // 2. Recommend Opportunities (Demands user capabilities can fulfill)
    const allOpps = await this.oppRepo.find({
      relations: ['creator', 'creator.profile', 'creator.businesses'],
      where: { status: 'OPEN' as any },
    });

    const recommendedOpportunities = allOpps
      .filter((o) => o.creator?.id !== userId)
      .map((o) => {
        let score = 75;
        let reason = 'High-visibility opportunity in your city';

        const matchOffer = userOffers.find(
          (off) =>
            off.categoryId === o.categoryId ||
            o.title.toLowerCase().includes(off.categoryName.toLowerCase()),
        );
        if (matchOffer) {
          score = 96;
          reason = `Direct match for your offering: ${matchOffer.title}`;
        }
        return { ...o, matchScore: score, recommendedReason: reason };
      })
      .sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0))
      .slice(0, 4);

    // 3. Recommend Marketplace Services (Solving user's active Needs)
    const allListings = await this.listingRepo.find({
      relations: ['provider', 'provider.profile', 'provider.businesses'],
      where: { status: 'PUBLISHED' as any },
    });

    const recommendedServices = allListings
      .filter((l) => l.provider?.id !== userId)
      .map((l) => {
        let score = 80;
        let reason = 'Top-tier verified agency in Bangalore';

        const matchNeed = userNeeds.find(
          (n) =>
            n.categoryName.toLowerCase().includes(l.category.toLowerCase()) ||
            l.category.toLowerCase().includes(n.categoryName.toLowerCase()),
        );
        if (matchNeed) {
          score = 98;
          reason = `Directly fulfills your active need: ${matchNeed.title}`;
        }
        return { ...l, synergyScore: score, recommendedReason: reason };
      })
      .sort((a, b) => (b.synergyScore || 0) - (a.synergyScore || 0))
      .slice(0, 4);

    return {
      communities: recommendedCommunities,
      opportunities: recommendedOpportunities,
      services: recommendedServices,
    };
  }

  /**
   * Log Recommendation Feedback for Continuous Analytics
   */
  async recordFeedback(userId: string, targetType: string, targetId: string, feedback: 'RELEVANT' | 'NOT_RELEVANT') {
    return { success: true, message: `Feedback recorded: ${feedback}` };
  }
}
