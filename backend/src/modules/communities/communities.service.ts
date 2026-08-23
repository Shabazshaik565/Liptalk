import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Community, CommunityVisibility } from '../../database/entities/community.entity';
import {
  CommunityMember,
  CommunityMemberRole,
  CommunityMemberStatus,
} from '../../database/entities/community-member.entity';
import { User } from '../../database/entities/user.entity';
import { Need } from '../../database/entities/need.entity';
import { Offer } from '../../database/entities/offer.entity';

export interface CreateCommunityDto {
  name: string;
  description: string;
  category: string;
  coverImageUrl?: string;
  avatarUrl?: string;
  rules?: string[];
  visibility?: CommunityVisibility;
}

export interface UpdateCommunityDto {
  name?: string;
  description?: string;
  category?: string;
  coverImageUrl?: string;
  avatarUrl?: string;
  rules?: string[];
  visibility?: CommunityVisibility;
}

@Injectable()
export class CommunitiesService {
  constructor(
    @InjectRepository(Community)
    private readonly communityRepo: Repository<Community>,
    @InjectRepository(CommunityMember)
    private readonly memberRepo: Repository<CommunityMember>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Need)
    private readonly needRepo: Repository<Need>,
    @InjectRepository(Offer)
    private readonly offerRepo: Repository<Offer>,
  ) {}

  async findAll(params?: {
    search?: string;
    category?: string;
    page?: number;
    limit?: number;
  }) {
    const page = params?.page || 1;
    const limit = params?.limit || 20;
    const skip = (page - 1) * limit;

    const qb = this.communityRepo
      .createQueryBuilder('community')
      .leftJoinAndSelect('community.owner', 'owner')
      .leftJoinAndSelect('owner.profile', 'ownerProfile');

    if (params?.category && params.category !== 'ALL') {
      qb.andWhere('LOWER(community.category) = LOWER(:category)', {
        category: params.category,
      });
    }

    if (params?.search) {
      qb.andWhere(
        '(LOWER(community.name) LIKE LOWER(:search) OR LOWER(community.description) LIKE LOWER(:search) OR LOWER(community.category) LIKE LOWER(:search))',
        { search: `%${params.search}%` },
      );
    }

    qb.orderBy('community.memberCount', 'DESC').skip(skip).take(limit);

    const [items, total] = await qb.getManyAndCount();
    return { items, total, page, limit };
  }

  async findOne(id: string, userId?: string) {
    const community = await this.communityRepo.findOne({
      where: [{ id }, { slug: id }],
      relations: ['owner', 'owner.profile', 'owner.businesses'],
    });

    if (!community) {
      throw new NotFoundException(`Community with ID/Slug "${id}" not found`);
    }

    let membership: CommunityMember | null = null;
    if (userId) {
      membership = await this.memberRepo.findOne({
        where: { community: { id: community.id }, user: { id: userId } },
      });
    }

    return {
      ...community,
      isJoined: !!membership && membership.status === CommunityMemberStatus.ACTIVE,
      membershipStatus: membership?.status || null,
      userRole: membership?.role || null,
    };
  }

  async create(userId: string, dto: CreateCommunityDto) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const baseSlug = dto.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    let slug = baseSlug;
    let count = 1;
    while (await this.communityRepo.findOne({ where: { slug } })) {
      slug = `${baseSlug}-${count++}`;
    }

    const community = this.communityRepo.create({
      name: dto.name,
      slug,
      description: dto.description,
      category: dto.category || 'General',
      coverImageUrl:
        dto.coverImageUrl ||
        'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600',
      avatarUrl:
        dto.avatarUrl ||
        'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=150',
      rules: dto.rules || [
        'Be respectful and professional.',
        'No direct spam or unsolicited mass messaging.',
        'Share authentic opportunities and value.',
      ],
      visibility: dto.visibility || CommunityVisibility.PUBLIC,
      owner: user,
      memberCount: 1,
      postCount: 0,
      isVerified: true,
    });

    const savedCommunity = await this.communityRepo.save(community);

    // Automatically add creator as OWNER
    await this.memberRepo.save(
      this.memberRepo.create({
        community: savedCommunity,
        user,
        role: CommunityMemberRole.OWNER,
        status: CommunityMemberStatus.ACTIVE,
      }),
    );

    return savedCommunity;
  }

  async update(communityId: string, userId: string, dto: UpdateCommunityDto) {
    const community = await this.communityRepo.findOne({
      where: { id: communityId },
      relations: ['owner'],
    });
    if (!community) {
      throw new NotFoundException('Community not found');
    }

    const membership = await this.memberRepo.findOne({
      where: { community: { id: communityId }, user: { id: userId } },
    });

    if (
      community.owner.id !== userId &&
      (!membership || membership.role !== CommunityMemberRole.MODERATOR)
    ) {
      throw new ForbiddenException('Only community owner or moderators can update settings');
    }

    Object.assign(community, dto);
    return this.communityRepo.save(community);
  }

  async join(communityId: string, userId: string) {
    const community = await this.communityRepo.findOne({ where: { id: communityId } });
    if (!community) {
      throw new NotFoundException('Community not found');
    }

    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    let existing = await this.memberRepo.findOne({
      where: { community: { id: communityId }, user: { id: userId } },
    });

    if (existing) {
      if (existing.status === CommunityMemberStatus.ACTIVE) {
        return { success: true, status: 'ALREADY_MEMBER', membership: existing };
      }
      existing.status =
        community.visibility === CommunityVisibility.PRIVATE
          ? CommunityMemberStatus.PENDING_APPROVAL
          : CommunityMemberStatus.ACTIVE;
      const updated = await this.memberRepo.save(existing);
      return { success: true, status: updated.status, membership: updated };
    }

    const status =
      community.visibility === CommunityVisibility.PRIVATE
        ? CommunityMemberStatus.PENDING_APPROVAL
        : CommunityMemberStatus.ACTIVE;

    const membership = await this.memberRepo.save(
      this.memberRepo.create({
        community,
        user,
        role: CommunityMemberRole.MEMBER,
        status,
      }),
    );

    if (status === CommunityMemberStatus.ACTIVE) {
      await this.communityRepo.increment({ id: communityId }, 'memberCount', 1);
    }

    return { success: true, status, membership };
  }

  async leave(communityId: string, userId: string) {
    const membership = await this.memberRepo.findOne({
      where: { community: { id: communityId }, user: { id: userId } },
      relations: ['community'],
    });

    if (!membership) {
      return { success: true, message: 'Not a member' };
    }

    if (membership.role === CommunityMemberRole.OWNER) {
      throw new BadRequestException('Community owner cannot leave without transferring ownership');
    }

    await this.memberRepo.remove(membership);
    await this.communityRepo.decrement({ id: communityId }, 'memberCount', 1);

    return { success: true, message: 'Successfully left community' };
  }

  async getMembers(communityId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [items, total] = await this.memberRepo.findAndCount({
      where: { community: { id: communityId }, status: CommunityMemberStatus.ACTIVE },
      relations: ['user', 'user.profile', 'user.businesses'],
      order: { joinedAt: 'ASC' },
      skip,
      take: limit,
    } as any);

    return { items, total, page, limit };
  }

  /**
   * Surface recommended communities based on Needs/Offers synergy
   */
  async getRecommended(userId: string) {
    const userNeeds = await this.needRepo.find({ where: { user: { id: userId } } });
    const userOffers = await this.offerRepo.find({ where: { user: { id: userId } } });

    const categories = new Set<string>();
    userNeeds.forEach((n) => categories.add(n.categoryName));
    userOffers.forEach((o) => categories.add(o.categoryName));

    const all = await this.communityRepo.find({
      relations: ['owner', 'owner.profile'],
      order: { memberCount: 'DESC' },
      take: 10,
    });

    // Score and mark why recommended
    return all.map((c) => {
      const isDirectMatch = Array.from(categories).some(
        (cat) =>
          c.category.toLowerCase().includes(cat.toLowerCase()) ||
          cat.toLowerCase().includes(c.category.toLowerCase()),
      );
      return {
        ...c,
        recommendedReason: isDirectMatch
          ? `Matches your business offerings & active needs in ${c.category}`
          : `Trending high-engagement community with ${c.memberCount} members`,
        synergyScore: isDirectMatch ? 94 : 82,
      };
    });
  }
}
