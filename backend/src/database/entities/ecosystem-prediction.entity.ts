import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

export type PredictionDomain =
  | 'COMMUNITY_GROWTH'
  | 'CREATOR_REVENUE'
  | 'EVENT_ATTENDANCE'
  | 'MARKETPLACE_DEMAND'
  | 'PROJECT_COMPLETION'
  | 'INFRASTRUCTURE_LOAD'
  | 'OPPORTUNITY_TREND';

@Entity('ecosystem_predictions')
export class EcosystemPrediction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({
    type: 'text',
    default: 'COMMUNITY_GROWTH',
  })
  domain: PredictionDomain;

  @Index()
  @Column({ length: 100, nullable: true })
  targetEntityId: string;

  @Column({ length: 255 })
  predictionTitle: string;

  @Column({ type: 'text', nullable: true })
  forecastStatement: string;

  @Column({ type: 'float', default: 0.85 })
  confidenceScore: number;

  @Column({ type: 'simple-json', nullable: true })
  uncertaintyBand: {
    lowerBound: number;
    expectedValue: number;
    upperBound: number;
    unit: string;
  };

  @Column({ type: 'simple-json', nullable: true })
  influencingSignals: Array<{
    signalName: string;
    weight: number;
    observation: string;
  }>;

  @Column({ type: 'text', nullable: true })
  aiExplanationRationale: string;

  @Column({ length: 50, default: 'NEXT_90_DAYS' })
  horizon: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
