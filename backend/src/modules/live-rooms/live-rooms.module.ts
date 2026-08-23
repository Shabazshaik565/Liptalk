import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LiveRoomsService } from './live-rooms.service';
import { LiveRoomsController } from './live-rooms.controller';
import { LiveRoomsGateway } from './live-rooms.gateway';
import { LiveRoom } from '../../database/entities/live-room.entity';
import { LiveRoomMessage } from '../../database/entities/live-room-message.entity';
import { User } from '../../database/entities/user.entity';
import { Community } from '../../database/entities/community.entity';
import { Event } from '../../database/entities/event.entity';

@Module({
  imports: [TypeOrmModule.forFeature([LiveRoom, LiveRoomMessage, User, Community, Event])],
  providers: [LiveRoomsService, LiveRoomsGateway],
  controllers: [LiveRoomsController],
  exports: [LiveRoomsService, LiveRoomsGateway],
})
export class LiveRoomsModule {}
