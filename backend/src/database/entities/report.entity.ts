import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

export enum ReportTargetType {
  USER = 'USER',
  COMMUNITY = 'COMMUNITY',
  POST = 'POST',
  COMMENT = 'COMMENT',
  OPPORTUNITY = 'OPPORTUNITY',
  MARKETPLACE_LISTING = 'MARKETPLACE_LISTING',
  LIVE_ROOM = 'LIVE_ROOM',
}

export enum ReportReason {
  SPAM = 'SPAM',
  HARASSMENT = 'HARASSMENT',
  FRAUD_SCAM = 'FRAUD_SCAM',
  MISINFORMATION = 'MISINFORMATION',
  POLICY_VIOLATION = 'POLICY_VIOLATION',
  IMPERSONATION = 'IMPERSONATION',
  OTHER = 'OTHER',
}

export enum ReportStatus {
  OPEN = 'OPEN',
  UNDER_REVIEW = 'UNDER_REVIEW',
  ACTION_TAKEN = 'ACTION_TAKEN',
  DISMISSED = 'DISMISSED',
  ESCALATED = 'ESCALATED',
  CLOSED = 'CLOSED',
}

@Entity('reports')
export class Report {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  reporter: User;

  @Column({
    type: 'simple-enum',
    enum: ReportTargetType,
    default: ReportTargetType.USER,
  })
  targetType: ReportTargetType;

  @Column()
  targetId: string;

  @Column({
    type: 'simple-enum',
    enum: ReportReason,
    default: ReportReason.POLICY_VIOLATION,
  })
  reason: ReportReason;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    type: 'simple-enum',
    enum: ReportStatus,
    default: ReportStatus.OPEN,
  })
  status: ReportStatus;

  @Column({ nullable: true })
  actionTaken: string;

  @Column({ nullable: true })
  moderatorNotes: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
