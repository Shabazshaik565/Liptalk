export class UpdatePreferencesDto {
  language?: string;
  country?: string;
  region?: string;
  city?: string;
  timezone?: string;
  currency?: string;
  locale?: string;
  isLocationPublic?: boolean;
  allowRegionalDiscovery?: boolean;
  autoDetectTimezone?: boolean;
}
