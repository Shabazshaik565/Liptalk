import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { COLORS, SPACING, RADIUS } from '../../constants/theme';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  actionText?: string;
  onAction?: () => void;
  badgeCount?: number;
  style?: ViewStyle;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  icon,
  actionText,
  onAction,
  badgeCount,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.titleArea}>
        <View style={styles.titleRow}>
          {icon && <View style={styles.iconBox}>{icon}</View>}
          <Text style={styles.title}>{title}</Text>
          {badgeCount !== undefined && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{badgeCount}</Text>
            </View>
          )}
        </View>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>

      {actionText && onAction && (
        <TouchableOpacity style={styles.actionBtn} onPress={onAction} activeOpacity={0.75}>
          <Text style={styles.actionText}>{actionText}</Text>
          <ChevronRight size={14} color={COLORS.primaryLight} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: SPACING.md,
    marginTop: SPACING.sm,
  },
  titleArea: {
    flex: 1,
    paddingRight: SPACING.sm,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  iconBox: {
    marginRight: 2,
  },
  title: {
    color: COLORS.textPrimary,
    fontSize: 16.5,
    fontWeight: '900',
    letterSpacing: 0.2,
  },
  subtitle: {
    color: COLORS.textMuted,
    fontSize: 12,
    marginTop: 2,
    lineHeight: 16,
  },
  badge: {
    backgroundColor: COLORS.bgElevated,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  badgeText: {
    color: COLORS.purpleLight,
    fontSize: 10,
    fontWeight: '800',
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingVertical: 2,
  },
  actionText: {
    color: COLORS.primaryLight,
    fontSize: 13,
    fontWeight: '800',
  },
});
