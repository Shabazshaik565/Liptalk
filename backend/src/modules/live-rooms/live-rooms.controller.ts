import { Controller, Get, Post, Body, Param, Request } from '@nestjs/common';
import { LiveRoomsService } from './live-rooms.service';
import { LiveRoomType } from '../../database/entities/live-room.entity';

@Controller('live-rooms')
export class LiveRoomsController {
  constructor(private readonly liveRoomsService: LiveRoomsService) {}

  @Get()
  async getLiveAndUpcoming() {
    return this.liveRoomsService.getLiveAndUpcomingRooms();
  }

  @Get(':id')
  async getRoomById(@Param('id') id: string) {
    return this.liveRoomsService.getRoomById(id);
  }

  @Post()
  async createRoom(
    @Body() body: {
      title: string;
      description?: string;
      category?: string;
      roomType?: LiveRoomType;
      coverImageUrl?: string;
      communityId?: string;
      eventId?: string;
    },
    @Request() req: any,
  ) {
    const hostId = req.user?.id || 'usr_curr_01';
    return this.liveRoomsService.createRoom(hostId, body);
  }

  @Post(':id/end')
  async endRoom(@Param('id') id: string, @Request() req: any) {
    const hostId = req.user?.id || 'usr_curr_01';
    return this.liveRoomsService.endRoom(id, hostId);
  }
}
