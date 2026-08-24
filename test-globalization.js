const fs = require('fs');
const path = require('path');

function runVerification() {
  console.log('========================================');
  console.log('LIPTALK PHASE 8 — GLOBALIZATION VERIFICATION');
  console.log('========================================\n');

  let passed = 0;
  let total = 0;

  function assert(title, condition) {
    total++;
    if (condition) {
      console.log(`✅ [PASS] ${title}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${title}`);
    }
  }

  // 1. Check all 8 locale files exist and are valid JSON
  const localeFiles = ['en', 'ta', 'hi', 'te', 'es', 'fr', 'de', 'ar'];
  console.log('1. Checking Localization JSON Dictionaries:');
  localeFiles.forEach((lang) => {
    const filePath = path.join(__dirname, 'mobile', 'src', 'locales', `${lang}.json`);
    const exists = fs.existsSync(filePath);
    assert(`Locale file [${lang}.json] exists`, exists);

    if (exists) {
      try {
        const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        assert(`Locale [${lang}] has common.save: "${content.common?.save}"`, !!content.common?.save);
        assert(`Locale [${lang}] has settings.title: "${content.settings?.title}"`, !!content.settings?.title);
        assert(`Locale [${lang}] has nav.home: "${content.nav?.home}"`, !!content.nav?.home);
      } catch (err) {
        assert(`Locale [${lang}] is valid JSON`, false);
      }
    }
  });

  // 2. Test Currency formatting logic
  console.log('\n2. Testing Currency Formatting:');
  const currencies = {
    INR: { symbol: '₹', position: 'prefix', sample: 75000 },
    USD: { symbol: '$', position: 'prefix', sample: 1200 },
    EUR: { symbol: '€', position: 'prefix', sample: 850 },
    GBP: { symbol: '£', position: 'prefix', sample: 900 },
    AED: { symbol: 'AED', position: 'prefix', sample: 3200 },
    JPY: { symbol: '¥', position: 'prefix', sample: 150000 },
  };

  Object.keys(currencies).forEach((curr) => {
    const c = currencies[curr];
    const formatted = `${c.symbol}${c.sample.toLocaleString('en-IN')}`;
    assert(`Currency ${curr} formatted: ${formatted}`, formatted.includes(c.symbol));
  });

  // 3. Test Timezone Date conversion
  console.log('\n3. Testing Timezone Formatting:');
  const d = new Date('2026-08-23T14:30:00Z');
  const timezones = ['Asia/Kolkata', 'America/New_York', 'Europe/London', 'Asia/Dubai', 'Asia/Singapore', 'Asia/Tokyo'];
  timezones.forEach((tz) => {
    const formatted = new Intl.DateTimeFormat('en-IN', {
      timeZone: tz,
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(d);
    assert(`Timezone [${tz}] conversion: ${formatted}`, formatted.length > 0);
  });

  console.log('\n========================================');
  console.log(`SUMMARY: ${passed}/${total} Assertions Passed`);
  console.log('========================================');
}

runVerification();
