import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../database/entities/user.entity';
import { Organization } from '../../database/entities/organization.entity';
import { Community } from '../../database/entities/community.entity';
import { Opportunity } from '../../database/entities/opportunity.entity';
import { Report } from '../../database/entities/report.entity';
import { AuditLog } from '../../database/entities/audit-log.entity';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Organization,
      Community,
      Opportunity,
      Report,
      AuditLog,
    ]),
  ],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
