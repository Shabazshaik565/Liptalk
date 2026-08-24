import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export type GoalScope = 'INDIVIDUAL' | 'COMMUNITY' | 'CREATOR' | 'ORGANIZATION' | 'PUBLIC_INITIATIVE';
export type GoalStatus = 'PLANNING' | 'ACTIVE' | 'PAUSED' | 'COMPLETED' | 'CANCELLED';

@Entity('global_goals')
export class GlobalGoal {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  ownerId: string;

  @Column({ default: 'INDIVIDUAL' })
  scope: GoalScope;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'simple-json', nullable: true })
  objectives: string[];

  @Column({ type: 'simple-json', nullable: true })
  resources: Array<{ title: string; url?: string; type: string }>;

  @Column({ type: 'simple-json', nullable: true })
  assignedAgentIds: string[];

  @Column({ type: 'int', default: 0 })
  progressPercent: number;

  @Column({ default: 'ACTIVE' })
  status: GoalStatus;

  @Column({ nullable: true })
  targetDate: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
