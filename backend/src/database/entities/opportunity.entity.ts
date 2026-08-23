import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Business } from './business.entity';
import { OpportunityInterest } from './opportunity-interest.entity';

export enum OpportunityStatus {
  OPEN = 'OPEN',
  IN_DISCUSSION = 'IN_DISCUSSION',
  CLOSED = 'CLOSED',
  EXPIRED = 'EXPIRED',
}

@Entity('opportunities')
export class Opportunity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  creator: User;

  @ManyToOne(() => Business, (biz) => biz.opportunities, { nullable: true, onDelete: 'SET NULL' })
  business: Business;

  @Column({ nullable: true })
  categoryId: string;

  @Column({ default: 'General' })
  categoryName: string;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column('simple-array', { nullable: true })
  tags: string[];

  @Column({ type: 'numeric', nullable: true })
  budgetAmount: number;

  @Column({ default: 'INR' })
  currency: string;

  @Column({ nullable: true })
  deadline: string;

  @Column({ default: 'Bangalore' })
  city: string;

  @Column({
    type: 'simple-enum',
    enum: OpportunityStatus,
    default: OpportunityStatus.OPEN,
  })
  status: OpportunityStatus;

  @OneToMany(() => OpportunityInterest, (interest) => interest.opportunity)
  interests: OpportunityInterest[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
