import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Query,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import {
  MarketplaceService,
  CreateListingDto,
  UpdateListingDto,
  RequestServiceDto,
} from './marketplace.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('marketplace')
export class MarketplaceController {
  constructor(private readonly marketplaceService: MarketplaceService) {}

  @Get()
  async getListings(
    @Query('search') search?: string,
    @Query('category') category?: string,
    @Query('pricingType') pricingType?: string,
    @Query('location') location?: string,
    @Query('userId') userId?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Req() req?: any,
  ) {
    const targetUserId = userId || req?.user?.id;
    return this.marketplaceService.findAll({
      search,
      category,
      pricingType,
      location,
      userId: targetUserId,
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 20,
    });
  }

  @Get('recommended')
  async getRecommended(@Query('userId') userId?: string, @Req() req?: any) {
    const targetUserId = userId || req?.user?.id || 'usr_curr_01';
    return this.marketplaceService.getRecommended(targetUserId);
  }

  @Get(':id')
  async getListing(
    @Param('id') id: string,
    @Query('userId') userId?: string,
    @Req() req?: any,
  ) {
    const targetUserId = userId || req?.user?.id;
    return this.marketplaceService.findOne(id, targetUserId);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async createListing(@Req() req: any, @Body() dto: CreateListingDto) {
    const userId = req.user?.id || 'usr_curr_01';
    return this.marketplaceService.create(userId, dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async updateListing(
    @Param('id') id: string,
    @Req() req: any,
    @Body() dto: UpdateListingDto,
  ) {
    const userId = req.user?.id || 'usr_curr_01';
    return this.marketplaceService.update(id, userId, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteListing(@Param('id') id: string, @Req() req: any) {
    const userId = req.user?.id || 'usr_curr_01';
    return this.marketplaceService.delete(id, userId);
  }

  @Post(':id/request')
  @UseGuards(JwtAuthGuard)
  async requestService(
    @Param('id') id: string,
    @Req() req: any,
    @Body() dto: RequestServiceDto,
  ) {
    const userId = req.user?.id || 'usr_curr_01';
    return this.marketplaceService.requestService(id, userId, dto);
  }
}
