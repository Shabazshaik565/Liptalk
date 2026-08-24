import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index, ManyToOne } from 'typeorm';
import { DeveloperApp } from './developer-app.entity';

@Entity('webhooks')
export class Webhook {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => DeveloperApp, { onDelete: 'CASCADE' })
  app: DeveloperApp;

  @Column({ type: 'varchar', length: 255 })
  targetUrl: string;

  @Column({ type: 'varchar', length: 100 })
  secretToken: string; // Used for HMAC-SHA256 signature verification

  @Column({ type: 'simple-array' })
  subscribedEvents: string[]; // e.g. ['user.created', 'post.created', 'order.created', 'ai.action.completed']

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'integer', default: 0 })
  deliveriesCount: number;

  @Column({ type: 'integer', default: 0 })
  failuresCount: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
