import { Injectable } from '@nestjs/common';
import { IdeaPipelineService } from './idea-pipeline.service';
import { HumanAiTeamService } from './human-ai-team.service';
import { CollaborationRoomService } from './collaboration-room.service';
import { MatchingContributionService } from './matching-contribution.service';
import { AgentCertificationService } from './agent-certification.service';
import { GovernanceApprovalService } from './governance-approval.service';

@Injectable()
export class CreationService {
  constructor(
    public readonly ideas: IdeaPipelineService,
    public readonly teams: HumanAiTeamService,
    public readonly rooms: CollaborationRoomService,
    public readonly matching: MatchingContributionService,
    public readonly agents: AgentCertificationService,
    public readonly governance: GovernanceApprovalService,
  ) {}

  async getEcosystemCreationDashboard(userId: string) {
    const [ideasList, teamsList, contribsList, approvalsList] = await Promise.all([
      this.ideas.listIdeas(),
      this.teams.listTeams(),
      this.matching.listContributionListings(),
      this.governance.listApprovalRequests(),
    ]);

    return {
      userId,
      platformCreationStage: 'COLLECTIVE_CREATION_ACTIVE',
      discoverableIdeasCount: ideasList.length,
      activeHumanAiTeamsCount: teamsList.length,
      openContributionListingsCount: contribsList.length,
      pendingHumanApprovalsCount: approvalsList.filter((a) => a.status === 'PENDING').length,
      governanceStatus: 'HUMAN_AUTHORIZED_EXECUTION',
      pipelineHeadline: 'IDEA → PEOPLE → KNOWLEDGE → PLAN → TEAM → EXECUTION → IMPACT',
      disclaimer: 'AI agents amplify human capability and execute sandboxed tasks. Consequential financial, publishing, and security operations require human authorization.',
    };
  }
}
