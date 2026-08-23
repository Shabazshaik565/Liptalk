import { Controller, Get, Post, Param, Body, UseGuards, Req } from '@nestjs/common';
import { ReviewsService, CreateReviewDto } from './reviews.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get('provider/:providerId')
  async getProviderReviews(@Param('providerId') providerId: string) {
    return this.reviewsService.getReviewsForProvider(providerId);
  }

  @Get('listing/:listingId')
  async getListingReviews(@Param('listingId') listingId: string) {
    return this.reviewsService.getReviewsForListing(listingId);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async createReview(@Req() req: any, @Body() dto: CreateReviewDto) {
    const userId = req.user?.id || 'usr_curr_01';
    return this.reviewsService.create(userId, dto);
  }
}
