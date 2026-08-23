import React from 'react';
import { View, StyleSheet, ViewStyle, TouchableOpacity } from 'react-native';
import { COLORS, RADIUS, SPACING, SHADOWS } from '../../constants/theme';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
  variant?: 'default' | 'elevated' | 'glow' | 'accentGlow' | 'interactive';
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  onPress,
  variant = 'default',
}) => {
  const cardStyle = [
    styles.card,
    variant === 'elevated' && styles.elevated,
    variant === 'glow' && styles.glow,
    variant === 'accentGlow' && styles.accentGlow,
    variant === 'interactive' && styles.interactive,
    style,
  ];

  if (onPress) {
    return (
      <TouchableOpacity
        style={cardStyle}
        onPress={onPress}
        activeOpacity={0.82}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={cardStyle}>{children}</View>;
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.md,
    ...SHADOWS.sm,
  },
  elevated: {
    backgroundColor: COLORS.bgElevated,
    borderColor: COLORS.borderLight,
    ...SHADOWS.md,
  },
  glow: {
    borderColor: 'rgba(99, 102, 241, 0.4)',
    ...SHADOWS.glow,
  },
  accentGlow: {
    borderColor: 'rgba(16, 185, 129, 0.4)',
    ...SHADOWS.glowAccent,
  },
  interactive: {
    backgroundColor: COLORS.bgCard,
    borderColor: COLORS.borderLight,
  },
});
