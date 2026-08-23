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
import { OrganizationMember } from './organization-member.entity';
import { Team } from './team.entity';

export enum OrganizationVerificationStatus {
  UNVERIFIED = 'UNVERIFIED',
  PENDING = 'PENDING',
  VERIFIED = 'VERIFIED',
  SUSPENDED = 'SUSPENDED',
}

@Entity('organizations')
export class Organization {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  slug: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: true })
  logoUrl: string;

  @Column({ default: 'Information Technology & Services' })
  industry: string;

  @Column({ default: '50-200' })
  employeeCountRange: string;

  @Column({ default: 'Bangalore, India' })
  location: string;

  @Column({ nullable: true })
  websiteUrl: string;

  @Column({
    type: 'simple-enum',
    enum: OrganizationVerificationStatus,
    default: OrganizationVerificationStatus.VERIFIED,
  })
  verificationStatus: OrganizationVerificationStatus;

  @ManyToOne(() => User, { onDelete: 'RESTRICT' })
  owner: User;

  @OneToMany(() => OrganizationMember, (member) => member.organization)
  members: OrganizationMember[];

  @OneToMany(() => Team, (team) => team.organization)
  teams: Team[];

  @Column({ type: 'int', default: 50 })
  maxSeats: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
