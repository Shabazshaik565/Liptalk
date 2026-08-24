import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm';

@Entity('ai_actions')
export class AiAction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ type: 'varchar', length: 100 })
  userId: string;

  @Index()
  @Column({ type: 'varchar', length: 50 })
  actionType: 'SEARCH' | 'DRAFT' | 'MESSAGE' | 'PUBLISH' | 'PURCHASE' | 'DELETE' | 'TRANSLATE';

  @Index()
  @Column({ type: 'varchar', length: 50, default: 'PENDING_CONFIRMATION' })
  status: 'PENDING_CONFIRMATION' | 'CONFIRMED' | 'EXECUTED' | 'REJECTED';

  @Column({ type: 'varchar', length: 100 })
  targetEntity: string; // e.g. 'NEED', 'OFFER', 'CHAT_MESSAGE', 'MARKETPLACE_PURCHASE'

  @Column({ type: 'text' })
  payload: string; // JSON description of proposed action

  @Column({ type: 'boolean', default: false })
  confirmationRequired: boolean;

  @Column({ type: 'datetime', nullable: true })
  confirmedAt?: Date;

  @Column({ type: 'datetime', nullable: true })
  executedAt?: Date;

  @CreateDateColumn()
  createdAt: Date;
}
