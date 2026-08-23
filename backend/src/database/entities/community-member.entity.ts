import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  Unique,
} from 'typeorm';
import { User } from './user.entity';
import { Community } from './community.entity';

export enum CommunityMemberRole {
  OWNER = 'OWNER',
  MODERATOR = 'MODERATOR',
  MEMBER = 'MEMBER',
}

export enum CommunityMemberStatus {
  ACTIVE = 'ACTIVE',
  PENDING_APPROVAL = 'PENDING_APPROVAL',
}

@Entity('community_members')
@Unique(['community', 'user'])
export class CommunityMember {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Community, { onDelete: 'CASCADE' })
  community: Community;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User;

  @Column({
    type: 'simple-enum',
    enum: CommunityMemberRole,
    default: CommunityMemberRole.MEMBER,
  })
  role: CommunityMemberRole;

  @Column({
    type: 'simple-enum',
    enum: CommunityMemberStatus,
    default: CommunityMemberStatus.ACTIVE,
  })
  status: CommunityMemberStatus;

  @CreateDateColumn()
  joinedAt: Date;
}
