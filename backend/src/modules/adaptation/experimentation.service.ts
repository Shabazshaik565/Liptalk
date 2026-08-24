import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PlatformExperiment, ExperimentStatus } from '../../database/entities/platform-experiment.entity';

@Injectable()
export class ExperimentationService {
  constructor(
    @InjectRepository(PlatformExperiment)
    private readonly experimentRepo: Repository<PlatformExperiment>,
  ) {}

  async listExperiments(status?: ExperimentStatus) {
    const list = await this.experimentRepo.find({ where: status ? { status } : {} });
    if (list.length > 0) return list;

    // Seed active and concluded platform experiments
    return [
      {
        id: 'exp_01',
        experimentKey: 'feed_diversity_boost_v2',
        title: 'Cross-Community Knowledge Discovery Feed Ranking',
        hypothesis: 'Injecting 1 verified cross-community knowledge card per 5 posts increases meaningful project collaborations without hurting session duration.',
        ownerId: 'usr_curr_01',
        targetSurface: 'FEED',
        targetAudienceSegment: '10%_GLOBAL_ACTIVE_USERS',
        durationDays: 14,
        primaryMetric: 'Project Contribution Inquiries (+15% target)',
        secondaryMetrics: ['Session Duration (Neutral)', 'Feed Interaction Rate (+5%)'],
        guardrailMetrics: [
          { metricName: 'User Feed Mutes', thresholdValue: 2.0, operator: 'LT' as const },
          { metricName: 'App Crash Rate', thresholdValue: 0.05, operator: 'LT' as const },
        ],
        rollbackCriteria: 'Auto-disable if Feed Mutes exceed 2.0% or Crash Rate exceeds 0.05%.',
        liveResults: {
          sampleSize: 8420,
          primaryMetricLiftPercent: 18.2,
          guardrailViolationsCount: 0,
          statisticallySignificant: true,
        },
        status: 'ACTIVE' as ExperimentStatus,
      },
      {
        id: 'exp_02',
        experimentKey: 'voice_intent_haptic_feedback',
        title: 'Haptic Confirmation on Consequential Voice Actions',
        hypothesis: 'Providing distinct double-haptic vibration on high-impact voice intents reduces accidental action triggers by 80%.',
        ownerId: 'usr_curr_01',
        targetSurface: 'VOICE_ASSISTANT',
        targetAudienceSegment: 'MOBILE_BETA_USERS',
        durationDays: 7,
        primaryMetric: 'Accidental Action Undo Rate (-80% target)',
        secondaryMetrics: ['Voice Completion Latency'],
        guardrailMetrics: [
          { metricName: 'Voice Session Abandonment', thresholdValue: 5.0, operator: 'LT' as const },
        ],
        rollbackCriteria: 'Roll back if abandonment exceeds 5.0%.',
        liveResults: {
          sampleSize: 3200,
          primaryMetricLiftPercent: 84.0,
          guardrailViolationsCount: 0,
          statisticallySignificant: true,
        },
        status: 'CONCLUDED_SUCCESS' as ExperimentStatus,
      },
    ];
  }

  async createExperiment(data: Partial<PlatformExperiment>) {
    return {
      id: `exp_${Date.now()}`,
      status: 'DRAFT',
      createdAt: new Date().toISOString(),
      ...data,
    };
  }

  async toggleExperimentStatus(id: string, newStatus: ExperimentStatus) {
    return {
      id,
      status: newStatus,
      updatedAt: new Date().toISOString(),
      actionSummary: newStatus === 'ROLLED_BACK' ? 'Experiment halted immediately and rolled back across all clients.' : `Experiment status changed to ${newStatus}.`,
    };
  }

  async getFeatureFlags() {
    return [
      { key: 'edge_mandi_cache', enabled: true, rolloutPercent: 100, owner: 'Infrastructure Team', description: 'Enable edge caching for mandi pricing' },
      { key: 'feed_diversity_boost_v2', enabled: true, rolloutPercent: 10, owner: 'Product Intelligence', description: 'Cross-community knowledge injection' },
      { key: 'multimodal_ocr_v2', enabled: true, rolloutPercent: 50, owner: 'AI Team', description: 'Enhanced OCR processing for agricultural certificates' },
      { key: 'voice_haptic_v1', enabled: true, rolloutPercent: 100, owner: 'Mobile UX', description: 'Haptic confirmation on voice actions' },
    ];
  }

  async updateFeatureFlag(key: string, enabled: boolean, rolloutPercent: number) {
    return {
      key,
      enabled,
      rolloutPercent,
      updatedAt: new Date().toISOString(),
    };
  }
}
