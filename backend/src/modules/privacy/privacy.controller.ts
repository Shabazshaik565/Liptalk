import { Controller, Get, Put, Post, Body, Param, Request } from '@nestjs/common';
import { PrivacyService, PrivacySettings } from './privacy.service';

@Controller('privacy')
export class PrivacyController {
  constructor(private readonly privacyService: PrivacyService) {}

  @Get('settings')
  async getSettings(@Request() req: any) {
    const userId = req.user?.id || 'usr_curr_01';
    return this.privacyService.getPrivacySettings(userId);
  }

  @Put('settings')
  async updateSettings(@Body() body: Partial<PrivacySettings>, @Request() req: any) {
    const userId = req.user?.id || 'usr_curr_01';
    return this.privacyService.updatePrivacySettings(userId, body);
  }

  @Get('export')
  async exportData(@Request() req: any) {
    const userId = req.user?.id || 'usr_curr_01';
    return this.privacyService.exportUserData(userId);
  }

  @Post('deactivate')
  async deactivateAccount(@Body() body: { reason?: string }, @Request() req: any) {
    const userId = req.user?.id || 'usr_curr_01';
    return this.privacyService.deactivateAccount(userId, body.reason);
  }

  @Get('sessions')
  async getSessions(@Request() req: any) {
    const userId = req.user?.id || 'usr_curr_01';
    return this.privacyService.getActiveSessions(userId);
  }

  @Post('sessions/:id/revoke')
  async revokeSession(@Param('id') sessionId: string, @Request() req: any) {
    const userId = req.user?.id || 'usr_curr_01';
    return this.privacyService.revokeSession(userId, sessionId);
  }
}
