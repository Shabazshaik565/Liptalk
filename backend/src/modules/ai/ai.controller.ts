import { Controller, Post, Body, Get, UseGuards, Request } from '@nestjs/common';
import { AiService } from './ai.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('assist')
  async assist(@Body() body: { query: string }, @Request() req: any) {
    const userId = req.user?.id || 'usr_curr_01';
    return this.aiService.executeAssistantQuery(body.query || '', userId);
  }

  @Post('search')
  async searchSemantic(@Body() body: { query: string }, @Request() req: any) {
    const userId = req.user?.id || 'usr_curr_01';
    return this.aiService.searchSemantic(body.query || '', userId);
  }

  @Post('smart-need')
  async smartNeed(@Body() body: { draftText: string }) {
    return this.aiService.assistNeedCreation(body.draftText || '');
  }

  @Post('smart-offer')
  async smartOffer(@Body() body: { draftText: string }) {
    return this.aiService.assistOfferCreation(body.draftText || '');
  }

  @Post('smart-opportunity')
  async smartOpportunity(@Body() body: { draftText: string }) {
    return this.aiService.assistOpportunityCreation(body.draftText || '');
  }

  @Get('profile-intelligence')
  async profileIntelligence(@Request() req: any) {
    const userId = req.user?.id || 'usr_curr_01';
    return this.aiService.getProfileIntelligence(userId);
  }

  @Post('chat-assist')
  async chatAssist(@Body() body: { mode: 'PROFESSIONAL' | 'SHORTEN' | 'PROPOSAL_PITCH'; originalText: string }) {
    return this.aiService.assistChatMessage(body.mode || 'PROFESSIONAL', body.originalText || '');
  }
}
