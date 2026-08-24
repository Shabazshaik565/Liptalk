import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm';

@Entity('ai_audit_logs')
export class AiAuditLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ type: 'varchar', length: 100 })
  userId: string;

  @Index()
  @Column({ type: 'varchar', length: 100 })
  action: string;

  @Column({ type: 'varchar', length: 50, default: 'ai.read' })
  permissionScope: string;

  @Column({ type: 'text', nullable: true })
  metadata?: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  ipAddress?: string;

  @CreateDateColumn()
  createdAt: Date;
}
