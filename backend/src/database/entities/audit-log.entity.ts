import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

export enum AuditAction {
  USER_LOGIN = 'USER_LOGIN',
  SECURITY_CHANGE = 'SECURITY_CHANGE',
  ROLE_ASSIGNED = 'ROLE_ASSIGNED',
  ORG_CREATED = 'ORG_CREATED',
  ORG_INVITE_SENT = 'ORG_INVITE_SENT',
  MODERATION_ACTION = 'MODERATION_ACTION',
  REWARD_ADJUSTMENT = 'REWARD_ADJUSTMENT',
  MEMBERSHIP_UPGRADE = 'MEMBERSHIP_UPGRADE',
  FEATURE_FLAG_TOGGLED = 'FEATURE_FLAG_TOGGLED',
}

@Entity('audit_logs')
export class AuditLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  actor: User;

  @Column({
    type: 'simple-enum',
    enum: AuditAction,
    default: AuditAction.SECURITY_CHANGE,
  })
  action: AuditAction;

  @Column()
  targetType: string;

  @Column({ nullable: true })
  targetId: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: true })
  ipAddress: string;

  @CreateDateColumn()
  createdAt: Date;
}
