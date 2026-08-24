import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('user_preferences')
export class UserPreference {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;

  @Column({ default: 'en' })
  language: string;

  @Column({ default: 'India' })
  country: string;

  @Column({ default: 'Tamil Nadu' })
  region: string;

  @Column({ default: 'Chennai' })
  city: string;

  @Column({ default: 'Asia/Kolkata' })
  timezone: string;

  @Column({ default: 'INR' })
  currency: string;

  @Column({ default: 'en-IN' })
  locale: string;

  @Column({ default: false })
  isLocationPublic: boolean;

  @Column({ default: true })
  allowRegionalDiscovery: boolean;

  @Column({ default: false })
  autoDetectTimezone: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
