import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

export type ScenarioScope = 'PERSONAL' | 'CREATOR' | 'COMMUNITY' | 'PROJECT' | 'ORGANIZATION' | 'GLOBAL_LAB';
export type ScenarioStatus = 'DRAFT' | 'RUNNING' | 'COMPLETED' | 'FAILED';

@Entity('simulation_scenarios')
export class SimulationScenario {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ length: 100 })
  creatorId: string;

  @Column({ length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  hypothesis: string;

  @Column({
    type: 'text',
    default: 'COMMUNITY',
  })
  scope: ScenarioScope;

  @Column({ type: 'simple-json', nullable: true })
  startingStateSnapshot: Record<string, any>;

  @Column({ type: 'simple-json', nullable: true })
  variablePerturbations: Array<{
    variableName: string;
    baselineValue: any;
    simulatedValue: any;
    unit?: string;
  }>;

  @Column({ length: 50, default: '30_DAYS' })
  timeHorizon: string;

  @Column({
    type: 'text',
    default: 'DRAFT',
  })
  status: ScenarioStatus;

  @Column({ type: 'simple-json', nullable: true })
  simulationResults: {
    expectedOutcomes?: Array<{ metric: string; deltaPercent: number; outcomeSummary: string }>;
    riskFactors?: Array<{ riskTitle: string; severity: 'LOW' | 'MEDIUM' | 'HIGH'; description: string }>;
    estimatedCostDeltaUsd?: number;
    resourceLoadImpact?: string;
    uncertaintyConfidencePercent?: number;
    aiSimulationExecutiveSummary?: string;
  };

  @Column({ default: true })
  isIsolatedSnapshotOnly: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
