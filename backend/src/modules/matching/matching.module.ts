import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MatchingService } from './matching.service';
import { MatchingController } from './matching.controller';
import { Need } from '../../database/entities/need.entity';
import { Offer } from '../../database/entities/offer.entity';
import { User } from '../../database/entities/user.entity';
import { CommunityMember } from '../../database/entities/community-member.entity';
import { AiModule } from '../ai/ai.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Need, Offer, User, CommunityMember]),
    AiModule,
  ],
  controllers: [MatchingController],
  providers: [MatchingService],
  exports: [MatchingService],
})
export class MatchingModule {}
