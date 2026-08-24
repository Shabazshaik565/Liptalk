import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

export type ExperimentStatus = 'DRAFT' | 'ACTIVE' | 'PAUSED' | 'CONCLUDED_SUCCESS' | 'ROLLED_BACK';

@Entity('platform_experiments')
export class PlatformExperiment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ length: 100 })
  experimentKey: string;

  @Column({ length: 255 })
  title: string;

  @Column({ type: 'text' })
  hypothesis: string;

  @Column({ length: 100, default: 'usr_curr_01' })
  ownerId: string;

  @Column({ length: 100, default: 'FEED' })
  targetSurface: string;

  @Column({ length: 100, default: '5%_SAMPLE_USERS' })
  targetAudienceSegment: string;

  @Column({ type: 'int', default: 14 })
  durationDays: number;

  @Column({ length: 100 })
  primaryMetric: string;

  @Column({ type: 'simple-json', nullable: true })
  secondaryMetrics: string[];

  @Column({ type: 'simple-json', nullable: true })
  guardrailMetrics: Array<{
    metricName: string;
    thresholdValue: number;
    operator: 'LT' | 'GT';
  }>;

  @Column({ type: 'text', nullable: true })
  rollbackCriteria: string;

  @Column({ type: 'simple-json', nullable: true })
  liveResults: {
    sampleSize?: number;
    primaryMetricLiftPercent?: number;
    guardrailViolationsCount?: number;
    statisticallySignificant?: boolean;
  };

  @Column({
    type: 'text',
    default: 'DRAFT',
  })
  status: ExperimentStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
