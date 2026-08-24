import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Entities
import { Idea } from '../../database/entities/idea.entity';
import { HumanAiTeam } from '../../database/entities/human-ai-team.entity';
import { CollaborationRoom } from '../../database/entities/collaboration-room.entity';
import { ResourceRequest } from '../../database/entities/resource-request.entity';
import { ContributionListing } from '../../database/entities/contribution-listing.entity';
import { AgentCertification } from '../../database/entities/agent-certification.entity';
import { HumanApprovalRequest } from '../../database/entities/human-approval-request.entity';

// Modules
import { AuthModule } from '../auth/auth.module';
import { AiModule } from '../ai/ai.module';

// Services and Controller
import { IdeaPipelineService } from './idea-pipeline.service';
import { HumanAiTeamService } from './human-ai-team.service';
import { CollaborationRoomService } from './collaboration-room.service';
import { MatchingContributionService } from './matching-contribution.service';
import { AgentCertificationService } from './agent-certification.service';
import { GovernanceApprovalService } from './governance-approval.service';
import { CreationService } from './creation.service';
import { CreationController } from './creation.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Idea,
      HumanAiTeam,
      CollaborationRoom,
      ResourceRequest,
      ContributionListing,
      AgentCertification,
      HumanApprovalRequest,
    ]),
    AuthModule,
    AiModule,
  ],
  controllers: [CreationController],
  providers: [
    IdeaPipelineService,
    HumanAiTeamService,
    CollaborationRoomService,
    MatchingContributionService,
    AgentCertificationService,
    GovernanceApprovalService,
    CreationService,
  ],
  exports: [
    CreationService,
    IdeaPipelineService,
    HumanAiTeamService,
    CollaborationRoomService,
    MatchingContributionService,
    AgentCertificationService,
    GovernanceApprovalService,
  ],
})
export class CreationModule {}
