import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('decision_records')
export class DecisionRecord {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  proposalId: string;

  @Column()
  targetEntityId: string;

  @Column()
  title: string;

  @Column()
  decisionOutcome: 'PASSED' | 'REJECTED' | 'CONSENSUS_REACHED' | 'TIED';

  @Column({ type: 'simple-json' })
  finalTally: Record<string, number>;

  @Column({ type: 'text', nullable: true })
  resolutionSummary: string;

  @Column({ type: 'simple-json', nullable: true })
  actionItems: string[];

  @Column({ default: 'HUMAN_LED' })
  governanceType: string;

  @CreateDateColumn()
  resolvedAt: Date;
}
