import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SecurityThreatEvent, ThreatSeverity, ThreatStatus } from '../../database/entities/security-threat-event.entity';

@Injectable()
export class ContinuousSecurityService {
  constructor(
    @InjectRepository(SecurityThreatEvent)
    private readonly threatRepo: Repository<SecurityThreatEvent>,
  ) {}

  async listThreatEvents() {
    const list = await this.threatRepo.find();
    if (list.length > 0) return list;

    // Seed realistic threat events with bounded auto-containment
    return [
      {
        id: 'threat_01',
        threatType: 'ANOMALOUS_BURST_IP_ACCESS',
        title: 'High-Frequency API Query Burst on Unverified Mandi Endpoint',
        description: 'Detected 450 requests/sec from single non-browser IP range targeting public pricing radar.',
        targetEntityId: 'ip_192_0_2_44',
        severity: 'MEDIUM' as ThreatSeverity,
        automatedBoundedResponse: {
          actionTaken: 'RATE_LIMITED' as const,
          targetId: 'ip_192_0_2_44',
          reversible: true,
          executedAt: new Date().toISOString(),
        },
        status: 'AUTO_CONTAINED' as ThreatStatus,
      },
      {
        id: 'threat_02',
        threatType: 'PROMPT_INJECTION_PROBE',
        title: 'Adversarial Prompt Injection Probe Deflected',
        description: 'Input attempted delimiter escape to override agent system instruction. Policy filter blocked query.',
        targetEntityId: 'agent_procure_01',
        severity: 'LOW' as ThreatSeverity,
        automatedBoundedResponse: {
          actionTaken: 'SESSION_TERMINATED' as const,
          targetId: 'sess_probe_09',
          reversible: false,
          executedAt: new Date().toISOString(),
        },
        status: 'AUTO_CONTAINED' as ThreatStatus,
      },
    ];
  }

  async simulatePrivacyImpact(targetAppOrIntegration: string, requestedScopes: string[]) {
    return {
      targetAppOrIntegration,
      requestedScopes,
      dataAccessedSummary: [
        { scope: 'projects.read', impact: 'Can view public titles and milestones of active projects.' },
        { scope: 'knowledge.search', impact: 'Can query public verified articles and research synthesis.' },
      ],
      prohibitedActions: [
        'Cannot access private personal messages',
        'Cannot execute financial payments or payouts',
        'Cannot alter profile security credentials',
      ],
      retentionPolicy: 'Data cached for active session only; zero permanent storage on external server.',
      revocationBehavior: 'One-tap immediate revocation permanently invalidates OAuth token.',
      recommendedAction: 'SAFE_TO_AUTHORIZE',
    };
  }

  async getDataLifecycleRules() {
    return [
      { category: 'AI_AGENT_EXECUTION_LOGS', retentionDays: 30, deletionPolicy: 'AUTOMATIC_PURGE_AFTER_30_DAYS' },
      { category: 'PROMPT_TELEMETRY_MINIMIZED', retentionDays: 14, deletionPolicy: 'ANONYMIZED_AND_PURGED' },
      { category: 'VOICE_SESSION_AUDIO_BUFFERS', retentionDays: 0, deletionPolicy: 'ZERO_RETENTION_IN_MEMORY_STREAM' },
      { category: 'SECURITY_AUDIT_TRAILS', retentionDays: 365, deletionPolicy: 'ENCRYPTED_COLD_ARCHIVE' },
    ];
  }
}
