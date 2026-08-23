import { Controller, Get, Query } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly service: AnalyticsService) {}

  @Get('dashboard')
  getDashboard(@Query('userId') userId?: string) {
    return this.service.getDashboardSummary(userId || 'usr_curr_01');
  }
}
