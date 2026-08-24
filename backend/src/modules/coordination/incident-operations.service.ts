import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IncidentRecord } from '../../database/entities/incident-record.entity';

@Injectable()
export class IncidentOperationsService {
  private readonly logger = new Logger(IncidentOperationsService.name);

  constructor(
    @InjectRepository(IncidentRecord)
    private readonly incidentRepo: Repository<IncidentRecord>,
  ) {}

  async getGlobalIncidents(): Promise<IncidentRecord[]> {
    let incidents = await this.incidentRepo.find({ order: { createdAt: 'DESC' } });
    if (incidents.length === 0) {
      const seed1 = this.incidentRepo.create({
        category: 'INFRASTRUCTURE',
        title: 'Transient Webhook Delivery Spike on South Asia Edge Gateway',
        description: 'Webhook backlog increased by 15% due to momentary upstream provider timeout.',
        severity: 'LOW',
        status: 'HEALED_AUTOMATICALLY',
        affectedSubsystems: ['webhooks', 'edge-router'],
        automatedRecoveryActions: [
          'Triggered exponential backoff retry worker',
          'Rerouted 40% traffic to backup Mumbai region edge cache',
        ],
        aiOperationsRemediationNote: 'System self-recovered within 45 seconds. Zero payload drop recorded.',
      });
      const seed2 = this.incidentRepo.create({
        category: 'AI_AGENT_FAILURE',
        title: 'Sandboxed Rate Limit Breach on Agent Team Squad Alpha',
        description: 'Multi-agent execution exceeded 40 requests/minute burst threshold.',
        severity: 'MEDIUM',
        status: 'CONTAINED',
        affectedSubsystems: ['agent-orchestrator', 'token-budgeter'],
        automatedRecoveryActions: [
          'Engaged automatic rate throttling',
          'Enforced 15-second execution pause before next collaborative step',
        ],
        aiOperationsRemediationNote: 'Incident contained by automated policy guardrails.',
      });
      incidents = await this.incidentRepo.save([seed1, seed2]);
    }
    return incidents;
  }

  async simulateSelfHealing(incidentId: string) {
    const inc = await this.incidentRepo.findOne({ where: { id: incidentId } });
    if (!inc) throw new Error('Incident not found');
    inc.status = 'HEALED_AUTOMATICALLY';
    inc.automatedRecoveryActions = [
      ...(inc.automatedRecoveryActions || []),
      `Self-healing worker rebalanced queue and verified health telemetry at ${new Date().toISOString()}`,
    ];
    return this.incidentRepo.save(inc);
  }

  getOperationsAssistantBriefing() {
    return {
      systemHealthStatus: 'OPTIMAL_99.98%',
      activeIncidentsCount: 0,
      containedIncidentsCount: 2,
      predictedTrafficSpikes: [
        { timeframe: 'Next 4 Hours', region: 'IN-SOUTH', expectedLoadIncrease: '+18%' },
      ],
      selfHealingMetrics: {
        workerAutoRestarts24h: 3,
        automatedQueueRebalances: 7,
        zeroDowntimeFailovers: 1,
      },
      aiOperationsRecommendation: 'All regional edge routes are stable. Recommended action: Maintain standard automated recovery thresholds.',
    };
  }
}
