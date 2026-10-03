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
      relations: ['messages', 'messages.sender', 'messages.sender.profile'],
      order: { updatedAt: 'DESC' },
    });

    const userIdsToFetch = new Set<string>();
    for (const c of convs) {
      for (const pId of c.participantIds || []) {
        if (pId !== userId) {
          userIdsToFetch.add(pId);
        }
      }
    }

    const otherUsers = Array.from(userIdsToFetch).length > 0
      ? await this.userRepo.find({
          where: Array.from(userIdsToFetch).map((id) => ({ id })),
          relations: ['profile', 'businesses'],
        })
      : [];
    const userMap = new Map<string, User>();
    for (const u of otherUsers) {
      userMap.set(u.id, u);
    }

    return convs.map((c) => {
      const otherId =
        (c.participantIds || []).find((pid) => pid !== userId) ||
        c.participantIds?.[0] ||
        'usr_unknown';
      const other = userMap.get(otherId);
      const sortedMessages = (c.messages || []).sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      );
      const lastMsg = sortedMessages[sortedMessages.length - 1];
      const unreadCount = sortedMessages.filter(
        (m) => !m.isRead && m.sender?.id !== userId,
      ).length;

      const otherName =
        (other?.profile?.firstName
          ? `${other.profile.firstName} ${other.profile.lastName || ''}`.trim()
          : null) ||
        other?.email?.split('@')[0] ||
        'Business Partner';

      return {
        id: c.id,
        contextType: c.contextType,
        contextId: c.contextId,
        contextTitle: c.contextTitle,
        otherParticipant: {
          id: other?.id || otherId,
          name: otherName,
          avatarUrl:
            other?.profile?.avatarUrl ||
            'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
          role: other?.role || 'BUSINESS',
          phoneNumber: other?.phoneNumber || '+91 7200317219',
          isOnline: true,
        },
        lastMessage: lastMsg
          ? {
              text: lastMsg.text,
              senderId: lastMsg.sender?.id || '',
              createdAt: lastMsg.createdAt?.toISOString(),
              isRead: lastMsg.isRead,
            }
          : undefined,
        unreadCount,
        updatedAt: c.updatedAt?.toISOString() || c.createdAt?.toISOString(),
      };
    });
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
    const messages = await this.msgRepo.find({
      where: { conversation: { id: conversationId } },
      relations: ['sender', 'sender.profile'],
      order: { createdAt: 'ASC' },
    });

    return messages.map((m) => {
      const senderName =
        (m.sender?.profile?.firstName
          ? `${m.sender.profile.firstName} ${m.sender.profile.lastName || ''}`.trim()
          : null) ||
        m.sender?.email?.split('@')[0] ||
        'User';

      return {
        id: m.id,
        conversationId,
        senderId: m.sender?.id,
        senderName,
        senderAvatar: m.sender?.profile?.avatarUrl,
        text: m.text,
        mediaUrl: m.mediaUrl,
        mediaType: m.mediaType,
        isRead: m.isRead,
        createdAt: m.createdAt?.toISOString(),
      };
    });
  }

  async saveMessage(conversationId: string, senderId: string, text: string) {
    const conv = await this.convRepo.findOne({ where: { id: conversationId } });
    const sender = await this.userRepo.findOne({
      where: { id: senderId },
      relations: ['profile'],
    });
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

    const senderName =
      (sender.profile?.firstName
        ? `${sender.profile.firstName} ${sender.profile.lastName || ''}`.trim()
        : null) ||
      sender.email?.split('@')[0] ||
      'User';

    return {
      id: saved.id,
      conversationId,
      senderId: sender.id,
      senderName,
      senderAvatar: sender.profile?.avatarUrl,
      text: saved.text,
      isRead: saved.isRead,
      createdAt: saved.createdAt?.toISOString(),
    };
  }
}
