import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity('creator_services')
export class CreatorService {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ type: 'varchar', length: 100 })
  creatorId: string;

  @Column({ type: 'varchar', length: 150 })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'varchar', length: 50, default: 'Consulting' })
  category: string; // e.g. 'Consulting', 'Design', 'Architecture Review', '1-on-1 Mentorship'

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  price: number;

  @Column({ type: 'varchar', length: 10, default: 'INR' })
  currency: string;

  @Column({ type: 'varchar', length: 50, default: 'FIXED' })
  pricingModel: 'FIXED' | 'HOURLY' | 'MONTHLY_RETAINER';

  @Column({ type: 'float', default: 5.0 })
  averageRating: number;

  @Column({ type: 'integer', default: 0 })
  completedOrdersCount: number;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
