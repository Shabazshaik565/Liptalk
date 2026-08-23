import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  Unique,
} from 'typeorm';
import { User } from './user.entity';

export enum SavedTargetType {
  LISTING = 'LISTING',
  OPPORTUNITY = 'OPPORTUNITY',
  COMMUNITY = 'COMMUNITY',
  EVENT = 'EVENT',
}

@Entity('saved_items')
@Unique(['user', 'targetType', 'targetId'])
export class SavedItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User;

  @Column({
    type: 'simple-enum',
    enum: SavedTargetType,
  })
  targetType: SavedTargetType;

  @Column()
  targetId: string;

  @CreateDateColumn()
  createdAt: Date;
}
