import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { RecommendationsService } from './recommendations.service';

@Controller('recommendations')
export class RecommendationsController {
  constructor(private readonly recService: RecommendationsService) {}

  @Get('discover')
  async getPersonalizedDiscover(@Request() req: any) {
    const userId = req.user?.id || 'usr_curr_01';
    return this.recService.getPersonalizedDiscover(userId);
  }

  @Post('feedback')
  async recordFeedback(
    @Body() body: { targetType: string; targetId: string; feedback: 'RELEVANT' | 'NOT_RELEVANT' },
    @Request() req: any,
  ) {
    const userId = req.user?.id || 'usr_curr_01';
    return this.recService.recordFeedback(userId, body.targetType, body.targetId, body.feedback);
  }
}
