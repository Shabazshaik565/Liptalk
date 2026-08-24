import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { IntelligenceService } from './intelligence.service';

@Controller('intelligence')
@UseGuards(JwtAuthGuard)
export class IntelligenceController {
  constructor(private readonly intelService: IntelligenceService) {}

  @Get('dashboard')
  async getDashboard(@Request() req: any) {
    const userId = req.user?.id || 'usr_curr_01';
    return this.intelService.getIntelligenceFabricDashboard(userId);
  }

  // 14.1 - 14.4 Graph Fabric
  @Get('graph')
  async getGraph(@Query('entityId') entityId?: string) {
    return this.intelService.graph.getGraphOverview(entityId);
  }

  @Post('graph/traverse')
  async traverseGraph(@Body() body: { sourceEntityId: string; question: string }) {
    return this.intelService.graph.traverseGraphContext(body.sourceEntityId, body.question);
  }

  // 14.5 - 14.10 Digital Twins
  @Get('digital-twins')
  async getDigitalTwins(@Request() req: any) {
    const userId = req.user?.id || 'usr_curr_01';
    return this.intelService.twin.getDigitalTwinsForUser(userId);
  }

  @Patch('digital-twins/:id')
  async updateDigitalTwin(@Param('id') id: string, @Body() body: any) {
    return this.intelService.twin.updateDigitalTwin(id, body);
  }

  @Post('digital-twins/:id/reset')
  async resetDigitalTwin(@Param('id') id: string, @Body() body: { action: 'RESET' | 'DELETE' }) {
    return this.intelService.twin.resetOrDeleteDigitalTwin(id, body.action);
  }

  // 14.11 - 14.14 Simulations
  @Get('simulations')
  async listSimulations(@Request() req: any) {
    const userId = req.user?.id || 'usr_curr_01';
    return this.intelService.simulation.listScenarios(userId);
  }

  @Post('simulations/run')
  async runSimulation(@Body() body: any) {
    return this.intelService.simulation.runSimulation(body);
  }

  @Post('simulations/compare')
  async compareSimulations(@Body() body: { scenarioIds: string[] }) {
    return this.intelService.simulation.compareScenarios(body.scenarioIds);
  }

  // 14.15 - 14.17 Predictions
  @Get('predictions')
  async listPredictions(@Query('domain') domain?: any) {
    return this.intelService.predictive.listPredictions(domain);
  }

  // 14.18 - 14.20 Recommendations
  @Get('recommendations')
  async getRecommendations(@Request() req: any) {
    const userId = req.user?.id || 'usr_curr_01';
    return this.intelService.recommendation.getExplainableRecommendations(userId);
  }

  @Post('recommendations/:id/feedback')
  async recordRecommendationFeedback(@Param('id') id: string, @Body() body: { feedback: any }) {
    return this.intelService.recommendation.recordFeedback(id, body.feedback);
  }

  // 14.23 - 14.27 Skills & Experts
  @Get('skills')
  async getSkillGraph() {
    return this.intelService.skills.getSkillGraph();
  }

  @Get('skills/gaps')
  async analyzeSkillGaps(
    @Query('targetType') targetType: 'PROJECT' | 'OPPORTUNITY',
    @Query('targetId') targetId: string,
  ) {
    return this.intelService.skills.analyzeSkillGapsForTarget(targetType, targetId);
  }

  @Get('experts')
  async listExperts(@Query('domain') domain?: string) {
    return this.intelService.skills.listExpertProfiles(domain);
  }

  // 14.41 - 14.46 AI Optimization & Red Teaming
  @Get('ai/routing-strategy')
  async getModelRouting(@Query('taskType') taskType: string) {
    return this.intelService.aiOpt.getModelRoutingStrategy(taskType || 'general_summary');
  }

  @Post('ai/red-team')
  async runRedTeam(@Body() body: { modelIdentifier: string }) {
    return this.intelService.aiOpt.runRedTeamEvaluation(body.modelIdentifier || 'gemini-1.5-pro');
  }

  @Get('workflows/optimizations')
  async getWorkflowOptimizations() {
    return this.intelService.aiOpt.getWorkflowOptimizations();
  }

  // 14.66 - 14.67 Weekly Briefs
  @Get('briefings/personal')
  async getPersonalBrief(@Request() req: any) {
    const userId = req.user?.id || 'usr_curr_01';
    return this.intelService.weekly.getPersonalWeeklyBrief(userId);
  }

  @Get('briefings/collective/:communityId')
  async getCollectiveBrief(@Param('communityId') communityId: string) {
    return this.intelService.weekly.getCollectiveWeeklyBrief(communityId);
  }
}
