import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm';

@Entity('ai_usage_logs')
export class AiUsageLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ type: 'varchar', length: 100 })
  userId: string;

  @Index()
  @Column({ type: 'varchar', length: 50 })
  feature: string;

  @Column({ type: 'varchar', length: 50 })
  model: string;

  @Column({ type: 'varchar', length: 50 })
  provider: string;

  @Column({ type: 'integer', default: 0 })
  inputTokens: number;

  @Column({ type: 'integer', default: 0 })
  outputTokens: number;

  @Column({ type: 'float', default: 0.0 })
  estimatedCostUsd: number;

  @Column({ type: 'integer', default: 0 })
  latencyMs: number;

  @Index()
  @Column({ type: 'varchar', length: 30, default: 'SUCCESS' })
  status: 'SUCCESS' | 'ERROR' | 'BLOCKED_POLICY' | 'RATE_LIMITED' | 'TIMEOUT';

  @Column({ type: 'text', nullable: true })
  errorMessage?: string;

  @CreateDateColumn()
  createdAt: Date;
}
