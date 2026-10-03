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
  NativeSyntheticEvent,
  NativeScrollEvent,
  Dimensions,
  Linking,
  Modal,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Send,
  Briefcase,
  TrendingUp,
  CheckCheck,
  Check,
  Clock,
  Sparkles,
  Phone,
  Video,
  Smile,
  Paperclip,
  IndianRupee,
  Camera,
  Mic,
} from 'lucide-react-native';
import { chatApi, leadsApi, aiApi, callsApi } from '../../src/api/domain.api';
import { CHAT_MESSAGES_DATA } from '../../src/api/mockData';
import { useAuthStore } from '../../src/store/auth.store';
import { socketService } from '../../src/services/socket.service';
import { Header } from '../../src/components/common/Header';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../../src/constants/theme';
import { useKeyboardViewport } from '../../src/hooks/useKeyboardViewport';

export default function ContextualChatScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuthStore();
  const convId = id || 'conv_01';
  const currentUserId = user?.id || 'usr_curr_01';
  const isVikram = currentUserId === 'usr_vikram_01';
  const isKavita = currentUserId === 'usr_growthpulse_founder';

  const defaultPeer =
    convId === 'conv_02'
      ? (isKavita
          ? {
              id: 'usr_curr_01',
              name: 'Alex Morgan',
              phone: '+91 9962786367',
              avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
              headline: 'Founder & Head of Tech @ Nexas Digital',
              businessName: 'Nexas Digital Solutions',
            }
          : {
              id: 'usr_growthpulse_founder',
              name: 'Kavita Menon',
              phone: '+91 98765 43214',
              avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
              headline: 'Managing Director @ GrowthPulse Media',
              businessName: 'GrowthPulse Media',
            })
      : (isVikram
          ? {
              id: 'usr_curr_01',
              name: 'Alex Morgan',
              phone: '+91 9962786367',
              avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
              headline: 'Founder & Head of Tech @ Nexas Digital',
              businessName: 'Nexas Digital Solutions',
            }
          : {
              id: 'usr_vikram_01',
              name: 'Vikram Singh',
              phone: '+91 7200317219',
              avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
              headline: 'Co-Founder & COO @ FinFlow Logistics Tech',
              businessName: 'FinFlow Logistics Tech',
            });

  const { data: conversation } = useQuery({
    queryKey: ['conversation', convId, currentUserId],
    queryFn: () => chatApi.getConversation(convId, currentUserId),
  });

  const peerId = conversation?.otherParticipant?.id || defaultPeer.id;
  const peerName = conversation?.otherParticipant?.name || defaultPeer.name;
  const peerPhone = conversation?.otherParticipant?.phoneNumber || defaultPeer.phone;
  const peerAvatar = conversation?.otherParticipant?.avatarUrl || defaultPeer.avatarUrl;
  const peerHeadline = defaultPeer.headline;
  const peerBusiness = defaultPeer.businessName;
  const contextTitle =
    conversation?.contextTitle ||
    (convId === 'conv_02'
      ? 'Match (94%): B2B Lead Gen & Web App Development'
      : 'Opportunity: React Native B2B Delivery App');

  const { viewportHeight, viewportOffsetTop, keyboardInset, isKeyboardVisible, isDesktop } =
    useKeyboardViewport();

  const [inputText, setInputText] = useState('');
  const [isOtherTyping, setIsOtherTyping] = useState(false);
  const [aiAssisting, setAiAssisting] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [showCallOptions, setShowCallOptions] = useState(false);
  const [chatLog, setChatLog] = useState<any[]>(
    () => CHAT_MESSAGES_DATA[convId] || CHAT_MESSAGES_DATA['conv_01'] || []
  );

  const typingTimeoutRef = useRef<any>(null);
  const scrollViewRef = useRef<ScrollView>(null);
  const inputRef = useRef<TextInput>(null);
  const isNearBottomRef = useRef(true);
  const prevKeyboardVisibleRef = useRef(false);

  // When keyboard opens or viewport shrinks:
  // If user is already near bottom, lock scroll immediately with zero lag or bounce.
  // If user is reading older messages, preserve their scroll position.
  useEffect(() => {
    if (isKeyboardVisible && !prevKeyboardVisibleRef.current) {
      if (isNearBottomRef.current) {
        requestAnimationFrame(() => {
          scrollViewRef.current?.scrollToEnd({ animated: false });
        });
      }
    }
    prevKeyboardVisibleRef.current = isKeyboardVisible;
  }, [isKeyboardVisible]);

  // Track scroll position to respect reading of older messages
  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const paddingToBottom = 80;
    const isNearBottom =
      layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;
    isNearBottomRef.current = isNearBottom;
  };

  // WhatsApp-style dynamic bottom clearance:
  // - On Android with edge-to-edge & adjustResize, the window coordinate extends behind the system navigation bar (insets.bottom).
  //   When the keyboard opens, Android resizes the window, but the bottom of the window still extends behind the keyboard by insets.bottom.
  //   Retaining (insets.bottom + 6)dp ensures the input pill and circular mic/send button are completely visible and sit cleanly ~8dp above the keypad.
  // - On iOS, KeyboardAvoidingView (behavior='padding') shifts the entire container by keyboardInset, so 6dp is used when open.
  // - On Desktop / Web, 10dp / 6dp clearance is used.
  const windowHeight = Dimensions.get('window').height;
  const screenHeight = Dimensions.get('screen').height;
  const osDidResize = Platform.OS === 'android' && (screenHeight - windowHeight > 100);

  const androidNavClearance = Math.max(insets.bottom, 28) + 6;

  const restingBottomClearance = isDesktop
    ? 10
    : Platform.OS === 'android'
    ? androidNavClearance
    : Math.max(insets.bottom, 20);

  const bottomClearance = isKeyboardVisible
    ? Platform.OS === 'android'
      ? (osDidResize ? androidNavClearance : keyboardInset + 6)
      : 6
    : restingBottomClearance;

  const { data: messages = [] } = useQuery({
    queryKey: ['messages', convId],
    queryFn: () => chatApi.getMessages(convId),
  });

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
      senderName: user?.profile?.fullName || (isVikram ? 'Vikram Singh' : 'Alex Morgan'),
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
    }, 80);

    // Keep focus on input for continuous chatting flow without closing keyboard
    if (Platform.OS === 'web') {
      inputRef.current?.focus();
    }
  };

  const handleConvertToLead = async () => {
    await leadsApi.createLead({
      businessId: 'biz_01',
      contactUserId: peerId,
      contactName: `${peerName} (${peerBusiness})`,
      title: `${peerBusiness} Contract`,
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
    const newCallId = 'call_' + Date.now();

    socketService.initiateCall({
      callerId: currentUserId,
      callerName: user?.profile?.fullName || (isVikram ? 'Vikram Singh' : 'Alex Morgan'),
      callerAvatar: user?.profile?.avatarUrl,
      receiverId: peerId,
      callType: type,
    });
    router.push({
      pathname: '/call/active' as any,
      params: {
        callId: newCallId,
        peerName,
        peerAvatar,
        callType: type,
        peerId,
        peerPhone,
        isIncoming: 'false',
      },
    });
  };

  const handleRealPhoneCall = (phoneToCall: string = peerPhone) => {
    handleStartCall('VOICE');
  };

  const webContainerStyle = Platform.OS === 'web'
    ? {
        height: isDesktop ? ('100%' as any) : viewportHeight,
        maxHeight: isDesktop ? ('100%' as any) : viewportHeight,
        overflow: 'hidden' as const,
      }
    : undefined;

  return (
    <KeyboardAvoidingView
      style={[styles.container, webContainerStyle]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={0}
    >
      <Header
        title={peerName.toUpperCase()}
        subtitle={peerHeadline ? peerHeadline.toUpperCase() : 'VERIFIED DIRECT CHANNEL'}
        showBack
        onBack={() => router.back()}
        rightAction={
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <TouchableOpacity
              style={styles.headerCallBtn}
              onPress={() => handleRealPhoneCall()}
              onLongPress={() => setShowCallOptions(true)}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel={`Real cellular phone call to ${peerPhone}`}
            >
              <Phone size={15} color="#FFF" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.headerCallBtn}
              onPress={() => handleStartCall('VIDEO')}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel="Start video call"
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
            {contextTitle}
          </Text>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          {/* Direct Real Phone Dial Chip */}
          <TouchableOpacity
            style={styles.phoneCta}
            onPress={() => handleRealPhoneCall()}
            onLongPress={() => setShowCallOptions(true)}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel={`Real cellular phone call to ${peerPhone}`}
          >
            <Phone size={11} color={COLORS.accent} />
            <Text style={styles.phoneCtaText}>{peerPhone}</Text>
            <View style={styles.realCallBadge}>
              <Text style={styles.realCallBadgeText}>REAL CALL</Text>
            </View>
          </TouchableOpacity>

          {/* Lead CRM Status Action */}
          <TouchableOpacity
            style={styles.leadCta}
            onPress={() => router.push('/leads' as any)}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Save opportunity to CRM"
          >
            <TrendingUp size={13} color="#000" />
            <Text style={styles.leadCtaText}>Save CRM</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Messages Thread */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {chatLog.map((msg, index) => {
          const isMe = msg.senderId === currentUserId;
          const messageKey = msg.id ? `msg_${msg.id}_${index}` : `msg_idx_${index}`;
          return (
            <View
              key={messageKey}
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
                {!isMe && (
                  <Text style={styles.otherSenderTitle}>{msg.senderName || peerName}</Text>
                )}
                <Text
                  style={[
                    styles.messageText,
                    isMe ? styles.messageTextMe : styles.messageTextOther,
                  ]}
                >
                  {msg.text}
                </Text>

                <View style={styles.bubbleMetaRow}>
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
                      <CheckCheck size={14} color={COLORS.accent} />
                    ) : (
                      <Check size={13} color={COLORS.primaryLight} />
                    )
                  )}
                </View>
              </View>
            </View>
          );
        })}

        {isOtherTyping && (
          <View style={styles.typingIndicatorRow}>
            <View style={styles.typingDot} />
            <Text style={styles.typingText}>{peerName} is typing...</Text>
          </View>
        )}
      </ScrollView>

      {/* WhatsApp-Style Mobile Chat Composer Dock */}
      <View style={[styles.bottomDockContainer, { paddingBottom: bottomClearance }]}>
        {/* AI Message Assistance Quick Pills */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.aiPillRow}
        >
          <TouchableOpacity
            style={styles.aiPill}
            onPress={() => handleAiAssist('PROFESSIONAL')}
            disabled={aiAssisting}
            activeOpacity={0.75}
            accessibilityRole="button"
            accessibilityLabel="Make message professional with AI"
          >
            <Sparkles size={11} color={COLORS.primaryLight} />
            <Text style={styles.aiPillText}>Make Professional</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.aiPill}
            onPress={() => handleAiAssist('SHORTEN')}
            disabled={aiAssisting}
            activeOpacity={0.75}
            accessibilityRole="button"
            accessibilityLabel="Shorten message with AI"
          >
            <Sparkles size={11} color={COLORS.primaryLight} />
            <Text style={styles.aiPillText}>Shorten</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.aiPill}
            onPress={() => handleAiAssist('PROPOSAL_PITCH')}
            disabled={aiAssisting}
            activeOpacity={0.75}
            accessibilityRole="button"
            accessibilityLabel="Draft proposal pitch with AI"
          >
            <Sparkles size={11} color={COLORS.accent} />
            <Text style={[styles.aiPillText, { color: COLORS.accent }]}>Draft Proposal</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Floating Input Bar & Action Button */}
        <View style={styles.waInputRow}>
          {/* Main Rounded Input Pill */}
          <View style={styles.waPill}>
            <TouchableOpacity
              style={styles.waIconBtn}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel="Choose emoji"
            >
              <Smile size={22} color={COLORS.primaryLight} />
            </TouchableOpacity>

            <TextInput
              ref={inputRef}
              style={styles.waTextInput}
              value={inputText}
              onChangeText={handleInputChange}
              placeholder="Type a message..."
              placeholderTextColor={COLORS.textDim}
              multiline
              onFocus={() => {
                setIsFocused(true);
                setTimeout(() => {
                  scrollViewRef.current?.scrollToEnd({ animated: true });
                }, 120);
              }}
              onBlur={() => setIsFocused(false)}
              onKeyPress={(e: any) => {
                if (Platform.OS === 'web' && e.nativeEvent?.key === 'Enter' && !e.nativeEvent?.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              accessibilityLabel="Message text input"
              accessibilityRole="text"
            />

            <TouchableOpacity
              style={styles.waIconBtn}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel="Attach file or media"
            >
              <Paperclip size={20} color={COLORS.primaryLight} />
            </TouchableOpacity>

            {!inputText.trim() && (
              <>
                <TouchableOpacity
                  style={styles.waIconBtn}
                  activeOpacity={0.7}
                  accessibilityRole="button"
                  accessibilityLabel="Propose deal quotation terms"
                >
                  <IndianRupee size={19} color={COLORS.accent} />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.waIconBtn}
                  activeOpacity={0.7}
                  accessibilityRole="button"
                  accessibilityLabel="Take photo or video"
                >
                  <Camera size={20} color={COLORS.primaryLight} />
                </TouchableOpacity>
              </>
            )}
          </View>

          {/* Right Floating Circular Action Button (Mic / Send) */}
          <TouchableOpacity
            style={[styles.waCircleBtn, inputText.trim() ? styles.waSendBtnActive : styles.waMicBtn]}
            onPress={inputText.trim() ? handleSend : undefined}
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityLabel={inputText.trim() ? 'Send message' : 'Record voice note'}
          >
            {inputText.trim() ? (
              <Send size={19} color="#FFFFFF" style={{ marginLeft: 2 }} />
            ) : (
              <Mic size={22} color="#FFFFFF" />
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Call Options Modal (VoIP HD Call vs Direct Native Cellular) */}
      <Modal
        visible={showCallOptions}
        transparent
        animationType="fade"
        onRequestClose={() => setShowCallOptions(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowCallOptions(false)}
        >
          <View style={styles.modalCard} onStartShouldSetResponder={() => true}>
            <View style={styles.modalHeader}>
              <View style={styles.modalIconWrap}>
                <Phone size={20} color={COLORS.primaryLight} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.modalTitle}>Connect with {peerName}</Text>
                <Text style={styles.modalSub}>{peerPhone} • {peerBusiness}</Text>
              </View>
            </View>

            <View style={styles.modalDivider} />

            {/* Option 1: Direct In-App Phone Call */}
            <TouchableOpacity
              style={[styles.modalOption, styles.modalOptionPrimary]}
              onPress={() => {
                setShowCallOptions(false);
                handleStartCall('VOICE');
              }}
              activeOpacity={0.7}
            >
              <View style={[styles.modalOptionIcon, { backgroundColor: 'rgba(16, 185, 129, 0.2)' }]}>
                <Phone size={19} color={COLORS.accent} />
              </View>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Text style={[styles.modalOptionTitle, { color: COLORS.accent }]}>
                    In-App Direct Phone Call
                  </Text>
                  <View style={styles.cellularTag}>
                    <Text style={styles.cellularTagText}>100% IN-APP</Text>
                  </View>
                </View>
                <Text style={styles.modalOptionSub}>
                  Call {peerPhone} directly inside LipTalk • Zero external redirect
                </Text>
              </View>
            </TouchableOpacity>

            {/* Option 2: In-App VoIP Voice Call */}
            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => {
                setShowCallOptions(false);
                handleStartCall('VOICE');
              }}
              activeOpacity={0.7}
            >
              <View style={[styles.modalOptionIcon, { backgroundColor: 'rgba(59, 130, 246, 0.15)' }]}>
                <Phone size={18} color={COLORS.primaryLight} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.modalOptionTitle}>LipTalk HD In-App VoIP Call</Text>
                <Text style={styles.modalOptionSub}>Encrypted voice over IP network (App required)</Text>
              </View>
            </TouchableOpacity>

            {/* Option 3: In-App VoIP Video Call */}
            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => {
                setShowCallOptions(false);
                handleStartCall('VIDEO');
              }}
              activeOpacity={0.7}
            >
              <View style={[styles.modalOptionIcon, { backgroundColor: 'rgba(168, 85, 247, 0.15)' }]}>
                <Video size={18} color="#C084FC" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.modalOptionTitle}>LipTalk HD Video Call</Text>
                <Text style={styles.modalOptionSub}>Face-to-face encrypted video conference</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalCancelBtn}
              onPress={() => setShowCallOptions(false)}
              activeOpacity={0.8}
            >
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
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
    backgroundColor: COLORS.bgDark,
  },
  messagesContent: {
    paddingHorizontal: 12,
    paddingVertical: 14,
    gap: 8,
  },
  bubbleWrapper: {
    maxWidth: '84%',
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
    paddingHorizontal: 14,
    paddingTop: 9,
    paddingBottom: 7,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
  },
  bubbleMe: {
    backgroundColor: COLORS.primaryDark,
    borderTopRightRadius: 2,
  },
  bubbleOther: {
    backgroundColor: COLORS.bgCard,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderTopLeftRadius: 2,
  },
  otherSenderTitle: {
    color: COLORS.primaryLight,
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 2,
  },
  messageText: {
    fontSize: 14.5,
    lineHeight: 20,
  },
  messageTextMe: {
    color: '#FFFFFF',
    fontWeight: '400',
  },
  messageTextOther: {
    color: COLORS.textPrimary,
    fontWeight: '400',
  },
  bubbleMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 4,
    marginTop: 3,
    alignSelf: 'flex-end',
  },
  timestamp: {
    color: COLORS.textDim,
    fontSize: 11,
    fontWeight: '500',
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
  bottomDockContainer: {
    backgroundColor: COLORS.bgDark,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 2,
    ...SHADOWS.md,
  },
  aiPillRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  aiPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.bgElevated,
    paddingHorizontal: 9,
    paddingVertical: 4.5,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  aiPillText: {
    color: COLORS.primaryLight,
    fontSize: 10.5,
    fontWeight: '700',
  },
  waInputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 6,
    paddingTop: 2,
    paddingBottom: 2,
    gap: 5,
  },
  waPill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.bgInput,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 8,
    paddingVertical: 2,
    minHeight: 46,
    maxHeight: 120,
  },
  waIconBtn: {
    padding: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  waTextInput: {
    flex: 1,
    color: COLORS.textPrimary,
    fontSize: 15,
    lineHeight: 20,
    paddingHorizontal: 6,
    paddingVertical: Platform.OS === 'android' ? 6 : 8,
    textAlignVertical: 'center',
    maxHeight: 100,
    minHeight: 36,
    outlineStyle: 'none',
  } as any,
  waCircleBtn: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 4,
  },
  waSendBtnActive: {
    backgroundColor: COLORS.primary,
  },
  waMicBtn: {
    backgroundColor: COLORS.primary,
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
  phoneCta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(16, 185, 129, 0.14)',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.35)',
  },
  phoneCtaText: {
    color: COLORS.accent,
    fontSize: 10,
    fontWeight: '800',
  },
  realCallBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.25)',
    paddingHorizontal: 4,
    paddingVertical: 1.5,
    borderRadius: 3,
  },
  realCallBadgeText: {
    color: COLORS.accent,
    fontSize: 7.5,
    fontWeight: '900',
    letterSpacing: 0.3,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.72)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: COLORS.bgCard,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 20,
    ...SHADOWS.lg,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  modalIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.3)',
  },
  modalTitle: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: '800',
  },
  modalSub: {
    color: COLORS.textDim,
    fontSize: 12,
    marginTop: 2,
    fontWeight: '600',
  },
  modalDivider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 14,
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: COLORS.bgElevated,
    padding: 12,
    borderRadius: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  modalOptionPrimary: {
    borderColor: 'rgba(16, 185, 129, 0.4)',
    backgroundColor: 'rgba(16, 185, 129, 0.08)',
  },
  modalOptionIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalOptionTitle: {
    color: COLORS.textPrimary,
    fontSize: 13.5,
    fontWeight: '700',
  },
  modalOptionSub: {
    color: COLORS.textDim,
    fontSize: 11,
    marginTop: 2,
  },
  cellularTag: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  cellularTagText: {
    color: COLORS.accent,
    fontSize: 9,
    fontWeight: '800',
  },
  modalCancelBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    marginTop: 4,
  },
  modalCancelText: {
    color: COLORS.textDim,
    fontSize: 13,
    fontWeight: '700',
  },
});
