import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

export enum NotificationType {
  MATCH = 'MATCH',
  CONNECTION_REQ = 'CONNECTION_REQ',
  CONNECTION_ACC = 'CONNECTION_ACC',
  OPP_INTEREST = 'OPP_INTEREST',
  LEAD_STATUS = 'LEAD_STATUS',
  MESSAGE = 'MESSAGE',
  EVENT = 'EVENT',
}

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  recipient: User;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  sender: User;

  @Column({
    type: 'simple-enum',
    enum: NotificationType,
    default: NotificationType.MATCH,
  })
  type: NotificationType;

  @Column()
  title: string;

  @Column({ type: 'text' })
  body: string;

  @Column({ nullable: true })
  deepLink: string;

  @Column({ default: false })
  isRead: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
