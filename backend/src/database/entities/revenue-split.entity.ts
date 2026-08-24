import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm';

@Entity('revenue_splits')
export class RevenueSplit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ type: 'varchar', length: 100 })
  transactionId: string;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  totalGrossAmount: number;

  @Column({ type: 'varchar', length: 10, default: 'INR' })
  currency: string;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  platformFeeAmount: number; // e.g. 5% platform fee

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  creatorNetAmount: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  collaboratorNetAmount: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  communityShareAmount: number;

  @Column({ type: 'varchar', length: 50, default: 'SETTLED' })
  status: 'PENDING_ESCROW' | 'SETTLED' | 'REFUNDED' | 'DISPUTED';

  @CreateDateColumn()
  createdAt: Date;
}
