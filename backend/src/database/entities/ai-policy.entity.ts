import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('ai_policies')
export class AiPolicy {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  policyName: string; // e.g. 'GLOBAL_AGENT_KILL_SWITCH', 'MAX_AGENT_TOOL_STEPS', 'ALLOW_AUTONOMOUS_PURCHASES'

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'boolean', default: true })
  isEnabled: boolean;

  @Column({ type: 'simple-json', nullable: true })
  policyParameters: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
