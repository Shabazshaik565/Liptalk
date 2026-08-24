import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm';

@Entity('conversation_actions')
export class ConversationAction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ type: 'varchar', length: 100 })
  conversationId: string;

  @Column({ type: 'varchar', length: 100 })
  suggestedByUserId: string;

  @Column({ type: 'varchar', length: 50 })
  actionType: 'CREATE_EVENT' | 'CREATE_TASK' | 'CREATE_OFFER' | 'SHARE_KNOWLEDGE';

  @Column({ type: 'varchar', length: 200 })
  title: string;

  @Column({ type: 'simple-json', nullable: true })
  payload: Record<string, any>;

  @Column({ type: 'varchar', length: 50, default: 'PENDING_APPROVAL' })
  status: 'PENDING_APPROVAL' | 'ACCEPTED' | 'DISMISSED';

  @CreateDateColumn()
  createdAt: Date;
}
