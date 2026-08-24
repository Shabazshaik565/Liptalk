import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EcosystemController } from './ecosystem.controller';
import { EcosystemService } from './ecosystem.service';
import { ReputationProfile } from '../../database/entities/reputation-profile.entity';
import { ProjectWorkspace } from '../../database/entities/project-workspace.entity';
import { CreatorService } from '../../database/entities/creator-service.entity';
import { RevenueSplit } from '../../database/entities/revenue-split.entity';
import { Subscription } from '../../database/entities/subscription.entity';
import { Entitlement } from '../../database/entities/entitlement.entity';
import { AgentListing } from '../../database/entities/agent-listing.entity';
import { MentorshipProfile } from '../../database/entities/mentorship-profile.entity';
import { Opportunity } from '../../database/entities/opportunity.entity';
import { AiModule } from '../ai/ai.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ReputationProfile,
      ProjectWorkspace,
      CreatorService,
      RevenueSplit,
      Subscription,
      Entitlement,
      AgentListing,
      MentorshipProfile,
      Opportunity,
    ]),
    AiModule,
  ],
  controllers: [EcosystemController],
  providers: [EcosystemService],
  exports: [EcosystemService],
})
export class EcosystemModule {}
