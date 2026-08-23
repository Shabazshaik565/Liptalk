import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CommunityPost, PostType } from '../../database/entities/community-post.entity';
import { PostComment } from '../../database/entities/post-comment.entity';
import { PostReaction, ReactionType } from '../../database/entities/post-reaction.entity';
import { Community } from '../../database/entities/community.entity';
import { CommunityMember, CommunityMemberRole } from '../../database/entities/community-member.entity';
import { User } from '../../database/entities/user.entity';

export interface CreatePostDto {
  type?: PostType;
  title?: string;
  content: string;
  mediaUrls?: string[];
}

export interface CreateCommentDto {
  content: string;
  parentCommentId?: string;
}

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(CommunityPost)
    private readonly postRepo: Repository<CommunityPost>,
    @InjectRepository(PostComment)
    private readonly commentRepo: Repository<PostComment>,
    @InjectRepository(PostReaction)
    private readonly reactionRepo: Repository<PostReaction>,
    @InjectRepository(Community)
    private readonly communityRepo: Repository<Community>,
    @InjectRepository(CommunityMember)
    private readonly memberRepo: Repository<CommunityMember>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async findByCommunity(communityId: string, userId?: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [posts, total] = await this.postRepo.findAndCount({
      where: { community: { id: communityId } },
      relations: ['author', 'author.profile', 'author.businesses', 'community'],
      order: { isPinned: 'DESC', createdAt: 'DESC' },
      skip,
      take: limit,
    });

    // Check reactions for current user
    let userReactions: Record<string, string> = {};
    if (userId && posts.length > 0) {
      const reactions = await this.reactionRepo.find({
        where: { user: { id: userId } },
        relations: ['post'],
      });
      reactions.forEach((r) => {
        if (r.post) userReactions[r.post.id] = r.reactionType;
      });
    }

    const items = posts.map((p) => ({
      ...p,
      hasLiked: !!userReactions[p.id],
      userReaction: userReactions[p.id] || null,
    }));

    return { items, total, page, limit };
  }

  async findOne(postId: string, userId?: string) {
    const post = await this.postRepo.findOne({
      where: { id: postId },
      relations: ['author', 'author.profile', 'author.businesses', 'community'],
    });
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    let hasLiked = false;
    if (userId) {
      const reaction = await this.reactionRepo.findOne({
        where: { post: { id: postId }, user: { id: userId } },
      });
      hasLiked = !!reaction;
    }

    return { ...post, hasLiked };
  }

  async create(communityId: string, userId: string, dto: CreatePostDto) {
    const community = await this.communityRepo.findOne({ where: { id: communityId } });
    if (!community) {
      throw new NotFoundException('Community not found');
    }

    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const post = this.postRepo.create({
      community,
      author: user,
      type: dto.type || PostType.TEXT,
      title: dto.title,
      content: dto.content,
      mediaUrls: dto.mediaUrls || [],
      likesCount: 0,
      commentsCount: 0,
    });

    const saved = await this.postRepo.save(post);
    await this.communityRepo.increment({ id: communityId }, 'postCount', 1);

    return this.findOne(saved.id, userId);
  }

  async delete(postId: string, userId: string) {
    const post = await this.postRepo.findOne({
      where: { id: postId },
      relations: ['author', 'community'],
    });
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const membership = await this.memberRepo.findOne({
      where: { community: { id: post.community.id }, user: { id: userId } },
    });

    const isAuthor = post.author.id === userId;
    const isModOrOwner =
      membership &&
      (membership.role === CommunityMemberRole.OWNER ||
        membership.role === CommunityMemberRole.MODERATOR);

    if (!isAuthor && !isModOrOwner) {
      throw new ForbiddenException('Not authorized to delete this post');
    }

    await this.postRepo.remove(post);
    await this.communityRepo.decrement({ id: post.community.id }, 'postCount', 1);

    return { success: true };
  }

  async react(postId: string, userId: string, reactionType: ReactionType = ReactionType.LIKE) {
    const post = await this.postRepo.findOne({ where: { id: postId } });
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const existing = await this.reactionRepo.findOne({
      where: { post: { id: postId }, user: { id: userId } },
    });

    if (existing) {
      // Remove reaction (toggle)
      await this.reactionRepo.remove(existing);
      await this.postRepo.decrement({ id: postId }, 'likesCount', 1);
      return { success: true, reacted: false };
    }

    await this.reactionRepo.save(
      this.reactionRepo.create({
        post,
        user,
        reactionType,
      }),
    );
    await this.postRepo.increment({ id: postId }, 'likesCount', 1);

    return { success: true, reacted: true, reactionType };
  }

  async getComments(postId: string) {
    return this.commentRepo.find({
      where: { post: { id: postId } },
      relations: ['author', 'author.profile', 'author.businesses'],
      order: { createdAt: 'ASC' },
    });
  }

  async addComment(postId: string, userId: string, dto: CreateCommentDto) {
    const post = await this.postRepo.findOne({ where: { id: postId } });
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const comment = await this.commentRepo.save(
      this.commentRepo.create({
        post,
        author: user,
        content: dto.content,
        parentCommentId: dto.parentCommentId,
      }),
    );

    await this.postRepo.increment({ id: postId }, 'commentsCount', 1);

    return this.commentRepo.findOne({
      where: { id: comment.id },
      relations: ['author', 'author.profile', 'author.businesses'],
    });
  }

  async deleteComment(commentId: string, userId: string) {
    const comment = await this.commentRepo.findOne({
      where: { id: commentId },
      relations: ['author', 'post'],
    });
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    if (comment.author.id !== userId) {
      throw new ForbiddenException('Not authorized to delete this comment');
    }

    await this.commentRepo.remove(comment);
    await this.postRepo.decrement({ id: comment.post.id }, 'commentsCount', 1);

    return { success: true };
  }
}
