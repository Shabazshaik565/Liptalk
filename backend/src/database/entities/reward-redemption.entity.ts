import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Reward } from './reward.entity';

export enum RedemptionStatus {
  ACTIVE = 'ACTIVE',
  USED = 'USED',
  EXPIRED = 'EXPIRED',
}

@Entity('reward_redemptions')
export class RewardRedemption {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Reward, { onDelete: 'CASCADE' })
  reward: Reward;

  @Column({ type: 'int' })
  pointsSpent: number;

  @Column()
  claimedCode: string;

  @Column({
    type: 'simple-enum',
    enum: RedemptionStatus,
    default: RedemptionStatus.ACTIVE,
  })
  status: RedemptionStatus;

  @Column({ nullable: true })
  expiresAt: Date;

  @CreateDateColumn()
  createdAt: Date;
}
