import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('skill_nodes')
export class SkillNode {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ length: 150 })
  skillName: string;

  @Column({ length: 100, default: 'ENGINEERING' })
  category: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'simple-json', nullable: true })
  relatedSkillIds: string[];

  @Column({ type: 'simple-json', nullable: true })
  learningPathIds: string[];

  @Column({ type: 'simple-json', nullable: true })
  relevantOpportunityIds: string[];

  @Column({ type: 'int', default: 1 })
  proficiencyLevelCount: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
