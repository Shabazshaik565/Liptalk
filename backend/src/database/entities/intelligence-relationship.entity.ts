import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';

export type RelationshipType =
  | 'FOLLOWS'
  | 'MEMBER_OF'
  | 'CREATED'
  | 'CONTRIBUTES_TO'
  | 'ATTENDS'
  | 'RELATED_TO'
  | 'USES'
  | 'OFFERS'
  | 'REQUIRES'
  | 'COLLABORATES_WITH'
  | 'DEPENDS_ON'
  | 'REFERENCES';

@Entity('intelligence_relationships')
export class IntelligenceRelationship {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ length: 100 })
  sourceEntityId: string;

  @Column({ length: 50 })
  sourceEntityType: string;

  @Index()
  @Column({ length: 100 })
  targetEntityId: string;

  @Column({ length: 50 })
  targetEntityType: string;

  @Column({
    type: 'text',
    default: 'RELATED_TO',
  })
  relationshipType: RelationshipType;

  @Column({ type: 'float', default: 1.0 })
  relationshipWeight: number;

  @Column({ type: 'simple-json', nullable: true })
  metadata: Record<string, any>;

  @Column({ length: 50, default: 'PUBLIC' })
  visibilityScope: string;

  @CreateDateColumn()
  createdAt: Date;
}
