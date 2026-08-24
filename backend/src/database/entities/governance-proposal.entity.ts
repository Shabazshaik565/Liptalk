import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export type ProposalScope = 'COMMUNITY' | 'PROJECT' | 'CREATOR_COLLECTIVE' | 'GLOBAL_INITIATIVE';
export type ProposalStatus = 'ACTIVE' | 'PASSED' | 'REJECTED' | 'EXPIRED';

@Entity('governance_proposals')
export class GovernanceProposal {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  creatorId: string;

  @Column()
  targetEntityId: string;

  @Column({ default: 'COMMUNITY' })
  scope: ProposalScope;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'simple-json', nullable: true })
  options: string[]; // e.g. ["APPROVE", "REJECT", "ABSTAIN"] or custom options

  @Column({ type: 'simple-json', nullable: true })
  voteCounts: Record<string, number>;

  @Column({ type: 'text', nullable: true })
  aiSummary: string;

  @Column({ type: 'simple-json', nullable: true })
  aiKeyTakeaways: string[];

  @Column({ default: 'ACTIVE' })
  status: ProposalStatus;

  @Column()
  votingDeadline: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
