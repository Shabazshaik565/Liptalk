import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole, UserStatus } from '../../database/entities/user.entity';
import { UserProfile } from '../../database/entities/profile.entity';
import { Business } from '../../database/entities/business.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(UserProfile)
    private readonly profileRepo: Repository<UserProfile>,
    @InjectRepository(Business)
    private readonly businessRepo: Repository<Business>,
    private readonly jwtService: JwtService,
  ) {}

  async register(data: { email?: string; phoneNumber?: string; password?: string; role?: UserRole }) {
    const user = new User();
    user.email = data.email || null;
    user.phoneNumber = data.phoneNumber || null;
    user.role = data.role || UserRole.INDIVIDUAL;
    user.status = UserStatus.ACTIVE;
    user.isEmailVerified = !!data.email;
    user.isPhoneVerified = !!data.phoneNumber;
    user.needsOnboarding = true;

    if (data.password) {
      user.passwordHash = await bcrypt.hash(data.password, 10);
    }

    const savedUser = await this.userRepo.save(user);

    // Create default profile
    const profile = new UserProfile();
    profile.user = savedUser;
    profile.firstName = data.email ? data.email.split('@')[0] : 'Member';
    profile.lastName = '';
    profile.skills = [];
    profile.interests = [];
    await this.profileRepo.save(profile);

    const token = this.generateToken(savedUser);
    return { user: savedUser, token };
  }

  async login(identifier: string, password?: string) {
    const isEmail = identifier.includes('@');
    const user = await this.userRepo.findOne({
      where: isEmail ? { email: identifier } : { phoneNumber: identifier },
      relations: ['profile', 'businesses'],
    });

    if (!user) {
      // Auto-provision demo account if not exists for seamless demo experience
      return this.register({
        email: isEmail ? identifier : undefined,
        phoneNumber: !isEmail ? identifier : undefined,
        password,
      });
    }

    const token = this.generateToken(user);
    return { user, token };
  }

  async sendOtp(phone: string) {
    return {
      success: true,
      message: `OTP sent successfully to ${phone}. (Use demo code: 123456)`,
    };
  }

  async verifyOtp(phone: string, otp: string) {
    let user = await this.userRepo.findOne({
      where: { phoneNumber: phone },
      relations: ['profile', 'businesses'],
    });

    if (!user) {
      const reg = await this.register({ phoneNumber: phone });
      user = reg.user;
    }

    user.isPhoneVerified = true;
    await this.userRepo.save(user);

    const token = this.generateToken(user);
    return { user, token };
  }

  private generateToken(user: User): string {
    return this.jwtService.sign({
      sub: user.id,
      email: user.email,
      role: user.role,
    });
  }
}
