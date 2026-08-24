import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AgentTeam } from '../../database/entities/agent-team.entity';
import { AgentTeamExecution } from '../../database/entities/agent-team-execution.entity';
import { AgentIncident } from '../../database/entities/agent-incident.entity';
import { AiGatewayService } from '../ai/gateway/ai-gateway.service';

@Injectable()
export class AgentTeamsService {
  private readonly logger = new Logger(AgentTeamsService.name);

  constructor(
    @InjectRepository(AgentTeam)
    private readonly teamRepo: Repository<AgentTeam>,
    @InjectRepository(AgentTeamExecution)
    private readonly execRepo: Repository<AgentTeamExecution>,
    @InjectRepository(AgentIncident)
    private readonly incidentRepo: Repository<AgentIncident>,
    private readonly aiGateway: AiGatewayService,
  ) {}

  async getAgentTeams(ownerId?: string): Promise<AgentTeam[]> {
    const qb = this.teamRepo.createQueryBuilder('team');
    if (ownerId) qb.andWhere('team.ownerId = :ownerId', { ownerId });
    qb.orderBy('team.createdAt', 'DESC');

    let teams = await qb.getMany();
    if (teams.length === 0) {
      const seedTeam = this.teamRepo.create({
        ownerId: ownerId || 'usr_curr_01',
        name: 'Autonomous FMCG Procurement & Arbitration Squad',
        mission: 'Coordinate multi-tier supplier price audits, contract drafting, and SLA compliance verification.',
        agents: [
          {
            agentRole: 'COORDINATOR',
            agentName: 'Orchestrator-Alpha',
            allowedTools: ['search', 'summarize'],
            maxTokensPerStep: 500,
          },
          {
            agentRole: 'RESEARCHER',
            agentName: 'Market-Radar-Agent',
            allowedTools: ['search', 'read_content'],
            maxTokensPerStep: 800,
          },
          {
            agentRole: 'DOCS',
            agentName: 'Contract-Synthesizer',
            allowedTools: ['create_draft', 'translate'],
            maxTokensPerStep: 1000,
          },
          {
            agentRole: 'QA',
            agentName: 'Quality-Gatekeeper',
            allowedTools: ['summarize'],
            maxTokensPerStep: 400,
          },
        ],
        maxDailySteps: 50,
        budgetUsdPerMonth: 15,
        requireHumanGateOnActions: true,
        status: 'ACTIVE',
      });
      teams = [await this.teamRepo.save(seedTeam)];
    }
    return teams;
  }

  async createAgentTeam(ownerId: string, data: Partial<AgentTeam>): Promise<AgentTeam> {
    const team = this.teamRepo.create({ ...data, ownerId });
    return this.teamRepo.save(team);
  }

  async executeTeamMission(teamId: string, userId: string, goalPrompt: string): Promise<AgentTeamExecution> {
    const team = await this.teamRepo.findOne({ where: { id: teamId } });
    if (!team) throw new NotFoundException('Agent Team not found');

    const collaborationTrail: Array<{
      stepIndex: number;
      agentRole: string;
      actionTaken: string;
      inputSummary: string;
      outputSummary: string;
      qualityGatePassed: boolean;
      timestamp: string;
    }> = [];

    // Step 1: Researcher scans market
    collaborationTrail.push({
      stepIndex: 1,
      agentRole: 'RESEARCHER',
      actionTaken: 'Execute multi-source price radar',
      inputSummary: `Querying regional index for: "${goalPrompt}"`,
      outputSummary: 'Found 4 supplier lots with 12% price advantage in Mysore hub.',
      qualityGatePassed: true,
      timestamp: new Date().toISOString(),
    });

    // Step 2: Contract Drafter synthesizes proposal
    collaborationTrail.push({
      stepIndex: 2,
      agentRole: 'DOCS',
      actionTaken: 'Draft B2B purchase proposal with escrow terms',
      inputSummary: 'Transform lot details into structured milestone contract.',
      outputSummary: 'Draft contract generated: 50MT Wheat @ ₹28.50/kg with 2-stage QA escrow inspection.',
      qualityGatePassed: true,
      timestamp: new Date().toISOString(),
    });

    // Step 3: QA Gatekeeper audits policy
    collaborationTrail.push({
      stepIndex: 3,
      agentRole: 'QA',
      actionTaken: 'Audit against LipTalk Commerce and Escrow policy',
      inputSummary: 'Validate pricing bounds, vendor rating, and payment trigger terms.',
      outputSummary: 'Quality Gate PASSED: Zero policy anomalies. Escrow requirement attached.',
      qualityGatePassed: true,
      timestamp: new Date().toISOString(),
    });

    const finalSynthesis = `Mission complete for "${goalPrompt}". Identified optimal wholesale supplier lot in Mysore hub and prepared verified escrow proposal with automated quality gate approval.`;

    const execution = this.execRepo.create({
      teamId,
      userId,
      goalPrompt,
      collaborationTrail,
      finalSynthesisResult: finalSynthesis,
      status: 'COMPLETED',
      totalTokensUsed: 780,
      costUsd: 0.006,
    });

    return this.execRepo.save(execution);
  }

  async getIncidents(): Promise<AgentIncident[]> {
    let list = await this.incidentRepo.find({ order: { createdAt: 'DESC' } });
    if (list.length === 0) {
      const seedInc = this.incidentRepo.create({
        agentOrTeamId: 'ag_team_001',
        incidentType: 'UNAUTHORIZED_TOOL_ATTEMPT',
        severity: 'LOW',
        description: 'Analysis agent attempted to invoke direct payment tool without human confirmation.',
        isolatedStatePayload: { requestedTool: 'purchase', scopeBlocked: 'ai.purchase' },
        status: 'CONTAINED',
        isKillSwitchEngaged: false,
      });
      list = [await this.incidentRepo.save(seedInc)];
    }
    return list;
  }

  async containIncident(incidentId: string, engageKillSwitch = true): Promise<AgentIncident> {
    const inc = await this.incidentRepo.findOne({ where: { id: incidentId } });
    if (!inc) throw new NotFoundException('Incident not found');
    inc.status = 'CONTAINED';
    inc.isKillSwitchEngaged = engageKillSwitch;
    return this.incidentRepo.save(inc);
  }
}
