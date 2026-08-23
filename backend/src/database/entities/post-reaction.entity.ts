import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  Unique,
} from 'typeorm';
import { User } from './user.entity';
import { CommunityPost } from './community-post.entity';

export enum ReactionType {
  LIKE = 'LIKE',
  CELEBRATE = 'CELEBRATE',
  INSIGHTFUL = 'INSIGHTFUL',
}

@Entity('post_reactions')
@Unique(['post', 'user'])
export class PostReaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => CommunityPost, { onDelete: 'CASCADE' })
  post: CommunityPost;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User;

  @Column({
    type: 'simple-enum',
    enum: ReactionType,
    default: ReactionType.LIKE,
  })
  reactionType: ReactionType;

  @CreateDateColumn()
  createdAt: Date;
}
