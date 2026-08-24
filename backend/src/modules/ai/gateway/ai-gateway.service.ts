import { Injectable, Logger, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  AIProvider,
  AICompletionOptions,
  AIGenerateResult,
  AIModerationResult,
} from '../interfaces/ai-provider.interface';
import { GeminiAIProvider } from '../providers/gemini-ai.provider';
import { OpenAICompatibleProvider } from '../providers/openai-compatible.provider';
import { HeuristicFallbackProvider } from '../providers/heuristic-fallback.provider';
import { AiPrivacyService } from '../privacy/ai-privacy.service';
import { PromptRegistryService } from '../prompts/prompt-registry.service';
import { AiUsageLog } from '../../../database/entities/ai-usage-log.entity';
import { AiUserPreference } from '../../../database/entities/ai-user-preference.entity';
import { AiAuditLog } from '../../../database/entities/ai-audit-log.entity';

export interface ExecuteGatewayRequestOptions {
  userId?: string;
  feature: string;
  scope?: string;
  promptSlug?: string;
  promptVariables?: Record<string, string>;
  rawPrompt?: string;
  systemInstruction?: string;
  temperature?: number;
  maxTokens?: number;
  responseFormat?: 'text' | 'json';
  schemaDescription?: string;
  requireExplicitConfirmation?: boolean;
  confirmationGranted?: boolean;
}

@Injectable()
export class AiGatewayService {
  private readonly logger = new Logger(AiGatewayService.name);
  private providers: AIProvider[];
  private heuristicProvider: HeuristicFallbackProvider;

  constructor(
    @InjectRepository(AiUsageLog)
    private readonly usageLogRepo: Repository<AiUsageLog>,
    @InjectRepository(AiUserPreference)
    private readonly userPrefRepo: Repository<AiUserPreference>,
    @InjectRepository(AiAuditLog)
    private readonly auditLogRepo: Repository<AiAuditLog>,
    private readonly privacyService: AiPrivacyService,
    private readonly promptRegistry: PromptRegistryService,
  ) {
    this.heuristicProvider = new HeuristicFallbackProvider();
    this.providers = [
      new GeminiAIProvider(),
      new OpenAICompatibleProvider(),
      this.heuristicProvider,
    ];
  }

  /**
   * Selects best available AI Provider
   */
  private async selectProvider(): Promise<AIProvider> {
    for (const p of this.providers) {
      if (await p.isAvailable()) {
        return p;
      }
    }
    return this.heuristicProvider;
  }

