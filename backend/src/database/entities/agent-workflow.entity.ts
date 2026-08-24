import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index, ManyToOne } from 'typeorm';
import { Agent } from './agent.entity';

export enum WorkflowTriggerType {
  SCHEDULE = 'SCHEDULE', // Cron or periodic (e.g. daily, weekly)
  EVENT = 'EVENT', // Triggered by event (e.g. new post in community)
  MANUAL = 'MANUAL',
}

@Entity('agent_workflows')
export class AgentWorkflow {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ type: 'varchar', length: 100 })
  userId: string;

  @ManyToOne(() => Agent, { onDelete: 'CASCADE', nullable: true })
  agent: Agent;

  @Column({ type: 'varchar', length: 150 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    type: 'simple-enum',
    enum: WorkflowTriggerType,
    default: WorkflowTriggerType.SCHEDULE,
  })
  triggerType: WorkflowTriggerType;

  @Column({ type: 'varchar', length: 100, nullable: true })
  scheduleCron: string; // e.g. '0 9 * * 0' (Every Sunday at 9 AM)

  @Column({ type: 'varchar', length: 100, nullable: true })
  eventTriggerName: string; // e.g. 'community.post.created'

  @Column({ type: 'simple-json' })
  actionsPlan: Array<{
    step: number;
    tool: string;
    inputTemplate: Record<string, any>;
    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  }>;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'datetime', nullable: true })
  lastRunAt?: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
