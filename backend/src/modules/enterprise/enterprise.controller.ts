import { Controller, Get, Post, Body, Param, Request, UseGuards } from '@nestjs/common';
import { EnterpriseService } from './enterprise.service';
import { OrganizationRole } from '../../database/entities/organization-member.entity';
import { PermissionsGuard } from '../rbac/permissions.guard';
import { RequirePermissions } from '../rbac/require-permissions.decorator';
import { Permission } from '../rbac/permissions.enum';

@Controller('enterprise')
@UseGuards(PermissionsGuard)
export class EnterpriseController {
  constructor(private readonly enterpriseService: EnterpriseService) {}

  @Get('my-organizations')
  async getMyOrganizations(@Request() req: any) {
    const userId = req.user?.id || 'usr_curr_01';
    return this.enterpriseService.getUserOrganizations(userId);
  }

  @Get('organizations/:id')
  async getOrganization(@Param('id') id: string, @Request() req: any) {
    const userId = req.user?.id || 'usr_curr_01';
    return this.enterpriseService.getOrganizationById(id, userId);
  }

  @Post('organizations')
  async createOrganization(
    @Body() body: {
      name: string;
      description?: string;
      industry?: string;
      employeeCountRange?: string;
      location?: string;
      websiteUrl?: string;
      logoUrl?: string;
    },
    @Request() req: any,
  ) {
    const userId = req.user?.id || 'usr_curr_01';
    return this.enterpriseService.createOrganization(userId, body);
  }

  @Get('organizations/:id/members')
  @RequirePermissions(Permission.ORG_MEMBERS_VIEW)
  async getMembers(@Param('id') orgId: string) {
    return this.enterpriseService.getMembers(orgId);
  }

  @Post('organizations/:id/invite')
  @RequirePermissions(Permission.ORG_MEMBERS_MANAGE)
  async inviteMember(
    @Param('id') orgId: string,
    @Body() body: { email: string; role?: OrganizationRole },
    @Request() req: any,
  ) {
    const inviterId = req.user?.id || 'usr_curr_01';
    return this.enterpriseService.inviteMember(orgId, inviterId, body.email, body.role);
  }

  @Post('invitations/accept')
  async acceptInvitation(@Body() body: { token: string }, @Request() req: any) {
    const userId = req.user?.id || 'usr_curr_01';
    return this.enterpriseService.acceptInvitation(body.token, userId);
  }

  @Get('organizations/:id/teams')
  @RequirePermissions(Permission.ORG_VIEW)
  async getTeams(@Param('id') orgId: string) {
    return this.enterpriseService.getTeams(orgId);
  }

  @Get('organizations/:id/analytics')
  @RequirePermissions(Permission.ORG_ANALYTICS_VIEW)
  async getAnalytics(@Param('id') orgId: string) {
    return this.enterpriseService.getEnterpriseAnalytics(orgId);
  }
}
