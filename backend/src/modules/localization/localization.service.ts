import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserPreference } from '../../database/entities/user-preference.entity';
import { User } from '../../database/entities/user.entity';
import { Community } from '../../database/entities/community.entity';
import { MarketplaceListing } from '../../database/entities/marketplace-listing.entity';
import { UpdatePreferencesDto } from './dto/update-preferences.dto';

export interface LanguageInfo {
  code: string;
  name: string;
  nativeName: string;
  direction: 'ltr' | 'rtl';
  isDefault?: boolean;
}

export interface CurrencyInfo {
  code: string;
  name: string;
  symbol: string;
  symbolPosition: 'prefix' | 'suffix';
  decimalPlaces: number;
  exchangeRateToINR: number;
}

export interface CountryInfo {
  code: string;
  name: string;
  nativeName: string;
  defaultLanguage: string;
  defaultCurrency: string;
  defaultTimezone: string;
  regions: string[];
}

@Injectable()
export class LocalizationService {
  private readonly languages: LanguageInfo[] = [
    { code: 'en', name: 'English', nativeName: 'English', direction: 'ltr', isDefault: true },
    { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', direction: 'ltr' },
    { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', direction: 'ltr' },
    { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', direction: 'ltr' },
    { code: 'es', name: 'Spanish', nativeName: 'Español', direction: 'ltr' },
    { code: 'fr', name: 'French', nativeName: 'Français', direction: 'ltr' },
    { code: 'de', name: 'German', nativeName: 'Deutsch', direction: 'ltr' },
    { code: 'ar', name: 'Arabic', nativeName: 'العربية', direction: 'rtl' },
  ];

  private readonly currencies: CurrencyInfo[] = [
    { code: 'INR', name: 'Indian Rupee', symbol: '₹', symbolPosition: 'prefix', decimalPlaces: 2, exchangeRateToINR: 1.0 },
    { code: 'USD', name: 'US Dollar', symbol: '$', symbolPosition: 'prefix', decimalPlaces: 2, exchangeRateToINR: 86.5 },
    { code: 'EUR', name: 'Euro', symbol: '€', symbolPosition: 'prefix', decimalPlaces: 2, exchangeRateToINR: 91.2 },
    { code: 'GBP', name: 'British Pound', symbol: '£', symbolPosition: 'prefix', decimalPlaces: 2, exchangeRateToINR: 109.8 },
    { code: 'AED', name: 'UAE Dirham', symbol: 'AED', symbolPosition: 'prefix', decimalPlaces: 2, exchangeRateToINR: 23.55 },
    { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', symbolPosition: 'prefix', decimalPlaces: 2, exchangeRateToINR: 64.8 },
    { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', symbolPosition: 'prefix', decimalPlaces: 2, exchangeRateToINR: 56.4 },
    { code: 'CAD', name: 'Canadian Dollar', symbol: 'CA$', symbolPosition: 'prefix', decimalPlaces: 2, exchangeRateToINR: 61.2 },
    { code: 'JPY', name: 'Japanese Yen', symbol: '¥', symbolPosition: 'prefix', decimalPlaces: 0, exchangeRateToINR: 0.57 },
  ];

  private readonly countries: CountryInfo[] = [
    {
      code: 'IN',
      name: 'India',
      nativeName: 'भारत',
      defaultLanguage: 'en',
      defaultCurrency: 'INR',
      defaultTimezone: 'Asia/Kolkata',
      regions: ['Tamil Nadu', 'Karnataka', 'Maharashtra', 'Delhi NCR', 'Telangana', 'Kerala', 'Gujarat', 'West Bengal'],
    },
    {
      code: 'US',
      name: 'United States',
      nativeName: 'United States',
      defaultLanguage: 'en',
      defaultCurrency: 'USD',
      defaultTimezone: 'America/New_York',
      regions: ['California', 'New York', 'Texas', 'Washington', 'Florida', 'Illinois', 'Massachusetts'],
    },
    {
      code: 'AE',
      name: 'United Arab Emirates',
      nativeName: 'الإمارات',
      defaultLanguage: 'ar',
      defaultCurrency: 'AED',
      defaultTimezone: 'Asia/Dubai',
      regions: ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman'],
    },
    {
      code: 'GB',
      name: 'United Kingdom',
      nativeName: 'United Kingdom',
      defaultLanguage: 'en',
      defaultCurrency: 'GBP',
      defaultTimezone: 'Europe/London',
      regions: ['Greater London', 'Scotland', 'North West', 'West Midlands'],
    },
    {
      code: 'SG',
      name: 'Singapore',
      nativeName: 'Singapore',
      defaultLanguage: 'en',
      defaultCurrency: 'SGD',
      defaultTimezone: 'Asia/Singapore',
      regions: ['Central', 'East', 'North', 'West'],
    },
    {
      code: 'DE',
      name: 'Germany',
      nativeName: 'Deutschland',
      defaultLanguage: 'de',
      defaultCurrency: 'EUR',
      defaultTimezone: 'Europe/Berlin',
      regions: ['Bavaria', 'Berlin', 'North Rhine-Westphalia', 'Baden-Württemberg', 'Hesse'],
    },
    {
      code: 'FR',
      name: 'France',
      nativeName: 'France',
      defaultLanguage: 'fr',
      defaultCurrency: 'EUR',
      defaultTimezone: 'Europe/Paris',
      regions: ['Île-de-France', 'Auvergne-Rhône-Alpes', 'Provence-Alpes-Côte d\'Azur'],
    },
    {
      code: 'AU',
      name: 'Australia',
      nativeName: 'Australia',
      defaultLanguage: 'en',
      defaultCurrency: 'AUD',
      defaultTimezone: 'Australia/Sydney',
      regions: ['New South Wales', 'Victoria', 'Queensland', 'Western Australia'],
    },
    {
      code: 'CA',
      name: 'Canada',
      nativeName: 'Canada',
      defaultLanguage: 'en',
      defaultCurrency: 'CAD',
      defaultTimezone: 'America/Toronto',
      regions: ['Ontario', 'British Columbia', 'Quebec', 'Alberta'],
    },
  ];

  private readonly timezones = [
    'Asia/Kolkata',
    'Asia/Dubai',
    'Asia/Singapore',
    'Asia/Tokyo',
    'Europe/London',
    'Europe/Paris',
    'Europe/Berlin',
    'America/New_York',
    'America/Chicago',
    'America/Los_Angeles',
    'America/Toronto',
    'Australia/Sydney',
    'UTC',
  ];

  constructor(
    @InjectRepository(UserPreference)
    private readonly preferenceRepo: Repository<UserPreference>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Community)
    private readonly communityRepo: Repository<Community>,
    @InjectRepository(MarketplaceListing)
    private readonly marketplaceRepo: Repository<MarketplaceListing>,
  ) {}

  getConfig() {
    return {
      defaultLanguage: 'en',
      defaultCountry: 'India',
      defaultCurrency: 'INR',
      defaultTimezone: 'Asia/Kolkata',
      languages: this.languages,
      currencies: this.currencies,
      countries: this.countries,
      timezones: this.timezones,
    };
  }

  getLanguages() {
    return this.languages;
  }

  getCurrencies() {
    return this.currencies;
  }

  getCountries() {
    return this.countries;
  }

  getTimezones() {
    return this.timezones;
  }

  async getUserPreferences(userId: string): Promise<UserPreference> {
    let pref = await this.preferenceRepo.findOne({
      where: { user: { id: userId } },
      relations: ['user'],
    });

    if (!pref) {
      // Find or create default preferences for the user
      const user = await this.userRepo.findOne({ where: { id: userId } });
      pref = this.preferenceRepo.create({
        user: user || ({ id: userId } as any),
        language: 'en',
        country: 'India',
        region: 'Tamil Nadu',
        city: 'Chennai',
        timezone: 'Asia/Kolkata',
        currency: 'INR',
        locale: 'en-IN',
        isLocationPublic: false,
        allowRegionalDiscovery: true,
        autoDetectTimezone: false,
      });
      await this.preferenceRepo.save(pref);
    }

    return pref;
  }

  async updateUserPreferences(userId: string, dto: UpdatePreferencesDto): Promise<UserPreference> {
    let pref = await this.preferenceRepo.findOne({
      where: { user: { id: userId } },
      relations: ['user'],
    });

    if (!pref) {
      const user = await this.userRepo.findOne({ where: { id: userId } });
      pref = this.preferenceRepo.create({
        user: user || ({ id: userId } as any),
        ...dto,
      });
    } else {
      Object.assign(pref, dto);
    }

    return this.preferenceRepo.save(pref);
  }

  async getRegionalDiscovery(params: {
    country?: string;
    region?: string;
    city?: string;
    language?: string;
  }) {
    const commQb = this.communityRepo.createQueryBuilder('c');
    if (params.country) {
      commQb.andWhere('(c.country = :country OR c.scope = :globalScope)', {
        country: params.country,
        globalScope: 'GLOBAL',
      });
    }
    if (params.language && params.language !== 'all') {
      commQb.andWhere('(c.language = :lang OR c.language = :allLang)', {
        lang: params.language,
        allLang: 'ALL',
      });
    }
    const communities = await commQb.take(10).getMany();

    const marketplaceQb = this.marketplaceRepo.createQueryBuilder('m');
    const marketplaceListings = await marketplaceQb.take(10).getMany();

    return {
      filtersApplied: params,
      regionalCommunitiesCount: communities.length,
      communities,
      marketplaceListings,
    };
  }
}
