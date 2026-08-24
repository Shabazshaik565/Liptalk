import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SkillNode } from '../../database/entities/skill-node.entity';
import { ExpertProfile } from '../../database/entities/expert-profile.entity';

@Injectable()
export class SkillsExpertsService {
  constructor(
    @InjectRepository(SkillNode)
    private readonly skillRepo: Repository<SkillNode>,
    @InjectRepository(ExpertProfile)
    private readonly expertRepo: Repository<ExpertProfile>,
  ) {}

  async getSkillGraph() {
    return [
      {
        id: 'skill_zk_escrow',
        skillName: 'Zero-Knowledge Batch Verification',
        category: 'CRYPTOGRAPHY_AND_SYSTEMS',
        description: 'Design and verification of privacy-preserving offline batch state transitions.',
        relatedSkillIds: ['skill_nest_microservices', 'skill_typeorm_architecture'],
        learningPathIds: ['path_agtech_protocols'],
        proficiencyLevelCount: 4,
      },
      {
        id: 'skill_agtech_logistics',
        skillName: 'Cold-Chain & Mandi Grain Logistics',
        category: 'AGRICULTURAL_COMMERCE',
        description: 'Real-time telemetry and quality grading standards across regional warehousing hubs.',
        relatedSkillIds: ['skill_zk_escrow'],
        learningPathIds: ['path_supply_chain_lead'],
        proficiencyLevelCount: 5,
      },
      {
        id: 'skill_multi_agent_teams',
        skillName: 'Multi-Agent Quality Gate Orchestration',
        category: 'AI_AND_AUTOMATION',
        description: 'Configuring safe inter-agent communication protocols and tool allowlists.',
        relatedSkillIds: ['skill_zk_escrow'],
        proficiencyLevelCount: 3,
      },
    ];
  }

  async analyzeSkillGapsForTarget(targetType: 'PROJECT' | 'OPPORTUNITY', targetId: string) {
    return {
      targetType,
      targetId,
      requiredSkills: [
        { skillName: 'Zero-Knowledge Batch Verification', importance: 'HIGH', currentCoveragePercent: 40 },
        { skillName: 'Cold-Chain & Mandi Grain Logistics', importance: 'HIGH', currentCoveragePercent: 85 },
        { skillName: 'Multi-Agent Quality Gate Orchestration', importance: 'MEDIUM', currentCoveragePercent: 60 },
      ],
      recommendedLearningPaths: [
        { id: 'path_zk_01', title: 'Edge Escrow & ZK Micro-Course', estimatedHours: 6 },
      ],
      recommendedPeerMentors: [
        { userId: 'usr_sarah_02', expertName: 'Dr. Sarah Chen', matchScore: 95 },
      ],
      aiSkillGapSummary: 'Primary gap identified in ZK Batch verification. Mentorship with Dr. Sarah Chen recommended to unblock milestone deliverables.',
    };
  }

  async listExpertProfiles(domain?: string) {
    return [
      {
        id: 'expert_01',
        userId: 'usr_sarah_02',
        expertName: 'Dr. Sarah Chen',
        titleHeadline: 'Principal Systems Architect @ AgriFlow Foundation',
        verifiedDomains: ['AgTech Protocols', 'Distributed Escrow', 'Multi-Agent Systems'],
        demonstratedPublicContributions: [
          { title: 'Zero-Knowledge Offline Batch Escrow Core Implementation', contributionType: 'CODE' as const, year: 2026 },
          { title: 'Mysore Mill Moisture Standards Research Paper', contributionType: 'RESEARCH' as const, year: 2026 },
        ],
        availabilityStatus: 'AVAILABLE_FOR_CONSULTATION',
        reputationIndex: 96.8,
        consultationsCompletedCount: 42,
        isPubliclyListed: true,
      },
      {
        id: 'expert_02',
        userId: 'usr_curr_01',
        expertName: 'Alex Morgan',
        titleHeadline: 'Founder & Full-Stack Architect @ Nexas Solutions',
        verifiedDomains: ['Enterprise Architecture', 'Next-Gen Mobile UX', 'Coordination Protocols'],
        demonstratedPublicContributions: [
          { title: 'LipTalk Global Intelligence Fabric Lead Architect', contributionType: 'CODE' as const, year: 2026 },
        ],
        availabilityStatus: 'OPEN_TO_COLLABORATION',
        reputationIndex: 94.5,
        consultationsCompletedCount: 28,
        isPubliclyListed: true,
      },
    ];
  }
}
