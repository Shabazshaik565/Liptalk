import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity('mentorship_profiles')
export class MentorshipProfile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ type: 'varchar', length: 100, unique: true })
  mentorId: string;

  @Column({ type: 'varchar', length: 150 })
  headline: string;

  @Column({ type: 'text' })
  bio: string;

  @Column({ type: 'simple-array' })
  expertiseAreas: string[]; // e.g. ['React Native Architecture', 'B2B Wholesale Trade', 'Cross-Border Supply Chain']

  @Column({ type: 'varchar', length: 50, default: 'OPEN' })
  availabilityStatus: 'OPEN' | 'LIMITED' | 'FULL';

  @Column({ type: 'integer', default: 0 })
  menteesHelpedCount: number;

  @Column({ type: 'float', default: 5.0 })
  rating: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
