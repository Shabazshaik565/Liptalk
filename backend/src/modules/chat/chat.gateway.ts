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
import { ChatService } from './chat.service';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: { origin: '*' },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(ChatGateway.name);
  private readonly connectedUsers = new Map<string, string>(); // socketId -> userId

  constructor(private readonly chatService: ChatService) {}

  handleConnection(client: Socket) {
    const token = client.handshake.auth?.token || client.handshake.query?.token;
    const userId = client.handshake.auth?.userId || (client.handshake.query?.userId as string);

    if (userId) {
      this.connectedUsers.set(client.id, userId);
      this.server.emit('presence_update', { userId, status: 'online' });
    }
    this.logger.log(`Client connected: ${client.id} (user: ${userId || 'anonymous'})`);
  }

  handleDisconnect(client: Socket) {
    const userId = this.connectedUsers.get(client.id);
    if (userId) {
      this.connectedUsers.delete(client.id);
      this.server.emit('presence_update', { userId, status: 'offline' });
    }
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('join_conversation')
  handleJoin(
    @MessageBody() data: { conversationId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const roomName = `conv_${data.conversationId}`;
    client.join(roomName);
    return { status: 'joined', conversationId: data.conversationId };
  }

  @SubscribeMessage('send_message')
  async handleSendMessage(
    @MessageBody()
    data: { conversationId: string; senderId: string; text: string; clientTempId?: string },
    @ConnectedSocket() client: Socket,
  ) {
    const saved = await this.chatService.saveMessage(
      data.conversationId,
      data.senderId,
      data.text,
    );

    const payload = {
      ...(saved || {}),
      clientTempId: data.clientTempId,
    };

    // Broadcast to room
    this.server.to(`conv_${data.conversationId}`).emit('new_message', payload);

    return { status: 'delivered', message: payload };
  }

  @SubscribeMessage('typing_start')
  handleTypingStart(
    @MessageBody() data: { conversationId: string; userId: string; userName?: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.to(`conv_${data.conversationId}`).emit('user_typing', data);
  }

  @SubscribeMessage('typing_stop')
  handleTypingStop(
    @MessageBody() data: { conversationId: string; userId: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.to(`conv_${data.conversationId}`).emit('user_stop_typing', data);
  }

  @SubscribeMessage('message_read')
  handleMessageRead(
    @MessageBody() data: { conversationId: string; messageId: string; readerId: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.to(`conv_${data.conversationId}`).emit('message_read_receipt', data);
  }
}
