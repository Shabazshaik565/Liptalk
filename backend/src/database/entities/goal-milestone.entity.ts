import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('goal_milestones')
export class GoalMilestone {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  goalId: string;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: true })
  dueDate: string;

  @Column({ default: false })
  isCompleted: boolean;

  @Column({ nullable: true })
  verifiedBy: string;

  @Column({ nullable: true })
  completedAt: string;

  @CreateDateColumn()
  createdAt: Date;
}
