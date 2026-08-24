import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';

@Entity('platform_health_snapshots')
export class PlatformHealthSnapshot {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ length: 50, default: 'GLOBAL' })
  region: string;

  @Column({ type: 'float', default: 99.98 })
  availabilityPercent: number;

  @Column({ type: 'float', default: 42.0 })
  averageLatencyMs: number;

  @Column({ type: 'float', default: 99.6 })
  securityScore: number;

  @Column({ type: 'float', default: 98.4 })
  aiQualityScore: number;

  @Column({ type: 'float', default: 99.2 })
  dataQualityScore: number;

  @Column({ type: 'float', default: 95.0 })
  uxSatisfactionIndex: number;

  @Column({ type: 'float', default: 92.5 })
  costEfficiencyIndex: number;

  @Column({ type: 'simple-json', nullable: true })
  diagnosticWarnings: string[];

  @CreateDateColumn()
  recordedAt: Date;
}
