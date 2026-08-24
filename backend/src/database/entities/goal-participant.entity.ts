import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

export type GoalRole = 'LEAD' | 'MAINTAINER' | 'CONTRIBUTOR' | 'ADVISOR' | 'OBSERVER';

@Entity('goal_participants')
export class GoalParticipant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  goalId: string;

  @Column()
  userId: string;

  @Column({ default: 'CONTRIBUTOR' })
  role: GoalRole;

  @Column({ type: 'int', default: 0 })
  contributionsCount: number;

  @CreateDateColumn()
  joinedAt: Date;
}
