import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Opportunity } from './opportunity.entity';
import { MarketplaceListing } from './marketplace-listing.entity';

export enum ContentType {
  ANNOUNCEMENT = 'ANNOUNCEMENT',
  EDUCATIONAL = 'EDUCATIONAL',
  WORKSHOP = 'WORKSHOP',
  SHOWCASE = 'SHOWCASE',
}

@Entity('professional_contents')
export class ProfessionalContent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  author: User;

  @Column({
    type: 'simple-enum',
    enum: ContentType,
    default: ContentType.ANNOUNCEMENT,
  })
  contentType: ContentType;

  @Column()
  title: string;

  @Column({ type: 'text' })
  body: string;

  @Column('simple-array', { nullable: true })
  mediaUrls: string[];

  @Column('simple-array', { nullable: true })
  tags: string[];

  @Column({ type: 'int', default: 0 })
  likesCount: number;

  @Column({ type: 'int', default: 0 })
  viewsCount: number;

  @ManyToOne(() => Opportunity, { nullable: true, onDelete: 'SET NULL' })
  linkedOpportunity: Opportunity;

  @ManyToOne(() => MarketplaceListing, { nullable: true, onDelete: 'SET NULL' })
  linkedListing: MarketplaceListing;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
