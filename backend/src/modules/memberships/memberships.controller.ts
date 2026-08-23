import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { MembershipsService } from './memberships.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('membership')
export class MembershipsController {
  constructor(private readonly membershipService: MembershipsService) {}

  @Get('current')
  @UseGuards(JwtAuthGuard)
  async getCurrentMembership(@Req() req: any) {
    const userId = req.user?.id || 'usr_curr_01';
    return this.membershipService.getUserMembership(userId);
  }

  @Get('plans')
  async getPlans() {
    return this.membershipService.getAvailablePlans();
  }
}
