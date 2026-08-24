import { Injectable, Logger, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AiAction } from '../../../database/entities/ai-action.entity';
import { AiUserPreference } from '../../../database/entities/ai-user-preference.entity';
import { AiAuditLog } from '../../../database/entities/ai-audit-log.entity';

export interface PlanAiActionDto {
  userId: string;
  actionType: 'SEARCH' | 'DRAFT' | 'MESSAGE' | 'PUBLISH' | 'PURCHASE' | 'DELETE' | 'TRANSLATE';
  targetEntity: string;
  payload: Record<string, any>;
}

@Injectable()
export class AiActionsService {
  private readonly logger = new Logger(AiActionsService.name);

  constructor(
    @InjectRepository(AiAction)
    private readonly actionRepo: Repository<AiAction>,
    @InjectRepository(AiUserPreference)
    private readonly userPrefRepo: Repository<AiUserPreference>,
    @InjectRepository(AiAuditLog)
    private readonly auditLogRepo: Repository<AiAuditLog>,
  ) {}

  /**
   * Plans an AI Agent action respecting permission tiers
   */
  async planAction(dto: PlanAiActionDto): Promise<AiAction> {
    const pref = await this.userPrefRepo.findOne({ where: { userId: dto.userId } });

    // Determine if action is high impact
    const isHighImpact = ['PUBLISH', 'PURCHASE', 'DELETE', 'MESSAGE'].includes(dto.actionType);
    const requiresConfirmation = isHighImpact || !(pref?.aiAutonomousWriteEnabled ?? false);

    const action = this.actionRepo.create({
      userId: dto.userId,
      actionType: dto.actionType,
      targetEntity: dto.targetEntity,
      payload: JSON.stringify(dto.payload),
      confirmationRequired: requiresConfirmation,
      status: requiresConfirmation ? 'PENDING_CONFIRMATION' : 'EXECUTED',
      executedAt: requiresConfirmation ? undefined : new Date(),
    });

    const saved = await this.actionRepo.save(action);

    // Audit log
    const audit = this.auditLogRepo.create({
      userId: dto.userId,
      action: `AI_ACTION_${dto.actionType}`,
      permissionScope: `ai.${dto.actionType.toLowerCase()}`,
      metadata: JSON.stringify({ actionId: saved.id, status: saved.status, target: dto.targetEntity }),
    });
    await this.auditLogRepo.save(audit);

    return saved;
  }

  /**
   * User explicitly confirms a pending AI action
   */
  async confirmAction(userId: string, actionId: string): Promise<AiAction> {
    const action = await this.actionRepo.findOne({ where: { id: actionId, userId } });
    if (!action) {
      throw new NotFoundException(`Action with ID '${actionId}' not found.`);
    }

    if (action.status !== 'PENDING_CONFIRMATION') {
      throw new ForbiddenException(`Action is already ${action.status}`);
    }

    action.status = 'EXECUTED';
    action.confirmedAt = new Date();
    action.executedAt = new Date();

    const updated = await this.actionRepo.save(action);

    // Audit log confirmation
    const audit = this.auditLogRepo.create({
      userId,
      action: `AI_ACTION_CONFIRMED_${action.actionType}`,
      permissionScope: `ai.${action.actionType.toLowerCase()}`,
      metadata: JSON.stringify({ actionId: action.id, executedAt: action.executedAt }),
    });
    await this.auditLogRepo.save(audit);

    return updated;
  }

  /**
   * User rejects a pending AI action
   */
  async rejectAction(userId: string, actionId: string): Promise<AiAction> {
    const action = await this.actionRepo.findOne({ where: { id: actionId, userId } });
    if (!action) {
      throw new NotFoundException(`Action with ID '${actionId}' not found.`);
    }

    action.status = 'REJECTED';
    return this.actionRepo.save(action);
  }

  /**
   * Retrieves all recent AI actions for user
   */
  async getUserActions(userId: string): Promise<AiAction[]> {
    return this.actionRepo.find({
      where: { userId },
      order: { createdAt: 'DESC' },
      take: 50,
    });
  }
}
