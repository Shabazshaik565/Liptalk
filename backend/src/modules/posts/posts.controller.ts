import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Query,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import { PostsService, CreatePostDto, CreateCommentDto } from './posts.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ReactionType } from '../../database/entities/post-reaction.entity';

@Controller()
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get('communities/:communityId/posts')
  async getCommunityPosts(
    @Param('communityId') communityId: string,
    @Query('userId') userId?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Req() req?: any,
  ) {
    const targetUserId = userId || req?.user?.id || 'usr_curr_01';
    return this.postsService.findByCommunity(
      communityId,
      targetUserId,
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 20,
    );
  }

  @Post('communities/:communityId/posts')
  @UseGuards(JwtAuthGuard)
  async createPost(
    @Param('communityId') communityId: string,
    @Req() req: any,
    @Body() dto: CreatePostDto,
  ) {
    const userId = req.user?.id || 'usr_curr_01';
    return this.postsService.create(communityId, userId, dto);
  }

  @Get('posts/:id')
  async getPost(
    @Param('id') id: string,
    @Query('userId') userId?: string,
    @Req() req?: any,
  ) {
    const targetUserId = userId || req?.user?.id || 'usr_curr_01';
    return this.postsService.findOne(id, targetUserId);
  }

  @Delete('posts/:id')
  @UseGuards(JwtAuthGuard)
  async deletePost(@Param('id') id: string, @Req() req: any) {
    const userId = req.user?.id || 'usr_curr_01';
    return this.postsService.delete(id, userId);
  }

  @Post('posts/:id/react')
  @UseGuards(JwtAuthGuard)
  async reactPost(
    @Param('id') id: string,
    @Req() req: any,
    @Body('reactionType') reactionType?: ReactionType,
  ) {
    const userId = req.user?.id || 'usr_curr_01';
    return this.postsService.react(id, userId, reactionType || ReactionType.LIKE);
  }

  @Get('posts/:id/comments')
  async getComments(@Param('id') id: string) {
    return this.postsService.getComments(id);
  }

  @Post('posts/:id/comments')
  @UseGuards(JwtAuthGuard)
  async addComment(
    @Param('id') id: string,
    @Req() req: any,
    @Body() dto: CreateCommentDto,
  ) {
    const userId = req.user?.id || 'usr_curr_01';
    return this.postsService.addComment(id, userId, dto);
  }

  @Delete('comments/:id')
  @UseGuards(JwtAuthGuard)
  async deleteComment(@Param('id') id: string, @Req() req: any) {
    const userId = req.user?.id || 'usr_curr_01';
    return this.postsService.deleteComment(id, userId);
  }
}
