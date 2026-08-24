import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('feedback_clusters')
export class FeedbackCluster {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ length: 100 })
  clusterCategory: string;

  @Column({ length: 255 })
  clusterTheme: string;

  @Column({ type: 'int', default: 1 })
  feedbackItemsCount: number;

  @Column({ length: 50, default: 'MEDIUM' })
  urgencyLevel: string;

  @Column({ type: 'simple-json', nullable: true })
  representativeQuotes: string[];

  @Column({ type: 'text', nullable: true })
  aiRoadmapRecommendation: string;

  @Column({ length: 50, default: 'UNDER_REVIEW' })
  status: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
