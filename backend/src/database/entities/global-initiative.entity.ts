import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export type InitiativeStatus = 'PROPOSED' | 'ACTIVE' | 'PAUSED' | 'CONCLUDED';

@Entity('global_initiatives')
export class GlobalInitiative {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  creatorId: string;

  @Column()
  title: string;

  @Column({ type: 'text' })
  mission: string;

  @Column({ default: 'Global Innovation' })
  category: string;

  @Column({ type: 'simple-json', nullable: true })
  targetRegions: string[];

  @Column({ type: 'simple-json', nullable: true })
  partnerCommunityIds: string[];

  @Column({ type: 'simple-json', nullable: true })
  partnerOrganizationIds: string[];

  @Column({ type: 'int', default: 0 })
  supportersCount: number;

  @Column({ type: 'int', default: 0 })
  fundingGoalAmount: number;

  @Column({ default: 'INR' })
  currency: string;

  @Column({ type: 'int', default: 0 })
  fundingRaisedAmount: number;

  @Column({ default: 'ACTIVE' })
  status: InitiativeStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
