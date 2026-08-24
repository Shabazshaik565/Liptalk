import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

export type ConsequentialActionType =
  | 'PUBLISH_CONTENT'
  | 'EXECUTE_PAYMENT'
  | 'MODIFY_PERMISSIONS'
  | 'DELETE_RESOURCE'
  | 'CHANGE_SECURITY_POLICY';

export type ApprovalStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'EXPIRED';

@Entity('human_approval_requests')
export class HumanApprovalRequest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ length: 100 })
  requesterAgentOrUserId: string;

  @Column({
    type: 'text',
  })
  actionType: ConsequentialActionType;

  @Column({ length: 255 })
  title: string;

  @Column({ type: 'text' })
  reasonAndContext: string;

  @Column({ length: 100 })
  targetEntityId: string;

  @Column({ length: 50, default: 'HIGH' })
  riskRating: string;

  @Column({ type: 'simple-json', nullable: true })
  dataScopesAccessed: string[];

  @Column({ type: 'text', nullable: true })
  expectedOutcome: string;

  @Column({
    type: 'text',
    default: 'PENDING',
  })
  status: ApprovalStatus;

  @Column({ length: 100, nullable: true })
  reviewedByUserId: string;

  @Column({ type: 'text', nullable: true })
  reviewerComments: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
