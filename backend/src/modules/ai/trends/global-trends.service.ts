import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GlobalTrend } from '../../../database/entities/global-trend.entity';

@Injectable()
export class GlobalTrendsService {
  private readonly logger = new Logger(GlobalTrendsService.name);

  constructor(
    @InjectRepository(GlobalTrend)
    private readonly trendRepo: Repository<GlobalTrend>,
  ) {}

  /**
   * Retrieves aggregated trends by scope, country, and language
   */
  async getTrends(params?: {
    scope?: 'GLOBAL' | 'COUNTRY' | 'REGIONAL' | 'LANGUAGE';
    country?: string;
    language?: string;
  }): Promise<GlobalTrend[]> {
    const where: any = {};
    if (params?.scope) where.scope = params.scope;
    if (params?.country) where.country = params.country;
    if (params?.language) where.language = params.language;

    const items = await this.trendRepo.find({
      where,
      order: { velocityScore: 'DESC', postCount: 'DESC' },
      take: 20,
    });

    if (items.length === 0) {
      // Seed default platform intelligence trends
      return this.getSeedTrends(params?.country, params?.language);
    }

    return items;
  }

  /**
   * Safe defaults for trend intelligence
   */
  private getSeedTrends(country = 'IN', language = 'en'): GlobalTrend[] {
    return [
      {
        id: 'trend_01',
        topic: 'Cross-Border FMCG Supply Chain',
        category: 'General Trade & Commerce',
        scope: 'GLOBAL',
        country,
        language,
        velocityScore: 98,
        postCount: 1420,
        searchCount: 5200,
        createdAt: new Date(),
      },
      {
        id: 'trend_02',
        topic: 'AI Voice Translation & Regional Dialects',
        category: 'AI & Communication',
        scope: 'GLOBAL',
        country,
        language,
        velocityScore: 94,
        postCount: 1180,
        searchCount: 4600,
        createdAt: new Date(),
      },
      {
        id: 'trend_03',
        topic: 'Kirana Direct-to-Mill Procurement Hubs',
        category: 'B2B Trade',
        scope: 'COUNTRY',
        country,
        language,
        velocityScore: 91,
        postCount: 890,
        searchCount: 3100,
        createdAt: new Date(),
      },
      {
        id: 'trend_04',
        topic: 'Enterprise React Native TurboModules & Offline Sync',
        category: 'Mobile & Cloud',
        scope: 'GLOBAL',
        country,
        language,
        velocityScore: 89,
        postCount: 740,
        searchCount: 2900,
        createdAt: new Date(),
      },
    ];
  }
}
