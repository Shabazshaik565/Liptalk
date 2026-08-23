import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Partner } from '../../database/entities/partner.entity';
import { PartnerOffer } from '../../database/entities/partner-offer.entity';

@Injectable()
export class PartnersService {
  constructor(
    @InjectRepository(Partner)
    private readonly partnerRepo: Repository<Partner>,
    @InjectRepository(PartnerOffer)
    private readonly offerRepo: Repository<PartnerOffer>,
  ) {}

  async getPartners() {
    return this.partnerRepo.find({
      relations: ['offers'],
    });
  }

  async getPartnerById(id: string) {
    return this.partnerRepo.findOne({
      where: { id },
      relations: ['offers'],
    });
  }
}
