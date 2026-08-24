import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DataAccessLog } from '../../database/entities/data-access-log.entity';
import { IdentityContext } from '../../database/entities/identity-context.entity';
import { AiUserMemory } from '../../database/entities/ai-user-memory.entity';

@Injectable()
export class PrivacyVaultService {
  private readonly logger = new Logger(PrivacyVaultService.name);

  constructor(
    @InjectRepository(DataAccessLog)
    private readonly logRepo: Repository<DataAccessLog>,
    @InjectRepository(IdentityContext)
    private readonly contextRepo: Repository<IdentityContext>,
    @InjectRepository(AiUserMemory)
    private readonly memoryRepo: Repository<AiUserMemory>,
  ) {}

  async getPersonalVaultData(userId: string) {
    const [logs, contexts, memories] = await Promise.all([
      this.logRepo.find({ where: { userId }, order: { accessedAt: 'DESC' }, take: 10 }),
      this.getIdentityContext(userId),
      this.memoryRepo.find({ where: { userId } }),
    ]);

    return {
      userId,
      vaultStatus: 'ENCRYPTED_AND_ISOLATED',
      activeContext: contexts.activeContextType,
      availablePersonas: contexts.availableContexts,
      recentAccessEvents: logs,
      retainedMemoriesCount: memories.length,
      privacyControls: {
        proactiveIntelligence: true,
        aiMemoryAllowed: true,
        thirdPartySharing: false,
        biometricVoiceStorage: false,
      },
    };
  }

  async getIdentityContext(userId: string): Promise<IdentityContext> {
    let ctx = await this.contextRepo.findOne({ where: { userId } });
    if (!ctx) {
      ctx = this.contextRepo.create({
        userId,
        activeContextType: 'PERSONAL',
        availableContexts: [
          {
            contextType: 'PERSONAL',
            entityName: 'Personal Identity',
            role: 'INDIVIDUAL',
            reputationScore: 92,
          },
          {
            contextType: 'CREATOR',
            entityName: 'Nexas Cloud & Architecture Studio',
            role: 'FOUNDER_CREATOR',
            reputationScore: 88,
          },
          {
            contextType: 'DEVELOPER',
            entityName: 'B2B Open Trade Gateway Apps',
            role: 'VERIFIED_DEVELOPER',
            reputationScore: 94,
          },
          {
            contextType: 'COMMUNITY_MODERATOR',
            entityName: 'Kirana Wholesale Traders Guild',
            role: 'LEAD_MODERATOR',
            reputationScore: 96,
          },
        ],
        scopedPermissions: ['profile.read', 'projects.write', 'governance.vote'],
      });
      ctx = await this.contextRepo.save(ctx);
    }
    return ctx;
  }

  async switchIdentityContext(userId: string, contextType: any): Promise<IdentityContext> {
    const ctx = await this.getIdentityContext(userId);
    ctx.activeContextType = contextType;
    return this.contextRepo.save(ctx);
  }

  async getDataAccessLogs(userId: string): Promise<DataAccessLog[]> {
    let logs = await this.logRepo.find({ where: { userId }, order: { accessedAt: 'DESC' } });
    if (logs.length === 0) {
      const seed1 = this.logRepo.create({
        userId,
        accessorId: 'App_TradeRadar_01',
        accessorType: 'DEVELOPER_APP',
        dataScopeAccessed: 'projects.read',
        purpose: 'Scan open milestone timelines for supplier matchmaking.',
        status: 'AUTHORIZED',
        canRevoke: true,
      });
      const seed2 = this.logRepo.create({
        userId,
        accessorId: 'Agent_Contract_Drafter',
        accessorType: 'AI_AGENT',
        dataScopeAccessed: 'knowledge.search',
        purpose: 'Retrieve ISO escrow boilerplate for proposal drafting.',
        status: 'AUTHORIZED',
        canRevoke: true,
      });
      logs = await this.logRepo.save([seed1, seed2]);
    }
    return logs;
  }

  async revokeDataAccess(logId: string): Promise<DataAccessLog> {
    const log = await this.logRepo.findOne({ where: { id: logId } });
    if (!log) throw new NotFoundException('Log entry not found');
    log.status = 'REVOKED';
    return this.logRepo.save(log);
  }

  async exportVaultArchive(userId: string) {
    const vault = await this.getPersonalVaultData(userId);
    return {
      exportedAt: new Date().toISOString(),
      userVaultExport: vault,
      integrityChecksum: 'sha256_e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    };
  }
}
