import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity('ai_user_memories')
export class AiUserMemory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ type: 'varchar', length: 100 })
  userId: string;

  @Index()
  @Column({ type: 'varchar', length: 50, default: 'PREFERENCE' })
  category: 'PREFERENCE' | 'INTEREST' | 'INTERACTION' | 'SAVED_CONTEXT' | 'EXPLICIT_MEMORY';

  @Column({ type: 'varchar', length: 100 })
  key: string;

  @Column({ type: 'text' })
  value: string;

  @Column({ type: 'float', default: 1.0 })
  confidence: number;

  @Column({ type: 'datetime', nullable: true })
  expiresAt?: Date;

  @Column({ type: 'boolean', default: false })
  isPinned: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
