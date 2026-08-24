import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity('personal_tasks')
export class PersonalTask {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ type: 'varchar', length: 100 })
  userId: string;

  @Column({ type: 'varchar', length: 150 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 50, default: 'MEDIUM' })
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

  @Column({ type: 'varchar', length: 50, default: 'TODO' })
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';

  @Column({ type: 'varchar', length: 100, nullable: true })
  goalId?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  projectId?: string;

  @Column({ type: 'datetime', nullable: true })
  dueDate?: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
