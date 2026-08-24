import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Unique } from 'typeorm';

@Entity('proposal_votes')
@Unique(['proposalId', 'userId'])
export class ProposalVote {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  proposalId: string;

  @Column()
  userId: string;

  @Column()
  selectedOption: string;

  @Column({ nullable: true })
  comment: string;

  @CreateDateColumn()
  votedAt: Date;
}
