import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';

export type MemoryConflictStatus = 'DETECTED' | 'USER_CONFIRMED' | 'RESOLVED' | 'DISCARDED';

@Entity('memory_conflicts')
export class MemoryConflict {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ length: 100 })
  userId: string;

  @Column({ length: 100 })
  memoryKey: string;

  @Column({ type: 'text' })
  existingMemoryValue: string;

  @Column({ type: 'text' })
  divergentMemoryValue: string;

  @Column({ type: 'text', nullable: true })
  evidenceContext: string;

  @Column({
    type: 'text',
    default: 'DETECTED',
  })
  status: MemoryConflictStatus;

  @Column({ type: 'text', nullable: true })
  resolvedValue: string;

  @CreateDateColumn()
  detectedAt: Date;
}
