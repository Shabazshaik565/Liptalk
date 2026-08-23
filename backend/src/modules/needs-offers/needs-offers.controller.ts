import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { NeedsOffersService } from './needs-offers.service';

@Controller()
export class NeedsOffersController {
  constructor(private readonly service: NeedsOffersService) {}

  @Get('needs')
  getNeeds(@Query('userId') userId?: string) {
    return this.service.getNeeds(userId);
  }

  @Post('needs')
  createNeed(@Body() body: any) {
    const userId = body.userId || 'usr_curr_01';
    return this.service.createNeed(userId, body);
  }

  @Get('offers')
  getOffers(@Query('userId') userId?: string) {
    return this.service.getOffers(userId);
  }

  @Post('offers')
  createOffer(@Body() body: any) {
    const userId = body.userId || 'usr_curr_01';
    return this.service.createOffer(userId, body);
  }
}
