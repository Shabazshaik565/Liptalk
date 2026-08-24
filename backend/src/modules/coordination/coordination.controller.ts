import { Controller, Get, Post, Patch, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CoordinationService } from './coordination.service';

@Controller('coordination')
export class CoordinationController {
  constructor(private readonly coordinationService: CoordinationService) {}

  // 1. Global Goals & Milestones
  @Get('goals')
  getGoals(@Query('scope') scope?: string, @Query('status') status?: string) {
    return this.coordinationService.goals.getGoals(scope, status);
  }

  @Get('goals/:id')
  getGoalById(@Param('id') id: string) {
    return this.coordinationService.goals.getGoalById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('goals')
  createGoal(@Request() req: any, @Body() body: any) {
    return this.coordinationService.goals.createGoal(req.user?.id || 'usr_curr_01', body);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('goals/:id/progress')
  updateGoalProgress(@Param('id') id: string, @Body('progress') progress: number) {
    return this.coordinationService.goals.updateGoalProgress(id, progress);
  }

  @UseGuards(JwtAuthGuard)
  @Post('goals/:id/milestones')
  addMilestone(@Param('id') id: string, @Body() body: any) {
    return this.coordinationService.goals.addMilestone(id, body);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('milestones/:id/toggle')
  toggleMilestone(@Param('id') id: string, @Request() req: any) {
    return this.coordinationService.goals.toggleMilestone(id, req.user?.id || 'usr_curr_01');
  }

  @UseGuards(JwtAuthGuard)
  @Post('goals/:id/join')
  joinGoal(@Param('id') id: string, @Request() req: any, @Body('role') role?: string) {
    return this.coordinationService.goals.joinGoal(id, req.user?.id || 'usr_curr_01', role);
  }

  // 2. Global Public Initiatives
  @Get('initiatives')
  getInitiatives(@Query('category') category?: string) {
    return this.coordinationService.goals.getInitiatives(category);
  }

  @UseGuards(JwtAuthGuard)
  @Post('initiatives')
  createInitiative(@Request() req: any, @Body() body: any) {
    return this.coordinationService.goals.createInitiative(req.user?.id || 'usr_curr_01', body);
  }

  @UseGuards(JwtAuthGuard)
  @Post('initiatives/:id/join')
  joinInitiative(@Param('id') id: string, @Request() req: any, @Body('pledgedAmount') pledgedAmount?: number) {
    return this.coordinationService.goals.joinInitiative(id, req.user?.id || 'usr_curr_01', 'USER', pledgedAmount || 0);
  }

  // 3. Shared Workspaces & Contributions
  @Get('workspaces')
  getWorkspaces(@Request() req?: any) {
    return this.coordinationService.getWorkspaces(req?.user?.id || 'usr_curr_01');
  }

  @UseGuards(JwtAuthGuard)
  @Post('workspaces')
  createWorkspace(@Request() req: any, @Body() body: any) {
    return this.coordinationService.createWorkspace(req.user?.id || 'usr_curr_01', body);
  }

  @Get('projects/:id/contributions')
  getContributions(@Param('id') projectId: string) {
    return this.coordinationService.getProjectContributions(projectId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('projects/:id/contributions')
  submitContribution(@Param('id') projectId: string, @Request() req: any, @Body() body: any) {
    return this.coordinationService.submitContribution(projectId, req.user?.id || 'usr_curr_01', body);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('contributions/:id/verify')
  verifyContribution(@Param('id') id: string, @Request() req: any) {
    return this.coordinationService.verifyContribution(id, req.user?.id || 'SYSTEM_VERIFIER');
  }

  // 4. Governance & Proposals
  @Get('proposals')
  getProposals(@Query('targetEntityId') targetEntityId?: string, @Query('scope') scope?: string) {
    return this.coordinationService.governance.getProposals(targetEntityId, scope);
  }

  @Get('proposals/:id')
  getProposalById(@Param('id') id: string) {
    return this.coordinationService.governance.getProposalById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('proposals')
  createProposal(@Request() req: any, @Body() body: any) {
    return this.coordinationService.governance.createProposal(req.user?.id || 'usr_curr_01', body);
  }

  @UseGuards(JwtAuthGuard)
  @Post('proposals/:id/vote')
  castVote(
    @Param('id') id: string,
    @Request() req: any,
    @Body('option') option: string,
    @Body('comment') comment?: string,
  ) {
    return this.coordinationService.governance.castVote(id, req.user?.id || 'usr_curr_01', option, comment);
  }

  @Get('decision-records')
  getDecisionRecords(@Query('targetEntityId') targetEntityId?: string) {
    return this.coordinationService.governance.getDecisionRecords(targetEntityId);
  }

  // 5. Knowledge Network & Research
  @Get('knowledge-graph')
  getKnowledgeGraph(@Query('query') query?: string) {
    return this.coordinationService.knowledgeNetwork.getKnowledgeGraph(query);
  }

  @Get('knowledge/:id/versions')
  getVersionHistory(@Param('id') id: string) {
    return this.coordinationService.knowledgeNetwork.getVersionHistory(id);
  }

  @Get('knowledge/conflicts')
  getKnowledgeConflicts() {
    return this.coordinationService.knowledgeNetwork.getConflicts();
  }

  @Get('research')
  getResearchProjects() {
    return this.coordinationService.knowledgeNetwork.getResearchProjects();
  }

  @UseGuards(JwtAuthGuard)
  @Post('research')
  createResearch(@Request() req: any, @Body() body: any) {
    return this.coordinationService.knowledgeNetwork.createResearchProject(req.user?.id || 'usr_curr_01', body);
  }

  @UseGuards(JwtAuthGuard)
  @Post('research/:id/synthesize')
  synthesizeResearch(@Param('id') id: string) {
    return this.coordinationService.knowledgeNetwork.synthesizeResearch(id);
  }

  // 6. Multi-Agent Teams & Quality Gates
  @Get('agent-teams')
  getAgentTeams(@Request() req?: any) {
    return this.coordinationService.agentTeams.getAgentTeams(req?.user?.id || 'usr_curr_01');
  }

  @UseGuards(JwtAuthGuard)
  @Post('agent-teams')
  createAgentTeam(@Request() req: any, @Body() body: any) {
    return this.coordinationService.agentTeams.createAgentTeam(req.user?.id || 'usr_curr_01', body);
  }

  @UseGuards(JwtAuthGuard)
  @Post('agent-teams/:id/execute')
  executeAgentTeam(@Param('id') id: string, @Request() req: any, @Body('goalPrompt') goalPrompt: string) {
    return this.coordinationService.agentTeams.executeTeamMission(id, req.user?.id || 'usr_curr_01', goalPrompt);
  }

  @Get('agent-incidents')
  getAgentIncidents() {
    return this.coordinationService.agentTeams.getIncidents();
  }

  @UseGuards(JwtAuthGuard)
  @Patch('agent-incidents/:id/contain')
  containIncident(@Param('id') id: string, @Body('killSwitch') killSwitch: boolean) {
    return this.coordinationService.agentTeams.containIncident(id, killSwitch);
  }

  // 7. Creator Collectives & Collaborative Shopping
  @Get('creator-collectives')
  getCreatorCollectives() {
    return this.coordinationService.getCreatorCollectives();
  }

  @Get('shopping-lists')
  getShoppingLists(@Request() req?: any) {
    return this.coordinationService.getShoppingLists(req?.user?.id || 'usr_curr_01');
  }

  // 8. Privacy Vault & Identity Contexts
  @Get('privacy/vault')
  getPersonalVault(@Request() req?: any) {
    return this.coordinationService.privacyVault.getPersonalVaultData(req?.user?.id || 'usr_curr_01');
  }

  @Get('privacy/access-logs')
  getDataAccessLogs(@Request() req?: any) {
    return this.coordinationService.privacyVault.getDataAccessLogs(req?.user?.id || 'usr_curr_01');
  }

  @UseGuards(JwtAuthGuard)
  @Patch('privacy/access-logs/:id/revoke')
  revokeDataAccess(@Param('id') id: string) {
    return this.coordinationService.privacyVault.revokeDataAccess(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('identity/switch-context')
  switchContext(@Request() req: any, @Body('contextType') contextType: string) {
    return this.coordinationService.privacyVault.switchIdentityContext(req.user?.id || 'usr_curr_01', contextType);
  }

  // 9. Multimodal & Voice Assistant
  @UseGuards(JwtAuthGuard)
  @Post('multimodal/process')
  processMultimodalAsset(@Request() req: any, @Body() body: any) {
    return this.coordinationService.multimodalVoice.processMultimodalAsset(req.user?.id || 'usr_curr_01', body);
  }

  @Get('multimodal/search')
  searchMultimodal(@Query('q') query: string, @Query('modality') modality?: any) {
    return this.coordinationService.multimodalVoice.searchMultimodal(query, modality);
  }

  @UseGuards(JwtAuthGuard)
  @Post('voice/intent')
  processVoiceIntent(@Request() req: any, @Body('speech') speech: string) {
    return this.coordinationService.multimodalVoice.transcribeAndProcessVoiceIntent(req.user?.id || 'usr_curr_01', speech);
  }

  // 10. Operations & Self-Healing
  @Get('operations/incidents')
  getSystemIncidents() {
    return this.coordinationService.incidentOps.getGlobalIncidents();
  }

  @Post('operations/incidents/:id/self-heal')
  simulateSelfHeal(@Param('id') id: string) {
    return this.coordinationService.incidentOps.simulateSelfHealing(id);
  }

  @Get('operations/assistant-briefing')
  getOperationsBriefing() {
    return this.coordinationService.incidentOps.getOperationsAssistantBriefing();
  }
}
