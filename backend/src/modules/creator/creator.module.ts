import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreatorService } from './creator.service';
import { CreatorController } from './creator.controller';
import { ProfessionalContent } from '../../database/entities/professional-content.entity';
import { Follow } from '../../database/entities/follow.entity';
import { User } from '../../database/entities/user.entity';
import { Opportunity } from '../../database/entities/opportunity.entity';
import { MarketplaceListing } from '../../database/entities/marketplace-listing.entity';
import { LiveRoom } from '../../database/entities/live-room.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProfessionalContent,
      Follow,
      User,
      Opportunity,
      MarketplaceListing,
      LiveRoom,
    ]),
  ],
  providers: [CreatorService],
  controllers: [CreatorController],
  exports: [CreatorService],
})
export class CreatorModule {}
