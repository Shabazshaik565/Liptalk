import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Opportunity } from '../../database/entities/opportunity.entity';
import { OpportunityInterest } from '../../database/entities/opportunity-interest.entity';
import { User } from '../../database/entities/user.entity';

export interface OpportunityFilterDto {
  search?: string;
  category?: string;
  city?: string;
  status?: string;
  minBudget?: number;
  maxBudget?: number;
  page?: number;
  limit?: number;
}

@Injectable()
export class OpportunitiesService {
  constructor(
    @InjectRepository(Opportunity)
    private readonly oppRepo: Repository<Opportunity>,
    @InjectRepository(OpportunityInterest)
    private readonly interestRepo: Repository<OpportunityInterest>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async getOpportunities(filter?: OpportunityFilterDto) {
    const qb = this.oppRepo
      .createQueryBuilder('opp')
      .leftJoinAndSelect('opp.creator', 'creator')
      .leftJoinAndSelect('opp.business', 'business')
      .leftJoinAndSelect('opp.interests', 'interests');

    if (filter?.search) {
      const q = `%${filter.search.toLowerCase()}%`;
      qb.andWhere(
        '(LOWER(opp.title) LIKE :q OR LOWER(opp.description) LIKE :q OR LOWER(opp.categoryName) LIKE :q)',
        { q },
      );
    }

    if (filter?.category && filter.category !== 'ALL') {
      qb.andWhere('LOWER(opp.categoryName) LIKE :cat', {
        cat: `%${filter.category.toLowerCase()}%`,
      });
    }

    if (filter?.city) {
      qb.andWhere('LOWER(opp.city) = :city', {
        city: filter.city.toLowerCase(),
      });
    }

    if (filter?.status) {
      qb.andWhere('opp.status = :status', { status: filter.status });
    }

    if (filter?.minBudget !== undefined) {
      qb.andWhere('opp.budgetAmount >= :minBudget', { minBudget: filter.minBudget });
    }

    if (filter?.maxBudget !== undefined) {
      qb.andWhere('opp.budgetAmount <= :maxBudget', { maxBudget: filter.maxBudget });
    }

    const page = Math.max(1, Number(filter?.page) || 1);
    const limit = Math.min(50, Math.max(1, Number(filter?.limit) || 20));
    qb.skip((page - 1) * limit).take(limit);

    qb.orderBy('opp.createdAt', 'DESC');

    return qb.getMany();
  }

  async getOpportunityById(id: string) {
    return this.oppRepo.findOne({
      where: { id },
      relations: ['creator', 'business', 'interests', 'interests.user', 'interests.user.profile'],
    });
  }

  async createOpportunity(creatorId: string, data: Partial<Opportunity>) {
    const creator = await this.userRepo.findOne({ where: { id: creatorId } });
    const opp = this.oppRepo.create({
      ...data,
      creator: creator || undefined,
    });
    return this.oppRepo.save(opp);
  }

  async expressInterest(oppId: string, userId: string, pitch: string, amount?: number) {
    const opp = await this.oppRepo.findOne({ where: { id: oppId } });
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!opp || !user) return null;

    const interest = this.interestRepo.create({
      opportunity: opp,
      user,
      proposalMessage: pitch,
      pitchAmount: amount,
    });
    return this.interestRepo.save(interest);
  }
}
