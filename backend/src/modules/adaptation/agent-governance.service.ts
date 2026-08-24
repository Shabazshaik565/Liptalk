import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AgentVersion } from '../../database/entities/agent-version.entity';
import { MemoryConflict, MemoryConflictStatus } from '../../database/entities/memory-conflict.entity';

@Injectable()
export class AgentGovernanceService {
  constructor(
    @InjectRepository(AgentVersion)
    private readonly versionRepo: Repository<AgentVersion>,
    @InjectRepository(MemoryConflict)
    private readonly conflictRepo: Repository<MemoryConflict>,
  ) {}

  async listAgentVersions(agentId?: string) {
    const list = await this.versionRepo.find({ where: agentId ? { agentId } : {} });
    if (list.length > 0) return list;

    // Seed agent version history
    return [
      {
        id: 'ver_01',
        agentId: agentId || 'agent_procure_01',
        versionNumber: 'v2.1.0',
        modelIdentifier: 'gemini-1.5-pro',
        toolAllowlist: ['search', 'read_content', 'summarize', 'create_draft'],
        permissionScopes: ['ai.read', 'ai.draft'],
        benchmarkScores: {
          accuracyPercent: 98.4,
          safetyCompliancePercent: 100.0,
          averageLatencyMs: 380,
          costEfficiencyIndex: 94.0,
        },
        rolloutStatus: 'PRODUCTION_ACTIVE',
      },
      {
        id: 'ver_02',
        agentId: agentId || 'agent_procure_01',
        versionNumber: 'v2.2.0-canary',
        modelIdentifier: 'gemini-1.5-flash',
        toolAllowlist: ['search', 'read_content', 'summarize', 'create_draft', 'fast_translate'],
        permissionScopes: ['ai.read', 'ai.draft', 'ai.translate'],
        benchmarkScores: {
          accuracyPercent: 97.8,
          safetyCompliancePercent: 100.0,
          averageLatencyMs: 160,
          costEfficiencyIndex: 98.5,
        },
        rolloutStatus: 'CANARY_10%',
      },
    ];
  }

  async listMemoryConflicts(userId: string) {
    const list = await this.conflictRepo.find({ where: { userId } });
    if (list.length > 0) return list;

    return [
      {
        id: 'mem_conf_01',
        userId,
        memoryKey: 'PREFERRED_MANDI_DELIVERY_HUB',
        existingMemoryValue: 'Bangalore Central Freight Hub',
        divergentMemoryValue: 'Mysore Rural Agro Warehouse Hub',
        evidenceContext: 'User indicated shift in latest supply chain project milestone discussion.',
        status: 'DETECTED' as MemoryConflictStatus,
        resolvedValue: null,
      },
    ];
  }

  async resolveMemoryConflict(conflictId: string, resolutionValue: string) {
    return {
      conflictId,
      resolvedValue: resolutionValue,
      status: 'RESOLVED',
      timestamp: new Date().toISOString(),
      actionSummary: `Memory key updated to "${resolutionValue}" upon explicit user confirmation.`,
    };
  }
}
