import { Controller, Get, Post, Body, Param, Query, Request } from '@nestjs/common';
import { EcosystemService } from './ecosystem.service';

@Controller('ecosystem')
export class EcosystemController {
  constructor(private readonly ecoService: EcosystemService) {}

  @Get('reputation')
  async getMyReputation(@Request() req: any) {
    const userId = req.user?.id || 'usr_curr_01';
    return this.ecoService.getReputationProfile(userId);
  }

  @Get('reputation/:userId')
  async getUserReputation(@Param('userId') userId: string) {
    return this.ecoService.getReputationProfile(userId);
  }

  @Get('projects')
  async getProjects(@Request() req: any) {
    const userId = req.user?.id || 'usr_curr_01';
    return this.ecoService.getUserProjects(userId);
  }

  @Post('projects')
  async createProject(@Body() body: any, @Request() req: any) {
    const userId = req.user?.id || 'usr_curr_01';
    return this.ecoService.createProject(userId, body);
  }

  @Get('creator/services')
  async getCreatorServices(@Request() req: any) {
    const userId = req.user?.id || 'usr_curr_01';
    return this.ecoService.getCreatorServices(userId);
  }

  @Post('creator/revenue-split')
  async calculateSplit(
    @Body() body: { amount: number; currency?: string; hasCollaborator?: boolean; hasCommunity?: boolean },
  ) {
    return this.ecoService.calculateRevenueSplit(
      body.amount,
      body.currency || 'INR',
      body.hasCollaborator,
      body.hasCommunity,
    );
  }

  @Get('subscriptions')
  async getSubscriptions(@Request() req: any) {
    const userId = req.user?.id || 'usr_curr_01';
    return this.ecoService.getUserSubscriptions(userId);
  }

  @Get('agent-store')
  async getAgentStore(@Query('category') category?: string) {
    return this.ecoService.getAgentStore(category);
  }

  @Get('mentorship')
  async getMentors(@Query('expertise') expertise?: string) {
    return this.ecoService.getMentors(expertise);
  }

  @Get('opportunities/match')
  async matchOpportunities(@Request() req: any) {
    const userId = req.user?.id || 'usr_curr_01';
    return this.ecoService.matchOpportunities(userId);
  }
}
