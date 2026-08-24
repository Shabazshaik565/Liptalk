import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GlobalGoal } from '../../database/entities/global-goal.entity';
import { GoalMilestone } from '../../database/entities/goal-milestone.entity';
import { GoalParticipant } from '../../database/entities/goal-participant.entity';
import { GlobalInitiative } from '../../database/entities/global-initiative.entity';
import { InitiativeParticipant } from '../../database/entities/initiative-participant.entity';

@Injectable()
export class GoalsService {
  private readonly logger = new Logger(GoalsService.name);

  constructor(
    @InjectRepository(GlobalGoal)
    private readonly goalRepo: Repository<GlobalGoal>,
    @InjectRepository(GoalMilestone)
    private readonly milestoneRepo: Repository<GoalMilestone>,
    @InjectRepository(GoalParticipant)
    private readonly participantRepo: Repository<GoalParticipant>,
    @InjectRepository(GlobalInitiative)
    private readonly initiativeRepo: Repository<GlobalInitiative>,
    @InjectRepository(InitiativeParticipant)
    private readonly initPartRepo: Repository<InitiativeParticipant>,
  ) {}

  async getGoals(scope?: string, status?: string): Promise<GlobalGoal[]> {
    const qb = this.goalRepo.createQueryBuilder('goal');
    if (scope) qb.andWhere('goal.scope = :scope', { scope });
    if (status) qb.andWhere('goal.status = :status', { status });
    qb.orderBy('goal.createdAt', 'DESC');

    let goals = await qb.getMany();
    if (goals.length === 0) {
      const seedGoal = this.goalRepo.create({
        ownerId: 'usr_curr_01',
        scope: 'COMMUNITY',
        title: 'Open FMCG Supply Chain Gateway',
        description: 'Global initiative to connect independent Kirana merchants with regional agricultural mills and transparent logistics.',
        objectives: [
          'Unify 500+ regional grain mills onto standard open escrow APIs',
          'Deploy verified B2B price discovery radar across 4 states',
          'Coordinate decentralized community delivery fleets',
        ],
        resources: [
          { title: 'Open Escrow Architecture Spec v2.1', url: 'https://docs.liptalk.io/escrow', type: 'DOC' },
          { title: 'Regional Mill Price Index Dataset', url: 'https://data.liptalk.io/mills', type: 'DATASET' },
        ],
        assignedAgentIds: ['ag_procure_01', 'ag_logistics_02'],
        progressPercent: 68,
        status: 'ACTIVE',
        targetDate: '2026-11-30',
      });
      goals = [await this.goalRepo.save(seedGoal)];

      // Seed milestones
      const m1 = this.milestoneRepo.create({
        goalId: goals[0].id,
        title: 'Publish open mill API & escrow contracts',
        dueDate: '2026-09-15',
        isCompleted: true,
        verifiedBy: 'usr_curr_01',
      });
      const m2 = this.milestoneRepo.create({
        goalId: goals[0].id,
        title: 'Deploy live arbitration dashboard in 10 hubs',
        dueDate: '2026-10-15',
        isCompleted: false,
      });
      await this.milestoneRepo.save([m1, m2]);
    }
    return goals;
  }

  async getGoalById(id: string) {
    const goal = await this.goalRepo.findOne({ where: { id } });
    if (!goal) throw new NotFoundException('Goal not found');
    const [milestones, participants] = await Promise.all([
      this.milestoneRepo.find({ where: { goalId: id } }),
      this.participantRepo.find({ where: { goalId: id } }),
    ]);
    return { ...goal, milestones, participants };
  }

  async createGoal(ownerId: string, data: Partial<GlobalGoal>): Promise<GlobalGoal> {
    const goal = this.goalRepo.create({ ...data, ownerId });
    return this.goalRepo.save(goal);
  }

  async updateGoalProgress(id: string, progressPercent: number): Promise<GlobalGoal> {
    const goal = await this.goalRepo.findOne({ where: { id } });
    if (!goal) throw new NotFoundException('Goal not found');
    goal.progressPercent = progressPercent;
    if (progressPercent >= 100) goal.status = 'COMPLETED';
    return this.goalRepo.save(goal);
  }

  async addMilestone(goalId: string, data: Partial<GoalMilestone>): Promise<GoalMilestone> {
    const milestone = this.milestoneRepo.create({ ...data, goalId });
    return this.milestoneRepo.save(milestone);
  }

  async toggleMilestone(milestoneId: string, verifiedBy?: string): Promise<GoalMilestone> {
    const m = await this.milestoneRepo.findOne({ where: { id: milestoneId } });
    if (!m) throw new NotFoundException('Milestone not found');
    m.isCompleted = !m.isCompleted;
    if (m.isCompleted) {
      m.verifiedBy = verifiedBy || 'SYSTEM_VERIFIER';
      m.completedAt = new Date().toISOString();
    } else {
      m.verifiedBy = null;
      m.completedAt = null;
    }
    return this.milestoneRepo.save(m);
  }

  async joinGoal(goalId: string, userId: string, role = 'CONTRIBUTOR'): Promise<GoalParticipant> {
    let participant = await this.participantRepo.findOne({ where: { goalId, userId } });
    if (!participant) {
      participant = this.participantRepo.create({
        goalId,
        userId,
        role: role as any,
        contributionsCount: 1,
      });
    } else {
      participant.contributionsCount += 1;
    }
    return this.participantRepo.save(participant);
  }

  // Global Public Initiatives
  async getInitiatives(category?: string): Promise<GlobalInitiative[]> {
    let inits = await this.initiativeRepo.find({ order: { supportersCount: 'DESC' } });
    if (inits.length === 0) {
      const seedInit = this.initiativeRepo.create({
        creatorId: 'usr_curr_01',
        title: 'Decentralized Micro-Grant & Mentorship Coalition',
        mission: 'Provide seed capital, engineering mentorship, and distribution access to 10,000 independent grassroot innovators.',
        category: 'Economic Empowerment',
        targetRegions: ['South Asia', 'Southeast Asia', 'East Africa'],
        partnerCommunityIds: ['comm_kirana_01', 'comm_dev_india'],
        partnerOrganizationIds: ['org_nexas_01'],
        supportersCount: 4280,
        fundingGoalAmount: 5000000,
        currency: 'INR',
        fundingRaisedAmount: 3240000,
        status: 'ACTIVE',
      });
      inits = [await this.initiativeRepo.save(seedInit)];
    }
    if (category) {
      return inits.filter((i) => i.category.toLowerCase().includes(category.toLowerCase()));
    }
    return inits;
  }

  async createInitiative(creatorId: string, data: Partial<GlobalInitiative>): Promise<GlobalInitiative> {
    const init = this.initiativeRepo.create({ ...data, creatorId });
    return this.initiativeRepo.save(init);
  }

  async joinInitiative(initiativeId: string, participantId: string, participantType: 'USER' | 'COMMUNITY' | 'ORGANIZATION' = 'USER', pledgedAmount = 0): Promise<InitiativeParticipant> {
    const init = await this.initiativeRepo.findOne({ where: { id: initiativeId } });
    if (!init) throw new NotFoundException('Initiative not found');
    const part = this.initPartRepo.create({
      initiativeId,
      participantId,
      participantType,
      pledgedAmount,
      role: 'SUPPORTER',
    });
    init.supportersCount += 1;
    init.fundingRaisedAmount += pledgedAmount;
    await this.initiativeRepo.save(init);
    return this.initPartRepo.save(part);
  }
}
