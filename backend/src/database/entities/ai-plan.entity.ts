import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

export type PlanStatus = 'DRAFT' | 'PREVIEW' | 'APPROVED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

@Entity('ai_plans')
export class AiPlan {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ length: 100 })
  userId: string;

  @Column({ length: 255 })
  goalTitle: string;

  @Column({ type: 'text', nullable: true })
  goalDescription: string;

  @Column({ type: 'simple-json', nullable: true })
  stepsBreakdown: Array<{
    stepIndex: number;
    stepTitle: string;
    agentRole: string;
    actionType: string;
    description: string;
    requiresHumanReview: boolean;
    status: 'PENDING' | 'EXECUTING' | 'COMPLETED' | 'FAILED';
  }>;

  @Column({ type: 'float', default: 0.0 })
  estimatedCostUsd: number;

  @Column({ type: 'simple-json', nullable: true })
  dataAccessScopes: string[];

  @Column({
    type: 'text',
    default: 'PREVIEW',
  })
  status: PlanStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
