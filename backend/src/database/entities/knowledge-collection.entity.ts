import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity('knowledge_collections')
export class KnowledgeCollection {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ type: 'varchar', length: 100 })
  userId: string;

  @Column({ type: 'varchar', length: 100 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 50, default: 'General' })
  category: string;

  @Column({ type: 'simple-array', nullable: true })
  tags: string[];

  @Column({ type: 'simple-json', nullable: true })
  items: Array<{
    id: string;
    itemType: 'POST' | 'COMMUNITY' | 'EVENT' | 'NOTE' | 'LINK' | 'DOCUMENT';
    title: string;
    content: string;
    sourceUrl?: string;
    addedAt: string;
  }>;

  @Column({ type: 'boolean', default: false })
  isPublic: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
