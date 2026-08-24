import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  Globe,
  MapPin,
  Clock,
  Coins,
  Check,
  Shield,
  Sparkles,
  ChevronDown,
  ArrowLeft,
  Compass,
  CheckCircle2,
} from 'lucide-react-native';
import { Header } from '../../src/components/common/Header';
import { Badge } from '../../src/components/common/Badge';
import { Button } from '../../src/components/common/Button';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../../src/constants/theme';
import {
  useLocalization,
  LocalizationState,
} from '../../src/store/localization.store';
import {
  LANGUAGES,
  SupportedLanguageCode,
} from '../../src/locales';
import {
  SUPPORTED_COUNTRIES,
  SUPPORTED_CURRENCIES,
  SUPPORTED_TIMEZONES,
  CountryConfig,
} from '../../src/utils/localization';
import { userPreferencesApi } from '../../src/api/domain.api';

export default function LanguageRegionScreen() {
  const router = useRouter();
  const loc = useLocalization();

  const [selectedLang, setSelectedLang] = useState<SupportedLanguageCode>(loc.language);
  const [selectedCountry, setSelectedCountry] = useState<string>(loc.country);
  const [selectedRegion, setSelectedRegion] = useState<string>(loc.region);
  const [selectedCurrency, setSelectedCurrency] = useState<string>(loc.currency);
  const [selectedTimezone, setSelectedTimezone] = useState<string>(loc.timezone);
  const [allowRegional, setAllowRegional] = useState<boolean>(loc.allowRegionalDiscovery);
  const [isLocationPublic, setIsLocationPublic] = useState<boolean>(loc.isLocationPublic);
  const [autoTimezone, setAutoTimezone] = useState<boolean>(loc.autoDetectTimezone);

  const [saving, setSaving] = useState(false);
  const [saveBanner, setSaveBanner] = useState(false);

  useEffect(() => {
    loc.loadPreferences();
  }, []);

  const currentCountryObj = SUPPORTED_COUNTRIES.find((c) => c.name === selectedCountry) || SUPPORTED_COUNTRIES[0];

  const handleCountrySelect = (country: CountryConfig) => {
    setSelectedCountry(country.name);
    setSelectedRegion(country.regions[0] || '');
    setSelectedCurrency(country.defaultCurrency);
    setSelectedTimezone(country.defaultTimezone);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const updates = {
        language: selectedLang,
        country: selectedCountry,
        region: selectedRegion,
        currency: selectedCurrency,
        timezone: selectedTimezone,
        allowRegionalDiscovery: allowRegional,
        isLocationPublic,
        autoDetectTimezone: autoTimezone,
      };

      await loc.updatePreferences(updates);
      await userPreferencesApi.updatePreferences(updates);

      setSaveBanner(true);
      setTimeout(() => {
        setSaveBanner(false);
      }, 3500);
    } catch (err) {
      Alert.alert('Error', 'Could not save preferences');
    } finally {
      setSaving(false);
    }
  };

  // Preview formatted data based on currently selected values
  const now = new Date();
  const sampleAmount = 75000;
  const currObj = SUPPORTED_CURRENCIES[selectedCurrency] || SUPPORTED_CURRENCIES.INR;
  const formattedPreviewCurrency =
    currObj.symbolPosition === 'prefix'
      ? `${currObj.symbol}${sampleAmount.toLocaleString()}`
      : `${sampleAmount.toLocaleString()} ${currObj.symbol}`;

  return (
    <View style={styles.container}>
      <Header
        title={loc.t('settings.title')}
        subtitle={loc.t('settings.subtitle')}
        showActions={false}
      />

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Success Banner */}
        {saveBanner && (
          <View style={styles.successBanner}>
            <CheckCircle2 size={18} color="#10B981" />
            <Text style={styles.successBannerText}>
              {loc.t('settings.saveSuccess')}
            </Text>
          </View>
        )}

        {/* Live Locale Preview Card */}
        <View style={styles.previewCard}>
          <View style={styles.previewHeader}>
            <View style={styles.iconCircle}>
              <Compass size={18} color={COLORS.primaryLight} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.previewTitle}>{loc.t('settings.localePreview')}</Text>
              <Text style={styles.previewSubtitle}>
                {loc.t('settings.previewDescription')}
              </Text>
            </View>
          </View>

          <View style={styles.previewGrid}>
            <View style={styles.previewMetric}>
              <Text style={styles.previewLabel}>Date & Time</Text>
              <Text style={styles.previewValue}>
                {loc.formatDate(now, 'full')}
              </Text>
            </View>
            <View style={styles.previewMetric}>
              <Text style={styles.previewLabel}>Currency Format</Text>
              <Text style={[styles.previewValue, { color: COLORS.accent }]}>
                {formattedPreviewCurrency}
              </Text>
            </View>
            <View style={styles.previewMetric}>
              <Text style={styles.previewLabel}>Active Timezone</Text>
              <Text style={styles.previewValue}>{selectedTimezone}</Text>
            </View>
            <View style={styles.previewMetric}>
              <Text style={styles.previewLabel}>Region Tag</Text>
              <Text style={styles.previewValue}>
                {selectedRegion ? `${selectedRegion}, ` : ''}{selectedCountry}
              </Text>
            </View>
          </View>
        </View>

        {/* Section 1: Display Language */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeaderRow}>
            <Globe size={18} color={COLORS.primaryLight} />
            <Text style={styles.sectionHeading}>{loc.t('settings.selectLanguage')}</Text>
          </View>
          <Text style={styles.sectionDesc}>
            Choose the language for application text, buttons, alerts, and navigation.
          </Text>

          <View style={styles.languageGrid}>
            {(Object.keys(LANGUAGES) as SupportedLanguageCode[]).map((code) => {
              const lang = LANGUAGES[code];
              const isSelected = selectedLang === code;
              return (
                <TouchableOpacity
                  key={code}
                  style={[
                    styles.langCard,
                    isSelected && styles.langCardSelected,
                  ]}
                  onPress={() => setSelectedLang(code)}
                  activeOpacity={0.8}
                >
                  <View style={styles.langTopRow}>
                    <Text style={styles.langFlag}>{lang.flag}</Text>
                    {isSelected && (
                      <View style={styles.selectedBadge}>
                        <Check size={12} color="#000" />
                      </View>
                    )}
                  </View>
                  <Text style={[styles.langNative, isSelected && styles.textSelected]}>
                    {lang.nativeName}
                  </Text>
                  <Text style={styles.langEnglish}>{lang.name}</Text>
                  {lang.direction === 'rtl' && (
                    <Badge label="RTL" variant="accent" size="sm" />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Section 2: Country & Territory */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeaderRow}>
            <MapPin size={18} color={COLORS.accent} />
            <Text style={styles.sectionHeading}>{loc.t('settings.selectCountry')}</Text>
          </View>
          <Text style={styles.sectionDesc}>
            Sets your default market, commercial regulations, and regional synergy clusters.
          </Text>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.countryScroll}>
            {SUPPORTED_COUNTRIES.map((country) => {
              const isSelected = selectedCountry === country.name;
              return (
                <TouchableOpacity
                  key={country.code}
                  style={[
                    styles.countryChip,
                    isSelected && styles.countryChipSelected,
                  ]}
                  onPress={() => handleCountrySelect(country)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.countryFlag}>{country.flag}</Text>
                  <Text style={[styles.countryChipText, isSelected && styles.textSelected]}>
                    {country.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Region / State Picker Chips */}
          <Text style={[styles.subFieldLabel, { marginTop: SPACING.md }]}>
            {loc.t('settings.selectRegion')}
          </Text>
          <View style={styles.regionChipContainer}>
            {currentCountryObj.regions.map((reg) => {
              const isSelected = selectedRegion === reg;
              return (
                <TouchableOpacity
                  key={reg}
                  style={[
                    styles.regionChip,
                    isSelected && styles.regionChipSelected,
                  ]}
                  onPress={() => setSelectedRegion(reg)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.regionChipText, isSelected && styles.textSelected]}>
                    {reg}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Section 3: Currency & Pricing */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeaderRow}>
            <Coins size={18} color="#FBBF24" />
            <Text style={styles.sectionHeading}>{loc.t('settings.selectCurrency')}</Text>
          </View>
          <Text style={styles.sectionDesc}>
            Preferred currency for opportunity budgets, CRM pipeline values, and B2B services.
          </Text>

          <View style={styles.currencyGrid}>
            {Object.keys(SUPPORTED_CURRENCIES).map((currKey) => {
              const curr = SUPPORTED_CURRENCIES[currKey];
              const isSelected = selectedCurrency === curr.code;
              return (
                <TouchableOpacity
                  key={curr.code}
                  style={[
                    styles.currencyCard,
                    isSelected && styles.currencyCardSelected,
                  ]}
                  onPress={() => setSelectedCurrency(curr.code)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.currencySymbol, isSelected && { color: COLORS.accent }]}>
                    {curr.symbol}
                  </Text>
                  <Text style={[styles.currencyCode, isSelected && styles.textSelected]}>
                    {curr.code}
                  </Text>
                  <Text style={styles.currencyName} numberOfLines={1}>
                    {curr.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Section 4: Timezone */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeaderRow}>
            <Clock size={18} color="#60A5FA" />
            <Text style={styles.sectionHeading}>{loc.t('settings.selectTimezone')}</Text>
          </View>
          <Text style={styles.sectionDesc}>
            Live stages, event schedules, and direct calls will be calibrated to this timezone.
          </Text>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.countryScroll}>
            {SUPPORTED_TIMEZONES.map((tz) => {
              const isSelected = selectedTimezone === tz;
              return (
                <TouchableOpacity
                  key={tz}
                  style={[
                    styles.timezoneChip,
                    isSelected && styles.timezoneChipSelected,
                  ]}
                  onPress={() => setSelectedTimezone(tz)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.timezoneChipText, isSelected && styles.textSelected]}>
                    {tz}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Section 5: Regional Privacy & Discovery Preferences */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeaderRow}>
            <Shield size={18} color={COLORS.primaryLight} />
            <Text style={styles.sectionHeading}>Regional Discovery & Privacy</Text>
          </View>

          <View style={styles.toggleRow}>
            <View style={{ flex: 1, paddingRight: SPACING.md }}>
              <Text style={styles.toggleTitle}>{loc.t('settings.regionalDiscovery')}</Text>
              <Text style={styles.toggleDesc}>{loc.t('settings.regionalDiscoveryDesc')}</Text>
            </View>
            <Switch
              value={allowRegional}
              onValueChange={setAllowRegional}
              trackColor={{ false: '#334155', true: COLORS.primaryLight }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={[styles.toggleRow, { borderBottomWidth: 0, marginTop: SPACING.sm }]}>
            <View style={{ flex: 1, paddingRight: SPACING.md }}>
              <Text style={styles.toggleTitle}>{loc.t('settings.publicLocation')}</Text>
              <Text style={styles.toggleDesc}>{loc.t('settings.publicLocationDesc')}</Text>
            </View>
            <Switch
              value={isLocationPublic}
              onValueChange={setIsLocationPublic}
              trackColor={{ false: '#334155', true: COLORS.primaryLight }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        {/* Save Changes Button */}
        <Button
          title={saving ? loc.t('settings.saving') : loc.t('common.save')}
          variant="primary"
          onPress={handleSave}
          disabled={saving}
          icon={saving ? <ActivityIndicator size="small" color="#000" /> : <Check size={18} color="#000" />}
          style={{ marginTop: SPACING.md, marginBottom: SPACING.xxl }}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgDark,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.md,
    paddingBottom: 60,
  },
  successBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderColor: 'rgba(16, 185, 129, 0.3)',
    borderWidth: 1,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    marginBottom: SPACING.md,
    gap: SPACING.sm,
  },
  successBannerText: {
    color: '#10B981',
    fontSize: 13,
    fontWeight: '600',
    flex: 1,
  },
  previewCard: {
    backgroundColor: 'rgba(30, 41, 59, 0.7)',
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderColor: 'rgba(139, 92, 246, 0.25)',
    borderWidth: 1,
    marginBottom: SPACING.md,
  },
  previewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewTitle: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: '700',
  },
  previewSubtitle: {
    color: COLORS.textDim,
    fontSize: 12,
    marginTop: 2,
  },
  previewGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  previewMetric: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    padding: SPACING.sm,
    borderRadius: RADIUS.sm,
  },
  previewLabel: {
    color: COLORS.textMuted,
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  previewValue: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: '600',
  },
  sectionCard: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderColor: COLORS.border,
    borderWidth: 1,
    marginBottom: SPACING.md,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: 4,
  },
  sectionHeading: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: '700',
  },
  sectionDesc: {
    color: COLORS.textDim,
    fontSize: 12,
    marginBottom: SPACING.md,
  },
  languageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  langCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    borderColor: COLORS.border,
    borderWidth: 1,
    borderRadius: RADIUS.md,
    padding: SPACING.sm,
  },
  langCardSelected: {
    borderColor: COLORS.primaryLight,
    backgroundColor: 'rgba(124, 58, 237, 0.15)',
  },
  langTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  langFlag: {
    fontSize: 18,
  },
  selectedBadge: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: COLORS.accent,
    justifyContent: 'center',
    alignItems: 'center',
  },
  langNative: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '700',
  },
  langEnglish: {
    color: COLORS.textMuted,
    fontSize: 11,
    marginTop: 2,
  },
  textSelected: {
    color: COLORS.primaryLight,
  },
  countryScroll: {
    flexDirection: 'row',
    marginBottom: SPACING.xs,
  },
  countryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    borderColor: COLORS.border,
    borderWidth: 1,
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    marginRight: SPACING.sm,
    gap: SPACING.xs,
  },
  countryChipSelected: {
    borderColor: COLORS.accent,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
  },
  countryFlag: {
    fontSize: 16,
  },
  countryChipText: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: '600',
  },
  subFieldLabel: {
    color: COLORS.textDim,
    fontSize: 12,
    fontWeight: '600',
    marginBottom: SPACING.xs,
  },
  regionChipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.xs,
  },
  regionChip: {
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    borderColor: COLORS.border,
    borderWidth: 1,
    borderRadius: RADIUS.sm,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 6,
  },
  regionChipSelected: {
    borderColor: COLORS.primaryLight,
    backgroundColor: 'rgba(124, 58, 237, 0.15)',
  },
  regionChipText: {
    color: COLORS.text,
    fontSize: 12,
    fontWeight: '500',
  },
  currencyGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.xs,
  },
  currencyCard: {
    width: '31%',
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    borderColor: COLORS.border,
    borderWidth: 1,
    borderRadius: RADIUS.md,
    padding: SPACING.sm,
    alignItems: 'center',
  },
  currencyCardSelected: {
    borderColor: '#FBBF24',
    backgroundColor: 'rgba(245, 158, 11, 0.12)',
  },
  currencySymbol: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 2,
  },
  currencyCode: {
    color: COLORS.text,
    fontSize: 12,
    fontWeight: '700',
  },
  currencyName: {
    color: COLORS.textMuted,
    fontSize: 10,
    marginTop: 2,
    textAlign: 'center',
  },
  timezoneChip: {
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    borderColor: COLORS.border,
    borderWidth: 1,
    borderRadius: RADIUS.sm,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    marginRight: SPACING.sm,
  },
  timezoneChipSelected: {
    borderColor: '#60A5FA',
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
  },
  timezoneChipText: {
    color: COLORS.text,
    fontSize: 12,
    fontWeight: '600',
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.sm,
    borderBottomColor: 'rgba(255, 255, 255, 0.06)',
    borderBottomWidth: 1,
  },
  toggleTitle: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: '600',
  },
  toggleDesc: {
    color: COLORS.textDim,
    fontSize: 11,
    marginTop: 2,
  },
});
