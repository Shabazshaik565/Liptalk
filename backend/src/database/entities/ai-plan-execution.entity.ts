import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';

@Entity('ai_plan_executions')
export class AiPlanExecution {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ length: 100 })
  planId: string;

  @Column({ type: 'int' })
  stepIndex: number;

  @Column({ length: 100 })
  agentRole: string;

  @Column({ length: 100 })
  actionTaken: string;

  @Column({ type: 'text', nullable: true })
  outputSummary: string;

  @Column({ type: 'simple-json', nullable: true })
  dataAccessed: string[];

  @Column({ type: 'float', default: 0.0 })
  stepCostUsd: number;

  @Column({ length: 50, default: 'COMPLETED' })
  status: string;

  @CreateDateColumn()
  executedAt: Date;
}
