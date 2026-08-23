import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import {
  Users,
  Mic,
  MicOff,
  Hand,
  Send,
  Sparkles,
  PhoneOff,
  ShieldCheck,
  Crown,
  ChevronLeft,
} from 'lucide-react-native';
import { socketService } from '../../src/services/socket.service';
import { liveRoomsApi } from '../../src/api/domain.api';
import { LiveRoomMessageItem } from '../../src/types';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../../src/constants/theme';

export default function LiveRoomScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const roomId = id || 'room_01';

  const { data: room } = useQuery({
    queryKey: ['live-room', roomId],
    queryFn: () => liveRoomsApi.getRoomById(roomId),
  });

  const [messages, setMessages] = useState<LiveRoomMessageItem[]>([
    {
      id: 'm1',
      roomId,
      senderId: 'usr_vikram_01',
      senderName: 'Vikram Singh',
      senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
      text: 'Great point on SQLite indexing for high-frequency writes! 🙌',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'm2',
      roomId,
      senderId: 'usr_priya_01',
      senderName: 'Priya Sharma',
      senderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
      text: 'How do you handle schema migrations seamlessly without locking user tables?',
      createdAt: new Date().toISOString(),
    },
  ]);

  const [chatText, setChatText] = useState('');
  const [isHandRaised, setIsHandRaised] = useState(false);
  const [activeReaction, setActiveReaction] = useState<string | null>(null);
  const [audienceCount, setAudienceCount] = useState(room?.audienceCount || 38);
  const chatScrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    // Join live room socket channel
    socketService.joinLiveRoom({
      roomId,
      userId: 'usr_curr_01',
      userName: 'Alex Morgan',
      userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
    });

    socketService.onLiveRoomMessage((newMsg) => {
      if (newMsg) {
        setMessages((prev) => [...prev, newMsg]);
        setTimeout(() => chatScrollRef.current?.scrollToEnd({ animated: true }), 100);
      }
    });

    socketService.onLiveRoomReaction((data) => {
      if (data?.reaction) {
        setActiveReaction(data.reaction);
        setTimeout(() => setActiveReaction(null), 2000);
      }
    });

    socketService.onLiveRoomUserJoined(() => {
      setAudienceCount((prev) => prev + 1);
    });

    socketService.onLiveRoomUserLeft(() => {
      setAudienceCount((prev) => Math.max(1, prev - 1));
    });

    return () => {
      socketService.leaveLiveRoom({
        roomId,
        userId: 'usr_curr_01',
        userName: 'Alex Morgan',
      });
    };
  }, [roomId]);

  const handleSendMessage = () => {
    if (!chatText.trim()) return;
    const newMsg: LiveRoomMessageItem = {
      id: 'msg_' + Date.now(),
      roomId,
      senderId: 'usr_curr_01',
      senderName: 'Alex Morgan',
      senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
      text: chatText.trim(),
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, newMsg]);
    socketService.sendLiveRoomMessage({
      roomId,
      senderId: 'usr_curr_01',
      text: chatText.trim(),
    });
    setChatText('');
    setTimeout(() => chatScrollRef.current?.scrollToEnd({ animated: true }), 100);
  };

  const handleReaction = (emoji: string) => {
    setActiveReaction(emoji);
    socketService.sendLiveRoomReaction({
      roomId,
      reaction: emoji,
      userId: 'usr_curr_01',
    });
    setTimeout(() => setActiveReaction(null), 2000);
  };

  const handleRaiseHand = () => {
    setIsHandRaised(!isHandRaised);
    socketService.raiseHandLiveRoom({
      roomId,
      userId: 'usr_curr_01',
      userName: 'Alex Morgan',
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Top Room Header */}
        <View style={styles.topHeader}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => router.back()}
            activeOpacity={0.8}
          >
            <ChevronLeft size={20} color="#FFF" />
          </TouchableOpacity>

          <View style={styles.roomHeaderCenter}>
            <View style={styles.liveBadge}>
              <View style={styles.liveDot} />
              <Text style={styles.liveBadgeText}>LIVE STAGE</Text>
            </View>
            <Text style={styles.roomHeaderTitle} numberOfLines={1}>
              {room?.title || 'Bangalore CTOs: High-Concurrency WebSockets'}
            </Text>
          </View>

          <View style={styles.listenersWrap}>
            <Users size={13} color={COLORS.accent} />
            <Text style={styles.listenersText}>{audienceCount}</Text>
          </View>
        </View>

        {/* Floating Emoji Reaction Bubble */}
        {activeReaction && (
          <View style={styles.floatingReactionBubble}>
            <Text style={styles.floatingReactionText}>{activeReaction}</Text>
          </View>
        )}

        {/* Speaker Stage Tile */}
        <View style={styles.speakerStage}>
          <Image
            source={{
              uri:
                room?.host?.profile?.avatarUrl ||
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
            }}
            style={styles.speakerAvatar}
          />
          <View style={styles.speakerSpeakingRing} />

          <View style={styles.speakerLabelCard}>
            <View style={styles.speakerNameRow}>
              <Crown size={12} color="#FBBF24" />
              <Text style={styles.speakerName}>
                {room?.host?.profile?.fullName || 'Alex Morgan'} (Host)
              </Text>
            </View>
            <Text style={styles.speakerRole}>Nexas Digital Solutions • Keynote Speaker</Text>
          </View>
        </View>

        {/* Audience Listeners Strip */}
        <View style={styles.audienceStrip}>
          <Text style={styles.audienceHeading}>STAGE LISTENERS & PEERS ({audienceCount})</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.audienceScroll}>
            {[
              { id: '1', name: 'Vikram', uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100' },
              { id: '2', name: 'Priya', uri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100' },
              { id: '3', name: 'Rahul', uri: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100' },
              { id: '4', name: 'Ananya', uri: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100' },
              { id: '5', name: 'Dev', uri: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100' },
            ].map((user) => (
              <View key={user.id} style={styles.listenerItem}>
                <Image source={{ uri: user.uri }} style={styles.listenerAvatar} />
                <Text style={styles.listenerName} numberOfLines={1}>{user.name}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Live Chat Stream */}
        <View style={styles.chatSection}>
          <Text style={styles.chatHeading}>LIVE CHAT & Q&A</Text>
          <ScrollView
            ref={chatScrollRef}
            style={styles.chatScroll}
            contentContainerStyle={styles.chatScrollContent}
            showsVerticalScrollIndicator={false}
          >
            {messages.map((msg) => (
              <View key={msg.id} style={styles.chatMessageRow}>
                <Image
                  source={{
                    uri:
                      msg.senderAvatar ||
                      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80',
                  }}
                  style={styles.chatAvatar}
                />
                <View style={styles.chatBubble}>
                  <Text style={styles.chatSenderName}>{msg.senderName}</Text>
                  <Text style={styles.chatMessageText}>{msg.text}</Text>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Quick Reactions Bar */}
        <View style={styles.reactionsBar}>
          {['👏', '🔥', '💡', '🚀', '❤️'].map((emoji) => (
            <TouchableOpacity
              key={emoji}
              style={styles.reactionBtn}
              onPress={() => handleReaction(emoji)}
              activeOpacity={0.7}
            >
              <Text style={styles.reactionEmoji}>{emoji}</Text>
            </TouchableOpacity>
          ))}

          <TouchableOpacity
            style={[styles.raiseHandBtn, isHandRaised && styles.raiseHandBtnActive]}
            onPress={handleRaiseHand}
            activeOpacity={0.8}
          >
            <Hand size={16} color={isHandRaised ? '#FFF' : COLORS.primaryLight} />
            <Text style={[styles.raiseHandText, isHandRaised && { color: '#FFF' }]}>
              {isHandRaised ? 'Hand Raised' : 'Raise Hand'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Input Bar */}
        <View style={styles.inputBar}>
          <TextInput
            style={styles.input}
            value={chatText}
            onChangeText={setChatText}
            placeholder="Ask speaker a question or drop a note..."
            placeholderTextColor={COLORS.textDim}
          />
          <TouchableOpacity
            style={[styles.sendBtn, !chatText.trim() && styles.sendBtnDisabled]}
            onPress={handleSendMessage}
            disabled={!chatText.trim()}
          >
            <Send size={16} color={!chatText.trim() ? COLORS.textDim : '#FFF'} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#090514',
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.bgCard,
    alignItems: 'center',
    justifyContent: 'center',
  },
  roomHeaderCenter: {
    flex: 1,
    marginHorizontal: SPACING.md,
    alignItems: 'center',
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: RADIUS.full,
    marginBottom: 2,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.danger,
  },
  liveBadgeText: {
    color: COLORS.danger,
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  roomHeaderTitle: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '700',
  },
  listenersWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
  },
  listenersText: {
    color: COLORS.accent,
    fontSize: 11,
    fontWeight: '800',
  },
  floatingReactionBubble: {
    position: 'absolute',
    top: '30%',
    alignSelf: 'center',
    backgroundColor: 'rgba(124, 58, 237, 0.85)',
    width: 70,
    height: 70,
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
    ...SHADOWS.glowPrimary,
  },
  floatingReactionText: {
    fontSize: 36,
  },
  speakerStage: {
    alignItems: 'center',
    paddingVertical: SPACING.lg,
    backgroundColor: 'rgba(23, 15, 41, 0.6)',
    position: 'relative',
  },
  speakerAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: COLORS.primaryLight,
  },
  speakerSpeakingRing: {
    position: 'absolute',
    top: SPACING.lg - 6,
    width: 112,
    height: 112,
    borderRadius: 56,
    borderWidth: 2,
    borderColor: 'rgba(16, 185, 129, 0.5)',
  },
  speakerLabelCard: {
    marginTop: SPACING.md,
    alignItems: 'center',
  },
  speakerNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  speakerName: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '800',
  },
  speakerRole: {
    color: COLORS.textDim,
    fontSize: 11,
    marginTop: 2,
  },
  audienceStrip: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  audienceHeading: {
    color: COLORS.primaryLight,
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginBottom: SPACING.xs,
  },
  audienceScroll: {
    flexDirection: 'row',
  },
  listenerItem: {
    alignItems: 'center',
    marginRight: SPACING.md,
    width: 44,
  },
  listenerAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    marginBottom: 2,
  },
  listenerName: {
    color: COLORS.textDim,
    fontSize: 9.5,
    textAlign: 'center',
  },
  chatSection: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.sm,
  },
  chatHeading: {
    color: COLORS.textDim,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  chatScroll: {
    flex: 1,
  },
  chatScrollContent: {
    gap: SPACING.xs,
    paddingBottom: SPACING.sm,
  },
  chatMessageRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.xs,
  },
  chatAvatar: {
    width: 26,
    height: 26,
    borderRadius: 13,
    marginTop: 2,
  },
  chatBubble: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.md,
    paddingHorizontal: 10,
    paddingVertical: 6,
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  chatSenderName: {
    color: COLORS.primaryLight,
    fontSize: 10.5,
    fontWeight: '800',
    marginBottom: 2,
  },
  chatMessageText: {
    color: COLORS.textPrimary,
    fontSize: 12.5,
    lineHeight: 17,
  },
  reactionsBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: 6,
    backgroundColor: COLORS.bgCard,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    gap: SPACING.xs,
  },
  reactionBtn: {
    padding: 6,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.bgDark,
  },
  reactionEmoji: {
    fontSize: 16,
  },
  raiseHandBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginLeft: 'auto',
    backgroundColor: COLORS.bgDark,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.primaryLight,
  },
  raiseHandBtnActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primaryLight,
  },
  raiseHandText: {
    color: COLORS.primaryLight,
    fontSize: 11,
    fontWeight: '800',
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.bgDark,
    gap: SPACING.sm,
  },
  input: {
    flex: 1,
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.md,
    paddingVertical: 8,
    color: '#FFF',
    fontSize: 13,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  sendBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnDisabled: {
    backgroundColor: COLORS.bgCard,
  },
});
