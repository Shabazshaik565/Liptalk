import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ViewStyle } from 'react-native';
import { COLORS, RADIUS, SPACING, SHADOWS } from '../../constants/theme';

export interface PillTabItem<T extends string = string> {
  id: T;
  label: string;
  count?: number;
  icon?: React.ReactNode;
}

interface PillTabsProps<T extends string = string> {
  tabs: PillTabItem<T>[];
  activeTab: T;
  onTabChange: (tabId: T) => void;
  scrollable?: boolean;
  style?: ViewStyle;
}

export function PillTabs<T extends string = string>({
  tabs,
  activeTab,
  onTabChange,
  scrollable = false,
  style,
}: PillTabsProps<T>) {
  const content = (
    <View style={[styles.container, !scrollable && styles.fixedContainer, style]}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <TouchableOpacity
            key={tab.id}
            style={[
              styles.pill,
              isActive && styles.pillActive,
              scrollable && styles.pillScrollable,
              scrollable && isActive && styles.pillScrollableActive,
            ]}
            onPress={() => onTabChange(tab.id)}
            activeOpacity={0.8}
          >
            {tab.icon && <View style={styles.icon}>{tab.icon}</View>}
            <Text style={[styles.label, isActive && styles.labelActive]}>
              {tab.label}
            </Text>
            {tab.count !== undefined && (
              <View style={[styles.countBadge, isActive && styles.countBadgeActive]}>
                <Text style={[styles.countText, isActive && styles.countTextActive]}>
                  {tab.count}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );

  if (scrollable) {
    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollWrapper}
      >
        {content}
      </ScrollView>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  scrollWrapper: {
    paddingVertical: 2,
    marginBottom: SPACING.md,
    gap: SPACING.xs,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  fixedContainer: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.lg,
    padding: 4,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.md,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: RADIUS.md,
    flex: 1,
  },
  pillScrollable: {
    flex: undefined,
    paddingHorizontal: 14,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.bgCard,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  pillScrollableActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primaryLight,
    ...SHADOWS.glowPrimary,
  },
  pillActive: {
    backgroundColor: COLORS.primary,
    ...SHADOWS.sm,
  },
  icon: {
    marginRight: 6,
  },
  label: {
    color: COLORS.textMuted,
    fontSize: 12,
    fontWeight: '700',
  },
  labelActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  countBadge: {
    backgroundColor: COLORS.bgElevated,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: RADIUS.full,
    marginLeft: 6,
  },
  countBadgeActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  countText: {
    color: COLORS.textSecondary,
    fontSize: 10,
    fontWeight: '800',
  },
  countTextActive: {
    color: '#FFFFFF',
  },
});
