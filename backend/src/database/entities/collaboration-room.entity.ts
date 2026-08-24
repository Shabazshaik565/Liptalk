import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('collaboration_rooms')
export class CollaborationRoom {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ length: 100 })
  projectId: string;

  @Column({ length: 255 })
  roomName: string;

  @Column({ type: 'text', nullable: true })
  topicFocus: string;

  @Column({ type: 'simple-json', nullable: true })
  activeParticipantIds: string[];

  @Column({ type: 'simple-json', nullable: true })
  assignedAgentIds: string[];

  @Column({ type: 'simple-json', nullable: true })
  realtimeIntelligence: {
    liveMeetingSummary?: string;
    extractedActionItems?: string[];
    unresolvedQuestions?: string[];
    suggestedKnowledgeResources?: string[];
  };

  @Column({ length: 50, default: 'ACTIVE' })
  status: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
