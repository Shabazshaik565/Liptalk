import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Entities
import { DigitalTwin } from '../../database/entities/digital-twin.entity';
import { SimulationScenario } from '../../database/entities/simulation-scenario.entity';
import { EcosystemPrediction } from '../../database/entities/ecosystem-prediction.entity';
import { RecommendationEvent } from '../../database/entities/recommendation-event.entity';
import { SkillNode } from '../../database/entities/skill-node.entity';
import { ExpertProfile } from '../../database/entities/expert-profile.entity';
import { WorkflowOptimization } from '../../database/entities/workflow-optimization.entity';
import { AiModelEvaluation } from '../../database/entities/ai-model-evaluation.entity';
import { IntelligenceRelationship } from '../../database/entities/intelligence-relationship.entity';

// Modules
import { AuthModule } from '../auth/auth.module';
import { AiModule } from '../ai/ai.module';

// Services and Controller
import { GraphFabricService } from './graph-fabric.service';
import { DigitalTwinService } from './digital-twin.service';
import { SimulationService } from './simulation.service';
import { PredictiveService } from './predictive.service';
import { RecommendationService } from './recommendation.service';
import { SkillsExpertsService } from './skills-experts.service';
import { AiOptimizationService } from './ai-optimization.service';
import { WeeklyIntelligenceService } from './weekly-intelligence.service';
import { IntelligenceService } from './intelligence.service';
import { IntelligenceController } from './intelligence.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DigitalTwin,
      SimulationScenario,
      EcosystemPrediction,
      RecommendationEvent,
      SkillNode,
      ExpertProfile,
      WorkflowOptimization,
      AiModelEvaluation,
      IntelligenceRelationship,
    ]),
    AuthModule,
    AiModule,
  ],
  controllers: [IntelligenceController],
  providers: [
    GraphFabricService,
    DigitalTwinService,
    SimulationService,
    PredictiveService,
    RecommendationService,
    SkillsExpertsService,
    AiOptimizationService,
    WeeklyIntelligenceService,
    IntelligenceService,
  ],
  exports: [
    IntelligenceService,
    GraphFabricService,
    DigitalTwinService,
    SimulationService,
    PredictiveService,
    RecommendationService,
    SkillsExpertsService,
    AiOptimizationService,
    WeeklyIntelligenceService,
  ],
})
export class IntelligenceModule {}
