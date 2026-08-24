import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';

export type ThreatSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type ThreatStatus = 'OPEN' | 'AUTO_CONTAINED' | 'REVIEWED' | 'RESOLVED';

@Entity('security_threat_events')
export class SecurityThreatEvent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ length: 100 })
  threatType: string;

  @Column({ length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ length: 100, nullable: true })
  targetEntityId: string;

  @Column({
    type: 'text',
    default: 'MEDIUM',
  })
  severity: ThreatSeverity;

  @Column({ type: 'simple-json', nullable: true })
  automatedBoundedResponse: {
    actionTaken?: 'TOKEN_REVOKED' | 'API_KEY_SUSPENDED' | 'RATE_LIMITED' | 'SESSION_TERMINATED';
    targetId?: string;
    reversible?: boolean;
    executedAt?: string;
  };

  @Column({
    type: 'text',
    default: 'AUTO_CONTAINED',
  })
  status: ThreatStatus;

  @CreateDateColumn()
  detectedAt: Date;
}
