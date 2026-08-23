import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

export enum ReportTargetType {
  POST = 'POST',
  COMMENT = 'COMMENT',
  USER = 'USER',
  COMMUNITY = 'COMMUNITY',
}

export enum ReportStatus {
  PENDING = 'PENDING',
  RESOLVED = 'RESOLVED',
  DISMISSED = 'DISMISSED',
}

@Entity('community_reports')
export class CommunityReport {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  reporter: User;

  @Column({
    type: 'simple-enum',
    enum: ReportTargetType,
  })
  targetType: ReportTargetType;

  @Column()
  targetId: string;

  @Column()
  reason: string;

  @Column({ type: 'text', nullable: true })
  details: string;

  @Column({
    type: 'simple-enum',
    enum: ReportStatus,
    default: ReportStatus.PENDING,
  })
  status: ReportStatus;

  @CreateDateColumn()
  createdAt: Date;
}
