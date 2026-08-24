import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('agent_team_executions')
export class AgentTeamExecution {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  teamId: string;

  @Column()
  userId: string;

  @Column({ type: 'text' })
  goalPrompt: string;

  @Column({ type: 'simple-json' })
  collaborationTrail: Array<{
    stepIndex: number;
    agentRole: string;
    actionTaken: string;
    inputSummary: string;
    outputSummary: string;
    qualityGatePassed: boolean;
    timestamp: string;
  }>;

  @Column({ type: 'text', nullable: true })
  finalSynthesisResult: string;

  @Column({ default: 'COMPLETED' })
  status: 'RUNNING' | 'COMPLETED' | 'HALTED_QUALITY_GATE' | 'FAILED';

  @Column({ type: 'int', default: 0 })
  totalTokensUsed: number;

  @Column({ type: 'float', default: 0.0 })
  costUsd: number;

  @CreateDateColumn()
  executedAt: Date;
}
