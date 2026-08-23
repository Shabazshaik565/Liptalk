import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NeedsOffersService } from './needs-offers.service';
import { NeedsOffersController } from './needs-offers.controller';
import { Need } from '../../database/entities/need.entity';
import { Offer } from '../../database/entities/offer.entity';
import { User } from '../../database/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Need, Offer, User])],
  controllers: [NeedsOffersController],
  providers: [NeedsOffersService],
  exports: [NeedsOffersService],
})
export class NeedsOffersModule {}
