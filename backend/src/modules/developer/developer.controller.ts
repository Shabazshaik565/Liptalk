import { Controller, Get, Post, Body, Param, Request } from '@nestjs/common';
import { DeveloperService } from './developer.service';

@Controller('developer')
export class DeveloperController {
  constructor(private readonly devService: DeveloperService) {}

  @Get('apps')
  async getApps(@Request() req: any) {
    const developerId = req.user?.id || 'usr_curr_01';
    return this.devService.getUserApps(developerId);
  }

  @Post('apps')
  async createApp(@Body() body: { name: string; description?: string; redirectUri?: string; scopes?: string[] }, @Request() req: any) {
    const developerId = req.user?.id || 'usr_curr_01';
    return this.devService.createApp(developerId, body);
  }

  @Post('apps/:id/roll-key')
  async rollApiKey(@Param('id') id: string, @Request() req: any) {
    const developerId = req.user?.id || 'usr_curr_01';
    return this.devService.rollApiKey(developerId, id);
  }

  @Get('apps/:id/webhooks')
  async getWebhooks(@Param('id') id: string) {
    return this.devService.getWebhooks(id);
  }

  @Post('apps/:id/webhooks')
  async createWebhook(
    @Param('id') id: string,
    @Body() body: { targetUrl: string; subscribedEvents: string[] },
  ) {
    return this.devService.createWebhook(id, body.targetUrl, body.subscribedEvents);
  }

  @Get('scopes')
  async getAvailableScopes() {
    return [
      { scope: 'read:profile', label: 'Read Profile Information', description: 'Access user name, avatar, bio, and headline.' },
      { scope: 'read:marketplace', label: 'Read Marketplace Catalog', description: 'Query public products and services.' },
      { scope: 'write:opportunities', label: 'Create Opportunities', description: 'Publish contracts and demands on behalf of user.' },
      { scope: 'read:leads', label: 'Read CRM Leads', description: 'Access deal stages and revenue pipelines.' },
      { scope: 'ai:actions', label: 'Trigger AI Agent Actions', description: 'Coordinate automated workflows.' },
    ];
  }
}
