import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

export enum ListingPricingType {
  FIXED = 'FIXED',
  HOURLY = 'HOURLY',
  NEGOTIABLE = 'NEGOTIABLE',
  CONTACT_FOR_PRICE = 'CONTACT_FOR_PRICE',
}

export enum ListingStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  PAUSED = 'PAUSED',
  ARCHIVED = 'ARCHIVED',
}

export enum ListingPromotionType {
  NORMAL = 'NORMAL',
  PROMOTED = 'PROMOTED',
  FEATURED = 'FEATURED',
}

@Entity('marketplace_listings')
export class MarketplaceListing {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  provider: User;

  @Column()
  title: string;

  @Column({ unique: true })
  slug: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ default: 'General Services' })
  category: string;

  @Column({
    type: 'simple-enum',
    enum: ListingPricingType,
    default: ListingPricingType.FIXED,
  })
  pricingType: ListingPricingType;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  price: number;

  @Column({ default: 'INR' })
  currency: string;

  @Column({ default: 'Bangalore' })
  location: string;

  @Column({ type: 'simple-array', nullable: true })
  tags: string[];

  @Column({ type: 'simple-array', nullable: true })
  imageUrls: string[];

  @Column({
    type: 'simple-enum',
    enum: ListingStatus,
    default: ListingStatus.PUBLISHED,
  })
  status: ListingStatus;

  @Column({
    type: 'simple-enum',
    enum: ListingPromotionType,
    default: ListingPromotionType.NORMAL,
  })
  promotionType: ListingPromotionType;

  @Column({ type: 'float', default: 5.0 })
  averageRating: number;

  @Column({ default: 0 })
  reviewsCount: number;

  @Column({ default: 0 })
  requestsCount: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
