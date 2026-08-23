import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Message } from './message.entity';

export enum ConversationContextType {
  OPPORTUNITY = 'OPPORTUNITY',
  NEED_OFFER_MATCH = 'NEED_OFFER_MATCH',
  DIRECT_LEAD = 'DIRECT_LEAD',
  GENERAL = 'GENERAL',
}

@Entity('conversations')
export class Conversation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'simple-enum',
    enum: ConversationContextType,
    default: ConversationContextType.GENERAL,
  })
  contextType: ConversationContextType;

  @Column({ nullable: true })
  contextId: string;

  @Column({ default: 'Business Discussion' })
  contextTitle: string;

  @Column('simple-array')
  participantIds: string[];

  @OneToMany(() => Message, (msg) => msg.conversation)
  messages: Message[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
