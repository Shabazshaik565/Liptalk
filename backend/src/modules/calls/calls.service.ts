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

  async getCallHistory(userId: string) {
    return this.callRepo.find({
      where: [{ caller: { id: userId } }, { receiver: { id: userId } }],
      relations: ['caller', 'caller.profile', 'receiver', 'receiver.profile'],
      order: { createdAt: 'DESC' },
      take: 20,
    });
  }
}
