import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm';

@Entity('entitlements')
export class Entitlement {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ type: 'varchar', length: 100 })
  userId: string;

  @Column({ type: 'varchar', length: 100 })
  featureKey: string; // e.g. 'CREATOR_EXCLUSIVE_FEED', 'AGENT_UNLIMITED_STEPS', 'DEV_HIGH_RATE_LIMIT'

  @Column({ type: 'varchar', length: 100, nullable: true })
  scopeEntityId: string; // e.g. Specific Creator ID or Community ID

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'datetime', nullable: true })
  expiresAt?: Date;

  @CreateDateColumn()
  createdAt: Date;
}
