import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Organization } from '../../database/entities/organization.entity';
import { OrganizationMember } from '../../database/entities/organization-member.entity';
import { OrganizationInvitation } from '../../database/entities/organization-invitation.entity';
import { Team } from '../../database/entities/team.entity';
import { User } from '../../database/entities/user.entity';
import { EnterpriseService } from './enterprise.service';
import { EnterpriseController } from './enterprise.controller';
import { PermissionsGuard } from '../rbac/permissions.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Organization,
      OrganizationMember,
      OrganizationInvitation,
      Team,
      User,
    ]),
  ],
  controllers: [EnterpriseController],
  providers: [EnterpriseService, PermissionsGuard],
  exports: [EnterpriseService],
})
export class EnterpriseModule {}
