import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  Membership,
  MembershipTier,
  MembershipStatus,
} from '../../database/entities/membership.entity';
import { User } from '../../database/entities/user.entity';

export interface Entitlements {
  canCreateCommunity: boolean;
  canCreateListing: boolean;
  canPromoteListing: boolean;
  canViewAdvancedAnalytics: boolean;
  maxActiveDemands: number;
  featuredBadge: boolean;
  directLeadExport: boolean;
}

@Injectable()
export class MembershipsService {
  constructor(
    @InjectRepository(Membership)
    private readonly membershipRepo: Repository<Membership>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async getUserMembership(userId: string) {
    let membership = await this.membershipRepo.findOne({
      where: { user: { id: userId } },
      relations: ['user'],
    });

    if (!membership) {
      const user = await this.userRepo.findOne({ where: { id: userId } });
      if (user) {
        membership = await this.membershipRepo.save(
          this.membershipRepo.create({
            user,
            tier: MembershipTier.FREE,
            status: MembershipStatus.ACTIVE,
          }),
        );
      }
    }

    const tier = membership?.tier || MembershipTier.FREE;
    const entitlements = this.getEntitlementsForTier(tier);

    return {
      tier,
      status: membership?.status || MembershipStatus.ACTIVE,
      expiresAt: membership?.expiresAt || null,
      entitlements,
    };
  }

  getEntitlementsForTier(tier: MembershipTier): Entitlements {
    switch (tier) {
      case MembershipTier.BUSINESS:
        return {
          canCreateCommunity: true,
          canCreateListing: true,
          canPromoteListing: true,
          canViewAdvancedAnalytics: true,
          maxActiveDemands: 50,
          featuredBadge: true,
          directLeadExport: true,
        };
      case MembershipTier.PRO:
        return {
          canCreateCommunity: true,
          canCreateListing: true,
          canPromoteListing: false,
          canViewAdvancedAnalytics: true,
          maxActiveDemands: 15,
          featuredBadge: false,
          directLeadExport: false,
        };
      case MembershipTier.FREE:
      default:
        return {
          canCreateCommunity: true,
          canCreateListing: true,
          canPromoteListing: false,
          canViewAdvancedAnalytics: false,
          maxActiveDemands: 5,
          featuredBadge: false,
          directLeadExport: false,
        };
    }
  }

  async getAvailablePlans() {
    return [
      {
        id: 'tier_free',
        name: 'Starter Networker',
        tier: MembershipTier.FREE,
        pricePerMonth: 0,
        currency: 'INR',
        badge: 'Free Forever',
        features: [
          'Full Synergy Matching Engine',
          'Post up to 5 Business Demands',
          'Join Unlimited Ecosystem Guilds',
          'Contextual 1:1 Inquiries & Chat',
          'Basic CRM Lead Pipeline',
        ],
      },
      {
        id: 'tier_pro',
        name: 'Executive Pro',
        tier: MembershipTier.PRO,
        pricePerMonth: 1499,
        currency: 'INR',
        badge: 'Most Popular',
        features: [
          'Everything in Starter',
          'Post up to 15 Business Demands',
          'Priority Matching Algorithm (2x Boost)',
          'Advanced Deal Conversion Analytics',
          'Create & Host Verified Guilds',
          'Custom Service Listing Badges',
        ],
      },
      {
        id: 'tier_business',
        name: 'Enterprise Scale',
        tier: MembershipTier.BUSINESS,
        pricePerMonth: 4999,
        currency: 'INR',
        badge: 'Scale Tier',
        features: [
          'Everything in Executive Pro',
          'Post up to 50 Demands & Contracts',
          'Promoted Marketplace Listings (Featured)',
          'Full CRM Lead Export to CSV/ERP',
          'Dedicated Ecosystem Relationship Advisor',
          'Exclusive Corporate Partner Perks',
        ],
      },
    ];
  }
}
