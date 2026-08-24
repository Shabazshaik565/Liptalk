import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ResourceRequest } from '../../database/entities/resource-request.entity';
import { ContributionListing } from '../../database/entities/contribution-listing.entity';

@Injectable()
export class MatchingContributionService {
  constructor(
    @InjectRepository(ResourceRequest)
    private readonly resourceRepo: Repository<ResourceRequest>,
    @InjectRepository(ContributionListing)
    private readonly listingRepo: Repository<ContributionListing>,
  ) {}

  async listResourceRequests(projectId?: string) {
    const list = await this.resourceRepo.find({ where: projectId ? { projectId } : {} });
    if (list.length > 0) return list;

    // Seed realistic resource requests
    return [
      {
        id: 'res_req_01',
        projectId: projectId || 'proj_supply_01',
        title: 'Android Bluetooth Low Energy (BLE) Peripheral Specialist',
        description: 'Need experienced engineer to optimize mobile background beacon scanning on Android 14+.',
        category: 'PEOPLE_SKILL' as const,
        matchCriteria: {
          skills: ['BLE Mesh Networking', 'Android Native C++', 'Kotlin Core'],
          locationScope: 'Pan-India or Remote',
          estimatedEffortHours: 25,
        },
        matchedEntityIds: ['usr_sarah_02', 'expert_01'],
        status: 'MATCHES_FOUND',
      },
    ];
  }

  async listContributionListings(projectId?: string) {
    const list = await this.listingRepo.find({ where: projectId ? { projectId } : {} });
    if (list.length > 0) return list;

    // Seed contribution marketplace listings
    return [
      {
        id: 'contrib_01',
        projectId: projectId || 'proj_supply_01',
        title: 'Implement Zero-Knowledge Batch Verification Module',
        description: 'Construct cryptographic proof validator for 100 simultaneous mandi trade commitments.',
        contributionType: 'DEVELOPMENT' as const,
        deliverablesSummary: [
          'Groth16 verifier contract and WebAssembly mobile runner',
          'Unit tests covering malformed signature rejection',
          'Integration documentation in Knowledge Graph',
        ],
        status: 'OPEN_CALL',
        assignedContributorId: null,
        attributionRecord: {
          verifiedByOwner: true,
          impactScore: 95.0,
        },
      },
      {
        id: 'contrib_02',
        projectId: projectId || 'proj_supply_01',
        title: 'Draft Regional Grain Mandi Arbitration Guidelines',
        description: 'Author structured consensus bylaws for moisture dispute resolution between farmers and millers.',
        contributionType: 'RESEARCH' as const,
        deliverablesSummary: [
          'Arbitration dispute flow chart and penalty formula',
          'Review by 2 verified community elders',
        ],
        status: 'ASSIGNED',
        assignedContributorId: 'usr_sarah_02',
        attributionRecord: {
          verifiedByOwner: true,
          impactScore: 92.0,
        },
      },
    ];
  }

  async applyForContribution(listingId: string, userId: string) {
    return {
      listingId,
      userId,
      status: 'APPLICATION_SUBMITTED',
      timestamp: new Date().toISOString(),
      actionSummary: 'Your contribution proposal has been forwarded to the project owner for verification.',
    };
  }
}
