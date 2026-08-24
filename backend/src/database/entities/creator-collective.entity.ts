import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('creator_collectives')
export class CreatorCollective {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  founderId: string;

  @Column()
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ default: 'CONTENT_CREATORS' })
  category: string;

  @Column({ type: 'simple-json' })
  members: Array<{
    creatorId: string;
    role: 'FOUNDER' | 'CORE_CREATOR' | 'GUEST_ARTIST';
    revenueSplitPercentage: number;
    joinedAt: string;
  }>;

  @Column({ type: 'int', default: 0 })
  sharedSubscriptionPrice: number;

  @Column({ default: 'INR' })
  currency: string;

  @Column({ type: 'simple-json', nullable: true })
  jointOfferings: string[];

  @Column({ type: 'int', default: 0 })
  totalCollectiveEarnings: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
