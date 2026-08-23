import {
  Controller,
  Get,
  Patch,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private readonly notifService: NotificationsService) {}

  @Get()
  async getNotifications(@Request() req: any) {
    const userId = req.user?.id || 'usr_curr_01';
    return this.notifService.getUserNotifications(userId);
  }

  @Patch('read-all')
  async markAllAsRead(@Request() req: any) {
    const userId = req.user?.id || 'usr_curr_01';
    return this.notifService.markAllAsRead(userId);
  }

  @Patch(':id/read')
  async markAsRead(@Param('id') id: string, @Request() req: any) {
    const userId = req.user?.id || 'usr_curr_01';
    return this.notifService.markAsRead(id, userId);
  }
}
