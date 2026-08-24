import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreationService } from './creation.service';

@Controller('creation')
@UseGuards(JwtAuthGuard)
export class CreationController {
  constructor(private readonly creationService: CreationService) {}

  @Get('dashboard')
  async getDashboard(@Request() req: any) {
    const userId = req.user?.id || 'usr_curr_01';
    return this.creationService.getEcosystemCreationDashboard(userId);
  }

  // 1. Idea Discovery & Pipeline
  @Get('ideas')
  async listIdeas(@Query('visibility') visibility?: any) {
    return this.creationService.ideas.listIdeas(visibility);
  }

  @Post('ideas')
  async createIdea(@Request() req: any, @Body() body: any) {
    const authorId = req.user?.id || 'usr_curr_01';
    return this.creationService.ideas.createIdea(authorId, body);
  }

  @Post('ideas/:id/convert')
  async convertIdeaToProject(@Request() req: any, @Param('id') id: string) {
    const authorId = req.user?.id || 'usr_curr_01';
    return this.creationService.ideas.convertIdeaToProject(id, authorId);
  }

  // 2. Human-AI Teams & AI Project Manager
  @Get('teams')
  async listTeams(@Query('projectId') projectId?: string) {
    return this.creationService.teams.listTeams(projectId);
  }

  @Get('teams/:projectId/pm-report')
  async getAiProjectManagerReport(@Param('projectId') projectId: string) {
    return this.creationService.teams.getAiProjectManagerReport(projectId);
  }

  // 3. Collaboration Rooms & Real-Time Intelligence
  @Get('rooms')
  async listRooms(@Query('projectId') projectId?: string) {
    return this.creationService.rooms.listRooms(projectId);
  }

  @Get('rooms/:id/intelligence')
  async getRoomIntelligence(@Param('id') id: string) {
    return this.creationService.rooms.getRoomIntelligence(id);
  }

  // 4. Resource Matching & Contribution Marketplace
  @Get('resources/requests')
  async listResourceRequests(@Query('projectId') projectId?: string) {
    return this.creationService.matching.listResourceRequests(projectId);
  }

  @Get('contributions/listings')
  async listContributionListings(@Query('projectId') projectId?: string) {
    return this.creationService.matching.listContributionListings(projectId);
  }

  @Post('contributions/listings/:id/apply')
  async applyForContribution(@Request() req: any, @Param('id') id: string) {
    const userId = req.user?.id || 'usr_curr_01';
    return this.creationService.matching.applyForContribution(id, userId);
  }

  // 5. Agent Marketplace 2.0 & Sandboxes
  @Get('agents/certified')
  async listCertifiedAgents(@Query('tier') tier?: any) {
    return this.creationService.agents.listCertifiedAgents(tier);
  }

  @Get('agents/:id/permission-preview')
  async previewAgentPermissions(@Param('id') id: string) {
    return this.creationService.agents.previewAgentPermissions(id);
  }

  // 6. Human Approvals & Decision Intelligence
  @Get('approvals')
  async listApprovals(@Query('status') status?: any) {
    return this.creationService.governance.listApprovalRequests(status);
  }

  @Post('approvals/:id/resolve')
  async resolveApproval(
    @Request() req: any,
    @Param('id') id: string,
    @Body() body: { approved: boolean; comments?: string },
  ) {
    const reviewerUserId = req.user?.id || 'usr_curr_01';
    return this.creationService.governance.resolveApprovalRequest(
      id,
      reviewerUserId,
      body.approved,
      body.comments,
    );
  }

  @Post('decisions/briefing')
  async getDecisionBriefing(@Body() body: { proposalTitle: string; contextSummary: string }) {
    return this.creationService.governance.getDecisionBriefing(
      body.proposalTitle,
      body.contextSummary,
    );
  }
}
