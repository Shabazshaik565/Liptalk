import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import configuration from './config/configuration';

// Domain Modules
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { NeedsOffersModule } from './modules/needs-offers/needs-offers.module';
import { MatchingModule } from './modules/matching/matching.module';
import { OpportunitiesModule } from './modules/opportunities/opportunities.module';
import { LeadsModule } from './modules/leads/leads.module';
import { ChatModule } from './modules/chat/chat.module';
import { PartnersModule } from './modules/partners/partners.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { MediaModule } from './modules/media/media.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { CommunitiesModule } from './modules/communities/communities.module';
import { PostsModule } from './modules/posts/posts.module';
import { EventsModule } from './modules/events/events.module';
import { ReportsModule } from './modules/reports/reports.module';
import { MarketplaceModule } from './modules/marketplace/marketplace.module';
import { SavedModule } from './modules/saved/saved.module';
import { ReviewsModule } from './modules/reviews/reviews.module';
import { RewardsModule } from './modules/rewards/rewards.module';
import { MembershipsModule } from './modules/memberships/memberships.module';
import { AiModule } from './modules/ai/ai.module';
import { RecommendationsModule } from './modules/recommendations/recommendations.module';
import { CallsModule } from './modules/calls/calls.module';
import { LiveRoomsModule } from './modules/live-rooms/live-rooms.module';
import { CreatorModule } from './modules/creator/creator.module';
import { FeatureFlagsModule } from './common/feature-flags/feature-flags.module';
import { EnterpriseModule } from './modules/enterprise/enterprise.module';
import { TrustSafetyModule } from './modules/trust-safety/trust-safety.module';
import { PrivacyModule } from './modules/privacy/privacy.module';
import { AdminModule } from './modules/admin/admin.module';
import { HealthModule } from './modules/health/health.module';
import { LocalizationModule } from './modules/localization/localization.module';
import { DeveloperModule } from './modules/developer/developer.module';
import { EcosystemModule } from './modules/ecosystem/ecosystem.module';
import { UniversalModule } from './modules/universal/universal.module';
import { CoordinationModule } from './modules/coordination/coordination.module';
import { IntelligenceModule } from './modules/intelligence/intelligence.module';
import { AdaptationModule } from './modules/adaptation/adaptation.module';
import { CreationModule } from './modules/creation/creation.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    TypeOrmModule.forRootAsync({
      useFactory: () => {
        const isPostgres = process.env.DATABASE_TYPE === 'postgres';
        if (isPostgres) {
          return {
            type: 'postgres',
            host: process.env.DATABASE_HOST || 'localhost',
            port: parseInt(process.env.DATABASE_PORT || '5432', 10),
            username: process.env.DATABASE_USER || 'postgres',
            password: process.env.DATABASE_PASSWORD || 'postgrespassword',
            database: process.env.DATABASE_NAME || 'liptalk_db',
            autoLoadEntities: true,
            synchronize: true,
          };
        }
        return {
          type: 'sqlite',
          database: 'liptalk.sqlite',
          autoLoadEntities: true,
          synchronize: true,
        };
      },
    }),
    AuthModule,
    UsersModule,
    NeedsOffersModule,
    MatchingModule,
    OpportunitiesModule,
    LeadsModule,
    ChatModule,
    PartnersModule,
    AnalyticsModule,
    MediaModule,
    NotificationsModule,
    CommunitiesModule,
    PostsModule,
    EventsModule,
    ReportsModule,
    MarketplaceModule,
    SavedModule,
    ReviewsModule,
    RewardsModule,
    MembershipsModule,
    AiModule,
    RecommendationsModule,
    CallsModule,
    LiveRoomsModule,
    CreatorModule,
    FeatureFlagsModule,
    EnterpriseModule,
    TrustSafetyModule,
    PrivacyModule,
    AdminModule,
    HealthModule,
    LocalizationModule,
    DeveloperModule,
    EcosystemModule,
    UniversalModule,
    CoordinationModule,
    IntelligenceModule,
    AdaptationModule,
    CreationModule,
  ],
})
export class AppModule {}
