import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  RewardTransaction,
  RewardTransactionType,
  RewardAction,
} from '../../database/entities/reward-transaction.entity';
import { Reward } from '../../database/entities/reward.entity';
import {
  RewardRedemption,
  RedemptionStatus,
} from '../../database/entities/reward-redemption.entity';
import { Referral, ReferralStatus } from '../../database/entities/referral.entity';
import { User } from '../../database/entities/user.entity';

@Injectable()
export class RewardsService {
  constructor(
    @InjectRepository(RewardTransaction)
    private readonly txRepo: Repository<RewardTransaction>,
    @InjectRepository(Reward)
    private readonly rewardRepo: Repository<Reward>,
    @InjectRepository(RewardRedemption)
    private readonly redemptionRepo: Repository<RewardRedemption>,
    @InjectRepository(Referral)
    private readonly referralRepo: Repository<Referral>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  /**
   * Calculate auditable point balance from ledger entries
   */
  async getWalletSummary(userId: string) {
    const transactions = await this.txRepo.find({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
    });

    let currentBalance = 0;
    let totalEarned = 0;
    let totalRedeemed = 0;

    for (const tx of transactions) {
      if (tx.amount > 0) {
        totalEarned += tx.amount;
      } else {
        totalRedeemed += Math.abs(tx.amount);
      }
      currentBalance += tx.amount;
    }

    return {
      currentBalance: Math.max(0, currentBalance),
      totalEarned,
      totalRedeemed,
      transactionCount: transactions.length,
      recentTransactions: transactions.slice(0, 10),
    };
  }

  async getTransactions(userId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [items, total] = await this.txRepo.findAndCount({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
      skip,
      take: limit,
    });

    return { items, total, page, limit };
  }

  async getAvailableRewards() {
    return this.rewardRepo.find({
      where: { isActive: true },
      relations: ['partner'],
      order: { pointsCost: 'ASC' },
    });
  }

  /**
   * Atomic reward redemption with ledger validation
   */
  async redeemReward(userId: string, rewardId: string) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const reward = await this.rewardRepo.findOne({
      where: { id: rewardId, isActive: true },
      relations: ['partner'],
    });
    if (!reward) {
      throw new NotFoundException('Reward not found or currently inactive');
    }

    // 1. Verify point balance
    const wallet = await this.getWalletSummary(userId);
    if (wallet.currentBalance < reward.pointsCost) {
      throw new BadRequestException(
        `Insufficient points. You have ${wallet.currentBalance} pts, but this perk requires ${reward.pointsCost} pts.`,
      );
    }

    // 2. Generate unique claimed code
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const claimedCode = `${reward.promoCodeTemplate}-${randomSuffix}`;

    // 3. Create redemption record
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30); // 30 days validity

    const redemption = await this.redemptionRepo.save(
      this.redemptionRepo.create({
        user,
        reward,
        pointsSpent: reward.pointsCost,
        claimedCode,
        status: RedemptionStatus.ACTIVE,
        expiresAt,
      }),
    );

    // 4. Record negative debit in ledger
    await this.txRepo.save(
      this.txRepo.create({
        user,
        amount: -reward.pointsCost,
        type: RewardTransactionType.REDEEMED,
        action: RewardAction.PARTNER_PERK_REDEEMED,
        description: `Redeemed: ${reward.title}`,
        referenceId: redemption.id,
      }),
    );

    const updatedWallet = await this.getWalletSummary(userId);

    return {
      success: true,
      redemption,
      newBalance: updatedWallet.currentBalance,
      message: `Successfully redeemed! Use promo code ${claimedCode} to claim your benefit.`,
    };
  }

  async getRedemptions(userId: string) {
    return this.redemptionRepo.find({
      where: { user: { id: userId } },
      relations: ['reward', 'reward.partner'],
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Safe server-side award method for ecosystem events
   */
  async awardPoints(
    userId: string,
    action: RewardAction,
    amount: number,
    description: string,
    referenceId?: string,
  ) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) return null;

    return this.txRepo.save(
      this.txRepo.create({
        user,
        amount: Math.abs(amount),
        type: RewardTransactionType.EARNED,
        action,
        description,
        referenceId,
      }),
    );
  }

  /**
   * Referral System: Generates or gets referral info
   */
  async getReferralInfo(userId: string) {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: ['profile'],
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const referralCode = `LIP-${userId.slice(-6).toUpperCase()}`;

    const referrals = await this.referralRepo.find({
      where: { referrer: { id: userId } },
      relations: ['referredUser', 'referredUser.profile'],
      order: { createdAt: 'DESC' },
    });

    const totalReferrals = referrals.length;
    const qualifiedReferrals = referrals.filter(
      (r) => r.status === ReferralStatus.REWARDED || r.status === ReferralStatus.QUALIFIED,
    ).length;
    const totalPointsFromReferrals = referrals.reduce(
      (acc, r) => acc + (r.status === ReferralStatus.REWARDED ? r.rewardPointsEarned : 0),
      0,
    );

    return {
      referralCode,
      referralLink: `https://liptalk.app/join?ref=${referralCode}`,
      rewardPerReferral: 500,
      totalReferrals,
      qualifiedReferrals,
      totalPointsFromReferrals,
      referralHistory: referrals,
    };
  }
}
