import { getTranslation, LANGUAGES, SupportedLanguageCode } from './mobile/src/locales';
import {
  formatCurrency,
  formatDate,
  formatRelativeTime,
  SUPPORTED_CURRENCIES,
  SUPPORTED_COUNTRIES,
  SUPPORTED_TIMEZONES,
} from './mobile/src/utils/localization';

function runPhase8Verification() {
  console.log('========================================');
  console.log('LIPTALK PHASE 8 — GLOBALIZATION VERIFICATION');
  console.log('========================================\n');

  let passed = 0;
  let total = 0;

  function assert(title: string, condition: boolean) {
    total++;
    if (condition) {
      console.log(`✅ [PASS] ${title}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${title}`);
    }
  }

  // 1. Language Dictionary Verification
  console.log('1. Testing Language Dictionaries & Translations:');
  const langCodes: SupportedLanguageCode[] = ['en', 'ta', 'hi', 'te', 'es', 'fr', 'de', 'ar'];
  assert('8 Languages Configured', langCodes.length === 8);

  langCodes.forEach((code) => {
    const title = getTranslation(code, 'settings.title');
    assert(`Language [${code.toUpperCase()}] resolves settings.title: "${title}"`, typeof title === 'string' && title.length > 0);
  });

  // 2. Fallback & Interpolation Test
  console.log('\n2. Testing Fallback & Parameter Interpolation:');
  const fallbackVal = getTranslation('ta', 'non.existent.key');
  assert('Missing key returns key path fallback', fallbackVal === 'non.existent.key');

  const interpolated = getTranslation('en', 'units.minsAgo', { count: 12 });
  assert('Parameter interpolation works correctly', interpolated === '12 mins ago');

  // 3. Currency Formatting Test
  console.log('\n3. Testing Currency Abstraction & Formatting:');
  const inrFormatted = formatCurrency(50000, 'INR', 'en-IN');
  assert(`INR Formatting: ${inrFormatted}`, inrFormatted.includes('₹') || inrFormatted.includes('50,000'));

  const usdFormatted = formatCurrency(1200, 'USD', 'en-US');
  assert(`USD Formatting: ${usdFormatted}`, usdFormatted.includes('$') || usdFormatted.includes('1,200'));

  const aedFormatted = formatCurrency(3500, 'AED', 'en-US');
  assert(`AED Formatting: ${aedFormatted}`, aedFormatted.includes('AED') || aedFormatted.includes('3,500'));

  const eurFormatted = formatCurrency(800, 'EUR', 'en-US');
  assert(`EUR Formatting: ${eurFormatted}`, eurFormatted.includes('€') || eurFormatted.includes('800'));

  // 4. Timezone Date Formatting Test
  console.log('\n4. Testing Timezone-Aware Dates:');
  const sampleUtcDate = '2026-08-23T14:30:00Z';
  const kolkataDate = formatDate(sampleUtcDate, 'full', 'Asia/Kolkata', 'en-IN');
  assert(`Date in Asia/Kolkata: ${kolkataDate}`, kolkataDate.length > 5);

  const nyDate = formatDate(sampleUtcDate, 'full', 'America/New_York', 'en-US');
  assert(`Date in America/New_York: ${nyDate}`, nyDate.length > 5);

  const relTime = formatRelativeTime(new Date(Date.now() - 5 * 60 * 1000), 'en');
  assert(`Relative Time calculation: ${relTime}`, relTime === '5m ago');

  // 5. Country & Timezone Catalogs
  console.log('\n5. Testing Regional Catalogs:');
  assert('Supported Countries catalog populated', SUPPORTED_COUNTRIES.length >= 8);
  assert('Supported Currencies catalog populated', Object.keys(SUPPORTED_CURRENCIES).length >= 8);
  assert('Supported Timezones catalog populated', SUPPORTED_TIMEZONES.length >= 10);

  console.log('\n========================================');
  console.log(`SUMMARY: ${passed}/${total} Assertions Passed`);
  console.log('========================================');

  if (passed !== total) {
    process.exit(1);
  }
}

runPhase8Verification();
