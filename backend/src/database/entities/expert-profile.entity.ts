import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('expert_profiles')
export class ExpertProfile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ length: 100 })
  userId: string;

  @Column({ length: 255 })
  expertName: string;

  @Column({ length: 255, nullable: true })
  titleHeadline: string;

  @Column({ type: 'simple-json', nullable: true })
  verifiedDomains: string[];

  @Column({ type: 'simple-json', nullable: true })
  demonstratedPublicContributions: Array<{
    title: string;
    contributionType: 'CODE' | 'RESEARCH' | 'GOVERNANCE' | 'CREATOR' | 'COMMUNITY_LEAD';
    year: number;
    referenceUrl?: string;
  }>;

  @Column({ length: 50, default: 'AVAILABLE_FOR_CONSULTATION' })
  availabilityStatus: string;

  @Column({ type: 'float', default: 94.5 })
  reputationIndex: number;

  @Column({ type: 'int', default: 0 })
  consultationsCompletedCount: number;

  @Column({ default: true })
  isPubliclyListed: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
