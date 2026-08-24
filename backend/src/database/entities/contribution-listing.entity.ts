import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

export type ContributionType =
  | 'DEVELOPMENT'
  | 'DESIGN'
  | 'RESEARCH'
  | 'WRITING'
  | 'MARKETING'
  | 'MENTORING'
  | 'EVENT_ORGANIZATION'
  | 'DOCUMENTATION';

@Entity('contribution_listings')
export class ContributionListing {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ length: 100 })
  projectId: string;

  @Column({ length: 255 })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({
    type: 'text',
    default: 'DEVELOPMENT',
  })
  contributionType: ContributionType;

  @Column({ type: 'simple-json', nullable: true })
  deliverablesSummary: string[];

  @Column({ length: 100, default: 'OPEN_CALL' })
  status: string;

  @Column({ length: 100, nullable: true })
  assignedContributorId: string;

  @Column({ type: 'simple-json', nullable: true })
  attributionRecord: {
    verifiedByOwner?: boolean;
    attestationHash?: string;
    impactScore?: number;
  };

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
