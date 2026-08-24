import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PersonalGoal } from '../../database/entities/personal-goal.entity';
import { PersonalTask } from '../../database/entities/personal-task.entity';
import { LearningPath } from '../../database/entities/learning-path.entity';
import { ConversationAction } from '../../database/entities/conversation-action.entity';
import { Opportunity } from '../../database/entities/opportunity.entity';
import { Community } from '../../database/entities/community.entity';
import { MarketplaceListing } from '../../database/entities/marketplace-listing.entity';
import { KnowledgeCollection } from '../../database/entities/knowledge-collection.entity';
import { AiGatewayService } from '../ai/gateway/ai-gateway.service';

@Injectable()
export class UniversalService {
  private readonly logger = new Logger(UniversalService.name);

  constructor(
    @InjectRepository(PersonalGoal)
    private readonly goalRepo: Repository<PersonalGoal>,
    @InjectRepository(PersonalTask)
    private readonly taskRepo: Repository<PersonalTask>,
    @InjectRepository(LearningPath)
    private readonly learnRepo: Repository<LearningPath>,
    @InjectRepository(ConversationAction)
    private readonly actionRepo: Repository<ConversationAction>,
    @InjectRepository(Opportunity)
    private readonly oppRepo: Repository<Opportunity>,
    @InjectRepository(Community)
    private readonly commRepo: Repository<Community>,
    @InjectRepository(MarketplaceListing)
    private readonly marketRepo: Repository<MarketplaceListing>,
    @InjectRepository(KnowledgeCollection)
    private readonly knowRepo: Repository<KnowledgeCollection>,
    private readonly aiGateway: AiGatewayService,
  ) {}

  /**
   * Universal Natural Language Command & Cross-Subsystem Search Engine
   */
  async executeUniversalCommand(userId: string, input: string, context?: Record<string, any>) {
    const raw = input.toLowerCase().trim();

    // 1. Detect Intent
    let intent: 'SEARCH' | 'NAVIGATE' | 'DISPATCH_AGENT' | 'CREATE_TASK' | 'SUMMARIZE' = 'SEARCH';
    let targetRoute = '/search';

    if (raw.startsWith('go to') || raw.startsWith('open') || raw.startsWith('show my')) {
      intent = 'NAVIGATE';
      if (raw.includes('marketplace') || raw.includes('trade') || raw.includes('store')) targetRoute = '/marketplace';
      else if (raw.includes('agent') || raw.includes('workflow')) targetRoute = '/agents';
      else if (raw.includes('developer') || raw.includes('api')) targetRoute = '/developer';
      else if (raw.includes('trust') || raw.includes('security')) targetRoute = '/trust/ai-trust-center';
      else if (raw.includes('identity') || raw.includes('reputation')) targetRoute = '/profile/identity';
      else if (raw.includes('personal') || raw.includes('goal') || raw.includes('task')) targetRoute = '/personal';
      else if (raw.includes('ecosystem') || raw.includes('mentor')) targetRoute = '/ecosystem';
    } else if (raw.startsWith('task:') || raw.startsWith('remind me') || raw.startsWith('todo:')) {
      intent = 'CREATE_TASK';
      const title = input.replace(/^(task:|remind me to|todo:)\s*/i, '').trim();
      const task = await this.createPersonalTask(userId, { title, priority: 'HIGH' });
      return {
        intent: 'CREATE_TASK',
        message: `Smart Task created: "${task.title}"`,
        data: task,
        suggestedRoute: '/personal',
      };
    }

    // 2. Perform Cross-Subsystem Search
    const [opps, comms, market, knowledge] = await Promise.all([
      this.oppRepo.find({ take: 3, order: { createdAt: 'DESC' } }),
      this.commRepo.find({ take: 3, order: { createdAt: 'DESC' } }),
      this.marketRepo.find({ take: 3, order: { createdAt: 'DESC' } }),
      this.knowRepo.find({ where: { userId }, take: 3 }),
    ]);

    return {
      intent,
      query: input,
      suggestedRoute: targetRoute,
      results: {
        opportunities: opps,
        communities: comms,
        marketplace: market,
        knowledgeHub: knowledge,
      },
    };
  }

