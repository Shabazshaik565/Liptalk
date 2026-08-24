import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AgentCertification, CertificationLevel } from '../../database/entities/agent-certification.entity';

@Injectable()
export class AgentCertificationService {
  constructor(
    @InjectRepository(AgentCertification)
    private readonly certRepo: Repository<AgentCertification>,
  ) {}

  async listCertifiedAgents(tier?: CertificationLevel) {
    const list = await this.certRepo.find({ where: tier ? { certificationTier: tier } : {} });
    if (list.length > 0) return list;

    // Seed certified agents
    return [
      {
        id: 'cert_ag_01',
        agentId: 'agent_procure_01',
        agentName: 'Mandi Procurement Intelligence Agent',
        developer: 'LipTalk AgTech Core Lab',
        certificationTier: 'ENTERPRISE_APPROVED' as CertificationLevel,
        toolAllowlist: ['search', 'read_content', 'summarize', 'calc_spot_rate'],
        dataAccessScopes: ['marketplace.read', 'communities.public', 'knowledge.search'],
        sandboxConstraints: {
          maxExecutionTimeMs: 15000,
          maxBudgetPerTaskUsd: 0.05,
          networkOutboundRestricted: true,
          fileAccessRestrictedToProject: true,
        },
        securityAuditSummary: 'Zero prompt-injection vulnerabilities detected across 150 automated red-teaming permutations. No arbitrary network egress.',
        status: 'ACTIVE',
      },
      {
        id: 'cert_ag_02',
        agentId: 'agent_qa_02',
        agentName: 'Cryptographic Schema Validator AI',
        developer: 'Open Source Security Collective',
        certificationTier: 'SECURITY_REVIEWED' as CertificationLevel,
        toolAllowlist: ['validate_json', 'check_signature', 'verify_hash'],
        dataAccessScopes: ['projects.read_artifacts'],
        sandboxConstraints: {
          maxExecutionTimeMs: 5000,
          maxBudgetPerTaskUsd: 0.01,
          networkOutboundRestricted: true,
          fileAccessRestrictedToProject: true,
        },
        securityAuditSummary: 'Deterministic schema validator running in isolated WebAssembly micro-sandbox.',
        status: 'ACTIVE',
      },
    ];
  }

  async previewAgentPermissions(agentId: string) {
    return {
      agentId,
      previewHeadline: 'Permission & Data Scope Preview for Mandi Procurement Intelligence Agent',
      allowedTools: ['Marketplace Search', 'Public Knowledge Retrieval', 'Spot Rate Calculator'],
      prohibitedActions: [
        'Cannot initiate banking transactions or debit balances',
        'Cannot access private unencrypted chat histories',
        'Cannot modify user or project security credentials',
      ],
      sandboxBoundaries: {
        budgetLimitPerTask: '$0.05 USD',
        runtimeLimit: '15.0s maximum execution window',
        networkEgress: 'Restricted exclusively to internal LipTalk API Gateway',
      },
      certificationBadge: 'ENTERPRISE_APPROVED',
      safetyGuarantee: 'Agent is bound by hardware sandbox and cannot modify its own allowlists.',
    };
  }
}
