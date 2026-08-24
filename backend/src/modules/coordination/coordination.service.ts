import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SharedWorkspace } from '../../database/entities/shared-workspace.entity';
import { ProjectContribution } from '../../database/entities/project-contribution.entity';
import { CreatorCollective } from '../../database/entities/creator-collective.entity';
import { CollaborativeShoppingList } from '../../database/entities/collaborative-shopping-list.entity';
import { GoalsService } from './goals.service';
import { GovernanceService } from './governance.service';
import { KnowledgeNetworkService } from './knowledge-network.service';
import { AgentTeamsService } from './agent-teams.service';
import { MultimodalVoiceService } from './multimodal-voice.service';
import { PrivacyVaultService } from './privacy-vault.service';
import { IncidentOperationsService } from './incident-operations.service';

@Injectable()
export class CoordinationService {
  private readonly logger = new Logger(CoordinationService.name);

  constructor(
    @InjectRepository(SharedWorkspace)
    private readonly workspaceRepo: Repository<SharedWorkspace>,
    @InjectRepository(ProjectContribution)
    private readonly contribRepo: Repository<ProjectContribution>,
    @InjectRepository(CreatorCollective)
    private readonly collectiveRepo: Repository<CreatorCollective>,
    @InjectRepository(CollaborativeShoppingList)
    private readonly shoppingRepo: Repository<CollaborativeShoppingList>,
    public readonly goals: GoalsService,
    public readonly governance: GovernanceService,
    public readonly knowledgeNetwork: KnowledgeNetworkService,
    public readonly agentTeams: AgentTeamsService,
    public readonly multimodalVoice: MultimodalVoiceService,
    public readonly privacyVault: PrivacyVaultService,
    public readonly incidentOps: IncidentOperationsService,
  ) {}

  /**
   * Shared Collaborative Workspaces
   */
  async getWorkspaces(userId?: string): Promise<SharedWorkspace[]> {
    let list = await this.workspaceRepo.find({ order: { createdAt: 'DESC' } });
    if (list.length === 0) {
      const seedWs = this.workspaceRepo.create({
        creatorId: userId || 'usr_curr_01',
        name: 'Pan-India FMCG & Kirana Logistics Alliance',
        description: 'Cross-community workspace coordinating grain millers, warehouse managers, and Kirana merchants across 4 state federations.',
        type: 'CROSS_COMMUNITY',
        participatingCommunityIds: ['comm_kirana_01', 'comm_logistics_south', 'comm_mandi_north'],
        members: [
          { userId: userId || 'usr_curr_01', role: 'ADMIN', joinedAt: '2026-08-01T10:00:00Z' },
          { userId: 'usr_sarah_02', role: 'MEMBER', joinedAt: '2026-08-05T12:00:00Z' },
        ],
        linkedProjectIds: ['proj_supply_01'],
        linkedKnowledgeIds: ['know_escrow_01'],
        assignedAgentTeamIds: ['ag_team_001'],
        isActive: true,
      });
      list = [await this.workspaceRepo.save(seedWs)];
    }
    return list;
  }

  async createWorkspace(creatorId: string, data: Partial<SharedWorkspace>): Promise<SharedWorkspace> {
    const ws = this.workspaceRepo.create({
      ...data,
      creatorId,
      members: [{ userId: creatorId, role: 'ADMIN', joinedAt: new Date().toISOString() }],
    });
    return this.workspaceRepo.save(ws);
  }

