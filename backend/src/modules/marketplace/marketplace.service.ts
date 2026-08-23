import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  MarketplaceListing,
  ListingPricingType,
  ListingStatus,
  ListingPromotionType,
} from '../../database/entities/marketplace-listing.entity';
import { User } from '../../database/entities/user.entity';
import { SavedItem, SavedTargetType } from '../../database/entities/saved-item.entity';
import { Need } from '../../database/entities/need.entity';
import { Offer } from '../../database/entities/offer.entity';
import { Conversation, ConversationContextType } from '../../database/entities/conversation.entity';
import { Message } from '../../database/entities/message.entity';
import { Lead, LeadSource, LeadStatus } from '../../database/entities/lead.entity';
import { LeadNote } from '../../database/entities/lead-note.entity';

export interface CreateListingDto {
  title: string;
  description: string;
  category: string;
  pricingType?: ListingPricingType;
  price?: number;
  currency?: string;
  location?: string;
  tags?: string[];
  imageUrls?: string[];
}

export interface UpdateListingDto {
  title?: string;
  description?: string;
  category?: string;
  pricingType?: ListingPricingType;
  price?: number;
  currency?: string;
  location?: string;
  tags?: string[];
  imageUrls?: string[];
  status?: ListingStatus;
}

export interface RequestServiceDto {
  message: string;
  estimatedBudget?: number;
  timeline?: string;
}

@Injectable()
export class MarketplaceService {
  constructor(
    @InjectRepository(MarketplaceListing)
    private readonly listingRepo: Repository<MarketplaceListing>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(SavedItem)
    private readonly savedRepo: Repository<SavedItem>,
    @InjectRepository(Need)
    private readonly needRepo: Repository<Need>,
    @InjectRepository(Offer)
    private readonly offerRepo: Repository<Offer>,
    @InjectRepository(Conversation)
    private readonly convRepo: Repository<Conversation>,
    @InjectRepository(Message)
    private readonly msgRepo: Repository<Message>,
    @InjectRepository(Lead)
    private readonly leadRepo: Repository<Lead>,
    @InjectRepository(LeadNote)
    private readonly leadNoteRepo: Repository<LeadNote>,
  ) {}

  async findAll(params?: {
    search?: string;
    category?: string;
    pricingType?: string;
    location?: string;
    userId?: string;
    page?: number;
    limit?: number;
  }) {
    const page = params?.page || 1;
    const limit = params?.limit || 20;
    const skip = (page - 1) * limit;

    const qb = this.listingRepo
      .createQueryBuilder('listing')
      .leftJoinAndSelect('listing.provider', 'provider')
      .leftJoinAndSelect('provider.profile', 'profile')
      .leftJoinAndSelect('provider.businesses', 'businesses')
      .where('listing.status = :status', { status: ListingStatus.PUBLISHED });

    if (params?.category && params.category !== 'ALL') {
      qb.andWhere('LOWER(listing.category) LIKE LOWER(:category)', {
        category: `%${params.category}%`,
      });
    }

    if (params?.search) {
      qb.andWhere(
        '(LOWER(listing.title) LIKE LOWER(:search) OR LOWER(listing.description) LIKE LOWER(:search) OR LOWER(listing.category) LIKE LOWER(:search))',
        { search: `%${params.search}%` },
      );
    }

    if (params?.pricingType && params.pricingType !== 'ALL') {
      qb.andWhere('listing.pricingType = :pricingType', { pricingType: params.pricingType });
    }

    qb.orderBy('listing.promotionType', 'DESC')
      .addOrderBy('listing.createdAt', 'DESC')
      .skip(skip)
      .take(limit);

    const [items, total] = await qb.getManyAndCount();

    // Check saved status
    let savedIds = new Set<string>();
    if (params?.userId && items.length > 0) {
      const saved = await this.savedRepo.find({
        where: { user: { id: params.userId }, targetType: SavedTargetType.LISTING },
      });
      saved.forEach((s) => savedIds.add(s.targetId));
    }

    const enriched = items.map((item) => ({
      ...item,
      isSaved: savedIds.has(item.id),
    }));

    return { items: enriched, total, page, limit };
  }

  async findOne(id: string, userId?: string) {
    const listing = await this.listingRepo.findOne({
      where: [{ id }, { slug: id }],
      relations: ['provider', 'provider.profile', 'provider.businesses'],
    });

    if (!listing) {
      throw new NotFoundException(`Marketplace listing "${id}" not found`);
    }

    let isSaved = false;
    if (userId) {
      const saved = await this.savedRepo.findOne({
        where: {
          user: { id: userId },
          targetType: SavedTargetType.LISTING,
          targetId: listing.id,
        },
      });
      isSaved = !!saved;
    }

    return { ...listing, isSaved };
  }

