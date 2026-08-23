import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Sparkles,
  UserPlus,
  Briefcase,
  TrendingUp,
  MessageSquare,
  ChevronRight,
  Bell,
  CheckCheck,
} from 'lucide-react-native';
import { NotificationItem } from '../src/types';
import { notificationsApi } from '../src/api/domain.api';
import { Header } from '../src/components/common/Header';
import { CardSkeleton } from '../src/components/common/SkeletonLoader';
import { EmptyState } from '../src/components/common/EmptyState';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../src/constants/theme';

export default function NotificationsScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [refreshing, setRefreshing] = React.useState(false);

  const { data: notifications = [], isLoading, refetch } = useQuery({
    queryKey: ['notifications'],
    queryFn: notificationsApi.getNotifications,
  });

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handleMarkAllRead = async () => {
    await notificationsApi.markAllAsRead();
    queryClient.invalidateQueries({ queryKey: ['notifications'] });
  };

  const handleItemPress = async (n: NotificationItem) => {
    if (!n.isRead) {
      await notificationsApi.markAsRead(n.id);
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    }
    router.push((n.deepLink as any) || '/(tabs)');
  };

  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'MATCH':
        return <Sparkles size={18} color={COLORS.accent} />;
      case 'OPP_INTEREST':
        return <Briefcase size={18} color={COLORS.primaryLight} />;
      case 'LEAD_STATUS':
        return <TrendingUp size={18} color={COLORS.warning} />;
      case 'MESSAGE':
        return <MessageSquare size={18} color={COLORS.primary} />;
      default:
        return <Bell size={18} color={COLORS.textPrimary} />;
    }
  };

  return (
    <View style={styles.container}>
      <Header
        title="NOTIFICATIONS"
        subtitle="ACTIVITY & OPPORTUNITY ALERTS"
        showBack
        onBack={() => router.back()}
        rightAction={
          <TouchableOpacity onPress={handleMarkAllRead} style={styles.markReadBtn} activeOpacity={0.7}>
            <CheckCheck size={14} color={COLORS.accent} />
            <Text style={styles.markReadText}>Read All</Text>
          </TouchableOpacity>
        }
      />

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.primary}
            colors={[COLORS.primary, COLORS.accent]}
          />
        }
      >
        {isLoading ? (
          <>
            <CardSkeleton />
            <CardSkeleton />
          </>
        ) : notifications.length > 0 ? (
          notifications.map((n) => (
            <TouchableOpacity
              key={n.id}
              style={[styles.card, !n.isRead && styles.cardUnread]}
              onPress={() => handleItemPress(n)}
              activeOpacity={0.82}
            >
              <View style={[styles.iconBox, !n.isRead && styles.iconBoxUnread]}>
                {getIcon(n.type)}
              </View>

              <View style={styles.contentCol}>
                <View style={styles.cardHeader}>
                  <Text style={[styles.title, !n.isRead && styles.titleUnread]}>
                    {n.title}
                  </Text>
                  <Text style={styles.time}>{n.createdAt}</Text>
                </View>
                <Text style={styles.body}>{n.body}</Text>
              </View>

              <ChevronRight size={16} color={COLORS.textDim} />
            </TouchableOpacity>
          ))
        ) : (
          <EmptyState
            icon={<Bell size={24} color={COLORS.primaryLight} />}
            title="All Caught Up!"
            description="You have no unread notifications or opportunity updates right now."
          />
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgDark,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.lg,
    gap: SPACING.sm,
    paddingBottom: SPACING.hero,
  },
  markReadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.bgCard,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  markReadText: {
    color: COLORS.accent,
    fontSize: 11,
    fontWeight: '800',
  },
  card: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.xl,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    ...SHADOWS.sm,
  },
  cardUnread: {
    borderColor: COLORS.primaryLight,
    backgroundColor: COLORS.bgElevated,
  },
  iconBox: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: COLORS.bgDark,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  iconBoxUnread: {
    backgroundColor: COLORS.purpleSoft,
    borderColor: 'rgba(139, 92, 246, 0.4)',
  },
  contentCol: {
    flex: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  title: {
    color: COLORS.textPrimary,
    fontSize: 13,
    fontWeight: '700',
    flex: 1,
    paddingRight: SPACING.xs,
  },
  titleUnread: {
    fontWeight: '900',
  },
  time: {
    color: COLORS.textDim,
    fontSize: 10,
    fontWeight: '600',
  },
  body: {
    color: COLORS.textSecondary,
    fontSize: 12,
    lineHeight: 16,
    marginTop: 2,
  },
});
