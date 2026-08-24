import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity('ai_prompt_templates')
export class AiPromptTemplate {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 100 })
  slug: string;

  @Column({ type: 'varchar', length: 20, default: '1.0.0' })
  version: string;

  @Column({ type: 'text' })
  systemInstruction: string;

  @Column({ type: 'text' })
  templateText: string;

  @Column({ type: 'simple-json', nullable: true })
  defaultParameters?: {
    temperature?: number;
    maxTokens?: number;
    responseFormat?: 'text' | 'json';
  };

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
