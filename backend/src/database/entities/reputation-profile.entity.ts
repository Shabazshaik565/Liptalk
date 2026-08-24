import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity('reputation_profiles')
export class ReputationProfile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ type: 'varchar', length: 100, unique: true })
  userId: string;

  @Column({ type: 'integer', default: 85 })
  marketplaceReputation: number; // 0-100 (fulfillment, reviews, dispute rate)

  @Column({ type: 'integer', default: 90 })
  communityReputation: number; // 0-100 (accepted answers, helpful votes)

  @Column({ type: 'integer', default: 88 })
  creatorReputation: number; // 0-100 (content quality, engagement velocity)

  @Column({ type: 'integer', default: 92 })
  developerReputation: number; // 0-100 (API stability, webhook health)

  @Column({ type: 'integer', default: 89 })
  contributorReputation: number; // 0-100 (knowledge contributions, open-source)

  @Column({ type: 'integer', default: 89 })
  overallTrustScore: number; // 0-100

  @Column({ type: 'varchar', length: 50, default: 'TIER_1_VERIFIED' })
  trustTier: 'TIER_1_VERIFIED' | 'TIER_2_ESTABLISHED' | 'TIER_3_RISING' | 'RESTRICTED';

  @Column({ type: 'simple-array', nullable: true })
  badges: string[]; // e.g. ['TOP_CONTRIBUTOR', 'VERIFIED_DEVELOPER', 'COMMUNITY_MENTOR']

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
