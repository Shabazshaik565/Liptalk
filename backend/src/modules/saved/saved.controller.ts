import {
  Controller,
  Get,
  Post,
  Query,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import { SavedService } from './saved.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SavedTargetType } from '../../database/entities/saved-item.entity';

@Controller('saved')
export class SavedController {
  constructor(private readonly savedService: SavedService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getSavedItems(
    @Req() req: any,
    @Query('targetType') targetType?: SavedTargetType,
  ) {
    const userId = req.user?.id || 'usr_curr_01';
    return this.savedService.getSavedItems(userId, targetType);
  }

  @Post('toggle')
  @UseGuards(JwtAuthGuard)
  async toggleSave(
    @Req() req: any,
    @Body('targetType') targetType: SavedTargetType,
    @Body('targetId') targetId: string,
  ) {
    const userId = req.user?.id || 'usr_curr_01';
    return this.savedService.toggleSave(userId, targetType, targetId);
  }
}