  async create(userId: string, dto: CreateListingDto) {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: ['profile', 'businesses'],
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const baseSlug = dto.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    let slug = baseSlug;
    let count = 1;
    while (await this.listingRepo.findOne({ where: { slug } })) {
      slug = `${baseSlug}-${count++}`;
    }

    const listing = this.listingRepo.create({
      provider: user,
      title: dto.title,
      slug,
      description: dto.description,
      category: dto.category || 'General Services',
      pricingType: dto.pricingType || ListingPricingType.FIXED,
      price: dto.price || 0,
      currency: dto.currency || 'INR',
      location: dto.location || 'Bangalore',
      tags: dto.tags || ['Verified Provider'],
      imageUrls: dto.imageUrls || [
        'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=600',
      ],
      status: ListingStatus.PUBLISHED,
      promotionType: ListingPromotionType.NORMAL,
      averageRating: 5.0,
      reviewsCount: 0,
      requestsCount: 0,
    });

    return this.listingRepo.save(listing);
  }

  async update(id: string, userId: string, dto: UpdateListingDto) {
    const listing = await this.listingRepo.findOne({
      where: { id },
      relations: ['provider'],
    });
    if (!listing) {
      throw new NotFoundException('Listing not found');
    }

    if (listing.provider.id !== userId) {
      throw new ForbiddenException('Not authorized to update this listing');
    }

    Object.assign(listing, dto);
    return this.listingRepo.save(listing);
  }

  async delete(id: string, userId: string) {
    const listing = await this.listingRepo.findOne({
      where: { id },
      relations: ['provider'],
    });
    if (!listing) {
      throw new NotFoundException('Listing not found');
    }

    if (listing.provider.id !== userId) {
      throw new ForbiddenException('Not authorized to delete this listing');
    }

    await this.listingRepo.remove(listing);
    return { success: true };
  }

  /**
   * Service Request Flow:
   * 1. Increments listing requestsCount
   * 2. Creates CRM Lead for provider
   * 3. Creates/Opens 1:1 Conversation with Context
   */
  async requestService(listingId: string, customerId: string, dto: RequestServiceDto) {
    const listing = await this.listingRepo.findOne({
      where: { id: listingId },
      relations: ['provider', 'provider.profile', 'provider.businesses'],
    });
    if (!listing) {
      throw new NotFoundException('Listing not found');
    }

    const customer = await this.userRepo.findOne({
      where: { id: customerId },
      relations: ['profile', 'businesses'],
    });
    if (!customer) {
      throw new NotFoundException('Customer user not found');
    }

    if (listing.provider.id === customerId) {
      throw new BadRequestException('Cannot request your own service listing');
    }

    // 1. Increment request count
    await this.listingRepo.increment({ id: listingId }, 'requestsCount', 1);

    // 2. Create CRM Lead in provider's pipeline
    const lead = this.leadRepo.create({
      business: listing.provider.businesses?.[0] || undefined,
      contactUser: customer,
      title: `Marketplace Request: ${listing.title}`,
      source: LeadSource.OPPORTUNITY,
      status: LeadStatus.NEW,
      estimatedValue: dto.estimatedBudget || listing.price || 50000,
      currency: listing.currency || 'INR',
    });
    const savedLead = await this.leadRepo.save(lead);

    if (dto.timeline) {
      await this.leadNoteRepo.save(
        this.leadNoteRepo.create({
          lead: savedLead,
          author: customer,
          noteText: `Requested Timeline: ${dto.timeline}`,
        }),
      );
    }

    // 3. Initiate or find Contextual Conversation
    let conversation = await this.convRepo.findOne({
      where: {
        contextId: listing.id,
      },
    });

    if (!conversation) {
      conversation = await this.convRepo.save(
        this.convRepo.create({
          participantIds: [customerId, listing.provider.id],
          contextType: ConversationContextType.GENERAL,
          contextId: listing.id,
          contextTitle: `Service Inquiry: ${listing.title}`,
        }),
      );
    }

    // Send initial inquiry message
    await this.msgRepo.save(
      this.msgRepo.create({
        conversation,
        sender: customer,
        text: `Hello! I'm interested in your marketplace offering "${listing.title}". ${dto.message}`,
        isRead: false,
      }),
    );

    return {
      success: true,
      leadId: savedLead.id,
      conversationId: conversation.id,
      message: 'Service requested successfully! Conversation initiated with provider.',
    };
  }

  /**
   * Surface Recommended Marketplace Services matching active user Needs
   */
  async getRecommended(userId: string) {
    const userNeeds = await this.needRepo.find({ where: { user: { id: userId } } });
    const needCategories = userNeeds.map((n) => n.categoryName.toLowerCase());

    const listings = await this.listingRepo.find({
      where: { status: ListingStatus.PUBLISHED },
      relations: ['provider', 'provider.profile', 'provider.businesses'],
      order: { promotionType: 'DESC', averageRating: 'DESC' },
      take: 6,
    });

    return listings.map((item) => {
      const matchesNeed = needCategories.some(
        (c) => item.category.toLowerCase().includes(c) || c.includes(item.category.toLowerCase()),
      );
      return {
        ...item,
        recommendedReason: matchesNeed
          ? `Direct match for your active business need in ${item.category}`
          : `Top-rated provider with ${item.averageRating}★ average rating`,
        synergyScore: matchesNeed ? 96 : 85,
      };
    });
  }
}
