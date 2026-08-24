import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AiController } from './ai.controller';
import { AiService } from './ai.service';
import { AiGatewayService } from './gateway/ai-gateway.service';
import { AiPrivacyService } from './privacy/ai-privacy.service';
import { PromptRegistryService } from './prompts/prompt-registry.service';
import { AiMemoryService } from './memory/ai-memory.service';
import { AiActionsService } from './actions/ai-actions.service';
import { GlobalTrendsService } from './trends/global-trends.service';
import { AgentPlatformService } from './agents/agent-platform.service';

import { User } from '../../database/entities/user.entity';
import { Need } from '../../database/entities/need.entity';
import { Offer } from '../../database/entities/offer.entity';
import { Opportunity } from '../../database/entities/opportunity.entity';
import { Community } from '../../database/entities/community.entity';
import { MarketplaceListing } from '../../database/entities/marketplace-listing.entity';
import { AiUsageLog } from '../../database/entities/ai-usage-log.entity';
import { AiUserPreference } from '../../database/entities/ai-user-preference.entity';
import { AiUserMemory } from '../../database/entities/ai-user-memory.entity';
import { AiPromptTemplate } from '../../database/entities/ai-prompt-template.entity';
import { AiAuditLog } from '../../database/entities/ai-audit-log.entity';
import { AiAction } from '../../database/entities/ai-action.entity';
import { GlobalTrend } from '../../database/entities/global-trend.entity';
import { Agent } from '../../database/entities/agent.entity';
import { AgentWorkflow } from '../../database/entities/agent-workflow.entity';
import { AgentExecution } from '../../database/entities/agent-execution.entity';
import { KnowledgeCollection } from '../../database/entities/knowledge-collection.entity';
import { AiPolicy } from '../../database/entities/ai-policy.entity';
import { AiFeedback } from '../../database/entities/ai-feedback.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Need,
      Offer,
      Opportunity,
      Community,
      MarketplaceListing,
      AiUsageLog,
      AiUserPreference,
      AiUserMemory,
      AiPromptTemplate,
      AiAuditLog,
      AiAction,
      GlobalTrend,
      Agent,
      AgentWorkflow,
      AgentExecution,
      KnowledgeCollection,
      AiPolicy,
      AiFeedback,
    ]),
  ],
  controllers: [AiController],
  providers: [
    AiService,
    AiGatewayService,
    AiPrivacyService,
    PromptRegistryService,
    AiMemoryService,
    AiActionsService,
    GlobalTrendsService,
    AgentPlatformService,
  ],
  exports: [
    AiService,
    AiGatewayService,
    AiPrivacyService,
    PromptRegistryService,
    AiMemoryService,
    AiActionsService,
    GlobalTrendsService,
    AgentPlatformService,
  ],
})
export class AiModule {}
