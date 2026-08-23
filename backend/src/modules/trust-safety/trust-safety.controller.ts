import { Controller, Get, Post, Body, Param, Query, Request } from '@nestjs/common';
import { TrustSafetyService } from './trust-safety.service';
import { ReportTargetType, ReportReason, ReportStatus } from '../../database/entities/report.entity';

@Controller('trust-safety')
export class TrustSafetyController {
  constructor(private readonly trustSafetyService: TrustSafetyService) {}

  @Post('reports')
  async createReport(
    @Body()
    body: {
      targetType: ReportTargetType;
      targetId: string;
      reason: ReportReason;
      description?: string;
    },
    @Request() req: any,
  ) {
    const reporterId = req.user?.id || 'usr_curr_01';
    return this.trustSafetyService.createReport(reporterId, body);
  }

  @Get('reports')
  async getReports(@Query('status') status?: ReportStatus) {
    return this.trustSafetyService.getReports(status);
  }

  @Post('reports/:id/action')
  async takeAction(
    @Param('id') reportId: string,
    @Body() body: { status: ReportStatus; actionTaken: string; moderatorNotes?: string },
  ) {
    return this.trustSafetyService.takeModerationAction(reportId, body);
  }

  @Post('blocks/:userId')
  async blockUser(@Param('userId') blockedId: string, @Request() req: any) {
    const blockerId = req.user?.id || 'usr_curr_01';
    return this.trustSafetyService.blockUser(blockerId, blockedId);
  }

  @Post('unblock/:userId')
  async unblockUser(@Param('userId') blockedId: string, @Request() req: any) {
    const blockerId = req.user?.id || 'usr_curr_01';
    return this.trustSafetyService.unblockUser(blockerId, blockedId);
  }

  @Get('blocks')
  async getBlockedUsers(@Request() req: any) {
    const userId = req.user?.id || 'usr_curr_01';
    return this.trustSafetyService.getBlockedUsers(userId);
  }

  @Get('trust-score/:userId')
  async getTrustScore(@Param('userId') userId: string) {
    return this.trustSafetyService.calculateTrustScore(userId);
  }

  @Get('my-trust-score')
  async getMyTrustScore(@Request() req: any) {
    const userId = req.user?.id || 'usr_curr_01';
    return this.trustSafetyService.calculateTrustScore(userId);
  }
}
