import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CommunityReport,
  ReportTargetType,
  ReportStatus,
} from '../../database/entities/community-report.entity';
import { User } from '../../database/entities/user.entity';

export interface CreateReportDto {
  targetType: ReportTargetType;
  targetId: string;
  reason: string;
  details?: string;
}

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(CommunityReport)
    private readonly reportRepo: Repository<CommunityReport>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async create(userId: string, dto: CreateReportDto) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const report = this.reportRepo.create({
      reporter: user,
      targetType: dto.targetType,
      targetId: dto.targetId,
      reason: dto.reason,
      details: dto.details,
      status: ReportStatus.PENDING,
    });

    return this.reportRepo.save(report);
  }
}
