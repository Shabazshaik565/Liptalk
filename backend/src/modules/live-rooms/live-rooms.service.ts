import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LiveRoom, LiveRoomStatus, LiveRoomType } from '../../database/entities/live-room.entity';
import { LiveRoomMessage } from '../../database/entities/live-room-message.entity';
import { User } from '../../database/entities/user.entity';
import { Community } from '../../database/entities/community.entity';
import { Event } from '../../database/entities/event.entity';

@Injectable()
export class LiveRoomsService {
  constructor(
    @InjectRepository(LiveRoom)
    private readonly roomRepo: Repository<LiveRoom>,
    @InjectRepository(LiveRoomMessage)
    private readonly msgRepo: Repository<LiveRoomMessage>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Community)
    private readonly commRepo: Repository<Community>,
    @InjectRepository(Event)
    private readonly eventRepo: Repository<Event>,
  ) {}

  async getLiveAndUpcomingRooms() {
    return this.roomRepo.find({
      where: [{ status: LiveRoomStatus.LIVE }, { status: LiveRoomStatus.SCHEDULED }],
      relations: ['host', 'host.profile', 'host.businesses', 'community', 'event'],
      order: { status: 'ASC', audienceCount: 'DESC', createdAt: 'DESC' },
    });
  }

  async getRoomById(roomId: string) {
    const room = await this.roomRepo.findOne({
      where: { id: roomId },
      relations: ['host', 'host.profile', 'host.businesses', 'community', 'event', 'messages'],
    });
    if (!room) throw new NotFoundException('Live room not found');
    return room;
  }

  async createRoom(hostId: string, data: {
    title: string;
    description?: string;
    category?: string;
    roomType?: LiveRoomType;
    coverImageUrl?: string;
    communityId?: string;
    eventId?: string;
  }) {
    const host = await this.userRepo.findOne({
      where: { id: hostId },
      relations: ['profile', 'businesses'],
    });
    if (!host) throw new NotFoundException('Host user not found');

    let community: Community | undefined;
    if (data.communityId) {
      community = (await this.commRepo.findOne({ where: { id: data.communityId } })) || undefined;
    }

    let event: Event | undefined;
    if (data.eventId) {
      event = (await this.eventRepo.findOne({ where: { id: data.eventId } })) || undefined;
    }

    const room = this.roomRepo.create({
      host,
      title: data.title,
      description: data.description,
      category: data.category || 'Tech & Networking',
      roomType: data.roomType || LiveRoomType.NETWORKING,
      status: LiveRoomStatus.LIVE,
      coverImageUrl: data.coverImageUrl || 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=600',
      audienceCount: 1,
      community,
      event,
      startedAt: new Date(),
    });

    return this.roomRepo.save(room);
  }

  async updateAudience(roomId: string, delta: number) {
    const room = await this.roomRepo.findOne({ where: { id: roomId } });
    if (room) {
      room.audienceCount = Math.max(1, (room.audienceCount || 1) + delta);
      return this.roomRepo.save(room);
    }
    return null;
  }

  async endRoom(roomId: string, hostId: string) {
    const room = await this.roomRepo.findOne({ where: { id: roomId }, relations: ['host'] });
    if (!room) return null;
    if (room.host.id !== hostId) throw new BadRequestException('Only the host can end this live room');

    room.status = LiveRoomStatus.ENDED;
    room.endedAt = new Date();
    return this.roomRepo.save(room);
  }

  async saveMessage(roomId: string, senderId: string, text: string) {
    const [room, sender] = await Promise.all([
      this.roomRepo.findOne({ where: { id: roomId } }),
      this.userRepo.findOne({ where: { id: senderId }, relations: ['profile'] }),
    ]);

    if (!room || !sender) return null;

    const senderName = sender.profile?.firstName
      ? `${sender.profile.firstName} ${sender.profile.lastName || ''}`.trim()
      : 'Ecosystem Member';

    const msg = this.msgRepo.create({
      room,
      sender,
      senderName,
      senderAvatar: sender.profile?.avatarUrl,
      text,
    });

    return this.msgRepo.save(msg);
  }
}
