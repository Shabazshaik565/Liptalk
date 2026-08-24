import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm';

@Entity('global_trends')
export class GlobalTrend {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ type: 'varchar', length: 100 })
  topic: string;

  @Column({ type: 'varchar', length: 50, default: 'General' })
  category: string;

  @Index()
  @Column({ type: 'varchar', length: 30, default: 'GLOBAL' })
  scope: 'GLOBAL' | 'COUNTRY' | 'REGIONAL' | 'LANGUAGE';

  @Index()
  @Column({ type: 'varchar', length: 10, nullable: true })
  country?: string; // ISO 2-letter code

  @Column({ type: 'varchar', length: 50, nullable: true })
  region?: string;

  @Index()
  @Column({ type: 'varchar', length: 10, nullable: true })
  language?: string; // e.g. 'en', 'ta', 'hi', 'te', 'ar'

  @Column({ type: 'integer', default: 50 })
  velocityScore: number; // 0-100

  @Column({ type: 'integer', default: 0 })
  postCount: number;

  @Column({ type: 'integer', default: 0 })
  searchCount: number;

  @CreateDateColumn()
  createdAt: Date;
}
