import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Query,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import { EventsService, CreateEventDto } from './events.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get()
  async getEvents(
    @Query('communityId') communityId?: string,
    @Query('category') category?: string,
    @Query('userId') userId?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Req() req?: any,
  ) {
    const targetUserId = userId || req?.user?.id || 'usr_curr_01';
    return this.eventsService.findAll({
      communityId,
      category,
      userId: targetUserId,
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 20,
    });
  }

  @Get(':id')
  async getEvent(
    @Param('id') id: string,
    @Query('userId') userId?: string,
    @Req() req?: any,
  ) {
    const targetUserId = userId || req?.user?.id || 'usr_curr_01';
    return this.eventsService.findOne(id, targetUserId);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async createEvent(@Req() req: any, @Body() dto: CreateEventDto) {
    const userId = req.user?.id || 'usr_curr_01';
    return this.eventsService.create(userId, dto);
  }

  @Post(':id/register')
  @UseGuards(JwtAuthGuard)
  async registerEvent(@Param('id') id: string, @Req() req: any) {
    const userId = req.user?.id || 'usr_curr_01';
    return this.eventsService.register(id, userId);
  }

  @Delete(':id/register')
  @UseGuards(JwtAuthGuard)
  async cancelRegistration(@Param('id') id: string, @Req() req: any) {
    const userId = req.user?.id || 'usr_curr_01';
    return this.eventsService.cancelRegistration(id, userId);
  }

  @Get(':id/attendees')
  async getAttendees(
    @Param('id') id: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.eventsService.getAttendees(
      id,
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 20,
    );
  }
}
