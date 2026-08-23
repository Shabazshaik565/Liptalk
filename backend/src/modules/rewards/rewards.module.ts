import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RewardTransaction } from '../../database/entities/reward-transaction.entity';
import { Reward } from '../../database/entities/reward.entity';
import { RewardRedemption } from '../../database/entities/reward-redemption.entity';
import { Referral } from '../../database/entities/referral.entity';
import { User } from '../../database/entities/user.entity';
import { RewardsService } from './rewards.service';
import { RewardsController } from './rewards.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      RewardTransaction,
      Reward,
      RewardRedemption,
      Referral,
      User,
    ]),
    AuthModule,
  ],
  controllers: [RewardsController],
  providers: [RewardsService],
  exports: [RewardsService],
})
export class RewardsModule {}
