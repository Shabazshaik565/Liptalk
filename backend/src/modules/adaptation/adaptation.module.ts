import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Entities
import { ImprovementProposal } from '../../database/entities/improvement-proposal.entity';
import { PlatformExperiment } from '../../database/entities/platform-experiment.entity';
import { AdaptiveUxProfile } from '../../database/entities/adaptive-ux-profile.entity';
import { AiPlan } from '../../database/entities/ai-plan.entity';
import { AiPlanExecution } from '../../database/entities/ai-plan-execution.entity';
import { AgentVersion } from '../../database/entities/agent-version.entity';
import { MemoryConflict } from '../../database/entities/memory-conflict.entity';
import { SecurityThreatEvent } from '../../database/entities/security-threat-event.entity';
import { PlatformHealthSnapshot } from '../../database/entities/platform-health-snapshot.entity';
import { FeedbackCluster } from '../../database/entities/feedback-cluster.entity';

// Modules
import { AuthModule } from '../auth/auth.module';
import { AiModule } from '../ai/ai.module';

// Services and Controller
import { ContinuousImprovementService } from './continuous-improvement.service';
import { ExperimentationService } from './experimentation.service';
import { AdaptiveUxService } from './adaptive-ux.service';
import { AiPlanningService } from './ai-planning.service';
import { AgentGovernanceService } from './agent-governance.service';
import { ContinuousSecurityService } from './continuous-security.service';
import { ResilienceDiagnosticsService } from './resilience-diagnostics.service';
import { FeedbackRoadmapService } from './feedback-roadmap.service';
import { AdaptationService } from './adaptation.service';
import { AdaptationController } from './adaptation.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ImprovementProposal,
      PlatformExperiment,
      AdaptiveUxProfile,
      AiPlan,
      AiPlanExecution,
      AgentVersion,
      MemoryConflict,
      SecurityThreatEvent,
      PlatformHealthSnapshot,
      FeedbackCluster,
    ]),
    AuthModule,
    AiModule,
  ],
  controllers: [AdaptationController],
  providers: [
    ContinuousImprovementService,
    ExperimentationService,
    AdaptiveUxService,
    AiPlanningService,
    AgentGovernanceService,
    ContinuousSecurityService,
    ResilienceDiagnosticsService,
    FeedbackRoadmapService,
    AdaptationService,
  ],
  exports: [
    AdaptationService,
    ContinuousImprovementService,
    ExperimentationService,
    AdaptiveUxService,
    AiPlanningService,
    AgentGovernanceService,
    ContinuousSecurityService,
    ResilienceDiagnosticsService,
    FeedbackRoadmapService,
  ],
})
export class AdaptationModule {}