  /**
   * Attributed Project Contributions
   */
  async getProjectContributions(projectId: string): Promise<ProjectContribution[]> {
    let contribs = await this.contribRepo.find({ where: { projectId }, order: { createdAt: 'DESC' } });
    if (contribs.length === 0) {
      const seedContrib = this.contribRepo.create({
        projectId,
        contributorId: 'usr_curr_01',
        title: 'Zero-Knowledge Offline Batch Escrow Protocol Implementation',
        description: 'Implemented cryptographic signature and batching logic for disconnected offline transactions.',
        category: 'CODE',
        versionNumber: 2,
        payloadUrlOrContent: 'https://github.com/liptalk/fmcg-escrow/pull/42',
        isAiAssisted: true,
        aiAssistedDetails: 'AI assisted in generating unit tests and cryptographic bounds validation.',
        status: 'VERIFIED',
        verifiedBy: 'usr_sarah_02',
        verifiedAt: new Date().toISOString(),
      });
      contribs = [await this.contribRepo.save(seedContrib)];
    }
    return contribs;
  }

  async submitContribution(projectId: string, contributorId: string, data: Partial<ProjectContribution>): Promise<ProjectContribution> {
    const contrib = this.contribRepo.create({
      ...data,
      projectId,
      contributorId,
      status: 'SUBMITTED',
    });
    return this.contribRepo.save(contrib);
  }

  async verifyContribution(contributionId: string, verifiedBy: string): Promise<ProjectContribution> {
    const contrib = await this.contribRepo.findOne({ where: { id: contributionId } });
    if (!contrib) throw new NotFoundException('Contribution not found');
    contrib.status = 'VERIFIED';
    contrib.verifiedBy = verifiedBy;
    contrib.verifiedAt = new Date().toISOString();
    return this.contribRepo.save(contrib);
  }

  /**
   * Creator Collectives
   */
  async getCreatorCollectives(): Promise<CreatorCollective[]> {
    let collectives = await this.collectiveRepo.find({ order: { totalCollectiveEarnings: 'DESC' } });
    if (collectives.length === 0) {
      const seedCol = this.collectiveRepo.create({
        founderId: 'usr_curr_01',
        name: 'Frontier Architecture & Systems Guild',
        description: 'Collective of senior engineering creators delivering high-tier system teardowns, masterclasses, and enterprise advisory.',
        category: 'ENGINEERING_ALLIANCE',
        members: [
          { creatorId: 'usr_curr_01', role: 'FOUNDER', revenueSplitPercentage: 50, joinedAt: '2026-07-01' },
          { creatorId: 'usr_sarah_02', role: 'CORE_CREATOR', revenueSplitPercentage: 50, joinedAt: '2026-07-15' },
        ],
        sharedSubscriptionPrice: 7999,
        currency: 'INR',
        jointOfferings: ['Enterprise Mobile & Cloud Architecture Review', 'B2B Sourcing Masterclass'],
        totalCollectiveEarnings: 450000,
      });
      collectives = [await this.collectiveRepo.save(seedCol)];
    }
    return collectives;
  }

  /**
   * Collaborative Shopping & Procurement Lists
   */
  async getShoppingLists(userId: string): Promise<CollaborativeShoppingList[]> {
    let lists = await this.shoppingRepo.find({ order: { createdAt: 'DESC' } });
    if (lists.length === 0) {
      const seedList = this.shoppingRepo.create({
        ownerId: userId,
        title: 'Regional Mill Pilot Testing Hardware & Beacons',
        description: 'Collaborative purchase list for BLE edge beacons and barcode scanners for the first 10 pilot hubs.',
        items: [
          {
            id: 'item_1',
            name: 'Industrial BLE 5.3 Sensor Beacons (Pack of 20)',
            estimatedPrice: 32000,
            currency: 'INR',
            vendorName: 'BeaconTech India',
            votes: 5,
            addedBy: userId,
            status: 'APPROVED',
          },
          {
            id: 'item_2',
            name: 'Rugged Handheld QR/NFC Scanner Terminal',
            estimatedPrice: 18500,
            currency: 'INR',
            vendorName: 'ScanPro Hardware',
            votes: 4,
            addedBy: 'usr_sarah_02',
            status: 'PROPOSED',
          },
        ],
        collaboratorUserIds: [userId, 'usr_sarah_02'],
        totalEstimatedAmount: 50500,
      });
      lists = [await this.shoppingRepo.save(seedList)];
    }
    return lists;
  }
}
