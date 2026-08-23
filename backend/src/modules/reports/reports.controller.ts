import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { ReportsService, CreateReportDto } from './reports.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async createReport(@Req() req: any, @Body() dto: CreateReportDto) {
    const userId = req.user?.id || 'usr_curr_01';
    return this.reportsService.create(userId, dto);
  }
}
