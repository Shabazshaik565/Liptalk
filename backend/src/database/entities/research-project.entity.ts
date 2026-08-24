import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('research_projects')
export class ResearchProject {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  leadUserId: string;

  @Column()
  title: string;

  @Column({ type: 'text' })
  researchQuestion: string;

  @Column({ type: 'simple-json', nullable: true })
  hypotheses: string[];

  @Column({ type: 'simple-json', nullable: true })
  evidenceSources: Array<{
    title: string;
    url?: string;
    summary: string;
    verified: boolean;
  }>;

  @Column({ type: 'simple-json', nullable: true })
  findingsNotes: string[];

  @Column({ type: 'text', nullable: true })
  aiSynthesizedReport: string;

  @Column({ default: 'IN_PROGRESS' })
  status: 'PLANNING' | 'IN_PROGRESS' | 'PEER_REVIEW' | 'PUBLISHED';

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
