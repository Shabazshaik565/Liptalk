import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Report } from '../../database/entities/report.entity';
import { UserBlock } from '../../database/entities/user-block.entity';
import { User } from '../../database/entities/user.entity';
import { UserProfile } from '../../database/entities/profile.entity';
import { Business } from '../../database/entities/business.entity';
import { Review } from '../../database/entities/review.entity';
import { TrustSafetyService } from './trust-safety.service';
import { TrustSafetyController } from './trust-safety.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Report,
      UserBlock,
      User,
      UserProfile,
      Business,
      Review,
    ]),
  ],
  controllers: [TrustSafetyController],
  providers: [TrustSafetyService],
  exports: [TrustSafetyService],
})
export class TrustSafetyModule {}
