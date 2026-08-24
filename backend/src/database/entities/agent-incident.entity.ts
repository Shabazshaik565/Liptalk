import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

export type IncidentSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type IncidentResolutionStatus = 'DETECTED' | 'CONTAINED' | 'INVESTIGATING' | 'RESOLVED';

@Entity('agent_incidents')
export class AgentIncident {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  agentOrTeamId: string;

  @Column()
  incidentType: 'BUDGET_EXCEEDED' | 'UNAUTHORIZED_TOOL_ATTEMPT' | 'POLICY_VIOLATION' | 'RECURSION_DETECTED' | 'HALLUCINATION_FLAGGED';

  @Column({ default: 'MEDIUM' })
  severity: IncidentSeverity;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'simple-json', nullable: true })
  isolatedStatePayload: Record<string, any>;

  @Column({ default: 'CONTAINED' })
  status: IncidentResolutionStatus;

  @Column({ default: true })
  isKillSwitchEngaged: boolean;

  @Column({ nullable: true })
  resolvedBy: string;

  @CreateDateColumn()
  createdAt: Date;
}
