import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export interface TeamAgentMember {
  agentRole: 'COORDINATOR' | 'RESEARCHER' | 'PLANNER' | 'DOCS' | 'ANALYSIS' | 'QA';
  agentName: string;
  allowedTools: string[];
  maxTokensPerStep: number;
}

@Entity('agent_teams')
export class AgentTeam {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  ownerId: string;

  @Column({ nullable: true })
  targetProjectId: string;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  mission: string;

  @Column({ type: 'simple-json' })
  agents: TeamAgentMember[];

  @Column({ type: 'int', default: 50 })
  maxDailySteps: number;

  @Column({ type: 'int', default: 10 })
  budgetUsdPerMonth: number;

  @Column({ default: true })
  requireHumanGateOnActions: boolean;

  @Column({ default: 'ACTIVE' })
  status: 'ACTIVE' | 'PAUSED' | 'SUSPENDED';

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
