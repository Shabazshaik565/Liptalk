import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

export enum AgentType {
  PERSONAL = 'PERSONAL',
  COMMUNITY = 'COMMUNITY',
  CREATOR = 'CREATOR',
  SYSTEM = 'SYSTEM',
}

export enum AgentStatus {
  ACTIVE = 'ACTIVE',
  PAUSED = 'PAUSED',
  SUSPENDED = 'SUSPENDED',
}

@Entity('agents')
export class Agent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ type: 'varchar', length: 100 })
  userId: string; // Owner

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    type: 'simple-enum',
    enum: AgentType,
    default: AgentType.PERSONAL,
  })
  type: AgentType;

  @Column({
    type: 'simple-enum',
    enum: AgentStatus,
    default: AgentStatus.ACTIVE,
  })
  status: AgentStatus;

  @Column({ type: 'simple-array' })
  allowedTools: string[]; // e.g. ['search', 'read_content', 'summarize', 'create_draft']

  @Column({ type: 'simple-array' })
  allowedScopes: string[]; // e.g. ['ai.read', 'ai.draft', 'ai.search']

  @Column({ type: 'integer', default: 100 })
  maxDailyExecutions: number;

  @Column({ type: 'float', default: 1.0 })
  monthlyBudgetUsd: number;

  @Column({ type: 'float', default: 0.0 })
  currentMonthSpendUsd: number;

  @Column({ type: 'boolean', default: true })
  requireHighImpactConfirmation: boolean;

  @Column({ type: 'simple-json', nullable: true })
  config: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
