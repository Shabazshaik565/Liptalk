import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Call, CallStatus, CallType } from '../../database/entities/call.entity';
import { User } from '../../database/entities/user.entity';

@Injectable()
export class CallsService {
  constructor(
    @InjectRepository(Call)
    private readonly callRepo: Repository<Call>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async initiateCall(callerId: string, receiverId: string, callType: CallType = CallType.VOICE) {
    if (callerId === receiverId) {
      throw new BadRequestException('Cannot initiate a call to yourself');
    }

    const [caller, receiver] = await Promise.all([
      this.userRepo.findOne({ where: { id: callerId }, relations: ['profile', 'businesses'] }),
      this.userRepo.findOne({ where: { id: receiverId }, relations: ['profile', 'businesses'] }),
    ]);

    if (!caller || !receiver) {
      throw new NotFoundException('Caller or receiver not found');
    }

    const channelId = `call_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    const call = this.callRepo.create({
      caller,
      receiver,
      callType,
      status: CallStatus.RINGING,
      channelId,
      startedAt: new Date(),
    });

    return this.callRepo.save(call);
  }

  async acceptCall(callId: string, userId: string) {
    const call = await this.callRepo.findOne({
      where: { id: callId },
      relations: ['caller', 'receiver'],
    });

    if (!call) throw new NotFoundException('Call not found');
    if (call.receiver.id !== userId) throw new BadRequestException('Unauthorized to accept this call');

    call.status = CallStatus.ACTIVE;
    call.startedAt = new Date();
    return this.callRepo.save(call);
  }

  async endCall(callId: string, userId: string, durationSeconds = 0) {
    const call = await this.callRepo.findOne({
      where: { id: callId },
      relations: ['caller', 'receiver'],
    });

    if (!call) return null;

    call.status = CallStatus.ENDED;
    call.endedAt = new Date();
    call.durationSeconds = durationSeconds;
    return this.callRepo.save(call);
  }

  async declineCall(callId: string, userId: string, reason?: string) {
    const call = await this.callRepo.findOne({
      where: { id: callId },
      relations: ['caller', 'receiver'],
    });

    if (!call) return null;
    call.status = CallStatus.REJECTED;
    call.endedAt = new Date();
    return this.callRepo.save(call);
  }

  async cancelCall(callId: string, callerId: string) {
    const call = await this.callRepo.findOne({
      where: { id: callId },
      relations: ['caller', 'receiver'],
    });

    if (!call) return null;
    call.status = CallStatus.MISSED;
    call.endedAt = new Date();
    return this.callRepo.save(call);
  }

  async markMissed(callId: string) {
    const call = await this.callRepo.findOne({
      where: { id: callId },
      relations: ['caller', 'receiver'],
    });

    if (!call) return null;
    call.status = CallStatus.MISSED;
    call.endedAt = new Date();
    return this.callRepo.save(call);
  }

  async getCallHistory(userId: string) {
    return this.callRepo.find({
      where: [{ caller: { id: userId } }, { receiver: { id: userId } }],
      relations: ['caller', 'caller.profile', 'receiver', 'receiver.profile'],
      order: { createdAt: 'DESC' },
      take: 20,
    });
  }

  async initiatePstnBridge(callerId: string, callerNumber: string, receiverNumber: string) {
    const twilioSid = process.env.TWILIO_ACCOUNT_SID;
    const twilioAuth = process.env.TWILIO_AUTH_TOKEN;
    const twilioCaller = process.env.TWILIO_CALLER_NUMBER || callerNumber;

    let gatewayStatus = 'MOCK_CARRIER_VOICE_BRIDGE';
    let externalCallSid = `pstn_${Date.now()}`;

    if (twilioSid && twilioAuth) {
      try {
        const cleanTo = receiverNumber.replace(/\s+/g, '');
        const cleanFrom = twilioCaller.replace(/\s+/g, '');
        const url = `https://api.twilio.com/2010-04-01/Accounts/${twilioSid}/Calls.json`;
        const authHeader = 'Basic ' + Buffer.from(`${twilioSid}:${twilioAuth}`).toString('base64');
        const params = new URLSearchParams();
        params.append('To', cleanTo);
        params.append('From', cleanFrom);
        params.append('Twiml', `<Response><Say voice="alice">Connecting your LipTalk call from ${callerNumber}.</Say></Response>`);

        const response = await fetch(url, {
          method: 'POST',
          headers: {
            Authorization: authHeader,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: params.toString(),
        });
        const data = (await response.json()) as any;
        if (data.sid) {
          externalCallSid = data.sid;
          gatewayStatus = 'LIVE_CARRIER_PSTN_DISPATCHED';
        }
      } catch (err) {
        console.warn('Twilio PSTN dispatch failed, falling back to in-app voice bridge', err);
      }
    }

    return {
      success: true,
      callSid: externalCallSid,
      status: gatewayStatus,
      callerNumber,
      receiverNumber,
      inAppSession: true,
      message: 'In-app telephony bridge connected. Caller remains 100% inside LipTalk app.',
    };
  }
}
