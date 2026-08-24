import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('knowledge_conflicts')
export class KnowledgeConflict {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  topic: string;

  @Column({ type: 'simple-json' })
  conflictingSources: Array<{
    sourceName: string;
    claim: string;
    publishedDate: string;
    authorOrCommunity: string;
    confidenceScore: number;
  }>;

  @Column({ type: 'text' })
  aiConflictExplanation: string;

  @Column({ default: 'UNRESOLVED' })
  status: 'UNRESOLVED' | 'CONSENSUS_NOTE_ADDED' | 'DISMISSED';

  @CreateDateColumn()
  detectedAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
