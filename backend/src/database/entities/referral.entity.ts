import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  Unique,
} from 'typeorm';
import { User } from './user.entity';

export enum ReferralStatus {
  PENDING = 'PENDING',
  QUALIFIED = 'QUALIFIED',
  REWARDED = 'REWARDED',
}

@Entity('referrals')
@Unique(['referredUser'])
export class Referral {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  referrer: User;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  referredUser: User;

  @Column()
  referralCode: string;

  @Column({
    type: 'simple-enum',
    enum: ReferralStatus,
    default: ReferralStatus.PENDING,
  })
  status: ReferralStatus;

  @Column({ type: 'int', default: 500 })
  rewardPointsEarned: number;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ nullable: true })
  qualifiedAt: Date;
}
