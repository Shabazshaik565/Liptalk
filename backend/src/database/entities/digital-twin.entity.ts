import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

export type DigitalTwinType = 'PERSONAL' | 'CREATOR' | 'COMMUNITY' | 'PROJECT' | 'ORGANIZATION';

@Entity('digital_twins')
export class DigitalTwin {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ length: 100 })
  ownerId: string;

  @Column({
    type: 'text',
    default: 'PERSONAL',
  })
  twinType: DigitalTwinType;

  @Column({ length: 255, default: 'My Digital Twin' })
  displayName: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'simple-json', nullable: true })
  stateSnapshot: {
    goals?: string[];
    interests?: string[];
    projects?: string[];
    knowledgeTopics?: string[];
    communities?: string[];
    contentThemes?: string[];
    publishingCadence?: string;
    rulesSummary?: string;
    milestonePacing?: string;
  };

  @Column({ type: 'simple-json', nullable: true })
  preferences: {
    ambientBriefingsEnabled?: boolean;
    recommendationAggressiveness?: 'CONSERVATIVE' | 'BALANCED' | 'EXPLORATORY';
    allowAutonomousAgentAssistance?: boolean;
    syncWithExternalCalendar?: boolean;
  };

  @Column({ type: 'simple-json', nullable: true })
  privacyControls: {
    isDiscoverable?: boolean;
    shareAggregatedMetricsOnly?: boolean;
    retainEventMemoryDays?: number;
    allowCrossDomainInference?: boolean;
  };

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
