import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeveloperController } from './developer.controller';
import { DeveloperService } from './developer.service';
import { DeveloperApp } from '../../database/entities/developer-app.entity';
import { Webhook } from '../../database/entities/webhook.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DeveloperApp, Webhook])],
  controllers: [DeveloperController],
  providers: [DeveloperService],
  exports: [DeveloperService],
})
export class DeveloperModule {}
