import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index, ManyToOne } from 'typeorm';
import { Agent } from './agent.entity';
import { AgentWorkflow } from './agent-workflow.entity';

@Entity('agent_executions')
export class AgentExecution {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ type: 'varchar', length: 100 })
  userId: string;

  @ManyToOne(() => Agent, { onDelete: 'SET NULL', nullable: true })
  agent: Agent;

  @ManyToOne(() => AgentWorkflow, { onDelete: 'SET NULL', nullable: true })
  workflow: AgentWorkflow;

  @Column({ type: 'varchar', length: 50, default: 'COMPLETED' })
  status: 'QUEUED' | 'RUNNING' | 'COMPLETED' | 'FAILED' | 'WAITING_CONFIRMATION' | 'CANCELLED';

  @Column({ type: 'text' })
  initialPromptOrTrigger: string;

  @Column({ type: 'simple-json', nullable: true })
  stepsLog: Array<{
    stepIndex: number;
    toolName: string;
    input: any;
    output: any;
    status: string;
    latencyMs: number;
  }>;

  @Column({ type: 'text', nullable: true })
  finalResultText: string;

  @Column({ type: 'integer', default: 0 })
  tokensUsed: number;

  @Column({ type: 'float', default: 0.0 })
  costUsd: number;

  @Column({ type: 'integer', default: 0 })
  executionTimeMs: number;

  @CreateDateColumn()
  createdAt: Date;
}
