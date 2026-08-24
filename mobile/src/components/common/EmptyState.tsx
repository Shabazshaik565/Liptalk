import React from 'react';
import { View, Text, StyleSheet, ViewStyle, Image } from 'react-native';
import { COLORS, RADIUS, SPACING, SHADOWS } from '../../constants/theme';
import { Button } from './Button';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionTitle?: string;
  onAction?: () => void;
  actionIcon?: React.ReactNode;
  showMascot?: boolean;
  style?: ViewStyle;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionTitle,
  onAction,
  actionIcon,
  showMascot = true,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      {showMascot ? (
        <View style={styles.mascotWrapper}>
          <Image
            source={require('../../../assets/mascot/mascot_default.png')}
            style={styles.mascotImage}
            resizeMode="contain"
          />
        </View>
      ) : icon ? (
        <View style={styles.iconCircle}>{icon}</View>
      ) : null}
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      {actionTitle && onAction && (
        <Button
          title={actionTitle}
          variant="primary"
          size="sm"
          icon={actionIcon}
          onPress={onAction}
          style={styles.actionBtn}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.xl,
    paddingVertical: SPACING.xxl,
    paddingHorizontal: SPACING.xl,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    marginVertical: SPACING.md,
    ...SHADOWS.sm,
  },
  mascotWrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(139, 92, 246, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.25)',
  },
  mascotImage: {
    width: 64,
    height: 64,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.purpleSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.35)',
  },
  title: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: SPACING.xs,
  },
  description: {
    color: COLORS.textMuted,
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'center',
    maxWidth: 280,
    marginBottom: SPACING.lg,
  },
  actionBtn: {
    minWidth: 140,
  },
});
