import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Image,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  Sparkles,
  X,
  Send,
  ArrowRight,
  Bot,
  Briefcase,
  Users,
  ShoppingBag,
} from 'lucide-react-native';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { aiApi } from '../../api/domain.api';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../../constants/theme';
import { AIAssistantResponse } from '../../types';

interface AskLipTalkSheetProps {
  visible: boolean;
  onClose: () => void;
}

export function AskLipTalkSheet({ visible, onClose }: AskLipTalkSheetProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const bottomClearance = Math.max(insets.bottom, Platform.OS === 'android' ? 24 : 16);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<AIAssistantResponse | null>(null);

  const suggestedPrompts = [
    'Find UI & Product Designers',
    'Show opportunities matching my skills',
    'Recommend startup founder communities',
    'How can I improve my profile completeness?',
    'Find verified React Native agencies',
  ];

  const handleAsk = async (textToAsk?: string) => {
    const q = textToAsk || query;
    if (!q.trim()) return;

    setLoading(true);
    setResponse(null);
    try {
      const res = await aiApi.assist(q.trim());
      setResponse(res);
    } catch {
      setResponse({
        reply: `Here are matching resources from the LipTalk verified ecosystem for "${q}".`,
        action: 'GENERAL_REPLY',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleActionNavigate = (action: string) => {
    onClose();
    if (action === 'SHOW_OPPORTUNITIES') router.push('/(tabs)/opportunities' as any);
    else if (action === 'SHOW_COMMUNITIES') router.push('/(tabs)/communities' as any);
    else if (action === 'SHOW_MARKETPLACE') router.push('/marketplace' as any);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.sheetCard}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.titleRow}>
              <Image
                source={require('../../../assets/mascot/mascot_default.png')}
                style={styles.headerMascot}
                resizeMode="contain"
              />
              <View>
                <Text style={styles.title}>Ask LipTalk Assistant</Text>
                <Text style={styles.sub}>Intelligent Navigation & Ecosystem Discovery</Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={18} color={COLORS.textDim} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
            {/* Suggested Prompt Pills */}
            {!response && (
              <View style={styles.promptSection}>
                <View style={styles.mascotWelcomeCard}>
                  <Image
                    source={require('../../../assets/mascot/mascot_default.png')}
                    style={styles.welcomeMascotImg}
                    resizeMode="contain"
                  />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.welcomeMascotTitle}>How can I help you today?</Text>
                    <Text style={styles.welcomeMascotSub}>
                      Ask for matches, find regional opportunities, or explore verified services.
                    </Text>
                  </View>
                </View>

                <Text style={styles.sectionLabel}>SUGGESTED DISCOVERY PROMPTS</Text>
                <View style={styles.pillsWrap}>
                  {suggestedPrompts.map((p, idx) => (
                    <TouchableOpacity
                      key={idx}
                      style={styles.pill}
                      onPress={() => {
                        setQuery(p);
                        handleAsk(p);
                      }}
                      activeOpacity={0.8}
                    >
                      <Sparkles size={11} color={COLORS.primaryLight} />
                      <Text style={styles.pillText}>{p}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            {/* AI Response Card */}
            {loading && (
              <View style={styles.loadingBox}>
                <ActivityIndicator size="small" color={COLORS.primary} />
                <Text style={styles.loadingText}>Synthesizing LipTalk ecosystem data...</Text>
              </View>
            )}

            {response && !loading && (
              <View style={styles.responseBox}>
                <View style={styles.botBadge}>
                  <Bot size={13} color={COLORS.accent} />
                  <Text style={styles.botBadgeText}>LIPTALK AI</Text>
                </View>
                <Text style={styles.responseText}>{response.reply}</Text>

                {response.action !== 'GENERAL_REPLY' && (
                  <Button
                    title={`Open ${
                      response.action === 'SHOW_OPPORTUNITIES'
                        ? 'Demands Hub'
                        : response.action === 'SHOW_COMMUNITIES'
                        ? 'Guilds Directory'
                        : 'Marketplace'
                    }`}
                    variant="primary"
                    size="sm"
                    icon={<ArrowRight size={13} color="#FFF" />}
                    onPress={() => handleActionNavigate(response.action)}
                    style={{ marginTop: SPACING.md }}
                  />
                )}
              </View>
            )}
          </ScrollView>

          {/* Bottom Query Input */}
          <View style={[styles.inputRow, { paddingBottom: bottomClearance }]}>
            <TextInput
              style={styles.input}
              placeholder="Ask anything (e.g. Find CTOs, opportunities...)"
              placeholderTextColor={COLORS.textDim}
              value={query}
              onChangeText={setQuery}
              onSubmitEditing={() => handleAsk()}
              returnKeyType="search"
            />
            <TouchableOpacity
              style={[styles.sendBtn, !query.trim() && styles.sendBtnDisabled]}
              onPress={() => handleAsk()}
              disabled={!query.trim() || loading}
            >
              <Send size={16} color="#FFF" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'flex-end',
  },
  sheetCard: {
    backgroundColor: COLORS.bgCard,
    borderTopLeftRadius: RADIUS.xxl,
    borderTopRightRadius: RADIUS.xxl,
    height: '75%',
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.primaryDark,
    ...SHADOWS.glowPrimary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingBottom: SPACING.md,
    marginBottom: SPACING.sm,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  headerMascot: {
    width: 38,
    height: 38,
  },
  mascotWelcomeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(139, 92, 246, 0.12)',
    borderColor: 'rgba(139, 92, 246, 0.25)',
    borderWidth: 1,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    gap: SPACING.md,
  },
  welcomeMascotImg: {
    width: 52,
    height: 52,
  },
  welcomeMascotTitle: {
    color: COLORS.textPrimary,
    fontSize: 14,
    fontWeight: '700',
  },
  welcomeMascotSub: {
    color: COLORS.textMuted,
    fontSize: 12,
    marginTop: 2,
    lineHeight: 16,
  },
  title: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: '900',
  },
  sub: {
    color: COLORS.textDim,
    fontSize: 11,
    marginTop: 1,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.bgInput,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    flex: 1,
    marginVertical: SPACING.sm,
  },
  promptSection: {
    marginTop: SPACING.xs,
  },
  sectionLabel: {
    color: COLORS.textDim,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.8,
    marginBottom: SPACING.sm,
  },
  pillsWrap: {
    gap: SPACING.xs,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.bgInput,
    borderRadius: RADIUS.lg,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  pillText: {
    color: COLORS.textSecondary,
    fontSize: 12.5,
    fontWeight: '600',
  },
  loadingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    backgroundColor: COLORS.bgInput,
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    marginVertical: SPACING.md,
  },
  loadingText: {
    color: COLORS.textSecondary,
    fontSize: 12,
  },
  responseBox: {
    backgroundColor: COLORS.bgElevated,
    borderRadius: RADIUS.xl,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    marginVertical: SPACING.xs,
  },
  botBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: SPACING.xs,
  },
  botBadgeText: {
    color: COLORS.accent,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  responseText: {
    color: COLORS.textPrimary,
    fontSize: 13.5,
    lineHeight: 19,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  input: {
    flex: 1,
    backgroundColor: COLORS.bgInput,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: 10,
    color: COLORS.textPrimary,
    fontSize: 13,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  sendBtn: {
    width: 42,
    height: 42,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnDisabled: {
    opacity: 0.4,
  },
});
