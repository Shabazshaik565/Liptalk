import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';

@Entity('ai_model_evaluations')
export class AiModelEvaluation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ length: 100 })
  modelIdentifier: string;

  @Column({ length: 100 })
  evaluationTaskDomain: string;

  @Column({ type: 'float', default: 0.0 })
  qualityScore: number;

  @Column({ type: 'float', default: 0.0 })
  averageLatencyMs: number;

  @Column({ type: 'float', default: 0.0 })
  costPer1kTokensUsd: number;

  @Column({ type: 'simple-json', nullable: true })
  redTeamResults: {
    promptInjectionResistancePercent: number;
    hallucinationRatePercent: number;
    toolAbuseResistancePercent: number;
    dataLeakageTestsPassed: boolean;
  };

  @Column({ length: 50, default: 'ACTIVE' })
  routingReadinessStatus: string;

  @CreateDateColumn()
  evaluatedAt: Date;
}
