import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

export type UxProfileTier =
  | 'SIMPLE'
  | 'STANDARD'
  | 'POWER_USER'
  | 'CREATOR'
  | 'DEVELOPER'
  | 'COMMUNITY_MANAGER'
  | 'ORGANIZATION';

@Entity('adaptive_ux_profiles')
export class AdaptiveUxProfile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ length: 100 })
  userId: string;

  @Column({
    type: 'text',
    default: 'STANDARD',
  })
  activeProfile: UxProfileTier;

  @Column({ type: 'simple-json', nullable: true })
  frequentToolsPriority: string[];

  @Column({ type: 'simple-json', nullable: true })
  attentionPreferences: {
    smartNotificationBatching?: boolean;
    batchIntervalMinutes?: number;
    quietHoursStart?: string;
    quietHoursEnd?: string;
    focusModeActive?: boolean;
    priorityInboxEnabled?: boolean;
    digestModeFrequency?: 'NONE' | 'DAILY_MORNING' | 'WEEKLY_SUNDAY';
  };

  @Column({ type: 'simple-json', nullable: true })
  adaptiveNavigationOrder: string[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
