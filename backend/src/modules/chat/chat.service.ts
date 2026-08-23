import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Conversation, ConversationContextType } from '../../database/entities/conversation.entity';
import { Message } from '../../database/entities/message.entity';
import { User } from '../../database/entities/user.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Conversation)
    private readonly convRepo: Repository<Conversation>,
    @InjectRepository(Message)
    private readonly msgRepo: Repository<Message>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async getConversations(userId: string) {
    const convs = await this.convRepo.find({
      relations: ['messages', 'messages.sender'],
      order: { updatedAt: 'DESC' },
    });
    return convs;
  }

  async getOrCreateContextualConversation(data: {
    participantIds: string[];
    contextType: ConversationContextType;
    contextId?: string;
    contextTitle: string;
  }) {
    let conv = await this.convRepo.findOne({
      where: {
        contextId: data.contextId,
      },
    });

    if (!conv) {
      conv = this.convRepo.create({
        participantIds: data.participantIds,
        contextType: data.contextType,
        contextId: data.contextId,
        contextTitle: data.contextTitle,
      });
      conv = await this.convRepo.save(conv);
    }
    return conv;
  }

  async getMessages(conversationId: string) {
    return this.msgRepo.find({
      where: { conversation: { id: conversationId } },
      relations: ['sender', 'sender.profile'],
      order: { createdAt: 'ASC' },
    });
  }

  async saveMessage(conversationId: string, senderId: string, text: string) {
    const conv = await this.convRepo.findOne({ where: { id: conversationId } });
    const sender = await this.userRepo.findOne({ where: { id: senderId } });
    if (!conv || !sender) return null;

    const message = this.msgRepo.create({
      conversation: conv,
      sender,
      text,
      isRead: false,
    });

    const saved = await this.msgRepo.save(message);
    conv.updatedAt = new Date();
    await this.convRepo.save(conv);

    return saved;
  }
}
