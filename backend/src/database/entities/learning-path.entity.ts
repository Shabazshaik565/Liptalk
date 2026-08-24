import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity('learning_paths')
export class LearningPath {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ type: 'varchar', length: 100 })
  userId: string;

  @Column({ type: 'varchar', length: 150 })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'varchar', length: 50, default: 'Engineering' })
  category: string;

  @Column({ type: 'simple-json' })
  modules: Array<{
    id: string;
    title: string;
    completed: boolean;
    estimatedMinutes: number;
    resourceLink?: string;
  }>;

  @Column({ type: 'integer', default: 0 })
  progressPercent: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
