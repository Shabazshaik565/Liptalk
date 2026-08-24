import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity('subscriptions')
export class Subscription {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ type: 'varchar', length: 100 })
  userId: string; // Subscriber

  @Index()
  @Column({ type: 'varchar', length: 100 })
  targetEntityId: string; // Creator ID, Community ID, or App ID

  @Column({ type: 'varchar', length: 50, default: 'CREATOR_MEMBERSHIP' })
  subscriptionType: 'PLATFORM_PRO' | 'CREATOR_MEMBERSHIP' | 'COMMUNITY_TIER' | 'APP_ADDON';

  @Column({ type: 'varchar', length: 100 })
  planName: string;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  amount: number;

  @Column({ type: 'varchar', length: 10, default: 'INR' })
  currency: string;

  @Column({ type: 'varchar', length: 20, default: 'MONTHLY' })
  billingInterval: 'MONTHLY' | 'ANNUAL';

  @Column({ type: 'varchar', length: 50, default: 'ACTIVE' })
  status: 'ACTIVE' | 'PAST_DUE' | 'CANCELLED' | 'EXPIRED';

  @Column({ type: 'datetime' })
  currentPeriodEnd: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
