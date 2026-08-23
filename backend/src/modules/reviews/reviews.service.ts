import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from '../../database/entities/review.entity';
import { User } from '../../database/entities/user.entity';
import { MarketplaceListing } from '../../database/entities/marketplace-listing.entity';

export interface CreateReviewDto {
  providerId: string;
  listingId?: string;
  rating: number;
  comment: string;
}

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepo: Repository<Review>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(MarketplaceListing)
    private readonly listingRepo: Repository<MarketplaceListing>,
  ) {}

  async getReviewsForProvider(providerId: string) {
    return this.reviewRepo.find({
      where: { provider: { id: providerId } },
      relations: ['reviewer', 'reviewer.profile', 'listing'],
      order: { createdAt: 'DESC' },
    });
  }

  async getReviewsForListing(listingId: string) {
    return this.reviewRepo.find({
      where: { listing: { id: listingId } },
      relations: ['reviewer', 'reviewer.profile'],
      order: { createdAt: 'DESC' },
    });
  }

  async create(reviewerId: string, dto: CreateReviewDto) {
    if (reviewerId === dto.providerId) {
      throw new BadRequestException('Cannot review your own services');
    }

    const reviewer = await this.userRepo.findOne({ where: { id: reviewerId } });
    if (!reviewer) {
      throw new NotFoundException('Reviewer not found');
    }

    const provider = await this.userRepo.findOne({ where: { id: dto.providerId } });
    if (!provider) {
      throw new NotFoundException('Provider not found');
    }

    let listing: MarketplaceListing | null = null;
    if (dto.listingId) {
      listing = await this.listingRepo.findOne({ where: { id: dto.listingId } });
    }

    const existing = await this.reviewRepo.findOne({
      where: {
        reviewer: { id: reviewerId },
        provider: { id: dto.providerId },
        listing: listing ? { id: listing.id } : undefined,
      },
    });

    if (existing) {
      throw new BadRequestException('You have already submitted a review for this collaboration');
    }

    const review = await this.reviewRepo.save(
      this.reviewRepo.create({
        reviewer,
        provider,
        listing: listing || undefined,
        rating: Math.max(1, Math.min(5, dto.rating)),
        comment: dto.comment,
      }),
    );

    // Recalculate listing average rating if applicable
    if (listing) {
      const allReviews = await this.reviewRepo.find({
        where: { listing: { id: listing.id } },
      });
      const avg =
        allReviews.reduce((sum, r) => sum + r.rating, 0) / (allReviews.length || 1);
      await this.listingRepo.update(
        { id: listing.id },
        {
          averageRating: parseFloat(avg.toFixed(1)),
          reviewsCount: allReviews.length,
        },
      );
    }

    return review;
  }
}
