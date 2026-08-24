import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HumanAiTeam } from '../../database/entities/human-ai-team.entity';

@Injectable()
export class HumanAiTeamService {
  constructor(
    @InjectRepository(HumanAiTeam)
    private readonly teamRepo: Repository<HumanAiTeam>,
  ) {}

  async listTeams(projectId?: string) {
    const list = await this.teamRepo.find({ where: projectId ? { projectId } : {} });
    if (list.length > 0) return list;

    // Seed realistic human-AI project team
    return [
      {
        id: 'team_01',
        projectId: projectId || 'proj_supply_01',
        teamName: 'Open FMCG Supply Chain Core Squad',
        missionStatement: 'Deploying high-speed zero-knowledge verifiable escrow gateways across 14 mandi trade routes.',
        humanMembers: [
          { userId: 'usr_curr_01', role: 'OWNER' as const, joinedAt: '2026-08-20T10:00:00Z' },
          { userId: 'usr_sarah_02', role: 'CONTRIBUTOR' as const, joinedAt: '2026-08-21T14:30:00Z' },
        ],
        aiMembers: [
          {
            agentId: 'agent_procure_01',
            agentName: 'Procurement Specialist Agent',
            agentRole: 'RESEARCH_AGENT' as const,
            toolAllowlist: ['search', 'read_content', 'summarize'],
            budgetLimitUsd: 15.0,
          },
          {
            agentId: 'agent_qa_02',
            agentName: 'Schema Quality Gatekeeper',
            agentRole: 'QA_AGENT' as const,
            toolAllowlist: ['validate_json', 'check_signature'],
            budgetLimitUsd: 10.0,
          },
          {
            agentId: 'agent_pm_03',
            agentName: 'Sprint Orchestrator AI',
            agentRole: 'COORDINATOR' as const,
            toolAllowlist: ['task_summary', 'milestone_check'],
            budgetLimitUsd: 20.0,
          },
        ],
        aiProjectManagerTelemetry: {
          activeMilestone: 'Milestone 2 — Regional Mandi BLE Node Stress Testing',
          identifiedBlockers: ['Requires physical testing verification at Mysore depot on Wednesday.'],
          progressScore: 78.5,
          lastReportGeneratedAt: new Date().toISOString(),
        },
        status: 'ACTIVE',
      },
    ];
  }

  async getAiProjectManagerReport(projectId: string) {
    return {
      projectId,
      reportHeadline: 'Sprint Status: On Track • 78.5% Milestones Achieved',
      activeBlockersCount: 1,
      blockersSummary: [
        'Awaiting Mysore depot physical BLE beacon verification (Assigned to Alex Morgan).',
      ],
      upcomingMilestones: [
        { title: 'BLE Mesh Payload Optimization', targetDate: '2026-08-28', status: 'IN_PROGRESS' },
        { title: 'Zero-Knowledge Batch Verification Ratification', targetDate: '2026-09-02', status: 'PENDING_REVIEW' },
      ],
      aiRecommendation: 'Schedule 15-minute sync with Dr. Sarah Chen to finalize cryptographic payload limits before field tests.',
      generatedAt: new Date().toISOString(),
      disclaimer: 'AI Project Manager monitors telemetry and recommends priorities. Consequential decisions require human sign-off.',
    };
  }
}
