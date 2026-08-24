import { Injectable } from '@nestjs/common';
import { ContinuousImprovementService } from './continuous-improvement.service';
import { ExperimentationService } from './experimentation.service';
import { AdaptiveUxService } from './adaptive-ux.service';
import { AiPlanningService } from './ai-planning.service';
import { AgentGovernanceService } from './agent-governance.service';
import { ContinuousSecurityService } from './continuous-security.service';
import { ResilienceDiagnosticsService } from './resilience-diagnostics.service';
import { FeedbackRoadmapService } from './feedback-roadmap.service';

@Injectable()
export class AdaptationService {
  constructor(
    public readonly improvement: ContinuousImprovementService,
    public readonly experiments: ExperimentationService,
    public readonly ux: AdaptiveUxService,
    public readonly planning: AiPlanningService,
    public readonly governance: AgentGovernanceService,
    public readonly security: ContinuousSecurityService,
    public readonly resilience: ResilienceDiagnosticsService,
    public readonly feedback: FeedbackRoadmapService,
  ) {}

  async getAdaptiveHubDashboard(userId: string) {
    const [proposals, experiments, uxProfile, health, feedbackClusters] = await Promise.all([
      this.improvement.listProposals(),
      this.experiments.listExperiments(),
      this.ux.getUxProfile(userId),
      this.resilience.getPlatformHealthModel(),
      this.feedback.listFeedbackClusters(),
    ]);

    return {
      userId,
      platformStatus: 'CONTINUOUSLY_ADAPTING',
      activeUxProfile: uxProfile.activeProfile,
      activeExperimentsCount: experiments.length,
      improvementProposalsCount: proposals.length,
      platformHealthScore: health.dimensions.availability.score,
      topFeedbackClusters: feedbackClusters,
      aiSafetyGovernance: 'ENFORCED_WITH_HUMAN_OVERSIGHT',
      disclaimer: 'AI is strictly prohibited from modifying its own permissions or safety boundaries.',
    };
  }
}
