import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from '../../database/entities/user.entity';
import { UserProfile } from '../../database/entities/profile.entity';
import { Business } from '../../database/entities/business.entity';

export interface UserFilterDto {
  search?: string;
  role?: UserRole | 'ALL';
  city?: string;
  page?: number;
  limit?: number;
}

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(UserProfile)
    private readonly profileRepo: Repository<UserProfile>,
    @InjectRepository(Business)
    private readonly businessRepo: Repository<Business>,
  ) {}

  async getMe(userId?: string) {
    const user = await this.userRepo.findOne({
      where: { id: userId || 'usr_curr_01' },
      relations: ['profile', 'businesses', 'needs', 'offers'],
    });
    return user;
  }

  async getAllUsers(filter?: UserFilterDto) {
    const qb = this.userRepo
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.profile', 'profile')
      .leftJoinAndSelect('user.businesses', 'businesses')
      .leftJoinAndSelect('user.needs', 'needs')
      .leftJoinAndSelect('user.offers', 'offers');

    if (filter?.role && filter.role !== 'ALL') {
      qb.andWhere('user.role = :role', { role: filter.role });
    }

    if (filter?.search) {
      const q = `%${filter.search.toLowerCase()}%`;
      qb.andWhere(
        '(LOWER(profile.fullName) LIKE :q OR LOWER(profile.headline) LIKE :q OR LOWER(profile.city) LIKE :q)',
        { q },
      );
    }

    if (filter?.city) {
      qb.andWhere('LOWER(profile.city) = :city', {
        city: filter.city.toLowerCase(),
      });
    }

    const page = Math.max(1, Number(filter?.page) || 1);
    const limit = Math.min(50, Math.max(1, Number(filter?.limit) || 20));
    qb.skip((page - 1) * limit).take(limit);

    qb.orderBy('user.createdAt', 'DESC');

    return qb.getMany();
  }

  async updateProfile(userId: string, data: Partial<UserProfile>) {
    let profile = await this.profileRepo.findOne({ where: { user: { id: userId } } });
    if (!profile) {
      profile = this.profileRepo.create({ ...data, user: { id: userId } as any });
    } else {
      Object.assign(profile, data);
    }
    return this.profileRepo.save(profile);
  }
}
