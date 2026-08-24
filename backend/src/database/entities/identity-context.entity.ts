import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export type ContextType = 'PERSONAL' | 'CREATOR' | 'DEVELOPER' | 'ORGANIZATION_MEMBER' | 'COMMUNITY_MODERATOR';

@Entity('identity_contexts')
export class IdentityContext {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column({ default: 'PERSONAL' })
  activeContextType: ContextType;

  @Column({ nullable: true })
  targetEntityId: string; // e.g. organizationId or communityId if in org/mod context

  @Column({ type: 'simple-json' })
  availableContexts: Array<{
    contextType: ContextType;
    entityId?: string;
    entityName: string;
    role: string;
    reputationScore: number;
  }>;

  @Column({ type: 'simple-json', nullable: true })
  scopedPermissions: string[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
