import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';

export type RecommendationFeedbackType =
  | 'VIEWED'
  | 'HELPFUL'
  | 'NOT_RELEVANT'
  | 'DISMISSED'
  | 'SHOW_MORE'
  | 'SHOW_LESS';

@Entity('recommendation_events')
export class RecommendationEvent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ length: 100 })
  userId: string;

  @Column({ length: 100 })
  itemType: string;

  @Column({ length: 100 })
  itemId: string;

  @Column({ length: 255 })
  itemTitle: string;

  @Column({ type: 'text', nullable: true })
  explanationReason: string;

  @Column({ type: 'float', default: 0.9 })
  relevanceScore: number;

  @Column({
    type: 'text',
    default: 'VIEWED',
  })
  feedback: RecommendationFeedbackType;

  @CreateDateColumn()
  createdAt: Date;
}
