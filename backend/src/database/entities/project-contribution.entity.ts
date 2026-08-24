import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export type ContributionCategory = 'CODE' | 'DOCUMENTATION' | 'DESIGN' | 'CONTENT' | 'RESEARCH' | 'MODERATION' | 'FUNDING' | 'EVENT' | 'KNOWLEDGE';
export type ContributionStatus = 'SUBMITTED' | 'IN_REVIEW' | 'VERIFIED' | 'REJECTED';

@Entity('project_contributions')
export class ProjectContribution {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  projectId: string;

  @Column()
  contributorId: string;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ default: 'CODE' })
  category: ContributionCategory;

  @Column({ type: 'int', default: 1 })
  versionNumber: number;

  @Column({ type: 'text', nullable: true })
  payloadUrlOrContent: string;

  @Column({ default: false })
  isAiAssisted: boolean;

  @Column({ nullable: true })
  aiAssistedDetails: string;

  @Column({ default: 'SUBMITTED' })
  status: ContributionStatus;

  @Column({ nullable: true })
  verifiedBy: string;

  @Column({ nullable: true })
  verifiedAt: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
