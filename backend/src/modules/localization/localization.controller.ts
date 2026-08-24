import {
  Controller,
  Get,
  Patch,
  Body,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { LocalizationService } from './localization.service';
import { UpdatePreferencesDto } from './dto/update-preferences.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('localization')
export class LocalizationController {
  constructor(private readonly localizationService: LocalizationService) {}

  @Get('config')
  getConfig() {
    return this.localizationService.getConfig();
  }

  @Get('languages')
  getLanguages() {
    return this.localizationService.getLanguages();
  }

  @Get('currencies')
  getCurrencies() {
    return this.localizationService.getCurrencies();
  }

  @Get('countries')
  getCountries() {
    return this.localizationService.getCountries();
  }

  @Get('timezones')
  getTimezones() {
    return this.localizationService.getTimezones();
  }

  @Get('discovery/regional')
  getRegionalDiscovery(
    @Query('country') country?: string,
    @Query('region') region?: string,
    @Query('city') city?: string,
    @Query('language') language?: string,
  ) {
    return this.localizationService.getRegionalDiscovery({
      country,
      region,
      city,
      language,
    });
  }
}

@Controller('user/preferences')
export class UserPreferencesController {
  constructor(private readonly localizationService: LocalizationService) {}

  @Get()
  async getPreferences(@Request() req: any) {
    const userId = req.user?.id || 'usr_curr_01';
    return this.localizationService.getUserPreferences(userId);
  }

  @Patch()
  async updatePreferences(
    @Request() req: any,
    @Body() dto: UpdatePreferencesDto,
  ) {
    const userId = req.user?.id || 'usr_curr_01';
    return this.localizationService.updateUserPreferences(userId, dto);
  }
}
