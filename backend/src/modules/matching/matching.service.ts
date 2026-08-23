import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Need } from '../../database/entities/need.entity';
import { Offer } from '../../database/entities/offer.entity';
import { User } from '../../database/entities/user.entity';
import { CommunityMember } from '../../database/entities/community-member.entity';
import { AiService } from '../ai/ai.service';

export interface MatchFactorBreakdown {
  factor: string;
  description: string;
  scoreContribution: number;
}

export interface ComputedMatch {
  id: string;
  targetId: string;
  targetType: 'USER' | 'BUSINESS';
  targetName: string;
  targetAvatar?: string;
  targetHeadline?: string;
  targetCity: string;
  targetRole: string;
  matchedNeedTitle?: string;
  matchedOfferTitle?: string;
  matchScore: number;
  matchScorePercent: string;
  primaryReason: string;
  reasons: MatchFactorBreakdown[];
  isReciprocal: boolean;
  reciprocalDetail?: string;
}

@Injectable()
export class MatchingService {
  constructor(
    @InjectRepository(Need)
    private readonly needRepo: Repository<Need>,
    @InjectRepository(Offer)
    private readonly offerRepo: Repository<Offer>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(CommunityMember)
    private readonly memberRepo: Repository<CommunityMember>,
    private readonly aiService: AiService,
  ) {}

