import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

export type ProposalStatus = 'PROPOSED' | 'EXPERIMENTING' | 'ACCEPTED' | 'REJECTED' | 'ROLLED_BACK';

@Entity('improvement_proposals')
export class ImprovementProposal {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ length: 100 })
  category: string;

  @Column({ length: 255 })
  title: string;

  @Column({ type: 'text' })
  problemDescription: string;

  @Column({ type: 'simple-json', nullable: true })
  evidenceMetrics: {
    slowWorkflowLatencyMs?: number;
    errorRatePercent?: number;
    searchFailurePercent?: number;
    uxDropoffPercent?: number;
    observationsCount?: number;
  };

  @Column({ type: 'text' })
  proposedChange: string;

  @Column({ type: 'text', nullable: true })
  expectedBenefit: string;

  @Column({ length: 50, default: 'LOW' })
  riskLevel: string;

  @Column({ type: 'simple-json', nullable: true })
  affectedSubsystems: string[];

  @Column({ type: 'text', nullable: true })
  experimentPlan: string;

  @Column({ type: 'text', nullable: true })
  rollbackPlan: string;

  @Column({ length: 100, default: 'usr_curr_01' })
  ownerId: string;

  @Column({
    type: 'text',
    default: 'PROPOSED',
  })
  status: ProposalStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
