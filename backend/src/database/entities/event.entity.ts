import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Community } from './community.entity';

export enum EventLocationType {
  ONLINE = 'ONLINE',
  IN_PERSON = 'IN_PERSON',
}

export enum EventStatus {
  UPCOMING = 'UPCOMING',
  ONGOING = 'ONGOING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

@Entity('events')
export class Event {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Community, { nullable: true, onDelete: 'SET NULL' })
  community: Community;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  organizer: User;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ default: 'Networking' })
  category: string;

  @Column()
  eventDate: string; // YYYY-MM-DD

  @Column({ nullable: true })
  startTime: string; // e.g. "06:00 PM"

  @Column({ nullable: true })
  endTime: string; // e.g. "08:00 PM"

  @Column({
    type: 'simple-enum',
    enum: EventLocationType,
    default: EventLocationType.ONLINE,
  })
  locationType: EventLocationType;

  @Column({ nullable: true })
  locationUrlOrAddress: string;

  @Column({ nullable: true })
  coverImageUrl: string;

  @Column({ default: 100 })
  capacity: number;

  @Column({ default: 0 })
  registeredCount: number;

  @Column({
    type: 'simple-enum',
    enum: EventStatus,
    default: EventStatus.UPCOMING,
  })
  status: EventStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
