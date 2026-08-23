import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Need } from '../../database/entities/need.entity';
import { Offer } from '../../database/entities/offer.entity';
import { User } from '../../database/entities/user.entity';

@Injectable()
export class NeedsOffersService {
  constructor(
    @InjectRepository(Need)
    private readonly needRepo: Repository<Need>,
    @InjectRepository(Offer)
    private readonly offerRepo: Repository<Offer>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async getNeeds(userId?: string) {
    if (userId) {
      return this.needRepo.find({ where: { user: { id: userId } } });
    }
    return this.needRepo.find({ relations: ['user', 'user.profile', 'user.businesses'] });
  }

  async createNeed(userId: string, data: Partial<Need>) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    const need = this.needRepo.create({
      ...data,
      user: user || undefined,
    });
    return this.needRepo.save(need);
  }

  async getOffers(userId?: string) {
    if (userId) {
      return this.offerRepo.find({ where: { user: { id: userId } } });
    }
    return this.offerRepo.find({ relations: ['user', 'user.profile', 'user.businesses'] });
  }

  async createOffer(userId: string, data: Partial<Offer>) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    const offer = this.offerRepo.create({
      ...data,
      user: user || undefined,
    });
    return this.offerRepo.save(offer);
  }
}
