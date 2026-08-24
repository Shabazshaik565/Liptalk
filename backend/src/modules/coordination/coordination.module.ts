import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Entities
import { GlobalGoal } from '../../database/entities/global-goal.entity';
import { GoalMilestone } from '../../database/entities/goal-milestone.entity';
import { GoalParticipant } from '../../database/entities/goal-participant.entity';
import { GlobalInitiative } from '../../database/entities/global-initiative.entity';
import { InitiativeParticipant } from '../../database/entities/initiative-participant.entity';
import { SharedWorkspace } from '../../database/entities/shared-workspace.entity';
import { ProjectContribution } from '../../database/entities/project-contribution.entity';
import { GovernanceProposal } from '../../database/entities/governance-proposal.entity';
import { ProposalVote } from '../../database/entities/proposal-vote.entity';
import { DecisionRecord } from '../../database/entities/decision-record.entity';
import { KnowledgeVersion } from '../../database/entities/knowledge-version.entity';
import { KnowledgeConflict } from '../../database/entities/knowledge-conflict.entity';
import { ResearchProject } from '../../database/entities/research-project.entity';
import { AgentTeam } from '../../database/entities/agent-team.entity';
import { AgentTeamExecution } from '../../database/entities/agent-team-execution.entity';
import { AgentIncident } from '../../database/entities/agent-incident.entity';
import { CreatorCollective } from '../../database/entities/creator-collective.entity';
import { CollaborativeShoppingList } from '../../database/entities/collaborative-shopping-list.entity';
import { IdentityContext } from '../../database/entities/identity-context.entity';
import { DataAccessLog } from '../../database/entities/data-access-log.entity';
import { IncidentRecord } from '../../database/entities/incident-record.entity';
import { MultimodalAsset } from '../../database/entities/multimodal-asset.entity';
import { VoiceSession } from '../../database/entities/voice-session.entity';
import { KnowledgeCollection } from '../../database/entities/knowledge-collection.entity';
import { AiUserMemory } from '../../database/entities/ai-user-memory.entity';

// Modules
import { AiModule } from '../ai/ai.module';
import { AuthModule } from '../auth/auth.module';

// Services and Controller
import { GoalsService } from './goals.service';
import { GovernanceService } from './governance.service';
import { KnowledgeNetworkService } from './knowledge-network.service';
import { AgentTeamsService } from './agent-teams.service';
import { MultimodalVoiceService } from './multimodal-voice.service';
import { PrivacyVaultService } from './privacy-vault.service';
import { IncidentOperationsService } from './incident-operations.service';
import { CoordinationService } from './coordination.service';
import { CoordinationController } from './coordination.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      GlobalGoal,
      GoalMilestone,
      GoalParticipant,
      GlobalInitiative,
      InitiativeParticipant,
      SharedWorkspace,
      ProjectContribution,
      GovernanceProposal,
      ProposalVote,
      DecisionRecord,
      KnowledgeVersion,
      KnowledgeConflict,
      ResearchProject,
      AgentTeam,
      AgentTeamExecution,
      AgentIncident,
      CreatorCollective,
      CollaborativeShoppingList,
      IdentityContext,
      DataAccessLog,
      IncidentRecord,
      MultimodalAsset,
      VoiceSession,
      KnowledgeCollection,
      AiUserMemory,
    ]),
    AiModule,
    AuthModule,
  ],
  controllers: [CoordinationController],
  providers: [
    GoalsService,
    GovernanceService,
    KnowledgeNetworkService,
    AgentTeamsService,
    MultimodalVoiceService,
    PrivacyVaultService,
    IncidentOperationsService,
    CoordinationService,
  ],
  exports: [
    CoordinationService,
    GoalsService,
    GovernanceService,
    KnowledgeNetworkService,
    AgentTeamsService,
    MultimodalVoiceService,
    PrivacyVaultService,
    IncidentOperationsService,
  ],
})
export class CoordinationModule {}
