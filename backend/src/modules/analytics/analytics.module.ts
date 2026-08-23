import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnalyticsService } from './analytics.service';
import { AnalyticsController } from './analytics.controller';
import { Lead } from '../../database/entities/lead.entity';
import { Opportunity } from '../../database/entities/opportunity.entity';
import { Connection } from '../../database/entities/connection.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Lead, Opportunity, Connection])],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
  exports: [AnalyticsService],
})
export class AnalyticsModule {}
