import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Send, Briefcase, TrendingUp, CheckCheck, Check, Clock, Sparkles, Phone, Video } from 'lucide-react-native';
import { chatApi, leadsApi, aiApi, callsApi } from '../../src/api/domain.api';
import { useAuthStore } from '../../src/store/auth.store';
import { socketService } from '../../src/services/socket.service';
import { Header } from '../../src/components/common/Header';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../../src/constants/theme';

export default function ContextualChatScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuthStore();
  const [inputText, setInputText] = useState('');
  const [isOtherTyping, setIsOtherTyping] = useState(false);
  const [aiAssisting, setAiAssisting] = useState(false);
  const typingTimeoutRef = useRef<any>(null);
  const scrollViewRef = useRef<ScrollView>(null);

  const convId = id || 'conv_01';
  const currentUserId = user?.id || 'usr_curr_01';

  const { data: messages = [] } = useQuery({
    queryKey: ['messages', convId],
    queryFn: () => chatApi.getMessages(convId),
  });

  const [chatLog, setChatLog] = useState<any[]>(messages);

  useEffect(() => {
    if (messages.length > 0) {
      setChatLog(messages);
    }
  }, [messages]);

  // Connect to Socket.IO and join room
  useEffect(() => {
    socketService.connect().then(() => {
      socketService.joinConversation(convId);
    });

    socketService.onNewMessage((newMsg) => {
      if (newMsg.conversationId === convId || !newMsg.conversationId) {
        setChatLog((prev) => {
          // If we have an optimistic message matching clientTempId, replace it
          if (newMsg.clientTempId) {
            const index = prev.findIndex((m) => m.id === newMsg.clientTempId);
            if (index !== -1) {
              const updated = [...prev];
              updated[index] = { ...newMsg, status: 'sent' };
              return updated;
            }
          }
          // Avoid duplicate by id
          if (prev.some((m) => m.id === newMsg.id)) return prev;
          return [...prev, { ...newMsg, status: 'delivered' }];
        });

        setTimeout(() => {
          scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 80);
      }
    });

    socketService.onUserTyping((data) => {
      if (data.conversationId === convId && data.userId !== currentUserId) {
        setIsOtherTyping(true);
      }
    });

    socketService.onUserStopTyping((data) => {
      if (data.conversationId === convId && data.userId !== currentUserId) {
        setIsOtherTyping(false);
      }
    });

    return () => {
      // Clean up typing timers
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    };
  }, [convId, currentUserId]);

  const handleInputChange = (text: string) => {
    setInputText(text);

    socketService.emitTypingStart(convId, currentUserId, user?.profile?.fullName);
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socketService.emitTypingStop(convId, currentUserId);
    }, 2000);
  };

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const tempId = 'temp_' + Date.now();
    const outgoingText = inputText.trim();

    const optimisticMsg = {
      id: tempId,
      conversationId: convId,
      senderId: currentUserId,
      senderName: user?.profile?.fullName || 'Alex Morgan',
      text: outgoingText,
      isRead: false,
      status: 'sending',
      createdAt: new Date().toISOString(),
    };

    setChatLog((prev) => [...prev, optimisticMsg]);
    setInputText('');
    socketService.emitTypingStop(convId, currentUserId);

    // Send via WebSocket & HTTP API fallback for absolute persistence
    socketService.sendMessage({
      conversationId: convId,
      senderId: currentUserId,
      text: outgoingText,
      clientTempId: tempId,
    });

    try {
      const saved = await chatApi.sendMessage(convId, outgoingText);
      setChatLog((prev) =>
        prev.map((m) => (m.id === tempId ? { ...saved, status: 'sent' } : m)),
      );
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    } catch {
      setChatLog((prev) =>
        prev.map((m) => (m.id === tempId ? { ...m, status: 'sent' } : m)),
      );
    }

    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const handleConvertToLead = async () => {
    await leadsApi.createLead({
      businessId: 'biz_01',
      contactUserId: 'usr_vikram_singh',
      contactName: 'Vikram Singh (FinFlow)',
      title: 'FinFlow Delivery App Contract',
      estimatedValue: 350000,
      source: 'MATCH',
    });
    queryClient.invalidateQueries({ queryKey: ['leads'] });
    router.push('/leads' as any);
  };

  const handleAiAssist = async (mode: 'PROFESSIONAL' | 'SHORTEN' | 'PROPOSAL_PITCH') => {
    const textToRefine = inputText || 'Let us discuss deliverables and start collaborating on this deal';
    setAiAssisting(true);
    try {
      const res = await aiApi.chatAssist(mode, textToRefine);
      if (res.suggested) {
        setInputText(res.suggested);
      }
    } finally {
      setAiAssisting(false);
    }
  };

  const handleStartCall = async (type: 'VOICE' | 'VIDEO') => {
    socketService.initiateCall({
      callerId: currentUserId,
      callerName: user?.profile?.fullName || 'Alex Morgan',
      callerAvatar: user?.profile?.avatarUrl,
      receiverId: 'usr_vikram_01',
      callType: type,
    });
    router.push({
      pathname: '/call/active' as any,
      params: {
        callId: 'call_' + Date.now(),
        peerName: 'Vikram Singh',
        peerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
        callType: type,
        peerId: 'usr_vikram_01',
      },
    });
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <Header
        title="BUSINESS DISCUSSION"
        subtitle="VERIFIED DIRECT CHANNEL"
        showBack
        onBack={() => router.back()}
        rightAction={
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <TouchableOpacity
              style={styles.headerCallBtn}
              onPress={() => handleStartCall('VOICE')}
              activeOpacity={0.8}
            >
              <Phone size={15} color="#FFF" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.headerCallBtn}
              onPress={() => handleStartCall('VIDEO')}
              activeOpacity={0.8}
            >
              <Video size={15} color="#FFF" />
            </TouchableOpacity>
          </View>
        }
      />

      {/* Opportunity Context Banner */}
      <View style={styles.contextBanner}>
        <View style={styles.contextInfo}>
          <View style={styles.contextTag}>
            <Briefcase size={12} color={COLORS.primaryLight} />
            <Text style={styles.contextTagText}>CONTEXT OPPORTUNITY</Text>
          </View>
          <Text style={styles.contextTitle} numberOfLines={1}>
            Mobile App & Cloud Architecture Deliverables
          </Text>
        </View>

        {/* Lead CRM Status Action */}
        <TouchableOpacity
          style={styles.leadCta}
          onPress={() => router.push('/leads' as any)}
          activeOpacity={0.8}
        >
          <TrendingUp size={13} color="#000" />
          <Text style={styles.leadCtaText}>Save to CRM</Text>
        </TouchableOpacity>
      </View>

      {/* Messages Thread */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
      >
        {chatLog.map((msg) => {
          const isMe = msg.senderId === currentUserId;
          return (
            <View
              key={msg.id}
              style={[
                styles.bubbleWrapper,
                isMe ? styles.bubbleWrapperMe : styles.bubbleWrapperOther,
              ]}
            >
              <View
                style={[
                  styles.bubble,
                  isMe ? styles.bubbleMe : styles.bubbleOther,
                ]}
              >
                <Text
                  style={[
                    styles.messageText,
                    isMe ? styles.messageTextMe : styles.messageTextOther,
                  ]}
                >
                  {msg.text}
                </Text>
              </View>

              <View style={styles.timestampRow}>
                <Text style={styles.timestamp}>
                  {new Date(msg.createdAt).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </Text>
                {isMe && (
                  msg.status === 'sending' ? (
                    <Clock size={11} color={COLORS.textDim} />
                  ) : msg.isRead ? (
                    <CheckCheck size={12} color={COLORS.accent} />
                  ) : (
                    <Check size={12} color={COLORS.primaryLight} />
                  )
                )}
              </View>
            </View>
          );
        })}

        {isOtherTyping && (
          <View style={styles.typingIndicatorRow}>
            <View style={styles.typingDot} />
            <Text style={styles.typingText}>Vikram is typing...</Text>
          </View>
        )}
      </ScrollView>

      {/* AI Message Assistance Quick Pills */}
      <View style={styles.aiPillRow}>
        <TouchableOpacity
          style={styles.aiPill}
          onPress={() => handleAiAssist('PROFESSIONAL')}
          disabled={aiAssisting}
        >
          <Sparkles size={11} color={COLORS.primaryLight} />
          <Text style={styles.aiPillText}>Make Professional</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.aiPill}
          onPress={() => handleAiAssist('SHORTEN')}
          disabled={aiAssisting}
        >
          <Sparkles size={11} color={COLORS.primaryLight} />
          <Text style={styles.aiPillText}>Shorten</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.aiPill}
          onPress={() => handleAiAssist('PROPOSAL_PITCH')}
          disabled={aiAssisting}
        >
          <Sparkles size={11} color={COLORS.accent} />
          <Text style={[styles.aiPillText, { color: COLORS.accent }]}>Draft Proposal</Text>
        </TouchableOpacity>
      </View>

      {/* Chat Input Bar */}
      <View style={styles.inputBar}>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={handleInputChange}
          placeholder="Discuss opportunity terms, share quote..."
          placeholderTextColor={COLORS.textDim}
          multiline
        />
        <TouchableOpacity
          style={[styles.sendBtn, !inputText.trim() && styles.sendBtnDisabled]}
          onPress={handleSend}
          disabled={!inputText.trim()}
          activeOpacity={0.8}
        >
          <Send size={18} color={!inputText.trim() ? COLORS.textDim : '#FFFFFF'} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgDark,
  },
  contextBanner: {
    backgroundColor: COLORS.bgCard,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: SPACING.md,
  },
  contextInfo: {
    flex: 1,
  },
  contextTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  contextTagText: {
    color: COLORS.primaryLight,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  contextTitle: {
    color: COLORS.textPrimary,
    fontSize: 12,
    fontWeight: '700',
    marginTop: 2,
  },
  leadCta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.accent,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: RADIUS.sm,
  },
  leadCtaText: {
    color: '#000',
    fontSize: 11,
    fontWeight: '800',
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: SPACING.lg,
    gap: SPACING.sm,
  },
  bubbleWrapper: {
    maxWidth: '82%',
    marginBottom: 4,
  },
  bubbleWrapperMe: {
    alignSelf: 'flex-end',
    alignItems: 'flex-end',
  },
  bubbleWrapperOther: {
    alignSelf: 'flex-start',
    alignItems: 'flex-start',
  },
  bubble: {
    borderRadius: RADIUS.lg,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  bubbleMe: {
    backgroundColor: COLORS.primary,
    borderBottomRightRadius: 2,
  },
  bubbleOther: {
    backgroundColor: COLORS.bgCard,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderBottomLeftRadius: 2,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  messageTextMe: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  messageTextOther: {
    color: COLORS.textPrimary,
    fontWeight: '500',
  },
  timestampRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 3,
    paddingHorizontal: 4,
  },
  timestamp: {
    color: COLORS.textDim,
    fontSize: 10,
    fontWeight: '600',
  },
  typingIndicatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
  },
  typingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.primaryLight,
  },
  typingText: {
    color: COLORS.primaryLight,
    fontSize: 11,
    fontStyle: 'italic',
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.bgDark,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    gap: SPACING.sm,
  },
  input: {
    flex: 1,
    backgroundColor: COLORS.bgInput,
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.lg,
    paddingVertical: 10,
    color: COLORS.textPrimary,
    fontSize: 14,
    maxHeight: 100,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.glowPrimary,
  },
  sendBtnDisabled: {
    backgroundColor: COLORS.bgElevated,
  },
  aiPillRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    paddingHorizontal: SPACING.lg,
    paddingVertical: 6,
    backgroundColor: COLORS.bgDark,
  },
  aiPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.bgInput,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  aiPillText: {
    color: COLORS.primaryLight,
    fontSize: 11,
    fontWeight: '700',
  },
  headerCallBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.bgElevated,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
});
