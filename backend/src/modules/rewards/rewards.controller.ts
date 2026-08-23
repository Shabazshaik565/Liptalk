import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { RewardsService } from './rewards.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('rewards')
export class RewardsController {
  constructor(private readonly rewardsService: RewardsService) {}

  @Get('wallet')
  @UseGuards(JwtAuthGuard)
  async getWallet(@Req() req: any) {
    const userId = req.user?.id || 'usr_curr_01';
    return this.rewardsService.getWalletSummary(userId);
  }

  @Get('transactions')
  @UseGuards(JwtAuthGuard)
  async getTransactions(
    @Req() req: any,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const userId = req.user?.id || 'usr_curr_01';
    return this.rewardsService.getTransactions(
      userId,
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 20,
    );
  }

  @Get('catalog')
  async getAvailableRewards() {
    return this.rewardsService.getAvailableRewards();
  }

  @Post('redeem/:rewardId')
  @UseGuards(JwtAuthGuard)
  async redeemReward(@Param('rewardId') rewardId: string, @Req() req: any) {
    const userId = req.user?.id || 'usr_curr_01';
    return this.rewardsService.redeemReward(userId, rewardId);
  }

  @Get('redemptions')
  @UseGuards(JwtAuthGuard)
  async getRedemptions(@Req() req: any) {
    const userId = req.user?.id || 'usr_curr_01';
    return this.rewardsService.getRedemptions(userId);
  }

  @Get('referrals')
  @UseGuards(JwtAuthGuard)
  async getReferrals(@Req() req: any) {
    const userId = req.user?.id || 'usr_curr_01';
    return this.rewardsService.getReferralInfo(userId);
  }
}
