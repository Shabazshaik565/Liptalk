import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UniversalController } from './universal.controller';
import { UniversalService } from './universal.service';
import { PersonalGoal } from '../../database/entities/personal-goal.entity';
import { PersonalTask } from '../../database/entities/personal-task.entity';
import { LearningPath } from '../../database/entities/learning-path.entity';
import { ConversationAction } from '../../database/entities/conversation-action.entity';
import { Opportunity } from '../../database/entities/opportunity.entity';
import { Community } from '../../database/entities/community.entity';
import { MarketplaceListing } from '../../database/entities/marketplace-listing.entity';
import { KnowledgeCollection } from '../../database/entities/knowledge-collection.entity';
import { AiModule } from '../ai/ai.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PersonalGoal,
      PersonalTask,
      LearningPath,
      ConversationAction,
      Opportunity,
      Community,
      MarketplaceListing,
      KnowledgeCollection,
    ]),
    AiModule,
  ],
  controllers: [UniversalController],
  providers: [UniversalService],
  exports: [UniversalService],
})
export class UniversalModule {}
