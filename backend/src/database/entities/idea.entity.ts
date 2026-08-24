import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

export type IdeaVisibility = 'PRIVATE' | 'COMMUNITY' | 'COLLABORATIVE' | 'PUBLIC';
export type IdeaStatus = 'DRAFT' | 'DISCOVERABLE' | 'VALIDATING' | 'CONVERTED_TO_PROJECT' | 'ARCHIVED';

@Entity('ideas')
export class Idea {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ length: 100 })
  authorId: string;

  @Column({ length: 255 })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'text', nullable: true })
  problemStatement: string;

  @Column({ type: 'text', nullable: true })
  proposedSolution: string;

  @Column({ length: 100, default: 'TECHNOLOGY' })
  category: string;

  @Column({ type: 'simple-json', nullable: true })
  skillsRequired: string[];

  @Column({ type: 'simple-json', nullable: true })
  resourcesRequired: string[];

  @Column({ type: 'simple-json', nullable: true })
  relatedCommunityIds: string[];

  @Column({ type: 'simple-json', nullable: true })
  relatedTopicTags: string[];

  @Column({
    type: 'text',
    default: 'PUBLIC',
  })
  visibility: IdeaVisibility;

  @Column({ type: 'simple-json', nullable: true })
  aiValidationReport: {
    factualPrecedents?: string[];
    sourceReferences?: string[];
    feasibilityInferences?: string[];
    growthPredictions?: string[];
    validationScore?: number;
  };

  @Column({ length: 100, nullable: true })
  convertedProjectId: string;

  @Column({
    type: 'text',
    default: 'DISCOVERABLE',
  })
  status: IdeaStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