  /**
   * Validates user AI permissions and scopes
   */
  async checkPermissions(userId: string, scope: string, isHighImpact = false, confirmed = false): Promise<boolean> {
    if (!userId) return true; // Anonymous / default access

    let pref = await this.userPrefRepo.findOne({ where: { userId } });
    if (!pref) {
      // Create safe default user preferences
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

    // Check scope
    if (pref.allowedScopes && !pref.allowedScopes.includes(scope)) {
      throw new ForbiddenException(`AI permission scope '${scope}' is disabled in your AI settings.`);
    }

    // Check high impact confirmation
    if (isHighImpact && pref.aiHighImpactConfirmEnabled && !confirmed) {
      throw new ForbiddenException(`Action requires explicit user confirmation before execution.`);
    }

    return true;
  }

  /**
   * Central Gateway Pipeline for Text Generation
   */
  async executeText(options: ExecuteGatewayRequestOptions): Promise<AIGenerateResult> {
    const userId = options.userId || 'usr_anonymous';
    const scope = options.scope || 'ai.read';

    // 1. Permission & Policy Check
    await this.checkPermissions(userId, scope, options.requireExplicitConfirmation, options.confirmationGranted);

    // 2. Prompt Synthesis
    let promptText = options.rawPrompt || '';
    let systemInstruction = options.systemInstruction;
    let temperature = options.temperature;
    let maxTokens = options.maxTokens;

    if (options.promptSlug) {
      const rendered = this.promptRegistry.render(options.promptSlug, options.promptVariables || {});
      promptText = rendered.promptText;
      systemInstruction = systemInstruction || rendered.definition.systemInstruction;
      temperature = temperature ?? rendered.definition.defaultParams.temperature;
      maxTokens = maxTokens ?? rendered.definition.defaultParams.maxTokens;
    }

    // 3. Privacy & Sensitive Data Minimization
    const sanitizedPrompt = this.privacyService.sanitizeContext(promptText);

    // 4. Content Safety Check
    const moderation = await this.heuristicProvider.moderate(sanitizedPrompt);
    if (moderation.isFlagged) {
      await this.logUsage({
        userId,
        feature: options.feature,
        model: 'policy-guard',
        provider: 'GATEWAY_POLICY',
        inputTokens: Math.ceil(sanitizedPrompt.length / 4),
        outputTokens: 0,
        estimatedCostUsd: 0,
        latencyMs: 10,
        status: 'BLOCKED_POLICY',
        errorMessage: moderation.reason || 'Input flagged by AI safety filter',
      });
      throw new ForbiddenException('Request blocked by LipTalk AI safety & trust filter.');
    }

    // 5. Select Provider & Execute
    const provider = await this.selectProvider();
    const result = await provider.generateText(sanitizedPrompt, {
      systemInstruction,
      temperature,
      maxTokens,
      userId,
      feature: options.feature,
    });

    // 6. Output Privacy & Safety Check
    const sanitizedOutput = this.privacyService.sanitizeContext(result.text);
    result.text = sanitizedOutput;

    // 7. Telemetry & Cost Accounting
    await this.logUsage({
      userId,
      feature: options.feature,
      model: result.model,
      provider: result.provider,
      inputTokens: result.inputTokens,
      outputTokens: result.outputTokens,
      estimatedCostUsd: result.estimatedCostUsd,
      latencyMs: result.latencyMs,
      status: 'SUCCESS',
    });

    return result;
  }

  /**
   * Central Gateway Pipeline for Structured JSON
   */
  async executeStructuredJson<T = any>(options: ExecuteGatewayRequestOptions): Promise<T> {
    const userId = options.userId || 'usr_anonymous';
    const scope = options.scope || 'ai.read';

    await this.checkPermissions(userId, scope, options.requireExplicitConfirmation, options.confirmationGranted);

    let promptText = options.rawPrompt || '';
    let systemInstruction = options.systemInstruction;

    if (options.promptSlug) {
      const rendered = this.promptRegistry.render(options.promptSlug, options.promptVariables || {});
      promptText = rendered.promptText;
      systemInstruction = systemInstruction || rendered.definition.systemInstruction;
    }

    const sanitizedPrompt = this.privacyService.sanitizeContext(promptText);
    const provider = await this.selectProvider();
    const schemaDesc = options.schemaDescription || 'Valid structured JSON';

    const startTime = Date.now();
    const result = await provider.generateStructuredJson<T>(sanitizedPrompt, schemaDesc, {
      systemInstruction,
      temperature: options.temperature ?? 0.2,
      maxTokens: options.maxTokens ?? 500,
    });

    const latencyMs = Date.now() - startTime;
    await this.logUsage({
      userId,
      feature: options.feature,
      model: provider.name,
      provider: provider.providerType,
      inputTokens: Math.ceil(sanitizedPrompt.length / 4),
      outputTokens: Math.ceil(JSON.stringify(result).length / 4),
      estimatedCostUsd: 0.0001,
      latencyMs,
      status: 'SUCCESS',
    });

    return result;
  }

  /**
   * Records usage metrics in database
   */
  private async logUsage(data: Partial<AiUsageLog>): Promise<void> {
    try {
      const entry = this.usageLogRepo.create({
        userId: data.userId || 'usr_anonymous',
        feature: data.feature || 'GATEWAY',
        model: data.model || 'unknown',
        provider: data.provider || 'HEURISTIC',
        inputTokens: data.inputTokens || 0,
        outputTokens: data.outputTokens || 0,
        estimatedCostUsd: data.estimatedCostUsd || 0,
        latencyMs: data.latencyMs || 0,
        status: data.status || 'SUCCESS',
        errorMessage: data.errorMessage,
      });
      await this.usageLogRepo.save(entry);
    } catch (err) {
      this.logger.error('Failed to log AI usage metric:', err);
    }
  }

  /**
   * Aggregates AI observability metrics for Admin Center
   */
  async getObservabilityMetrics(): Promise<{
    totalRequests: number;
    successRatePercentage: number;
    totalTokens: number;
    totalCostUsd: number;
    averageLatencyMs: number;
    providerBreakdown: Record<string, number>;
    featureBreakdown: Record<string, number>;
  }> {
    const logs = await this.usageLogRepo.find({ order: { createdAt: 'DESC' }, take: 1000 });
    const totalRequests = logs.length;
    if (totalRequests === 0) {
      return {
        totalRequests: 0,
        successRatePercentage: 100,
        totalTokens: 0,
        totalCostUsd: 0,
        averageLatencyMs: 0,
        providerBreakdown: {},
        featureBreakdown: {},
      };
    }

    const successCount = logs.filter((l) => l.status === 'SUCCESS').length;
    const totalTokens = logs.reduce((acc, l) => acc + l.inputTokens + l.outputTokens, 0);
    const totalCostUsd = logs.reduce((acc, l) => acc + l.estimatedCostUsd, 0);
    const averageLatencyMs = Math.round(logs.reduce((acc, l) => acc + l.latencyMs, 0) / totalRequests);

    const providerBreakdown: Record<string, number> = {};
    const featureBreakdown: Record<string, number> = {};

    for (const log of logs) {
      providerBreakdown[log.provider] = (providerBreakdown[log.provider] || 0) + 1;
      featureBreakdown[log.feature] = (featureBreakdown[log.feature] || 0) + 1;
    }

    return {
      totalRequests,
      successRatePercentage: Math.round((successCount / totalRequests) * 100),
      totalTokens,
      totalCostUsd: Number(totalCostUsd.toFixed(4)),
      averageLatencyMs,
      providerBreakdown,
      featureBreakdown,
    };
  }
}
