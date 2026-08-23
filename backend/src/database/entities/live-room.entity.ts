import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Community } from './community.entity';
import { Event } from './event.entity';
import { LiveRoomMessage } from './live-room-message.entity';

export enum LiveRoomType {
  NETWORKING = 'NETWORKING',
  WORKSHOP = 'WORKSHOP',
  AMA = 'AMA',
  COMMUNITY = 'COMMUNITY',
  BUSINESS = 'BUSINESS',
  EDUCATION = 'EDUCATION',
}

export enum LiveRoomStatus {
  SCHEDULED = 'SCHEDULED',
  LIVE = 'LIVE',
  ENDED = 'ENDED',
}

@Entity('live_rooms')
export class LiveRoom {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  host: User;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ default: 'Tech & Networking' })
  category: string;

  @Column({
    type: 'simple-enum',
    enum: LiveRoomType,
    default: LiveRoomType.NETWORKING,
  })
  roomType: LiveRoomType;

  @Column({
    type: 'simple-enum',
    enum: LiveRoomStatus,
    default: LiveRoomStatus.LIVE,
  })
  status: LiveRoomStatus;

  @Column({ nullable: true })
  coverImageUrl: string;

  @Column({ type: 'int', default: 1 })
  audienceCount: number;

  @ManyToOne(() => Community, { nullable: true, onDelete: 'SET NULL' })
  community: Community;

  @ManyToOne(() => Event, { nullable: true, onDelete: 'SET NULL' })
  event: Event;

  @OneToMany(() => LiveRoomMessage, (msg) => msg.room)
  messages: LiveRoomMessage[];

  @Column({ nullable: true })
  scheduledAt: Date;

  @Column({ nullable: true })
  startedAt: Date;

  @Column({ nullable: true })
  endedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
