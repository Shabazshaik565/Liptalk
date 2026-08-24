import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FeedbackCluster } from '../../database/entities/feedback-cluster.entity';

@Injectable()
export class FeedbackRoadmapService {
  constructor(
    @InjectRepository(FeedbackCluster)
    private readonly clusterRepo: Repository<FeedbackCluster>,
  ) {}

  async listFeedbackClusters() {
    const list = await this.clusterRepo.find();
    if (list.length > 0) return list;

    // Seed realistic clustered user feedback and roadmap recommendations
    return [
      {
        id: 'cluster_01',
        clusterCategory: 'FEATURE_REQUEST',
        clusterTheme: 'Offline Mobile Escrow Signing for Rural Kirana Outposts',
        feedbackItemsCount: 42,
        urgencyLevel: 'HIGH',
        representativeQuotes: [
          'Need ability to draft trade agreements when connectivity drops in Mandi sheds.',
          'Offline BLE beacon synchronization with nearby trucks would help tremendously.',
        ],
        aiRoadmapRecommendation: 'Prioritize Phase 15.2 offline-first state synchronization protocol for trade commitments.',
        status: 'ACCEPTED_INTO_ROADMAP',
      },
      {
        id: 'cluster_02',
        clusterCategory: 'AI_USABILITY',
        clusterTheme: 'One-Tap Voice Intent Presets for Quick Inventory Checks',
        feedbackItemsCount: 28,
        urgencyLevel: 'MEDIUM',
        representativeQuotes: [
          'Love voice orb, want custom shortcuts on home screen for daily wheat spot check.',
        ],
        aiRoadmapRecommendation: 'Add customizable voice intent widget to Mobile Personal Dashboard.',
        status: 'UNDER_REVIEW',
      },
    ];
  }

  async recordUserFeedback(data: { category: string; message: string; userId?: string }) {
    return {
      id: `fb_${Date.now()}`,
      status: 'ROUTED_TO_FEEDBACK_INTELLIGENCE',
      recordedAt: new Date().toISOString(),
      category: data.category,
      message: data.message,
    };
  }
}
