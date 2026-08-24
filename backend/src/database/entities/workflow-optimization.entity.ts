import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('workflow_optimizations')
export class WorkflowOptimization {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ length: 100 })
  workflowId: string;

  @Column({ length: 255 })
  workflowName: string;

  @Column({ type: 'int', default: 0 })
  totalExecutions: number;

  @Column({ type: 'float', default: 0.0 })
  averageLatencyMs: number;

  @Column({ type: 'float', default: 0.0 })
  failureRatePercent: number;

  @Column({ type: 'float', default: 0.0 })
  averageTokenCostUsd: number;

  @Column({ type: 'simple-json', nullable: true })
  optimizationProposals: Array<{
    proposalTitle: string;
    description: string;
    expectedLatencyReductionPercent: number;
    expectedCostSavingsPercent: number;
    riskScore: 'LOW' | 'MEDIUM' | 'HIGH';
    requiresHumanReview: boolean;
  }>;

  @Column({ default: 'OPTIMAL' })
  status: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
