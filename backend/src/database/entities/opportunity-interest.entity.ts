import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Opportunity } from './opportunity.entity';
import { User } from './user.entity';

export enum InterestStatus {
  SUBMITTED = 'SUBMITTED',
  REVIEWED = 'REVIEWED',
  SHORTLISTED = 'SHORTLISTED',
  REJECTED = 'REJECTED',
}

@Entity('opportunity_interests')
export class OpportunityInterest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Opportunity, (opp) => opp.interests, { onDelete: 'CASCADE' })
  opportunity: Opportunity;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User;

  @Column({ type: 'text' })
  proposalMessage: string;

  @Column({ type: 'numeric', nullable: true })
  pitchAmount: number;

  @Column({
    type: 'simple-enum',
    enum: InterestStatus,
    default: InterestStatus.SUBMITTED,
  })
  status: InterestStatus;

  @CreateDateColumn()
  createdAt: Date;
}
