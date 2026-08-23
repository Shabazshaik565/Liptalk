import { Controller, Get, Post, Param, Body, Query } from '@nestjs/common';
import { OpportunitiesService, OpportunityFilterDto } from './opportunities.service';

@Controller('opportunities')
export class OpportunitiesController {
  constructor(private readonly service: OpportunitiesService) {}

  @Get()
  getOpportunities(
    @Query('search') search?: string,
    @Query('category') category?: string,
    @Query('city') city?: string,
    @Query('status') status?: string,
    @Query('minBudget') minBudget?: string,
    @Query('maxBudget') maxBudget?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const filter: OpportunityFilterDto = {
      search,
      category,
      city,
      status,
      minBudget: minBudget ? parseInt(minBudget, 10) : undefined,
      maxBudget: maxBudget ? parseInt(maxBudget, 10) : undefined,
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 20,
    };
    return this.service.getOpportunities(filter);
  }

  @Get(':id')
  getOpportunityById(@Param('id') id: string) {
    return this.service.getOpportunityById(id);
  }

  @Post()
  createOpportunity(@Body() body: any) {
    const creatorId = body.creatorId || 'usr_curr_01';
    return this.service.createOpportunity(creatorId, body);
  }

  @Post(':id/interest')
  expressInterest(@Param('id') id: string, @Body() body: any) {
    const userId = body.userId || 'usr_curr_01';
    return this.service.expressInterest(
      id,
      userId,
      body.pitch || body.proposalMessage,
      body.pitchAmount,
    );
  }
}
