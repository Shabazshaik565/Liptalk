export const COLORS = {
  // Brand Accents (LipTalk Purple Professional System)
  primary: '#8B5CF6',         // Vibrant Electric Purple (Action & Primary)
  primaryDark: '#6D28D9',     // Deep Royal Purple
  primaryLight: '#A78BFA',    // Soft Highlight Purple
  primaryGlow: 'rgba(139, 92, 246, 0.22)',
  purpleSoft: 'rgba(139, 92, 246, 0.12)',
  purpleLight: '#EDE9FE',     // Light Crisp Lavender / Tint

  // Hero & Brand Gradient Anchors
  hero: '#7C3AED',            // Hero Radiant Violet
  heroDark: '#5B21B6',        // Deep Canvas Violet
  heroLight: '#C4B5FD',

  // Secondary Accents & Match Indicators
  secondary: '#A855F7',       // Expressive Violet
  secondaryDark: '#7E22CE',
  secondaryLight: '#C084FC',

  // Growth, Synergy Match & Success (Emerald)
  accent: '#10B981',          // Emerald Match & Value Indicator
  accentDark: '#047857',
  accentLight: '#34D399',
  accentGlow: 'rgba(16, 185, 129, 0.20)',
  accentSoft: 'rgba(16, 185, 129, 0.12)',

  // Status & Tier Indicators
  success: '#10B981',
  successSoft: 'rgba(16, 185, 129, 0.14)',
  warning: '#F59E0B',
  warningGlow: 'rgba(245, 158, 11, 0.18)',
  warningSoft: 'rgba(245, 158, 11, 0.12)',
  danger: '#EF4444',
  dangerGlow: 'rgba(239, 68, 68, 0.20)',
  dangerSoft: 'rgba(239, 68, 68, 0.12)',
  info: '#38BDF8',
  infoSoft: 'rgba(56, 189, 248, 0.12)',

  // Match Tiers
  matchHigh: '#10B981',       // 85-100% High Confidence Match
  matchMed: '#F59E0B',        // 70-84% Moderate Synergy
  matchLow: '#8B5CF6',        // <70% Potential Synergy

  // Surfaces & Backgrounds (Purple Obsidian System)
  bgDark: '#0D0B18',          // Deep Canvas Background
  bgCanvas: '#0D0B18',        // Alias for Canvas
  bgCard: '#161329',          // Primary Card Surface
  bgCardHover: '#1E1938',     // Active / Hovered Card Surface
  bgElevated: '#221C42',      // Elevated Elements & Modals
  bgInput: '#181430',         // Form Input Fields
  bgGlass: 'rgba(22, 19, 41, 0.92)',
  bgGlassBorder: 'rgba(139, 92, 246, 0.18)',
  bgGlassLight: 'rgba(255, 255, 255, 0.05)',

  // Borders & Dividers
  border: '#2A244D',          // Primary Purple Border
  borderLight: '#3B3366',     // Lighter Divider Border
  borderActive: '#8B5CF6',    // Active Focus Purple Border
  borderSuccess: '#10B981',   // Match Verified Border
  borderMuted: 'rgba(255, 255, 255, 0.08)',

  // Typography
  text: '#F9FAFB',            // Standard Text
  textPrimary: '#F9FAFB',     // 98% Pure Crisp White
  textSecondary: '#E2E8F0',   // 88% Soft High-Readability Light Grey
  textMuted: '#94A3B8',       // Subtitles, Notes & Secondary Captions
  textDim: '#71717A',         // Metadata Timestamps & Hints
  textPurple: '#C4B5FD',      // Accent Subtitle Text
  textInverse: '#0D0B18',     // Dark Contrast on Bright Buttons

  // Disabled States
  disabledBg: '#1C1833',
  disabledText: '#524B70',
  disabledBorder: '#282245',

  // Gradients (RGB/Hex tuples for components & overlays)
  gradientPrimary: ['#8B5CF6', '#6D28D9'] as const,
  gradientHero: ['#7C3AED', '#4C1D95'] as const,
  gradientCard: ['#1E1938', '#161329'] as const,
  gradientGrowth: ['#10B981', '#047857'] as const,
  gradientPurpleGlow: ['#8B5CF6', '#10B981'] as const,
  gradientDarkGlass: ['rgba(34, 28, 66, 0.95)', 'rgba(22, 19, 41, 0.98)'] as const,
};

export const SPACING = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  hero: 40,
  tabBarClearance: 110,
};

export const RADIUS = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 22,
  xxl: 28,
  full: 9999,
};

export const SHADOWS = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.45,
    shadowRadius: 10,
    elevation: 5,
  },
  glowPurple: {
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
  glowPrimary: {
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
  glowEmerald: {
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.30,
    shadowRadius: 12,
    elevation: 6,
  },
  glowAccent: {
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.30,
    shadowRadius: 12,
    elevation: 6,
  },
  glow: {
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.30,
    shadowRadius: 10,
    elevation: 5,
  },
};
