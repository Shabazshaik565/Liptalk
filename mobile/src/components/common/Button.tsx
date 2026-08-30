import React, { useRef } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  View,
  Animated,
} from 'react-native';
import { COLORS, RADIUS, SPACING, SHADOWS } from '../../constants/theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'accent' | 'danger' | 'glass';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  style,
  textStyle,
  icon,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.96,
      useNativeDriver: false,
      speed: 40,
      bounciness: 4,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: false,
      speed: 40,
      bounciness: 4,
    }).start();
  };

  const getBackgroundColor = () => {
    if (disabled) return COLORS.disabledBg;
    switch (variant) {
      case 'primary':
        return COLORS.primary;
      case 'secondary':
        return COLORS.primaryDark;
      case 'accent':
        return COLORS.accent;
      case 'danger':
        return COLORS.danger;
      case 'glass':
        return 'rgba(34, 28, 66, 0.85)';
      case 'outline':
        return 'transparent';
      default:
        return COLORS.primary;
    }
  };

  const getTextColor = () => {
    if (disabled) return COLORS.disabledText;
    if (variant === 'accent') return '#000000';
    if (variant === 'outline') return COLORS.textPrimary;
    if (variant === 'glass') return COLORS.textSecondary;
    return '#FFFFFF';
  };

  const getHeight = () => {
    switch (size) {
      case 'sm':
        return 38;
      case 'lg':
        return 52;
      default:
        return 46;
    }
  };

  const isOutline = variant === 'outline';
  const isGlass = variant === 'glass';

  return (
    <Animated.View style={[{ transform: [{ scale: scaleAnim }] }, style]}>
      <TouchableOpacity
        style={[
          styles.base,
          {
            backgroundColor: getBackgroundColor(),
            height: getHeight(),
            borderWidth: isOutline || isGlass || disabled ? 1.2 : 0,
            borderColor: disabled
              ? COLORS.disabledBorder
              : isOutline
              ? COLORS.primaryLight
              : isGlass
              ? 'rgba(139, 92, 246, 0.35)'
              : 'transparent',
          },
          variant === 'primary' && !disabled ? SHADOWS.glowPrimary : null,
          variant === 'accent' && !disabled ? SHADOWS.glowAccent : null,
        ]}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
        activeOpacity={0.88}
      >
        {loading ? (
          <ActivityIndicator color={getTextColor()} size="small" />
        ) : (
          <View style={styles.contentRow}>
            {icon && <View style={styles.icon}>{icon}</View>}
            <Text
              style={[
                styles.text,
                {
                  color: getTextColor(),
                  fontSize: size === 'sm' ? 12.5 : size === 'lg' ? 15 : 13.5,
                  fontWeight: variant === 'accent' ? '900' : '800',
                },
                textStyle,
              ]}
            >
              {title}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.lg,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
  },
  icon: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    letterSpacing: 0.3,
  },
});
