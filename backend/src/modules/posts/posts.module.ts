import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommunityPost } from '../../database/entities/community-post.entity';
import { PostComment } from '../../database/entities/post-comment.entity';
import { PostReaction } from '../../database/entities/post-reaction.entity';
import { Community } from '../../database/entities/community.entity';
import { CommunityMember } from '../../database/entities/community-member.entity';
import { User } from '../../database/entities/user.entity';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CommunityPost,
      PostComment,
      PostReaction,
      Community,
      CommunityMember,
      User,
    ]),
    AuthModule,
  ],
  controllers: [PostsController],
  providers: [PostsService],
  exports: [PostsService],
})
export class PostsModule {}
