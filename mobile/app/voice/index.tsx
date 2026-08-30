import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  Animated,
} from 'react-native';
import { ArrowLeft, Mic, Zap, Volume2, ArrowRight, Search, ShieldCheck } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { coordinationApi } from '../../src/api/domain.api';
import { COLORS, RADIUS, SPACING, SHADOWS } from '../../src/constants/theme';

export default function VoiceScreen() {
  const router = useRouter();
  const [isRecording, setIsRecording] = useState(false);
  const [speechText, setSpeechText] = useState('');
  const [processing, setProcessing] = useState(false);
  const [sessionResult, setSessionResult] = useState<any>(null);

  // Multimodal query state
  const [searchQuery, setSearchQuery] = useState('');
  const [multimodalResults, setMultimodalResults] = useState<any[]>([]);

  // Pulse animation for recording orb
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    let animLoop: Animated.CompositeAnimation | null = null;
    if (isRecording) {
      animLoop = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.15,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1.0,
            duration: 600,
            useNativeDriver: true,
          }),
        ])
      );
      animLoop.start();
    } else {
      pulseAnim.setValue(1);
    }
    return () => {
      if (animLoop) animLoop.stop();
    };
  }, [isRecording]);

  const handleSimulateVoice = async (presetText?: string) => {
    const textToSend = presetText || speechText || 'What is the status of my open FMCG supply chain goal?';
    setSpeechText(textToSend);
    setProcessing(true);
    try {
      const res = await coordinationApi.processVoiceIntent(textToSend);
      setSessionResult(res);
    } catch (e) {
      Alert.alert('Voice Error', 'Unable to process voice session.');
    } finally {
      setProcessing(false);
      setIsRecording(false);
    }
  };

  const handleMultimodalSearch = async () => {
    if (!searchQuery.trim()) return;
    const res = await coordinationApi.searchMultimodal(searchQuery);
    setMultimodalResults(res);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} activeOpacity={0.8}>
          <ArrowLeft size={20} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Voice & Multimodal AI</Text>
          <Text style={styles.headerSubtitle}>Frontier Ambient Interaction</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Voice Interaction Orb Card */}
        <View style={styles.voiceOrbCard}>
          <Text style={styles.voiceCardTitle}>Voice Assistant Foundation</Text>
          <Text style={styles.voiceCardDesc}>
            Speak or type naturally to orchestrate goals, workspaces, or search verified documents.
          </Text>

          <View style={styles.orbContainer}>
            <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
              <TouchableOpacity
                style={[styles.orb, isRecording && styles.orbActive]}
                activeOpacity={0.85}
                onPress={() => {
                  const nextRec = !isRecording;
                  setIsRecording(nextRec);
                  if (nextRec) {
                    setTimeout(() => handleSimulateVoice(), 1500);
                  }
                }}
              >
                <Mic size={36} color="#FFFFFF" />
              </TouchableOpacity>
            </Animated.View>
            <Text style={styles.orbStatus}>
              {isRecording ? 'Listening & Transcribing...' : 'Tap Mic to Speak'}
            </Text>
          </View>

          {/* Quick Voice Intent Presets */}
          <Text style={styles.presetsLabel}>Try Quick Intent Shortcuts:</Text>
          <View style={styles.presetWrap}>
            {[
              'Check my supply chain goal progress',
              'Open collaborative workspaces',
              'Review pending community votes',
            ].map((p, idx) => (
              <TouchableOpacity
                key={idx}
                style={styles.presetChip}
                onPress={() => handleSimulateVoice(p)}
                activeOpacity={0.82}
              >
                <Zap size={12} color={COLORS.primaryLight} />
                <Text style={styles.presetText}>{p}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {processing && (
            <View style={styles.processingRow}>
              <ActivityIndicator size="small" color={COLORS.primary} />
              <Text style={styles.processingText}>Detecting intent & compiling response...</Text>
            </View>
          )}

          {/* Voice Session Result Output */}
          {sessionResult && (
            <View style={styles.sessionBox}>
              <View style={styles.sessionHead}>
                <View style={styles.intentBadge}>
                  <Text style={styles.intentText}>{sessionResult.detectedIntent}</Text>
                </View>
                <Text style={styles.latencyText}>{sessionResult.latencyMs}ms latency</Text>
              </View>

              <Text style={styles.transcriptionText}>
                Transcribed: "{sessionResult.speechTranscription}"
              </Text>

              <View style={styles.replyBox}>
                <Volume2 size={18} color={COLORS.accent} />
                <Text style={styles.replyText}>{sessionResult.aiVoiceReplyText}</Text>
              </View>

              {sessionResult.suggestedActionPayload?.suggestedRoute && (
                <TouchableOpacity
                  style={styles.routeBtn}
                  onPress={() =>
                    router.push(sessionResult.suggestedActionPayload.suggestedRoute as any)
                  }
                  activeOpacity={0.85}
                >
                  <Text style={styles.routeBtnText}>
                    Navigate to {sessionResult.suggestedActionPayload.suggestedRoute}
                  </Text>
                  <ArrowRight size={14} color="#FFFFFF" />
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>

        {/* Multimodal Search Section */}
        <View style={styles.multimodalCard}>
          <Text style={styles.sectionHeader}>Cross-Modality Search</Text>
          <Text style={styles.sectionDesc}>
            Search text, verified PDF certificates, voice notes, and images.
          </Text>

          <View style={styles.searchRow}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search documents or certificates..."
              placeholderTextColor={COLORS.textDim}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            <TouchableOpacity style={styles.searchBtn} onPress={handleMultimodalSearch} activeOpacity={0.85}>
              <Search size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {multimodalResults.map((item) => (
            <View key={item.id} style={styles.assetCard}>
              <View style={styles.assetHead}>
                <View style={styles.modalityBadge}>
                  <Text style={styles.modalityText}>{item.modality}</Text>
                </View>
                <View style={styles.safetyTag}>
                  <ShieldCheck size={12} color={COLORS.accent} />
                  <Text style={styles.safetyText}>{item.moderationStatus}</Text>
                </View>
              </View>
              <Text style={styles.assetTitle}>{item.title}</Text>
              <Text style={styles.assetSummary}>{item.aiVisualSummary}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bgDark },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingTop: 54,
    paddingBottom: SPACING.lg,
    backgroundColor: COLORS.bgCard,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.bgElevated,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  headerTitleContainer: { flex: 1 },
  headerTitle: { fontSize: 18, fontWeight: '800', color: COLORS.textPrimary },
  headerSubtitle: { fontSize: 12, color: COLORS.textMuted, marginTop: 2 },
  scrollContent: { padding: SPACING.lg, paddingBottom: 40 },
  voiceOrbCard: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    ...SHADOWS.sm,
  },
  voiceCardTitle: { fontSize: 17, fontWeight: '800', color: COLORS.textPrimary, marginBottom: 6 },
  voiceCardDesc: { fontSize: 12.5, color: COLORS.textSecondary, textAlign: 'center', marginBottom: 20 },
  orbContainer: { alignItems: 'center', marginBottom: 20 },
  orb: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.glowPrimary,
  },
  orbActive: { backgroundColor: COLORS.danger, ...SHADOWS.glowDanger },
  orbStatus: { color: COLORS.textPrimary, fontSize: 12, fontWeight: '700', marginTop: 12 },
  presetsLabel: { fontSize: 11, fontWeight: '800', color: COLORS.primaryLight, alignSelf: 'flex-start', marginBottom: 8, letterSpacing: 0.4 },
  presetWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 14 },
  presetChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.bgInput,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  presetText: { fontSize: 11, color: COLORS.textSecondary, fontWeight: '600' },
  processingRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginVertical: 10 },
  processingText: { fontSize: 12, color: COLORS.primaryLight, fontWeight: '600' },
  sessionBox: {
    width: '100%',
    backgroundColor: COLORS.bgInput,
    borderRadius: RADIUS.md,
    padding: 14,
    marginTop: 10,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  sessionHead: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  intentBadge: {
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.3)',
  },
  intentText: { color: COLORS.info, fontSize: 11, fontWeight: '800' },
  latencyText: { color: COLORS.textMuted, fontSize: 11 },
  transcriptionText: { fontSize: 12, color: COLORS.textSecondary, fontStyle: 'italic', marginBottom: 10 },
  replyBox: {
    flexDirection: 'row',
    gap: 10,
    backgroundColor: COLORS.bgElevated,
    padding: 12,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  replyText: { fontSize: 13, color: COLORS.textPrimary, flex: 1, lineHeight: 18, fontWeight: '600' },
  routeBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    borderRadius: RADIUS.md,
    ...SHADOWS.glowPrimary,
  },
  routeBtnText: { color: '#FFFFFF', fontSize: 12, fontWeight: '800' },
  multimodalCard: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
  },
  sectionHeader: { fontSize: 16, fontWeight: '800', color: COLORS.textPrimary, marginBottom: 4 },
  sectionDesc: { fontSize: 12, color: COLORS.textSecondary, marginBottom: 12 },
  searchRow: { flexDirection: 'row', gap: 8, marginBottom: 14 },
  searchInput: {
    flex: 1,
    backgroundColor: COLORS.bgInput,
    borderRadius: RADIUS.md,
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: COLORS.textPrimary,
    fontSize: 12.5,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  searchBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 14,
    borderRadius: RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.glowPrimary,
  },
  assetCard: { backgroundColor: COLORS.bgInput, borderRadius: RADIUS.md, padding: 12, marginTop: 8, borderWidth: 1, borderColor: COLORS.borderLight },
  assetHead: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  modalityBadge: {
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
  },
  modalityText: { color: COLORS.primaryLight, fontSize: 10, fontWeight: '800' },
  safetyTag: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  safetyText: { color: COLORS.accent, fontSize: 11, fontWeight: '700' },
  assetTitle: { fontSize: 13.5, fontWeight: '800', color: COLORS.textPrimary, marginBottom: 4 },
  assetSummary: { fontSize: 12, color: COLORS.textSecondary, lineHeight: 16 },
});
