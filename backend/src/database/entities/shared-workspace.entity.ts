import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export type WorkspaceType = 'CROSS_COMMUNITY' | 'ORGANIZATION_FEDERATED' | 'CREATOR_ALLIANCE' | 'OPEN_RESEARCH';

@Entity('shared_workspaces')
export class SharedWorkspace {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  creatorId: string;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ default: 'CROSS_COMMUNITY' })
  type: WorkspaceType;

  @Column({ type: 'simple-json', nullable: true })
  participatingCommunityIds: string[];

  @Column({ type: 'simple-json', nullable: true })
  members: Array<{ userId: string; role: 'ADMIN' | 'MEMBER' | 'OBSERVER'; joinedAt: string }>;

  @Column({ type: 'simple-json', nullable: true })
  linkedProjectIds: string[];

  @Column({ type: 'simple-json', nullable: true })
  linkedKnowledgeIds: string[];

  @Column({ type: 'simple-json', nullable: true })
  assignedAgentTeamIds: string[];

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
