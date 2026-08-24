import { Injectable } from '@nestjs/common';
import { GraphFabricService } from './graph-fabric.service';
import { DigitalTwinService } from './digital-twin.service';
import { SimulationService } from './simulation.service';
import { PredictiveService } from './predictive.service';
import { RecommendationService } from './recommendation.service';
import { SkillsExpertsService } from './skills-experts.service';
import { AiOptimizationService } from './ai-optimization.service';
import { WeeklyIntelligenceService } from './weekly-intelligence.service';

@Injectable()
export class IntelligenceService {
  constructor(
    public readonly graph: GraphFabricService,
    public readonly twin: DigitalTwinService,
    public readonly simulation: SimulationService,
    public readonly predictive: PredictiveService,
    public readonly recommendation: RecommendationService,
    public readonly skills: SkillsExpertsService,
    public readonly aiOpt: AiOptimizationService,
    public readonly weekly: WeeklyIntelligenceService,
  ) {}

  async getIntelligenceFabricDashboard(userId: string) {
    const graphData = await this.graph.getGraphOverview(userId);
    const predictions = await this.predictive.listPredictions();
    const recommendations = await this.recommendation.getExplainableRecommendations(userId);
    const weeklyBrief = await this.weekly.getPersonalWeeklyBrief(userId);

    return {
      userId,
      fabricStatus: 'ONLINE_AND_HARMONIZED',
      crossDomainEntitiesCount: graphData.totalEntitiesCount,
      crossDomainEdgesCount: graphData.totalRelationshipsCount,
      activeForecasts: predictions,
      topRecommendations: recommendations,
      personalWeeklyBrief: weeklyBrief,
      disclaimer: 'All simulations and predictions are probabilistic estimates under strict human governance.',
    };
  }
}
