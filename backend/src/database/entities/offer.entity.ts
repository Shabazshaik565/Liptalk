import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

export enum OfferPricing {
  HOURLY = 'HOURLY',
  FIXED = 'FIXED',
  RETAINER = 'RETAINER',
  CUSTOM = 'CUSTOM',
}

export enum OfferStatus {
  ACTIVE = 'ACTIVE',
  PAUSED = 'PAUSED',
}

@Entity('offers')
export class Offer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.offers, { onDelete: 'CASCADE' })
  user: User;

  @Column({ default: 'USER' })
  ownerType: 'USER' | 'BUSINESS';

  @Column({ nullable: true })
  ownerId: string;

  @Column({ nullable: true })
  categoryId: string;

  @Column({ default: 'General' })
  categoryName: string;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column('simple-array', { nullable: true })
  tags: string[];

  @Column({
    type: 'simple-enum',
    enum: OfferPricing,
    default: OfferPricing.FIXED,
  })
  pricingModel: OfferPricing;

  @Column({ default: 'Bangalore' })
  city: string;

  @Column({
    type: 'simple-enum',
    enum: OfferStatus,
    default: OfferStatus.ACTIVE,
  })
  status: OfferStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
