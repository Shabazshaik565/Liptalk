import { Controller, Get, Post, Body, Param, Request } from '@nestjs/common';
import { CallsService } from './calls.service';
import { CallType } from '../../database/entities/call.entity';

@Controller('calls')
export class CallsController {
  constructor(private readonly callsService: CallsService) {}

  @Get('history')
  async getHistory(@Request() req: any) {
    const userId = req.user?.id || 'usr_curr_01';
    return this.callsService.getCallHistory(userId);
  }

  @Post('initiate')
  async initiateCall(
    @Body() body: { receiverId: string; callType?: CallType },
    @Request() req: any,
  ) {
    const callerId = req.user?.id || 'usr_curr_01';
    return this.callsService.initiateCall(callerId, body.receiverId, body.callType || CallType.VOICE);
  }

  @Post(':id/end')
  async endCall(
    @Param('id') callId: string,
    @Body() body: { durationSeconds?: number },
    @Request() req: any,
  ) {
    const userId = req.user?.id || 'usr_curr_01';
    return this.callsService.endCall(callId, userId, body.durationSeconds || 0);
  }

  @Post('pstn-bridge')
  async initiatePstnBridge(
    @Body() body: { callerNumber?: string; receiverNumber: string },
    @Request() req: any,
  ) {
    const callerId = req.user?.id || 'usr_curr_01';
    return this.callsService.initiatePstnBridge(
      callerId,
      body.callerNumber || '+91 9962786367',
      body.receiverNumber || '+91 7200317219',
    );
  }
}
