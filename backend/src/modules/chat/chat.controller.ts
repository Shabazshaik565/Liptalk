import { Controller, Get, Post, Param, Body, Query } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('conversations')
  getConversations(@Query('userId') userId?: string) {
    return this.chatService.getConversations(userId || 'usr_curr_01');
  }

  @Post('conversations')
  createConversation(@Body() body: any) {
    return this.chatService.getOrCreateContextualConversation(body);
  }

  @Get('conversations/:id/messages')
  getMessages(@Param('id') id: string) {
    return this.chatService.getMessages(id);
  }

  @Post('conversations/:id/messages')
  sendMessage(@Param('id') id: string, @Body() body: any) {
    const senderId = body.senderId || 'usr_curr_01';
    return this.chatService.saveMessage(id, senderId, body.text);
  }
}
