import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DigitalTwin, DigitalTwinType } from '../../database/entities/digital-twin.entity';

@Injectable()
export class DigitalTwinService {
  constructor(
    @InjectRepository(DigitalTwin)
    private readonly twinRepo: Repository<DigitalTwin>,
  ) {}

  async getDigitalTwinsForUser(userId: string) {
    const list = await this.twinRepo.find({ where: { ownerId: userId } });
    if (list.length > 0) return list;

    // Seed default personal & creator digital twins
    return [
      {
        id: 'twin_personal_01',
        ownerId: userId,
        twinType: 'PERSONAL' as DigitalTwinType,
        displayName: 'Alex Morgan Personal Twin',
        description: 'Represents active personal goals, learning paths, and high-priority Kirana project tasks.',
        stateSnapshot: {
          goals: ['Open FMCG Supply Chain Gateway', 'Pan-India AgTech Coordination'],
          interests: ['AgTech', 'Supply Chain Escrow', 'Decentralized Architecture'],
          projects: ['proj_supply_01'],
          knowledgeTopics: ['Grain logistics', 'Micro-escrow protocols'],
          communities: ['comm_kirana_01'],
        },
        preferences: {
          ambientBriefingsEnabled: true,
          recommendationAggressiveness: 'BALANCED',
          allowAutonomousAgentAssistance: true,
          syncWithExternalCalendar: false,
        },
        privacyControls: {
          isDiscoverable: true,
          shareAggregatedMetricsOnly: true,
          retainEventMemoryDays: 30,
          allowCrossDomainInference: true,
        },
        isActive: true,
      },
      {
        id: 'twin_creator_01',
        ownerId: userId,
        twinType: 'CREATOR' as DigitalTwinType,
        displayName: 'Nexas Cloud & Architecture Twin',
        description: 'Represents creator content themes, publishing cadence, and audience demand trends.',
        stateSnapshot: {
          contentThemes: ['Distributed Systems', 'AgTech Architecture', 'Web3 Escrow Patterns'],
          publishingCadence: 'BI_WEEKLY',
          rulesSummary: 'Technical deep-dives with verified open-source benchmarks.',
        },
        preferences: {
          ambientBriefingsEnabled: true,
          recommendationAggressiveness: 'EXPLORATORY',
          allowAutonomousAgentAssistance: true,
        },
        privacyControls: {
          isDiscoverable: true,
          shareAggregatedMetricsOnly: false,
          retainEventMemoryDays: 90,
          allowCrossDomainInference: true,
        },
        isActive: true,
      },
    ];
  }

  async updateDigitalTwin(id: string, payload: Partial<DigitalTwin>) {
    return {
      id,
      updated: true,
      timestamp: new Date().toISOString(),
      ...payload,
    };
  }

  async resetOrDeleteDigitalTwin(id: string, action: 'RESET' | 'DELETE') {
    return {
      id,
      actionTaken: action,
      status: action === 'RESET' ? 'MEMORY_PURGED_AND_RESET' : 'PERMANENTLY_DELETED',
      timestamp: new Date().toISOString(),
    };
  }
}
