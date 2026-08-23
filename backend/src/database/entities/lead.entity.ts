import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Business } from './business.entity';
import { User } from './user.entity';
import { Opportunity } from './opportunity.entity';
import { LeadNote } from './lead-note.entity';

export enum LeadStatus {
  NEW = 'NEW',
  CONTACTED = 'CONTACTED',
  IN_DISCUSSION = 'IN_DISCUSSION',
  QUALIFIED = 'QUALIFIED',
  CONVERTED = 'CONVERTED',
  LOST = 'LOST',
}

export enum LeadSource {
  MATCH = 'MATCH',
  OPPORTUNITY = 'OPPORTUNITY',
  DIRECT_NETWORK = 'DIRECT_NETWORK',
  PARTNER = 'PARTNER',
}

@Entity('leads')
export class Lead {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Business, (biz) => biz.leads, { onDelete: 'CASCADE' })
  business: Business;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  contactUser: User;

  @ManyToOne(() => Opportunity, { nullable: true, onDelete: 'SET NULL' })
  opportunity: Opportunity;

  @Column()
  title: string;

  @Column({
    type: 'simple-enum',
    enum: LeadSource,
    default: LeadSource.MATCH,
  })
  source: LeadSource;

  @Column({
    type: 'simple-enum',
    enum: LeadStatus,
    default: LeadStatus.NEW,
  })
  status: LeadStatus;

  @Column({ type: 'numeric', nullable: true })
  estimatedValue: number;

  @Column({ default: 'INR' })
  currency: string;

  @OneToMany(() => LeadNote, (note) => note.lead)
  notes: LeadNote[];

  @Column({ nullable: true })
  lastContactedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
