import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

export enum RewardTransactionType {
  EARNED = 'EARNED',
  REDEEMED = 'REDEEMED',
  BONUS = 'BONUS',
  ADJUSTED = 'ADJUSTED',
}

export enum RewardAction {
  PROFILE_COMPLETED = 'PROFILE_COMPLETED',
  REFERRAL_SUCCESS = 'REFERRAL_SUCCESS',
  COLLABORATION_COMPLETED = 'COLLABORATION_COMPLETED',
  EVENT_ATTENDED = 'EVENT_ATTENDED',
  COMMUNITY_CONTRIBUTION = 'COMMUNITY_CONTRIBUTION',
  PARTNER_PERK_REDEEMED = 'PARTNER_PERK_REDEEMED',
  SERVICE_COMPLETED = 'SERVICE_COMPLETED',
}

@Entity('reward_transactions')
export class RewardTransaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User;

  @Column({ type: 'int' })
  amount: number; // positive = credit, negative = debit

  @Column({
    type: 'simple-enum',
    enum: RewardTransactionType,
    default: RewardTransactionType.EARNED,
  })
  type: RewardTransactionType;

  @Column({
    type: 'simple-enum',
    enum: RewardAction,
  })
  action: RewardAction;

  @Column()
  description: string;

  @Column({ nullable: true })
  referenceId: string;

  @CreateDateColumn()
  createdAt: Date;
}
