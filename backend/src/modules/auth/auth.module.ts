import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { User } from '../../database/entities/user.entity';
import { UserProfile } from '../../database/entities/profile.entity';
import { Business } from '../../database/entities/business.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserProfile, Business]),
    JwtModule.register({
      secret: process.env.JWT_ACCESS_SECRET || 'liptalk_access_secret_2026',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtAuthGuard],
  exports: [AuthService, JwtModule, JwtAuthGuard],
})
export class AuthModule {}
