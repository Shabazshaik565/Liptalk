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
import { CommunitiesService, CreateCommunityDto, UpdateCommunityDto } from './communities.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('communities')
export class CommunitiesController {
  constructor(private readonly communitiesService: CommunitiesService) {}

  @Get()
  async getCommunities(
    @Query('search') search?: string,
    @Query('category') category?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.communitiesService.findAll({
      search,
      category,
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 20,
    });
  }

  @Get('recommended')
  async getRecommended(@Query('userId') userId?: string, @Req() req?: any) {
    const targetUserId = userId || req?.user?.id || 'usr_curr_01';
    return this.communitiesService.getRecommended(targetUserId);
  }

  @Get(':id')
  async getCommunity(
    @Param('id') id: string,
    @Query('userId') userId?: string,
    @Req() req?: any,
  ) {
    const targetUserId = userId || req?.user?.id || 'usr_curr_01';
    return this.communitiesService.findOne(id, targetUserId);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async createCommunity(@Req() req: any, @Body() dto: CreateCommunityDto) {
    const userId = req.user?.id || 'usr_curr_01';
    return this.communitiesService.create(userId, dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async updateCommunity(
    @Param('id') id: string,
    @Req() req: any,
    @Body() dto: UpdateCommunityDto,
  ) {
    const userId = req.user?.id || 'usr_curr_01';
    return this.communitiesService.update(id, userId, dto);
  }

  @Post(':id/join')
  @UseGuards(JwtAuthGuard)
  async joinCommunity(@Param('id') id: string, @Req() req: any) {
    const userId = req.user?.id || 'usr_curr_01';
    return this.communitiesService.join(id, userId);
  }

  @Delete(':id/leave')
  @UseGuards(JwtAuthGuard)
  async leaveCommunity(@Param('id') id: string, @Req() req: any) {
    const userId = req.user?.id || 'usr_curr_01';
    return this.communitiesService.leave(id, userId);
  }

  @Get(':id/members')
  async getMembers(
    @Param('id') id: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.communitiesService.getMembers(
      id,
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 20,
    );
  }
}
