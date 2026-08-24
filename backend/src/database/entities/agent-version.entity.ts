import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('agent_versions')
export class AgentVersion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ length: 100 })
  agentId: string;

  @Column({ length: 50 })
  versionNumber: string;

  @Column({ length: 100 })
  modelIdentifier: string;

  @Column({ type: 'simple-json', nullable: true })
  toolAllowlist: string[];

  @Column({ type: 'simple-json', nullable: true })
  permissionScopes: string[];

  @Column({ type: 'simple-json', nullable: true })
  benchmarkScores: {
    accuracyPercent?: number;
    safetyCompliancePercent?: number;
    averageLatencyMs?: number;
    costEfficiencyIndex?: number;
  };

  @Column({ length: 50, default: 'CANARY' })
  rolloutStatus: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
