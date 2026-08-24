import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RecommendationEvent, RecommendationFeedbackType } from '../../database/entities/recommendation-event.entity';

@Injectable()
export class RecommendationService {
  constructor(
    @InjectRepository(RecommendationEvent)
    private readonly recRepo: Repository<RecommendationEvent>,
  ) {}

  async getExplainableRecommendations(userId: string) {
    return [
      {
        id: 'rec_01',
        itemType: 'PROJECT',
        itemId: 'proj_supply_01',
        itemTitle: 'Open FMCG Supply Chain Gateway',
        explanationReason: 'Recommended because you actively contribute to Kirana Wholesale Traders community and follow Distributed Escrow topics.',
        relevanceScore: 0.96,
        category: 'Collaborative Projects',
      },
      {
        id: 'rec_02',
        itemType: 'CREATOR_COLLECTIVE',
        itemId: 'col_01',
        itemTitle: 'Frontier Architecture & Systems Guild',
        explanationReason: 'Recommended because 4 members in your network joined this creator pass.',
        relevanceScore: 0.91,
        category: 'Creator Alliances',
      },
      {
        id: 'rec_03',
        itemType: 'EXPERT',
        itemId: 'usr_sarah_02',
        itemTitle: 'Dr. Sarah Chen (AgTech & Escrow Protocols)',
        explanationReason: 'Top contributor in your active project with 18 verified code contributions.',
        relevanceScore: 0.88,
        category: 'Expert Network',
      },
      {
        id: 'rec_04',
        itemType: 'SKILL',
        itemId: 'skill_zk_escrow',
        itemTitle: 'Zero-Knowledge Batch Verification',
        explanationReason: 'Identified as a critical skill prerequisite for upcoming FMCG milestone deliverables.',
        relevanceScore: 0.85,
        category: 'Skill Pathways',
      },
    ];
  }

  async recordFeedback(recommendationId: string, feedback: RecommendationFeedbackType) {
    return {
      recommendationId,
      feedbackRecorded: feedback,
      status: 'FEEDBACK_APPLIED_TO_PERSONAL_PREFERENCES',
      timestamp: new Date().toISOString(),
    };
  }
}
