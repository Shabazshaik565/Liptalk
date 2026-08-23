import { Controller, Get, Put, Body, UseGuards, Request, Query } from '@nestjs/common';
import { UsersService, UserFilterDto } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserRole } from '../../database/entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  getMe(@Request() req: any) {
    const userId = req.user?.id || 'usr_curr_01';
    return this.usersService.getMe(userId);
  }

  @Get()
  getAllUsers(
    @Query('search') search?: string,
    @Query('role') role?: UserRole | 'ALL',
    @Query('city') city?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const filter: UserFilterDto = {
      search,
      role,
      city,
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 20,
    };
    return this.usersService.getAllUsers(filter);
  }

  @Put('profile')
  @UseGuards(JwtAuthGuard)
  updateProfile(@Request() req: any, @Body() body: any) {
    const userId = req.user?.id || 'usr_curr_01';
    return this.usersService.updateProfile(userId, body);
  }
}
