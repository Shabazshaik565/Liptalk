import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdaptationService } from './adaptation.service';

@Controller('adaptation')
@UseGuards(JwtAuthGuard)
export class AdaptationController {
  constructor(private readonly adaptationService: AdaptationService) {}

  @Get('dashboard')
  async getDashboard(@Request() req: any) {
    const userId = req.user?.id || 'usr_curr_01';
    return this.adaptationService.getAdaptiveHubDashboard(userId);
  }

  // 1. Continuous Improvement Proposals
  @Get('improvements')
  async listImprovements(@Query('status') status?: any) {
    return this.adaptationService.improvement.listProposals(status);
  }

  @Post('improvements')
  async createImprovement(@Body() body: any) {
    return this.adaptationService.improvement.createProposal(body);
  }

  @Patch('improvements/:id/status')
  async updateImprovementStatus(@Param('id') id: string, @Body() body: { status: any }) {
    return this.adaptationService.improvement.updateProposalStatus(id, body.status);
  }

  // 2. Controlled Experiments & Feature Flags
  @Get('experiments')
  async listExperiments(@Query('status') status?: any) {
    return this.adaptationService.experiments.listExperiments(status);
  }

  @Post('experiments')
  async createExperiment(@Body() body: any) {
    return this.adaptationService.experiments.createExperiment(body);
  }

  @Patch('experiments/:id/status')
  async toggleExperiment(@Param('id') id: string, @Body() body: { status: any }) {
    return this.adaptationService.experiments.toggleExperimentStatus(id, body.status);
  }

  @Get('feature-flags')
  async getFeatureFlags() {
    return this.adaptationService.experiments.getFeatureFlags();
  }

  @Patch('feature-flags/:key')
  async updateFeatureFlag(
    @Param('key') key: string,
    @Body() body: { enabled: boolean; rolloutPercent: number },
  ) {
    return this.adaptationService.experiments.updateFeatureFlag(key, body.enabled, body.rolloutPercent);
  }

  // 3. Adaptive UX & Attention Management
  @Get('ux/profile')
  async getUxProfile(@Request() req: any) {
    const userId = req.user?.id || 'usr_curr_01';
    return this.adaptationService.ux.getUxProfile(userId);
  }

  @Patch('ux/profile')
  async updateUxProfile(@Request() req: any, @Body() body: any) {
    const userId = req.user?.id || 'usr_curr_01';
    return this.adaptationService.ux.updateUxProfile(userId, body);
  }

  @Post('ux/focus-mode')
  async toggleFocusMode(@Request() req: any, @Body() body: { active: boolean }) {
    const userId = req.user?.id || 'usr_curr_01';
    return this.adaptationService.ux.toggleFocusMode(userId, body.active);
  }

  // 4. AI Planning & Execution Monitor
  @Get('ai/plans')
  async listPlans(@Request() req: any) {
    const userId = req.user?.id || 'usr_curr_01';
    return this.adaptationService.planning.listPlans(userId);
  }

  @Post('ai/plans/generate')
  async generatePlan(@Request() req: any, @Body() body: { goalPrompt: string }) {
    const userId = req.user?.id || 'usr_curr_01';
    return this.adaptationService.planning.generatePlan(userId, body.goalPrompt);
  }

  @Post('ai/plans/:id/steps/:index/execute')
  async executePlanStep(
    @Param('id') id: string,
    @Param('index') index: string,
  ) {
    return this.adaptationService.planning.executePlanStep(id, parseInt(index, 10));
  }

  @Post('ai/plans/:id/cancel')
  async cancelPlan(@Param('id') id: string) {
    return this.adaptationService.planning.cancelPlan(id);
  }

  // 5. Agent Governance & Memory Conflicts
  @Get('agents/versions')
  async listAgentVersions(@Query('agentId') agentId?: string) {
    return this.adaptationService.governance.listAgentVersions(agentId);
  }

  @Get('memory/conflicts')
  async listMemoryConflicts(@Request() req: any) {
    const userId = req.user?.id || 'usr_curr_01';
    return this.adaptationService.governance.listMemoryConflicts(userId);
  }

  @Post('memory/conflicts/:id/resolve')
  async resolveMemoryConflict(
    @Param('id') id: string,
    @Body() body: { resolutionValue: string },
  ) {
    return this.adaptationService.governance.resolveMemoryConflict(id, body.resolutionValue);
  }

  // 6. Security & Privacy Simulator
  @Get('security/threats')
  async listThreats() {
    return this.adaptationService.security.listThreatEvents();
  }

  @Post('privacy/simulate')
  async simulatePrivacy(@Body() body: { targetApp: string; requestedScopes: string[] }) {
    return this.adaptationService.security.simulatePrivacyImpact(body.targetApp, body.requestedScopes);
  }

  @Get('privacy/lifecycle-rules')
  async getLifecycleRules() {
    return this.adaptationService.security.getDataLifecycleRules();
  }

  // 7. Platform Diagnostics & Chaos Testing
  @Get('health/model')
  async getHealthModel() {
    return this.adaptationService.resilience.getPlatformHealthModel();
  }

  @Post('health/chaos-test')
  async runChaosTest(@Body() body: { targetComponent: string }) {
    return this.adaptationService.resilience.runControlledChaosTest(body.targetComponent || 'QueueWorker');
  }

  @Get('capacity/forecast')
  async getCapacityForecast() {
    return this.adaptationService.resilience.getCapacityAndCostForecast();
  }

  // 8. Feedback & Roadmap Intelligence
  @Get('feedback/clusters')
  async listFeedbackClusters() {
    return this.adaptationService.feedback.listFeedbackClusters();
  }

  @Post('feedback')
  async submitFeedback(@Request() req: any, @Body() body: any) {
    const userId = req.user?.id || 'usr_curr_01';
    return this.adaptationService.feedback.recordUserFeedback({ userId, ...body });
  }
}
