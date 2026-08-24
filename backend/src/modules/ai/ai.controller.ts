import {
  Controller,
  Post,
  Body,
  Get,
  Patch,
  Delete,
  Param,
  Query,
  Request,
} from '@nestjs/common';
import { AiService } from './ai.service';
import { AiGatewayService } from './gateway/ai-gateway.service';
import { AiMemoryService } from './memory/ai-memory.service';
import { AiActionsService, PlanAiActionDto } from './actions/ai-actions.service';
import { GlobalTrendsService } from './trends/global-trends.service';
import { AgentPlatformService } from './agents/agent-platform.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AiUserPreference } from '../../database/entities/ai-user-preference.entity';
import { AiUsageLog } from '../../database/entities/ai-usage-log.entity';
import { AiFeedbackType } from '../../database/entities/ai-feedback.entity';

@Controller('ai')
export class AiController {
  constructor(
    private readonly aiService: AiService,
    private readonly gatewayService: AiGatewayService,
    private readonly memoryService: AiMemoryService,
    private readonly actionsService: AiActionsService,
    private readonly trendsService: GlobalTrendsService,
    private readonly agentPlatform: AgentPlatformService,
    @InjectRepository(AiUserPreference)
    private readonly userPrefRepo: Repository<AiUserPreference>,
    @InjectRepository(AiUsageLog)
    private readonly usageLogRepo: Repository<AiUsageLog>,
  ) {}

  @Get('config')
  async getConfig() {
    return {
      version: '10.0.0',
      activeGateway: 'LIPTALK_CENTRAL_AI_GATEWAY',
      supportedProviders: ['GEMINI', 'OPENAI', 'HEURISTIC'],
      supportedScopes: [
        'ai.read',
        'ai.search',
        'ai.recommend',
        'ai.summarize',
        'ai.translate',
        'ai.draft',
        'ai.save',
        'ai.message',
        'ai.publish',
        'ai.purchase',
      ],
      privacyLevels: ['STANDARD', 'MINIMAL', 'STRICT_ANONYMIZED'],
      memoryCategories: ['PREFERENCE', 'INTEREST', 'INTERACTION', 'SAVED_CONTEXT', 'EXPLICIT_MEMORY'],
      actionConfirmationTypes: ['PUBLISH', 'PURCHASE', 'DELETE', 'MESSAGE'],
      agentPlatformEnabled: true,
      developerPlatformEnabled: true,
    };
  }

  @Get('tools')
  async getTools() {
    return this.agentPlatform.getRegisteredTools();
  }

  @Get('agent/me')
  async getPersonalAgent(@Request() req: any) {
    const userId = req.user?.id || 'usr_curr_01';
    return this.agentPlatform.getOrCreatePersonalAgent(userId);
  }

  @Patch('agent/:id')
  async updateAgent(@Param('id') id: string, @Body() body: any, @Request() req: any) {
    const userId = req.user?.id || 'usr_curr_01';
    return this.agentPlatform.updateAgent(userId, id, body);
  }

  @Post('agent/:id/execute')
  async executeAgentTask(@Param('id') id: string, @Body() body: { prompt: string }, @Request() req: any) {
    const userId = req.user?.id || 'usr_curr_01';
    return this.agentPlatform.executeAgentTask(userId, id, body.prompt);
  }

  @Get('workflows')
  async getWorkflows(@Request() req: any) {
    const userId = req.user?.id || 'usr_curr_01';
    return this.agentPlatform.getUserWorkflows(userId);
  }

  @Post('workflows')
  async createWorkflow(@Body() body: any, @Request() req: any) {
    const userId = req.user?.id || 'usr_curr_01';
    return this.agentPlatform.createWorkflow(userId, body);
  }

  @Patch('workflows/:id/toggle')
  async toggleWorkflow(@Param('id') id: string, @Body() body: { isActive: boolean }, @Request() req: any) {
    const userId = req.user?.id || 'usr_curr_01';
    return this.agentPlatform.toggleWorkflow(userId, id, body.isActive);
  }

  @Get('knowledge')
  async getKnowledge(@Request() req: any) {
    const userId = req.user?.id || 'usr_curr_01';
    return this.agentPlatform.getKnowledgeCollections(userId);
  }

