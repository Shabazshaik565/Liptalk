import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export type SystemIncidentCategory = 'SECURITY' | 'FRAUD_ABUSE' | 'INFRASTRUCTURE' | 'AI_AGENT_FAILURE' | 'NETWORK_EDGE';

@Entity('incident_records')
export class IncidentRecord {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: 'INFRASTRUCTURE' })
  category: SystemIncidentCategory;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ default: 'MEDIUM' })
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

  @Column({ default: 'OPEN' })
  status: 'OPEN' | 'CONTAINED' | 'HEALED_AUTOMATICALLY' | 'RESOLVED';

  @Column({ type: 'simple-json', nullable: true })
  affectedSubsystems: string[];

  @Column({ type: 'simple-json', nullable: true })
  automatedRecoveryActions: string[];

  @Column({ type: 'text', nullable: true })
  aiOperationsRemediationNote: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
