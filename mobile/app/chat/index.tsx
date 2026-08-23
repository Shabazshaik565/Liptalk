import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { MessageSquare, Sparkles, Briefcase, ChevronRight } from 'lucide-react-native';
import { chatApi } from '../../src/api/domain.api';
import { Header } from '../../src/components/common/Header';
import { Badge } from '../../src/components/common/Badge';
import { EmptyState } from '../../src/components/common/EmptyState';
import { CardSkeleton } from '../../src/components/common/SkeletonLoader';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../../src/constants/theme';

export default function ChatListScreen() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);

  const { data: conversations = [], isLoading, refetch } = useQuery({
    queryKey: ['conversations'],
    queryFn: () => chatApi.getConversations(),
  });

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  return (
    <View style={styles.container}>
      <Header
        title="MESSAGES & INQUIRIES"
        subtitle="CONTEXTUAL BUSINESS CONVERSATIONS"
        showBack
        onBack={() => router.back()}
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
        <View style={styles.banner}>
          <Text style={styles.bannerTitle}>Contextual Opportunity Threads</Text>
          <Text style={styles.bannerSub}>
            Every conversation is anchored to its original Need, Offer, or Opportunity so you always know why you connected.
          </Text>
        </View>

        {isLoading ? (
          <>
            <CardSkeleton />
            <CardSkeleton />
          </>
        ) : conversations && conversations.length > 0 ? (
          <View style={styles.list}>
            {conversations.map((conv) => (
              <TouchableOpacity
                key={conv.id}
                style={styles.convCard}
                onPress={() => router.push(`/chat/${conv.id}` as any)}
                activeOpacity={0.82}
              >
                {/* Context Tag Header */}
                <View style={styles.contextBadge}>
                  {conv.contextType === 'NEED_OFFER_MATCH' ? (
                    <Sparkles size={12} color={COLORS.accent} />
                  ) : (
                    <Briefcase size={12} color={COLORS.primaryLight} />
                  )}
                  <Text style={styles.contextText} numberOfLines={1}>
                    RE: {conv.contextTitle}
                  </Text>
                </View>

                {/* Main Card Row */}
                <View style={styles.cardMain}>
                  <View style={styles.avatarWrapper}>
                    <Image
                      source={{
                        uri:
                          conv.otherParticipant.avatarUrl ||
                          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
                      }}
                      style={styles.avatar}
                    />
                    {conv.otherParticipant.role === 'BUSINESS' && (
                      <View style={styles.bizDot} />
                    )}
                  </View>

                  <View style={styles.textCol}>
                    <View style={styles.topRow}>
                      <Text style={styles.name} numberOfLines={1}>
                        {conv.otherParticipant.name}
                      </Text>
                      {conv.lastMessage && (
                        <Text style={styles.timestamp}>
                          {new Date(conv.lastMessage.createdAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </Text>
                      )}
                    </View>

                    {conv.lastMessage ? (
                      <Text style={styles.lastMsg} numberOfLines={1}>
                        {conv.lastMessage.text}
                      </Text>
                    ) : (
                      <Text style={styles.lastMsgEmpty}>No messages yet</Text>
                    )}
                  </View>

                  {conv.unreadCount > 0 && (
                    <View style={styles.unreadBadge}>
                      <Text style={styles.unreadCount}>{conv.unreadCount}</Text>
                    </View>
                  )}

                  <ChevronRight size={16} color={COLORS.textDim} />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <EmptyState
            icon={<MessageSquare size={24} color={COLORS.primaryLight} />}
            title="No Active Conversations"
            description="Start connecting with verified matches from the Discover tab to launch contextual discussions."
            actionTitle="Discover Matches"
            onAction={() => router.push('/(tabs)' as any)}
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
    paddingBottom: SPACING.hero,
  },
  banner: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
  },
  bannerTitle: {
    color: COLORS.textPrimary,
    fontSize: 15,
    fontWeight: '800',
  },
  bannerSub: {
    color: COLORS.textMuted,
    fontSize: 12,
    marginTop: 2,
    lineHeight: 16,
  },
  list: {
    gap: SPACING.sm,
  },
  convCard: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.xl,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
  },
  contextBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.bgInput,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: RADIUS.sm,
    marginBottom: SPACING.xs,
    alignSelf: 'flex-start',
  },
  contextText: {
    color: COLORS.primaryLight,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  cardMain: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  avatarWrapper: {
    position: 'relative',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.bgElevated,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  bizDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.accent,
    borderWidth: 2,
    borderColor: COLORS.bgCard,
  },
  textCol: {
    flex: 1,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  name: {
    color: COLORS.textPrimary,
    fontSize: 14,
    fontWeight: '800',
    flex: 1,
    paddingRight: SPACING.xs,
  },
  timestamp: {
    color: COLORS.textDim,
    fontSize: 10,
    fontWeight: '500',
  },
  lastMsg: {
    color: COLORS.textSecondary,
    fontSize: 12,
    lineHeight: 16,
  },
  lastMsgEmpty: {
    color: COLORS.textDim,
    fontSize: 12,
    fontStyle: 'italic',
  },
  unreadBadge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unreadCount: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '800',
  },
});
