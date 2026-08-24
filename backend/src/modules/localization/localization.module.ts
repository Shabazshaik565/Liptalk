import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserPreference } from '../../database/entities/user-preference.entity';
import { User } from '../../database/entities/user.entity';
import { Community } from '../../database/entities/community.entity';
import { MarketplaceListing } from '../../database/entities/marketplace-listing.entity';
import { LocalizationService } from './localization.service';
import {
  LocalizationController,
  UserPreferencesController,
} from './localization.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserPreference,
      User,
      Community,
      MarketplaceListing,
    ]),
  ],
  controllers: [LocalizationController, UserPreferencesController],
  providers: [LocalizationService],
  exports: [LocalizationService],
})
export class LocalizationModule {}
