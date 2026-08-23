import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { LiveRoomsService } from './live-rooms.service';

@WebSocketGateway({
  cors: { origin: '*' },
})
export class LiveRoomsGateway {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(LiveRoomsGateway.name);

  constructor(private readonly liveRoomsService: LiveRoomsService) {}

  @SubscribeMessage('room_join')
  async handleRoomJoin(
    @MessageBody() data: { roomId: string; userId: string; userName: string; userAvatar?: string },
    @ConnectedSocket() client: Socket,
  ) {
    const roomChannel = `live_room_${data.roomId}`;
    client.join(roomChannel);

    await this.liveRoomsService.updateAudience(data.roomId, 1);

    this.server.to(roomChannel).emit('room_user_joined', {
      userId: data.userId,
      userName: data.userName,
      userAvatar: data.userAvatar,
    });

    return { status: 'joined', roomId: data.roomId };
  }

  @SubscribeMessage('room_leave')
  async handleRoomLeave(
    @MessageBody() data: { roomId: string; userId: string; userName?: string },
    @ConnectedSocket() client: Socket,
  ) {
    const roomChannel = `live_room_${data.roomId}`;
    client.leave(roomChannel);

    await this.liveRoomsService.updateAudience(data.roomId, -1);

    this.server.to(roomChannel).emit('room_user_left', {
      userId: data.userId,
      userName: data.userName,
    });

    return { status: 'left' };
  }

  @SubscribeMessage('room_message')
  async handleRoomMessage(
    @MessageBody() data: { roomId: string; senderId: string; text: string },
    @ConnectedSocket() client: Socket,
  ) {
    const saved = await this.liveRoomsService.saveMessage(data.roomId, data.senderId, data.text);
    const roomChannel = `live_room_${data.roomId}`;

    this.server.to(roomChannel).emit('room_new_message', saved);
    return { status: 'sent', message: saved };
  }

  @SubscribeMessage('room_raise_hand')
  handleRaiseHand(
    @MessageBody() data: { roomId: string; userId: string; userName: string; userAvatar?: string },
    @ConnectedSocket() client: Socket,
  ) {
    const roomChannel = `live_room_${data.roomId}`;
    this.server.to(roomChannel).emit('room_hand_raised', data);
  }

  @SubscribeMessage('room_reaction')
  handleReaction(
    @MessageBody() data: { roomId: string; reaction: string; userId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const roomChannel = `live_room_${data.roomId}`;
    this.server.to(roomChannel).emit('room_reaction_triggered', data);
  }
}
