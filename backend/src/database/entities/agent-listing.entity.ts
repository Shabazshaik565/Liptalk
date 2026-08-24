import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity('agent_listings')
export class AgentListing {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ type: 'varchar', length: 100 })
  developerId: string;

  @Column({ type: 'varchar', length: 120 })
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'varchar', length: 50, default: 'Productivity' })
  category: string; // e.g. 'Productivity', 'E-Commerce', 'B2B Sourcing', 'Community Moderation'

  @Column({ type: 'varchar', length: 50, default: 'FREE' })
  pricingModel: 'FREE' | 'ONE_TIME' | 'MONTHLY_SUBSCRIPTION';

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  price: number;

  @Column({ type: 'simple-array' })
  requiredScopes: string[];

  @Column({ type: 'varchar', length: 50, default: 'CERTIFIED' })
  certificationStatus: 'PENDING_REVIEW' | 'CERTIFIED' | 'REVOKED';

  @Column({ type: 'float', default: 4.9 })
  rating: number;

  @Column({ type: 'integer', default: 0 })
  installsCount: number;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