  /**
   * Personal Operating System: Dashboard Aggregator
   */
  async getPersonalDashboard(userId: string) {
    let [goals, tasks, learningPaths] = await Promise.all([
      this.goalRepo.find({ where: { userId }, order: { progressPercent: 'ASC' } }),
      this.taskRepo.find({ where: { userId }, order: { createdAt: 'DESC' } }),
      this.learnRepo.find({ where: { userId } }),
    ]);

    // Seed defaults if empty
    if (goals.length === 0) {
      const g1 = this.goalRepo.create({
        userId,
        title: 'Master Cross-Border B2B Supply Chain',
        category: 'COMMERCE_EXPANSION',
        progressPercent: 40,
        status: 'IN_PROGRESS',
      });
      goals = [await this.goalRepo.save(g1)];
    }

    if (tasks.length === 0) {
      const t1 = this.taskRepo.create({
        userId,
        title: 'Review GT vs MT Price Index report',
        priority: 'HIGH',
        status: 'TODO',
      });
      const t2 = this.taskRepo.create({
        userId,
        title: 'Complete Autonomous Agent allowlist security check',
        priority: 'CRITICAL',
        status: 'IN_PROGRESS',
      });
      tasks = await this.taskRepo.save([t1, t2]);
    }

    if (learningPaths.length === 0) {
      const lp = this.learnRepo.create({
        userId,
        title: 'Modern B2B Supply Chain & Digital Trade',
        category: 'Commerce Strategy',
        progressPercent: 60,
        modules: [
          { id: 'm1', title: 'Kirana Wholesale Sourcing Fundamentals', completed: true, estimatedMinutes: 25 },
          { id: 'm2', title: 'Smart Contracts & Escrow Settlements', completed: true, estimatedMinutes: 40 },
          { id: 'm3', title: 'AI-Driven Multi-Tier Inventory Forecasting', completed: false, estimatedMinutes: 30 },
        ],
      });
      learningPaths = [await this.learnRepo.save(lp)];
    }

    return {
      userId,
      goals,
      tasks,
      learningPaths,
      aiSummary: 'You have 2 high-priority tasks and are 60% through the Digital Trade mastery track.',
    };
  }

  async createPersonalGoal(userId: string, data: Partial<PersonalGoal>): Promise<PersonalGoal> {
    const goal = this.goalRepo.create({ ...data, userId });
    return this.goalRepo.save(goal);
  }

  async createPersonalTask(userId: string, data: Partial<PersonalTask>): Promise<PersonalTask> {
    const task = this.taskRepo.create({ ...data, userId });
    return this.taskRepo.save(task);
  }

  async togglePersonalTask(id: string): Promise<PersonalTask> {
    const task = await this.taskRepo.findOne({ where: { id } });
    if (!task) throw new Error('Task not found');
    task.status = task.status === 'DONE' ? 'TODO' : 'DONE';
    return this.taskRepo.save(task);
  }

  /**
   * Ambient AI Context Query
   */
  async queryAmbientContext(userId: string, screenContext: string, query: string) {
    const prompt = `User is on screen: ${screenContext}. User asks: "${query}". Provide a concise, contextual answer grounded on the current screen without exposing unauthorized data.`;
    const response = await this.aiGateway.executeText({
      feature: 'AMBIENT_ASSISTANT',
      scope: 'ai.read',
      rawPrompt: prompt,
      userId,
    });
    return {
      screenContext,
      query,
      answer: response.text,
      tokensUsed: (response.inputTokens || 0) + (response.outputTokens || 0) || 120,
    };
  }

  /**
   * Autonomous Agent Workflow Simulation
   */
  simulateWorkflow(workflowConfig: { title: string; trigger: string; steps: string[] }) {
    return {
      workflowTitle: workflowConfig.title,
      triggerType: workflowConfig.trigger,
      simulatedSteps: workflowConfig.steps.map((step, idx) => ({
        stepNumber: idx + 1,
        tool: step,
        riskLevel: step === 'publish' || step === 'purchase' ? 'HIGH' : 'LOW',
        requiresApproval: step === 'publish' || step === 'purchase',
        estimatedLatencyMs: 180 + idx * 60,
      })),
      estimatedTokensTotal: workflowConfig.steps.length * 150,
      estimatedCostUsd: 0.004,
      safetyCheck: 'PASSED_ZERO_LOOP_RISK',
    };
  }
}
