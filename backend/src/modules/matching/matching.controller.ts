import { Controller, Get, Param, Query } from '@nestjs/common';
import { MatchingService } from './matching.service';

@Controller('matches')
export class MatchingController {
  constructor(private readonly matchingService: MatchingService) {}

  @Get()
  async getMatches(@Query('userId') userId?: string) {
    // If no userId passed, fallback to demo/active user
    const targetUserId = userId || 'usr_curr_01';
    return this.matchingService.computeMatchesForUser(targetUserId);
  }

  @Get(':id/breakdown')
  async getMatchBreakdown(@Param('id') id: string) {
    return {
      matchId: id,
      verified: true,
      timestamp: new Date().toISOString(),
    };
  }
}
