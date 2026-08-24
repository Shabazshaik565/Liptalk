import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

export type ResourceCategory = 'PEOPLE_SKILL' | 'TOOLS_EQUIPMENT' | 'KNOWLEDGE_RESEARCH' | 'SERVICES' | 'COMMUNITY_PARTNER';

@Entity('resource_requests')
export class ResourceRequest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ length: 100 })
  projectId: string;

  @Column({ length: 255 })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({
    type: 'text',
    default: 'PEOPLE_SKILL',
  })
  category: ResourceCategory;

  @Column({ type: 'simple-json', nullable: true })
  matchCriteria: {
    skills?: string[];
    locationScope?: string;
    estimatedEffortHours?: number;
  };

  @Column({ type: 'simple-json', nullable: true })
  matchedEntityIds: string[];

  @Column({ length: 50, default: 'OPEN' })
  status: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
