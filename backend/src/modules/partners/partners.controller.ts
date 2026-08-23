import { Controller, Get, Param } from '@nestjs/common';
import { PartnersService } from './partners.service';

@Controller('partners')
export class PartnersController {
  constructor(private readonly service: PartnersService) {}

  @Get()
  getPartners() {
    return this.service.getPartners();
  }

  @Get(':id')
  getPartnerById(@Param('id') id: string) {
    return this.service.getPartnerById(id);
  }
}
