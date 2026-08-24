import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity('developer_apps')
export class DeveloperApp {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ type: 'varchar', length: 100 })
  developerId: string; // Owner user ID

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Index()
  @Column({ type: 'varchar', length: 100, unique: true })
  apiKey: string; // Live API Key for platform access

  @Column({ type: 'varchar', length: 255, nullable: true })
  redirectUri: string;

  @Column({ type: 'simple-array' })
  scopes: string[]; // e.g. ['read:profile', 'write:posts', 'read:marketplace']

  @Column({ type: 'integer', default: 1000 })
  rateLimitPerMinute: number;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