  @Post('knowledge')
  async createKnowledgeCollection(@Body() body: any, @Request() req: any) {
    const userId = req.user?.id || 'usr_curr_01';
    return this.agentPlatform.createKnowledgeCollection(userId, body);
  }

  @Post('knowledge/:id/items')
  async addKnowledgeItem(@Param('id') id: string, @Body() body: any, @Request() req: any) {
    const userId = req.user?.id || 'usr_curr_01';
    return this.agentPlatform.addItemToKnowledgeCollection(userId, id, body);
  }

  @Post('knowledge/synthesize')
  async synthesizeKnowledge(@Body() body: { query: string }, @Request() req: any) {
    const userId = req.user?.id || 'usr_curr_01';
    return this.agentPlatform.synthesizeKnowledge(userId, body.query);
  }

  @Post('feedback')
  async submitFeedback(
    @Body() body: { featureOrActionId: string; feedbackType: AiFeedbackType; comments?: string },
    @Request() req: any,
  ) {
    const userId = req.user?.id || 'usr_curr_01';
    return this.agentPlatform.submitFeedback(userId, body.featureOrActionId, body.feedbackType, body.comments);
  }

  @Get('trust')
  async getAiTrustCenter() {
    return {
      title: 'LipTalk AI Trust & Safety Governance Center',
      version: '10.0',
      principles: [
        {
          title: 'Human Authority & Control',
          description: 'High-impact actions (publishing, payments, deletions) strictly require explicit user approval.',
        },
        {
          title: 'Zero Credential Leakage',
          description: 'Bearer tokens, passwords, and sensitive credentials are automatically redacted before model transmission.',
        },
        {
          title: 'User-Governed Memory Vault',
          description: 'Users have full visibility to view, edit, or purge all learned AI context at any time.',
        },
        {
          title: 'Transparent Multi-Model Routing',
          description: 'Independent model failover ensures zero downtime while tracking token consumption and cost per request.',
        },
      ],
      safetyThresholds: {
        maxStepLimit: 5,
        maxDailyBudgetUsd: 10.0,
        rateLimitPerMinute: 60,
        emergencyKillSwitchActive: false,
      },
    };
  }

  @Get('preferences')
  async getPreferences(@Request() req: any) {
    const userId = req.user?.id || 'usr_curr_01';
    let pref = await this.userPrefRepo.findOne({ where: { userId } });
    if (!pref) {
      pref = this.userPrefRepo.create({
        userId,
        aiPersonalizationEnabled: true,
        aiMemoryEnabled: true,
        aiContentAssistanceEnabled: true,
        aiRecommendationsEnabled: true,
        aiTranslationEnabled: true,
        aiAutonomousReadEnabled: true,
        aiAutonomousWriteEnabled: false,
        aiHighImpactConfirmEnabled: true,
        dataClassificationLevel: 'STANDARD',
        allowedScopes: ['ai.read', 'ai.search', 'ai.recommend', 'ai.summarize', 'ai.translate', 'ai.draft'],
      });
      await this.userPrefRepo.save(pref);
    }
    return pref;
  }

  @Patch('preferences')
  async updatePreferences(@Body() body: Partial<AiUserPreference>, @Request() req: any) {
    const userId = req.user?.id || 'usr_curr_01';
    let pref = await this.userPrefRepo.findOne({ where: { userId } });
    if (!pref) {
      pref = this.userPrefRepo.create({ userId, ...body });
    } else {
      Object.assign(pref, body);
    }
    return this.userPrefRepo.save(pref);
  }

  @Get('memory')
  async getMemories(@Request() req: any) {
    const userId = req.user?.id || 'usr_curr_01';
    return this.memoryService.getUserMemories(userId);
  }

  @Post('memory')
  async createMemory(
    @Body() body: { key: string; value: string; category?: any; isPinned?: boolean },
    @Request() req: any,
  ) {
    const userId = req.user?.id || 'usr_curr_01';
    return this.memoryService.saveMemory(userId, body.key, body.value, body.category, body.isPinned);
  }

  @Delete('memory/:id')
  async deleteMemory(@Param('id') id: string, @Request() req: any) {
    const userId = req.user?.id || 'usr_curr_01';
    return this.memoryService.deleteMemory(userId, id);
  }

