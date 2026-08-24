import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

export interface HumanMember {
  userId: string;
  role: 'OWNER' | 'MANAGER' | 'CONTRIBUTOR' | 'REVIEWER' | 'OBSERVER';
  joinedAt: string;
}

export interface AiMember {
  agentId: string;
  agentName: string;
  agentRole: 'RESEARCH_AGENT' | 'PLANNING_AGENT' | 'DOCUMENTATION_AGENT' | 'QA_AGENT' | 'COORDINATOR';
  toolAllowlist: string[];
  budgetLimitUsd: number;
}

@Entity('human_ai_teams')
export class HumanAiTeam {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ length: 100 })
  projectId: string;

  @Column({ length: 255 })
  teamName: string;

  @Column({ type: 'text', nullable: true })
  missionStatement: string;

  @Column({ type: 'simple-json' })
  humanMembers: HumanMember[];

  @Column({ type: 'simple-json' })
  aiMembers: AiMember[];

  @Column({ type: 'simple-json', nullable: true })
  aiProjectManagerTelemetry: {
    activeMilestone?: string;
    identifiedBlockers?: string[];
    progressScore?: number;
    lastReportGeneratedAt?: string;
  };

  @Column({ length: 50, default: 'ACTIVE' })
  status: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
