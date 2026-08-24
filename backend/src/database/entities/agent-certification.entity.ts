import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

export type CertificationLevel =
  | 'COMMUNITY_TESTED'
  | 'PLATFORM_TESTED'
  | 'SECURITY_REVIEWED'
  | 'ENTERPRISE_APPROVED';

@Entity('agent_certifications')
export class AgentCertification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ length: 100 })
  agentId: string;

  @Column({ length: 100 })
  agentName: string;

  @Column({ length: 100, default: 'LipTalk Foundation' })
  developer: string;

  @Column({
    type: 'text',
    default: 'PLATFORM_TESTED',
  })
  certificationTier: CertificationLevel;

  @Column({ type: 'simple-json' })
  toolAllowlist: string[];

  @Column({ type: 'simple-json' })
  dataAccessScopes: string[];

  @Column({ type: 'simple-json', nullable: true })
  sandboxConstraints: {
    maxExecutionTimeMs?: number;
    maxBudgetPerTaskUsd?: number;
    networkOutboundRestricted?: boolean;
    fileAccessRestrictedToProject?: boolean;
  };

  @Column({ type: 'text', nullable: true })
  securityAuditSummary: string;

  @Column({ length: 50, default: 'ACTIVE' })
  status: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
