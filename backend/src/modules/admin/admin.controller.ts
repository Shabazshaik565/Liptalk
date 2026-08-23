import { Controller, Get, Post, Body, Query, Request } from '@nestjs/common';
import { AdminService } from './admin.service';
import { FeatureFlags } from '../../common/feature-flags/feature-flags.service';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('overview')
  async getOverview() {
    return this.adminService.getPlatformOverview();
  }

  @Get('audit-logs')
  async getAuditLogs(@Query('limit') limit?: number) {
    return this.adminService.getAuditLogs(limit ? Number(limit) : 50);
  }

  @Get('feature-flags')
  async getFeatureFlags() {
    return this.adminService.getFeatureFlags();
  }

  @Post('feature-flags')
  async setFeatureFlag(
    @Body() body: { flag: keyof FeatureFlags; value: boolean },
  ) {
    return this.adminService.setFeatureFlag(body.flag, body.value);
  }
}
