import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { COLORS, RADIUS, SPACING } from '../../constants/theme';

interface BadgeProps {
  label: string;
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'neutral' | 'accent' | 'purple';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'primary',
  size = 'md',
  icon,
  style,
  textStyle,
}) => {
  const getColors = () => {
    switch (variant) {
      case 'success':
      case 'accent':
        return { bg: 'rgba(16, 185, 129, 0.12)', text: '#34D399', border: 'rgba(16, 185, 129, 0.35)' };
      case 'warning':
        return { bg: 'rgba(245, 158, 11, 0.12)', text: '#FBBF24', border: 'rgba(245, 158, 11, 0.35)' };
      case 'danger':
        return { bg: 'rgba(239, 68, 68, 0.12)', text: '#F87171', border: 'rgba(239, 68, 68, 0.35)' };
      case 'purple':
      case 'primary':
        return { bg: 'rgba(139, 92, 246, 0.15)', text: '#C4B5FD', border: 'rgba(139, 92, 246, 0.40)' };
      case 'neutral':
      default:
        return { bg: '#221C42', text: '#E2E8F0', border: '#3B3366' };
    }
  };

  const colors = getColors();

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: colors.bg,
          borderColor: colors.border,
          paddingVertical: size === 'sm' ? 2.5 : size === 'lg' ? 6 : 4,
          paddingHorizontal: size === 'sm' ? 8 : size === 'lg' ? 12 : 10,
        },
        style,
      ]}
    >
      {icon && <View style={styles.iconBox}>{icon}</View>}
      <Text
        style={[
          styles.text,
          {
            color: colors.text,
            fontSize: size === 'sm' ? 10 : size === 'lg' ? 13 : 11,
          },
          textStyle,
        ]}
      >
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    borderRadius: RADIUS.full,
    borderWidth: 1,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  iconBox: {
    marginRight: 2,
  },
  text: {
    fontWeight: '800',
    letterSpacing: 0.3,
  },
});
