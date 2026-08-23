import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { CommunityPost } from './community-post.entity';

@Entity('post_comments')
export class PostComment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => CommunityPost, { onDelete: 'CASCADE' })
  post: CommunityPost;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  author: User;

  @Column({ type: 'text' })
  content: string;

  @Column({ nullable: true })
  parentCommentId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
