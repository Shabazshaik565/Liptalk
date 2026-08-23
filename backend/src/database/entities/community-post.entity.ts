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

export enum PostType {
  TEXT = 'TEXT',
  IMAGE = 'IMAGE',
  QUESTION = 'QUESTION',
  ANNOUNCEMENT = 'ANNOUNCEMENT',
}

@Entity('community_posts')
export class CommunityPost {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Community, { onDelete: 'CASCADE' })
  community: Community;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  author: User;

  @Column({
    type: 'simple-enum',
    enum: PostType,
    default: PostType.TEXT,
  })
  type: PostType;

  @Column({ nullable: true })
  title: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'simple-array', nullable: true })
  mediaUrls: string[];

  @Column({ default: 0 })
  likesCount: number;

  @Column({ default: 0 })
  commentsCount: number;

  @Column({ default: false })
  isPinned: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
