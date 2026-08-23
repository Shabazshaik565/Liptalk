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

export enum CommunityVisibility {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE',
}

@Entity('communities')
export class Community {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  slug: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ default: 'General' })
  category: string;

  @Column({ nullable: true })
  coverImageUrl: string;

  @Column({ nullable: true })
  avatarUrl: string;

  @Column({ type: 'simple-array', nullable: true })
  rules: string[];

  @Column({
    type: 'simple-enum',
    enum: CommunityVisibility,
    default: CommunityVisibility.PUBLIC,
  })
  visibility: CommunityVisibility;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  owner: User;

  @Column({ default: 1 })
  memberCount: number;

  @Column({ default: 0 })
  postCount: number;

  @Column({ default: false })
  isVerified: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