  @Delete('memory')
  async clearAllMemories(@Request() req: any) {
    const userId = req.user?.id || 'usr_curr_01';
    return this.memoryService.clearAllMemories(userId);
  }

  @Get('actions')
  async getUserActions(@Request() req: any) {
    const userId = req.user?.id || 'usr_curr_01';
    return this.actionsService.getUserActions(userId);
  }

  @Post('actions/plan')
  async planAction(@Body() body: Omit<PlanAiActionDto, 'userId'>, @Request() req: any) {
    const userId = req.user?.id || 'usr_curr_01';
    return this.actionsService.planAction({ ...body, userId });
  }

  @Post('actions/:id/confirm')
  async confirmAction(@Param('id') id: string, @Request() req: any) {
    const userId = req.user?.id || 'usr_curr_01';
    return this.actionsService.confirmAction(userId, id);
  }

  @Post('actions/:id/reject')
  async rejectAction(@Param('id') id: string, @Request() req: any) {
    const userId = req.user?.id || 'usr_curr_01';
    return this.actionsService.rejectAction(userId, id);
  }

  @Get('trends')
  async getTrends(
    @Query('scope') scope?: any,
    @Query('country') country?: string,
    @Query('language') language?: string,
  ) {
    return this.trendsService.getTrends({ scope, country, language });
  }

  @Get('usage')
  async getUsageLogs(@Request() req: any) {
    const userId = req.user?.id || 'usr_curr_01';
    const logs = await this.usageLogRepo.find({
      where: { userId },
      order: { createdAt: 'DESC' },
      take: 50,
    });
    const totalTokens = logs.reduce((acc, l) => acc + l.inputTokens + l.outputTokens, 0);
    const totalCost = logs.reduce((acc, l) => acc + l.estimatedCostUsd, 0);
    return {
      userId,
      recentRequests: logs,
      totalRequests: logs.length,
      totalTokens,
      estimatedCostUsd: Number(totalCost.toFixed(4)),
    };
  }

  @Get('metrics')
  async getAdminMetrics() {
    return this.gatewayService.getObservabilityMetrics();
  }

  @Post('translate')
  async translate(
    @Body() body: { text: string; targetLanguage: string; locale?: string },
    @Request() req: any,
  ) {
    const userId = req.user?.id || 'usr_curr_01';
    return this.aiService.translateText(body.text, body.targetLanguage, body.locale, userId);
  }

  @Post('assist')
  async assist(@Body() body: { query: string }, @Request() req: any) {
    const userId = req.user?.id || 'usr_curr_01';
    return this.aiService.executeAssistantQuery(body.query || '', userId);
  }

  @Post('search')
  async searchSemantic(@Body() body: { query: string }, @Request() req: any) {
    const userId = req.user?.id || 'usr_curr_01';
    return this.aiService.searchSemantic(body.query || '', userId);
  }

  @Post('smart-need')
  async smartNeed(@Body() body: { draftText: string }, @Request() req: any) {
    const userId = req.user?.id || 'usr_curr_01';
    return this.aiService.assistNeedCreation(body.draftText || '', userId);
  }

  @Post('smart-offer')
  async smartOffer(@Body() body: { draftText: string }, @Request() req: any) {
    const userId = req.user?.id || 'usr_curr_01';
    return this.aiService.assistOfferCreation(body.draftText || '', userId);
  }

  @Post('smart-opportunity')
  async smartOpportunity(@Body() body: { draftText: string }, @Request() req: any) {
    const userId = req.user?.id || 'usr_curr_01';
    return this.aiService.assistOpportunityCreation(body.draftText || '', userId);
  }

  @Get('profile-intelligence')
  async profileIntelligence(@Request() req: any) {
    const userId = req.user?.id || 'usr_curr_01';
    return this.aiService.getProfileIntelligence(userId);
  }

  @Post('chat-assist')
  async chatAssist(
    @Body() body: { mode: 'PROFESSIONAL' | 'SHORTEN' | 'PROPOSAL_PITCH'; originalText: string },
    @Request() req: any,
  ) {
    const userId = req.user?.id || 'usr_curr_01';
    return this.aiService.assistChatMessage(body.mode || 'PROFESSIONAL', body.originalText || '', userId);
  }
}
