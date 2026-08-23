import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification, NotificationType } from '../../database/entities/notification.entity';
import { User } from '../../database/entities/user.entity';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private readonly notifRepo: Repository<Notification>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async getUserNotifications(userId: string) {
    return this.notifRepo.find({
      where: { recipient: { id: userId } },
      order: { createdAt: 'DESC' },
      take: 50,
    });
  }

  async markAsRead(notificationId: string, userId: string) {
    const notif = await this.notifRepo.findOne({
      where: { id: notificationId, recipient: { id: userId } },
    });
    if (notif) {
      notif.isRead = true;
      return this.notifRepo.save(notif);
    }
    return null;
  }

  async markAllAsRead(userId: string) {
    await this.notifRepo.update(
      { recipient: { id: userId }, isRead: false },
      { isRead: true },
    );
    return { success: true };
  }

  async createNotification(data: {
    recipientId: string;
    senderId?: string;
    type: NotificationType;
    title: string;
    body: string;
    deepLink?: string;
  }) {
    const recipient = await this.userRepo.findOne({ where: { id: data.recipientId } });
    if (!recipient) return null;

    let sender: User | null = null;
    if (data.senderId) {
      sender = await this.userRepo.findOne({ where: { id: data.senderId } });
    }

    const notif = this.notifRepo.create({
      recipient,
      sender: sender || undefined,
      type: data.type,
      title: data.title,
      body: data.body,
      deepLink: data.deepLink,
      isRead: false,
    });

    return this.notifRepo.save(notif);
  }
}
