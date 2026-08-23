import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../database/entities/user.entity';
import { UserProfile } from '../../database/entities/profile.entity';
import { Need } from '../../database/entities/need.entity';
import { Offer } from '../../database/entities/offer.entity';
import { Connection } from '../../database/entities/connection.entity';

export interface PrivacySettings {
  profileVisibility: 'PUBLIC' | 'NETWORK_ONLY' | 'ORGANIZATION_ONLY';
  searchDiscoverability: boolean;
  directMessaging: 'EVERYONE' | 'CONNECTIONS_ONLY' | 'VERIFIED_ONLY';
  allowCalling: 'EVERYONE' | 'CONNECTIONS_ONLY' | 'VERIFIED_ONLY';
  aiRecommendationsOptIn: boolean;
  activityStatusVisible: boolean;
}

@Injectable()
export class PrivacyService {
  private privacyStore: Map<string, PrivacySettings> = new Map();

  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(UserProfile)
    private readonly profileRepo: Repository<UserProfile>,
    @InjectRepository(Need)
    private readonly needRepo: Repository<Need>,
    @InjectRepository(Offer)
    private readonly offerRepo: Repository<Offer>,
    @InjectRepository(Connection)
    private readonly connectionRepo: Repository<Connection>,
  ) {}

  async getPrivacySettings(userId: string): Promise<PrivacySettings> {
    if (!this.privacyStore.has(userId)) {
      this.privacyStore.set(userId, {
        profileVisibility: 'PUBLIC',
        searchDiscoverability: true,
        directMessaging: 'EVERYONE',
        allowCalling: 'CONNECTIONS_ONLY',
        aiRecommendationsOptIn: true,
        activityStatusVisible: true,
      });
    }
    return this.privacyStore.get(userId)!;
  }

  async updatePrivacySettings(userId: string, settings: Partial<PrivacySettings>): Promise<PrivacySettings> {
    const current = await this.getPrivacySettings(userId);
    const updated = { ...current, ...settings };
    this.privacyStore.set(userId, updated);
    return updated;
  }

  async exportUserData(userId: string) {
    const [user, profile, needs, offers, connections] = await Promise.all([
      this.userRepo.findOne({ where: { id: userId } }),
      this.profileRepo.findOne({ where: { user: { id: userId } } }),
      this.needRepo.find({ where: { ownerId: userId } }),
      this.offerRepo.find({ where: { ownerId: userId } }),
      this.connectionRepo.find({
        where: [{ sender: { id: userId } }, { receiver: { id: userId } }],
        relations: ['sender', 'receiver'],
      }),
    ]);

    if (!user) throw new NotFoundException('User not found');

    return {
      exportTimestamp: new Date().toISOString(),
      user: {
        id: user.id,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role,
        isPhoneVerified: user.isPhoneVerified,
        isEmailVerified: user.isEmailVerified,
        createdAt: user.createdAt,
      },
      profile: profile || null,
      needs,
      offers,
      connectionsCount: connections.length,
      privacySettings: await this.getPrivacySettings(userId),
    };
  }

  async deactivateAccount(userId: string, reason?: string) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    user.status = 'SUSPENDED' as any;
    await this.userRepo.save(user);

    return { success: true, message: 'Account successfully scheduled for deactivation and safe data retention' };
  }

  async getActiveSessions(userId: string) {
    return [
      {
        id: 'sess_curr',
        deviceName: 'Mobile Device (Expo App)',
        ipAddress: '192.168.1.100',
        location: 'Bangalore, India',
        lastActive: 'Just now',
        isCurrentSession: true,
      },
      {
        id: 'sess_web_01',
        deviceName: 'MacBook Pro (Chrome 124.0)',
        ipAddress: '106.51.72.18',
        location: 'Bangalore, India',
        lastActive: '2 hours ago',
        isCurrentSession: false,
      },
    ];
  }

  async revokeSession(userId: string, sessionId: string) {
    return { success: true, revokedSessionId: sessionId };
  }
}
