import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SavedItem } from '../../database/entities/saved-item.entity';
import { User } from '../../database/entities/user.entity';
import { SavedService } from './saved.service';
import { SavedController } from './saved.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([SavedItem, User]), AuthModule],
  controllers: [SavedController],
  providers: [SavedService],
  exports: [SavedService],
})
export class SavedModule {}