  /**
   * Hybrid Explainable Matching Algorithm:
   * Deterministic Rules (Category + Tags + Location + Reciprocal)
   * +
   * AI Semantic Vector Similarity (Need text <-> Offer capability)
   * +
   * Ecosystem Signals (Shared Community Memberships)
   */
  async computeMatchesForUser(userId: string): Promise<ComputedMatch[]> {
    const userNeeds = await this.needRepo.find({
      where: { user: { id: userId }, status: 'ACTIVE' as any },
    });
    const userOffers = await this.offerRepo.find({
      where: { user: { id: userId }, status: 'ACTIVE' as any },
    });

    const otherOffers = await this.offerRepo.find({
      relations: ['user', 'user.profile', 'user.businesses'],
    });

    const otherNeeds = await this.needRepo.find({
      relations: ['user', 'user.profile', 'user.businesses'],
    });

    // Fetch user's community memberships
    const userMemberships = await this.memberRepo.find({
      where: { user: { id: userId }, status: 'ACTIVE' as any },
      relations: ['community'],
    });
    const userCommunityIds = new Set(userMemberships.map((m) => m.community?.id).filter(Boolean));

    const matches: ComputedMatch[] = [];

    // Evaluate each user need against all active offers
    for (const need of userNeeds) {
      const needText = `${need.title} ${need.description || ''} ${need.categoryName} ${(need.tags || []).join(' ')}`;

      for (const offer of otherOffers) {
        if (!offer.user || offer.user.id === userId) continue;

        const breakdown: MatchFactorBreakdown[] = [];
        let totalScore = 0;

        // 1. Category Match (30%)
        let catScore = 0;
        if (need.categoryId && offer.categoryId && need.categoryId === offer.categoryId) {
          catScore = 30;
          breakdown.push({
            factor: 'Direct Domain Match',
            description: `Exact category match in ${need.categoryName}`,
            scoreContribution: 30,
          });
        } else if (
          need.categoryName.toLowerCase().includes(offer.categoryName.toLowerCase()) ||
          offer.categoryName.toLowerCase().includes(need.categoryName.toLowerCase())
        ) {
          catScore = 20;
          breakdown.push({
            factor: 'Related Industry Domain',
            description: `Aligned service discipline (${offer.categoryName})`,
            scoreContribution: 20,
          });
        }
        totalScore += catScore;

        // 2. Tag & Skill Jaccard Overlap (20%)
        const needTags = (need.tags || []).map((t) => t.toLowerCase().trim());
        const offerTags = (offer.tags || []).map((t) => t.toLowerCase().trim());
        const intersection = needTags.filter((t) => offerTags.includes(t));
        const union = Array.from(new Set([...needTags, ...offerTags]));

        let tagScore = 0;
        if (union.length > 0) {
          const jaccard = intersection.length / union.length;
          tagScore = Math.round(jaccard * 20);
          if (intersection.length > 0) {
            breakdown.push({
              factor: 'Skill & Deliverable Overlap',
              description: `Shared capabilities: ${intersection.join(', ')}`,
              scoreContribution: tagScore,
            });
          }
        }
        totalScore += tagScore;

        // 3. AI Semantic Vector Similarity (20%)
        const offerText = `${offer.title} ${offer.description || ''} ${offer.categoryName} ${(offer.tags || []).join(' ')}`;
        const semanticSim = await this.aiService.computeSemanticSimilarity(needText, offerText);
        const semanticScore = Math.round(semanticSim * 20);

        if (semanticScore >= 8) {
          breakdown.push({
            factor: 'AI Semantic Conceptual Match',
            description: `High conceptual alignment between requirement and offering`,
            scoreContribution: semanticScore,
          });
        }
        totalScore += semanticScore;

        // 4. Shared Community / Guild Overlap (10%)
        const candidateMemberships = await this.memberRepo.find({
          where: { user: { id: offer.user.id }, status: 'ACTIVE' as any },
          relations: ['community'],
        });
        const sharedGuilds = candidateMemberships.filter(
          (m) => m.community && userCommunityIds.has(m.community.id),
        );

        if (sharedGuilds.length > 0) {
          const guildName = sharedGuilds[0].community.name;
          totalScore += 10;
          breakdown.push({
            factor: 'Shared Community Guild',
            description: `Both active in "${guildName}"`,
            scoreContribution: 10,
          });
        } else {
          totalScore += 5;
        }

        // 5. Geographic Proximity (10%)
        let locScore = 5;
        if (need.city && offer.city && need.city.toLowerCase() === offer.city.toLowerCase()) {
          locScore = 10;
          breakdown.push({
            factor: 'Local Hub Synergy',
            description: `Based in the same business hub (${need.city})`,
            scoreContribution: 10,
          });
        } else {
          breakdown.push({
            factor: 'Remote Collaboration',
            description: 'Available for distributed cross-city delivery',
            scoreContribution: 5,
          });
        }
        totalScore += locScore;

        // 6. Reciprocal Synergy Check (10% boost)
        let isReciprocal = false;
        let reciprocalDetail: string | undefined;

        const candidateUserId = offer.user.id;
        const candidateNeeds = otherNeeds.filter((n) => n.user?.id === candidateUserId);
        for (const cNeed of candidateNeeds) {
          for (const uOffer of userOffers) {
            if (
              (cNeed.categoryId && uOffer.categoryId && cNeed.categoryId === uOffer.categoryId) ||
              cNeed.title.toLowerCase().includes(uOffer.title.toLowerCase())
            ) {
              isReciprocal = true;
              reciprocalDetail = `They also need "${cNeed.title}" which you offer!`;
              totalScore += 10;
              breakdown.push({
                factor: 'Reciprocal Dual-Need Synergy',
                description: reciprocalDetail,
                scoreContribution: 10,
              });
              break;
            }
          }
          if (isReciprocal) break;
        }

        const finalScore = Math.min(Math.max(totalScore, 50), 99);

        const primaryBiz = offer.user.businesses && offer.user.businesses[0];
        const isBiz = offer.user.role === 'BUSINESS' && primaryBiz;

        matches.push({
          id: `match_${need.id}_${offer.id}`,
          targetId: isBiz ? primaryBiz.id : offer.user.id,
          targetType: isBiz ? 'BUSINESS' : 'USER',
          targetName: isBiz
            ? primaryBiz.businessName
            : `${offer.user.profile?.firstName || ''} ${offer.user.profile?.lastName || ''}`.trim() || 'Lip Talk Member',
          targetAvatar: isBiz ? primaryBiz.logoUrl : offer.user.profile?.avatarUrl,
          targetHeadline: isBiz ? primaryBiz.description : offer.user.profile?.headline,
          targetCity: offer.city || 'Bangalore',
          targetRole: offer.user.role,
          matchedNeedTitle: need.title,
          matchedOfferTitle: offer.title,
          matchScore: finalScore,
          matchScorePercent: `${finalScore}%`,
          primaryReason: `Offers verified service matching your need: ${need.title}`,
          reasons: breakdown,
          isReciprocal,
          reciprocalDetail,
        });
      }
    }

    return matches.sort((a, b) => b.matchScore - a.matchScore);
  }
}
