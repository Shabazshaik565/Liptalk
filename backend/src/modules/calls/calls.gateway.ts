import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { CallsService } from './calls.service';
import { CallType } from '../../database/entities/call.entity';

export type PresenceStatus = 'ONLINE' | 'OFFLINE' | 'AWAY' | 'BUSY' | 'IN_CALL';

@WebSocketGateway({
  cors: { origin: '*' },
})
export class CallsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(CallsGateway.name);
  private readonly userSockets = new Map<string, string>(); // userId -> socketId
  private readonly socketUsers = new Map<string, string>(); // socketId -> userId
  private readonly userPresence = new Map<string, PresenceStatus>();

  constructor(private readonly callsService: CallsService) {}

  handleConnection(client: Socket) {
    const userId = client.handshake.auth?.userId || (client.handshake.query?.userId as string);
    if (userId) {
      this.userSockets.set(userId, client.id);
      this.socketUsers.set(client.id, userId);
      this.userPresence.set(userId, 'ONLINE');

      this.server.emit('presence_status', { userId, status: 'ONLINE' });
      this.logger.log(`Presence: User ${userId} is ONLINE`);
    }
  }

  handleDisconnect(client: Socket) {
    const userId = this.socketUsers.get(client.id);
    if (userId) {
      this.userSockets.delete(userId);
      this.socketUsers.delete(client.id);
      this.userPresence.set(userId, 'OFFLINE');

      this.server.emit('presence_status', { userId, status: 'OFFLINE' });
      this.logger.log(`Presence: User ${userId} is OFFLINE`);
    }
  }

  @SubscribeMessage('register_user')
  handleRegisterUser(
    @MessageBody() data: { userId: string },
    @ConnectedSocket() client: Socket,
  ) {
    if (data?.userId) {
      const oldUserId = this.socketUsers.get(client.id);
      if (oldUserId && oldUserId !== data.userId) {
        if (this.userSockets.get(oldUserId) === client.id) {
          this.userSockets.delete(oldUserId);
        }
      }

      this.userSockets.set(data.userId, client.id);
      this.socketUsers.set(client.id, data.userId);
      this.userPresence.set(data.userId, 'ONLINE');

      this.server.emit('presence_status', { userId: data.userId, status: 'ONLINE' });
      this.logger.log(`RegisterUser: User ${data.userId} bound to socket ${client.id}`);
    }
    return { status: 'registered', userId: data?.userId };
  }

  @SubscribeMessage('presence_set')
  handleSetPresence(
    @MessageBody() data: { userId: string; status: PresenceStatus },
    @ConnectedSocket() client: Socket,
  ) {
    this.userPresence.set(data.userId, data.status);
    this.server.emit('presence_status', { userId: data.userId, status: data.status });
  }

  // ==========================================
  // WEBRTC 1-TO-1 CALLING SIGNALING
  // ==========================================

  @SubscribeMessage('call_initiate')
  async handleCallInitiate(
    @MessageBody()
    data: { callerId: string; callerName: string; callerAvatar?: string; receiverId: string; callType: 'VOICE' | 'VIDEO' },
    @ConnectedSocket() client: Socket,
  ) {
    // Check if receiver is already in another call
    if (this.userPresence.get(data.receiverId) === 'IN_CALL') {
      const callerSocketId = this.userSockets.get(data.callerId);
      if (callerSocketId) {
        this.server.to(callerSocketId).emit('call_busy', { receiverId: data.receiverId });
      }
      return { status: 'busy' };
    }

    const call = await this.callsService.initiateCall(
      data.callerId,
      data.receiverId,
      data.callType as CallType,
    );

    const receiverSocketId = this.userSockets.get(data.receiverId);

    const payload = {
      callId: call.id,
      callerId: data.callerId,
      callerName: data.callerName,
      callerAvatar: data.callerAvatar,
      callType: data.callType,
      channelId: call.channelId,
    };

    if (receiverSocketId) {
      this.server.to(receiverSocketId).emit('call_incoming', payload);
    }

    return { status: 'ringing', callId: call.id, channelId: call.channelId };
  }

  @SubscribeMessage('call_accept')
  async handleCallAccept(
    @MessageBody() data: { callId: string; userId: string; callerId: string },
    @ConnectedSocket() client: Socket,
  ) {
    await this.callsService.acceptCall(data.callId, data.userId);

    this.userPresence.set(data.userId, 'IN_CALL');
    this.userPresence.set(data.callerId, 'IN_CALL');
    this.server.emit('presence_status', { userId: data.userId, status: 'IN_CALL' });
    this.server.emit('presence_status', { userId: data.callerId, status: 'IN_CALL' });

    const callerSocketId = this.userSockets.get(data.callerId);
    if (callerSocketId) {
      this.server.to(callerSocketId).emit('call_accepted', { callId: data.callId });
    }

    return { status: 'connected' };
  }

  @SubscribeMessage('call_decline')
  async handleCallDecline(
    @MessageBody() data: { callId: string; callerId: string; reason?: string },
    @ConnectedSocket() client: Socket,
  ) {
    await this.callsService.declineCall(data.callId, data.callerId, data.reason);

    const callerSocketId = this.userSockets.get(data.callerId);
    if (callerSocketId) {
      this.server.to(callerSocketId).emit('call_declined', { callId: data.callId, reason: data.reason });
    }
    return { status: 'declined' };
  }

  @SubscribeMessage('call_cancel')
  async handleCallCancel(
    @MessageBody() data: { callId: string; callerId: string; receiverId: string },
    @ConnectedSocket() client: Socket,
  ) {
    await this.callsService.cancelCall(data.callId, data.callerId);

    const receiverSocketId = this.userSockets.get(data.receiverId);
    if (receiverSocketId) {
      this.server.to(receiverSocketId).emit('call_cancelled', { callId: data.callId });
    }
    return { status: 'cancelled' };
  }

  @SubscribeMessage('call_mute')
  handleCallMute(
    @MessageBody() data: { callId: string; targetUserId: string; isMuted: boolean },
    @ConnectedSocket() client: Socket,
  ) {
    const targetSocketId = this.userSockets.get(data.targetUserId);
    if (targetSocketId) {
      this.server.to(targetSocketId).emit('call_peer_mute', { isMuted: data.isMuted });
    }
    return { status: 'ok' };
  }

  @SubscribeMessage('call_missed')
  async handleCallMissed(
    @MessageBody() data: { callId: string; receiverId: string },
    @ConnectedSocket() client: Socket,
  ) {
    await this.callsService.markMissed(data.callId);

    const receiverSocketId = this.userSockets.get(data.receiverId);
    if (receiverSocketId) {
      this.server.to(receiverSocketId).emit('call_missed', { callId: data.callId });
    }
    return { status: 'missed' };
  }

  @SubscribeMessage('call_signal')
  handleCallSignal(
    @MessageBody() data: { targetUserId: string; signal: any },
    @ConnectedSocket() client: Socket,
  ) {
    const senderUserId = this.socketUsers.get(client.id);
    const targetSocketId = this.userSockets.get(data.targetUserId);
    if (targetSocketId) {
      this.server.to(targetSocketId).emit('call_signal', {
        senderId: senderUserId,
        signal: data.signal,
      });
    }
  }

  @SubscribeMessage('call_end')
  async handleCallEnd(
    @MessageBody() data: { callId: string; userId: string; peerId: string; durationSeconds?: number },
    @ConnectedSocket() client: Socket,
  ) {
    await this.callsService.endCall(data.callId, data.userId, data.durationSeconds || 0);

    this.userPresence.set(data.userId, 'ONLINE');
    this.userPresence.set(data.peerId, 'ONLINE');
    this.server.emit('presence_status', { userId: data.userId, status: 'ONLINE' });
    this.server.emit('presence_status', { userId: data.peerId, status: 'ONLINE' });

    const peerSocketId = this.userSockets.get(data.peerId);
    if (peerSocketId) {
      this.server.to(peerSocketId).emit('call_ended', { callId: data.callId });
    }

    return { status: 'ended' };
  }
}
