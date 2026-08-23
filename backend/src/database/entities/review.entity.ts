import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  Unique,
} from 'typeorm';
import { User } from './user.entity';
import { MarketplaceListing } from './marketplace-listing.entity';

@Entity('reviews')
@Unique(['reviewer', 'provider', 'listing'])
export class Review {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  reviewer: User;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  provider: User;

  @ManyToOne(() => MarketplaceListing, { nullable: true, onDelete: 'SET NULL' })
  listing: MarketplaceListing;

  @Column({ type: 'int', default: 5 })
  rating: number; // 1 to 5

  @Column({ type: 'text' })
  comment: string;

  @CreateDateColumn()
  createdAt: Date;
}
