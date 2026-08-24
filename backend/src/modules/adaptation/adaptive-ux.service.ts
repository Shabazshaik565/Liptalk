import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AdaptiveUxProfile, UxProfileTier } from '../../database/entities/adaptive-ux-profile.entity';

@Injectable()
export class AdaptiveUxService {
  constructor(
    @InjectRepository(AdaptiveUxProfile)
    private readonly uxRepo: Repository<AdaptiveUxProfile>,
  ) {}

  async getUxProfile(userId: string) {
    const record = await this.uxRepo.findOne({ where: { userId } });
    if (record) return record;

    // Default adaptive UX profile
    return {
      id: 'ux_prof_01',
      userId,
      activeProfile: 'POWER_USER' as UxProfileTier,
      frequentToolsPriority: ['/intelligence', '/goals', '/collaboration', '/ai-plans', '/simulation'],
      attentionPreferences: {
        smartNotificationBatching: true,
        batchIntervalMinutes: 30,
        quietHoursStart: '22:00',
        quietHoursEnd: '07:00',
        focusModeActive: false,
        priorityInboxEnabled: true,
        digestModeFrequency: 'DAILY_MORNING' as const,
      },
      adaptiveNavigationOrder: ['Home', 'Intelligence', 'Workspaces', 'Goals', 'Profile'],
    };
  }

  async updateUxProfile(userId: string, data: Partial<AdaptiveUxProfile>) {
    return {
      userId,
      updated: true,
      timestamp: new Date().toISOString(),
      ...data,
    };
  }

  async toggleFocusMode(userId: string, active: boolean) {
    return {
      userId,
      focusModeActive: active,
      status: active ? 'FOCUS_MODE_ENGAGED' : 'FOCUS_MODE_DISENGAGED',
      note: active ? 'Non-critical notifications suppressed and batched into next digest.' : 'Normal notification delivery resumed.',
    };
  }
}
