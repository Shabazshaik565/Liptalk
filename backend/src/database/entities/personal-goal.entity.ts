import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity('personal_goals')
export class PersonalGoal {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ type: 'varchar', length: 100 })
  userId: string;

  @Column({ type: 'varchar', length: 150 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 50, default: 'SKILL_GROWTH' })
  category: 'SKILL_GROWTH' | 'COMMERCE_EXPANSION' | 'COMMUNITY_LEADERSHIP' | 'COLLABORATION';

  @Column({ type: 'integer', default: 0 })
  progressPercent: number;

  @Column({ type: 'varchar', length: 50, default: 'IN_PROGRESS' })
  status: 'IN_PROGRESS' | 'COMPLETED' | 'PAUSED';

  @Column({ type: 'simple-array', nullable: true })
  connectedEntityIds: string[]; // Connected Communities, Projects, or Knowledge items

  @Column({ type: 'datetime', nullable: true })
  targetDate?: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
