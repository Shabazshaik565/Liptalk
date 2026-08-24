import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('knowledge_versions')
export class KnowledgeVersion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  collectionId: string;

  @Column()
  editorId: string;

  @Column({ type: 'int' })
  versionNumber: number;

  @Column()
  title: string;

  @Column({ type: 'text' })
  contentSummary: string;

  @Column({ type: 'simple-json', nullable: true })
  deltaChanges: string[];

  @Column({ nullable: true })
  commitMessage: string;

  @CreateDateColumn()
  createdAt: Date;
}
