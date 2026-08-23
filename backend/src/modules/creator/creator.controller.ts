import { Controller, Get, Post, Body, Param, Request } from '@nestjs/common';
import { CreatorService } from './creator.service';
import { ContentType } from '../../database/entities/professional-content.entity';

@Controller('creator')
export class CreatorController {
  constructor(private readonly creatorService: CreatorService) {}

  @Get('feed')
  async getFeed(@Request() req: any) {
    const userId = req.user?.id || 'usr_curr_01';
    return this.creatorService.getFeed(userId);
  }

  @Get('analytics')
  async getAnalytics(@Request() req: any) {
    const userId = req.user?.id || 'usr_curr_01';
    return this.creatorService.getCreatorAnalytics(userId);
  }

  @Post('publish')
  async publish(
    @Body() body: {
      title: string;
      body: string;
      contentType?: ContentType;
      mediaUrls?: string[];
      tags?: string[];
      linkedOpportunityId?: string;
      linkedListingId?: string;
    },
    @Request() req: any,
  ) {
    const authorId = req.user?.id || 'usr_curr_01';
    return this.creatorService.publishContent(authorId, body);
  }

  @Post('follow/:id')
  async toggleFollow(@Param('id') followingId: string, @Request() req: any) {
    const followerId = req.user?.id || 'usr_curr_01';
    return this.creatorService.toggleFollow(followerId, followingId);
  }
}
