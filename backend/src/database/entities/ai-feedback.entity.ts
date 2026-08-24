import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm';

export enum AiFeedbackType {
  HELPFUL = 'HELPFUL',
  NOT_HELPFUL = 'NOT_HELPFUL',
  INCORRECT = 'INCORRECT',
  UNSAFE = 'UNSAFE',
  IRRELEVANT = 'IRRELEVANT',
}

@Entity('ai_feedback')
export class AiFeedback {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ type: 'varchar', length: 100 })
  userId: string;

  @Column({ type: 'varchar', length: 100 })
  featureOrActionId: string; // Feature name or Action ID

  @Column({
    type: 'simple-enum',
    enum: AiFeedbackType,
    default: AiFeedbackType.HELPFUL,
  })
  feedbackType: AiFeedbackType;

  @Column({ type: 'text', nullable: true })
  comments: string;

  @CreateDateColumn()
  createdAt: Date;
}
