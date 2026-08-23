import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
} from 'typeorm';
import { Organization } from './organization.entity';
import { User } from './user.entity';
import { Team } from './team.entity';

export enum OrganizationRole {
  OWNER = 'OWNER',
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  MEMBER = 'MEMBER',
  ANALYST = 'ANALYST',
}

@Entity('organization_members')
@Unique(['organization', 'user'])
export class OrganizationMember {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Organization, (org) => org.members, { onDelete: 'CASCADE' })
  organization: Organization;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User;

  @Column({
    type: 'simple-enum',
    enum: OrganizationRole,
    default: OrganizationRole.MEMBER,
  })
  role: OrganizationRole;

  @ManyToOne(() => Team, { nullable: true, onDelete: 'SET NULL' })
  team: Team;

  @Column({ default: 'Engineering' })
  department: string;

  @Column({ default: 'Senior Software Engineer' })
  jobTitle: string;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
