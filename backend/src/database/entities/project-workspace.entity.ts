import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity('project_workspaces')
export class ProjectWorkspace {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ type: 'varchar', length: 100 })
  ownerId: string; // User or Organization ID

  @Column({ type: 'varchar', length: 150 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 50, default: 'COMMUNITY_OPEN_SOURCE' })
  scope: 'COMMUNITY_OPEN_SOURCE' | 'ORGANIZATION_PRIVATE' | 'CREATOR_COLLABORATION';

  @Column({ type: 'simple-json', nullable: true })
  members: Array<{
    userId: string;
    role: 'LEAD' | 'CONTRIBUTOR' | 'REVIEWER' | 'OBSERVER';
    joinedAt: string;
  }>;

  @Column({ type: 'simple-json', nullable: true })
  milestones: Array<{
    id: string;
    title: string;
    dueDate: string;
    completed: boolean;
  }>;

  @Column({ type: 'simple-json', nullable: true })
  tasks: Array<{
    id: string;
    title: string;
    assigneeId?: string;
    status: 'TODO' | 'IN_PROGRESS' | 'IN_REVIEW' | 'DONE';
    priority: 'LOW' | 'MEDIUM' | 'HIGH';
  }>;

  @Column({ type: 'integer', default: 0 })
  progressPercent: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
