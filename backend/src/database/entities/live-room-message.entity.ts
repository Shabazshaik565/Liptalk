import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { LiveRoom } from './live-room.entity';
import { User } from './user.entity';

@Entity('live_room_messages')
export class LiveRoomMessage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => LiveRoom, (room) => room.messages, { onDelete: 'CASCADE' })
  room: LiveRoom;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  sender: User;

  @Column()
  senderName: string;

  @Column({ nullable: true })
  senderAvatar: string;

  @Column({ type: 'text' })
  text: string;

  @CreateDateColumn()
  createdAt: Date;
}
