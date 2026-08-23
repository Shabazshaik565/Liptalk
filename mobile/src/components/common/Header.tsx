import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Bell, MessageSquare, ArrowLeft } from 'lucide-react-native';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../../constants/theme';
import { useAuthStore } from '../../store/auth.store';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  showActions?: boolean;
  showBack?: boolean;
  onBack?: () => void;
  rightAction?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  showActions = true,
  showBack = false,
  onBack,
  rightAction,
}) => {
  const router = useRouter();
  const isHome = !title || title === 'LIP TALK';

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.leftSection}>
          {showBack ? (
            <TouchableOpacity
              style={styles.iconButton}
              onPress={onBack || (() => router.back())}
              activeOpacity={0.7}
            >
              <ArrowLeft color={COLORS.textPrimary} size={20} />
            </TouchableOpacity>
          ) : isHome ? (
            <View style={styles.brandRow}>
              <Image
                source={require('../../../assets/logo.png')}
                style={styles.fullBrandLogo}
                resizeMode="contain"
              />
            </View>
          ) : (
            <View style={styles.pageTitleGroup}>
              <Text style={styles.title} numberOfLines={1}>
                {title}
              </Text>
              <Text style={styles.subtitle}>
                {subtitle || 'CONNECT • PROMOTE • GROW'}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.rightSection}>
          {rightAction}

          {showActions && (
            <>
              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => router.push('/chat' as any)}
                activeOpacity={0.7}
              >
                <MessageSquare color={COLORS.purpleLight} size={18} />
                <View style={styles.badgeDot}>
                  <Text style={styles.badgeDotText}>1</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => router.push('/notifications' as any)}
                activeOpacity={0.7}
              >
                <Bell color={COLORS.purpleLight} size={18} />
                <View style={styles.notificationDot} />
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: COLORS.bgDark,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    minHeight: 58,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    flex: 1,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fullBrandLogo: {
    width: 140,
    height: 42,
  },
  pageTitleGroup: {
    flex: 1,
  },
  title: {
    color: COLORS.textPrimary,
    fontSize: 17,
    fontWeight: '900',
    letterSpacing: 0.3,
  },
  subtitle: {
    color: COLORS.primaryLight,
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 1,
    marginTop: 1,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.bgCard,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    position: 'relative',
    ...SHADOWS.sm,
  },
  notificationDot: {
    position: 'absolute',
    top: 9,
    right: 9,
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: COLORS.accent,
  },
  badgeDot: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: COLORS.primary,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  badgeDotText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '900',
  },
});
