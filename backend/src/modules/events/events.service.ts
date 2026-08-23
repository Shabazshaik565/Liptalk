import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event, EventLocationType, EventStatus } from '../../database/entities/event.entity';
import {
  EventRegistration,
  RegistrationStatus,
} from '../../database/entities/event-registration.entity';
import { Community } from '../../database/entities/community.entity';
import { User } from '../../database/entities/user.entity';

export interface CreateEventDto {
  communityId?: string;
  title: string;
  description: string;
  category?: string;
  eventDate: string;
  startTime?: string;
  endTime?: string;
  locationType?: EventLocationType;
  locationUrlOrAddress?: string;
  coverImageUrl?: string;
  capacity?: number;
}

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepo: Repository<Event>,
    @InjectRepository(EventRegistration)
    private readonly regRepo: Repository<EventRegistration>,
    @InjectRepository(Community)
    private readonly communityRepo: Repository<Community>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async findAll(params?: {
    communityId?: string;
    category?: string;
    userId?: string;
    page?: number;
    limit?: number;
  }) {
    const page = params?.page || 1;
    const limit = params?.limit || 20;
    const skip = (page - 1) * limit;

    const qb = this.eventRepo
      .createQueryBuilder('event')
      .leftJoinAndSelect('event.organizer', 'organizer')
      .leftJoinAndSelect('organizer.profile', 'organizerProfile')
      .leftJoinAndSelect('organizer.businesses', 'organizerBusiness')
      .leftJoinAndSelect('event.community', 'community');

    if (params?.communityId) {
      qb.andWhere('community.id = :communityId', { communityId: params.communityId });
    }

    if (params?.category && params.category !== 'ALL') {
      qb.andWhere('LOWER(event.category) = LOWER(:category)', {
        category: params.category,
      });
    }

    qb.orderBy('event.eventDate', 'ASC').skip(skip).take(limit);

    const [events, total] = await qb.getManyAndCount();

    // Check user registration status
    let userRegistrations: Set<string> = new Set();
    if (params?.userId && events.length > 0) {
      const regs = await this.regRepo.find({
        where: { user: { id: params.userId }, status: RegistrationStatus.REGISTERED },
        relations: ['event'],
      });
      regs.forEach((r) => {
        if (r.event) userRegistrations.add(r.event.id);
      });
    }

    const items = events.map((e) => ({
      ...e,
      isRegistered: userRegistrations.has(e.id),
    }));

    return { items, total, page, limit };
  }

  async findOne(eventId: string, userId?: string) {
    const event = await this.eventRepo.findOne({
      where: { id: eventId },
      relations: ['organizer', 'organizer.profile', 'organizer.businesses', 'community'],
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    let isRegistered = false;
    if (userId) {
      const reg = await this.regRepo.findOne({
        where: {
          event: { id: eventId },
          user: { id: userId },
          status: RegistrationStatus.REGISTERED,
        },
      });
      isRegistered = !!reg;
    }

    return { ...event, isRegistered };
  }

  async create(userId: string, dto: CreateEventDto) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    let community: Community | null = null;
    if (dto.communityId) {
      community = await this.communityRepo.findOne({ where: { id: dto.communityId } });
    }

    const event = this.eventRepo.create({
      community: community || undefined,
      organizer: user,
      title: dto.title,
      description: dto.description,
      category: dto.category || 'Networking',
      eventDate: dto.eventDate,
      startTime: dto.startTime || '06:00 PM',
      endTime: dto.endTime || '08:00 PM',
      locationType: dto.locationType || EventLocationType.ONLINE,
      locationUrlOrAddress:
        dto.locationUrlOrAddress || 'https://meet.google.com/liptalk-connect',
      coverImageUrl:
        dto.coverImageUrl ||
        'https://images.unsplash.com/photo-1511578314322-379afb476865?w=600',
      capacity: dto.capacity || 100,
      registeredCount: 1,
      status: EventStatus.UPCOMING,
    });

    const saved = await this.eventRepo.save(event);

    // Automatically register organizer
    await this.regRepo.save(
      this.regRepo.create({
        event: saved,
        user,
        status: RegistrationStatus.REGISTERED,
      }),
    );

    return this.findOne(saved.id, userId);
  }

  async register(eventId: string, userId: string) {
    const event = await this.eventRepo.findOne({ where: { id: eventId } });
    if (!event) {
      throw new NotFoundException('Event not found');
    }

    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    let existing = await this.regRepo.findOne({
      where: { event: { id: eventId }, user: { id: userId } },
    });

    if (existing) {
      if (existing.status === RegistrationStatus.REGISTERED) {
        return { success: true, message: 'Already registered', status: existing.status };
      }
      existing.status = RegistrationStatus.REGISTERED;
      await this.regRepo.save(existing);
      await this.eventRepo.increment({ id: eventId }, 'registeredCount', 1);
      return { success: true, message: 'Re-registered successfully', status: existing.status };
    }

    if (event.registeredCount >= event.capacity) {
      throw new BadRequestException('Event is at full capacity');
    }

    await this.regRepo.save(
      this.regRepo.create({
        event,
        user,
        status: RegistrationStatus.REGISTERED,
      }),
    );

    await this.eventRepo.increment({ id: eventId }, 'registeredCount', 1);

    return { success: true, message: 'Registered successfully', status: 'REGISTERED' };
  }

  async cancelRegistration(eventId: string, userId: string) {
    const reg = await this.regRepo.findOne({
      where: {
        event: { id: eventId },
        user: { id: userId },
        status: RegistrationStatus.REGISTERED,
      },
    });

    if (!reg) {
      return { success: true, message: 'Not registered' };
    }

    reg.status = RegistrationStatus.CANCELLED;
    await this.regRepo.save(reg);
    await this.eventRepo.decrement({ id: eventId }, 'registeredCount', 1);

    return { success: true, message: 'Registration cancelled' };
  }

  async getAttendees(eventId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [items, total] = await this.regRepo.findAndCount({
      where: { event: { id: eventId }, status: RegistrationStatus.REGISTERED },
      relations: ['user', 'user.profile', 'user.businesses'],
      order: { registeredAt: 'ASC' },
      skip,
      take: limit,
    });

    return { items, total, page, limit };
  }
}
