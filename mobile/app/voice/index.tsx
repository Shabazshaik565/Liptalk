import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { coordinationApi } from '../../src/api/domain.api';

export default function VoiceScreen() {
  const router = useRouter();
  const [isRecording, setIsRecording] = useState(false);
  const [speechText, setSpeechText] = useState('');
  const [processing, setProcessing] = useState(false);
  const [sessionResult, setSessionResult] = useState<any>(null);

  // Multimodal query state
  const [searchQuery, setSearchQuery] = useState('');
  const [multimodalResults, setMultimodalResults] = useState<any[]>([]);

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
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Voice & Multimodal AI</Text>
          <Text style={styles.headerSubtitle}>Frontier Ambient Interaction</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Voice Interaction Orb Card */}
        <View style={styles.voiceOrbCard}>
          <Text style={styles.voiceCardTitle}>Voice Assistant Foundation</Text>
          <Text style={styles.voiceCardDesc}>
            Speak or type naturally to orchestrate goals, workspaces, or search verified documents.
          </Text>

          <View style={styles.orbContainer}>
            <TouchableOpacity
              style={[styles.orb, isRecording && styles.orbActive]}
              onPress={() => {
                setIsRecording(!isRecording);
                if (!isRecording) {
                  setTimeout(() => handleSimulateVoice(), 1500);
                }
              }}
            >
              <Ionicons
                name={isRecording ? 'mic' : 'mic-outline'}
                size={36}
                color="#FFFFFF"
              />
            </TouchableOpacity>
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
              >
                <Ionicons name="flash-outline" size={12} color="#6366F1" />
                <Text style={styles.presetText}>{p}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {processing && (
            <View style={styles.processingRow}>
              <ActivityIndicator size="small" color="#6366F1" />
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
                <Ionicons name="volume-high" size={18} color="#10B981" />
                <Text style={styles.replyText}>{sessionResult.aiVoiceReplyText}</Text>
              </View>

              {sessionResult.suggestedActionPayload?.suggestedRoute && (
                <TouchableOpacity
                  style={styles.routeBtn}
                  onPress={() =>
                    router.push(sessionResult.suggestedActionPayload.suggestedRoute as any)
                  }
                >
                  <Text style={styles.routeBtnText}>
                    Navigate to {sessionResult.suggestedActionPayload.suggestedRoute}
                  </Text>
                  <Ionicons name="arrow-forward" size={14} color="#FFFFFF" />
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
              placeholderTextColor="#64748B"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            <TouchableOpacity style={styles.searchBtn} onPress={handleMultimodalSearch}>
              <Ionicons name="search" size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {multimodalResults.map((item) => (
            <View key={item.id} style={styles.assetCard}>
              <View style={styles.assetHead}>
                <View style={styles.modalityBadge}>
                  <Text style={styles.modalityText}>{item.modality}</Text>
                </View>
                <Text style={styles.safetyTag}>
                  <Ionicons name="shield-checkmark" size={12} color="#10B981" /> {item.moderationStatus}
                </Text>
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
  container: { flex: 1, backgroundColor: '#0B0F19' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 54,
    paddingBottom: 16,
    backgroundColor: '#111827',
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  backBtn: { padding: 6, marginRight: 10 },
  headerTitleContainer: { flex: 1 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#F8FAFC' },
  headerSubtitle: { fontSize: 12, color: '#94A3B8', marginTop: 2 },
  scrollContent: { padding: 16, paddingBottom: 40 },
  voiceOrbCard: {
    backgroundColor: '#111827',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#1E293B',
    alignItems: 'center',
  },
  voiceCardTitle: { fontSize: 17, fontWeight: '700', color: '#F8FAFC', marginBottom: 6 },
  voiceCardDesc: { fontSize: 13, color: '#94A3B8', textAlign: 'center', marginBottom: 20 },
  orbContainer: { alignItems: 'center', marginBottom: 20 },
  orb: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#6366F1',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 8,
  },
  orbActive: { backgroundColor: '#EF4444', transform: [{ scale: 1.08 }] },
  orbStatus: { color: '#CBD5E1', fontSize: 12, fontWeight: '600', marginTop: 10 },
  presetsLabel: { fontSize: 11, fontWeight: '700', color: '#94A3B8', alignSelf: 'flex-start', marginBottom: 8 },
  presetWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 14 },
  presetChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#0F172A',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  presetText: { fontSize: 11, color: '#E2E8F0' },
  processingRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginVertical: 10 },
  processingText: { fontSize: 12, color: '#94A3B8' },
  sessionBox: {
    width: '100%',
    backgroundColor: '#0F172A',
    borderRadius: 12,
    padding: 14,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#334155',
  },
  sessionHead: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  intentBadge: { backgroundColor: 'rgba(56, 189, 248, 0.15)', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  intentText: { color: '#38BDF8', fontSize: 11, fontWeight: '700' },
  latencyText: { color: '#94A3B8', fontSize: 11 },
  transcriptionText: { fontSize: 12, color: '#CBD5E1', fontStyle: 'italic', marginBottom: 10 },
  replyBox: {
    flexDirection: 'row',
    gap: 10,
    backgroundColor: '#1E293B',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  replyText: { fontSize: 13, color: '#F1F5F9', flex: 1, lineHeight: 18 },
  routeBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#6366F1',
    paddingVertical: 8,
    borderRadius: 6,
  },
  routeBtnText: { color: '#FFFFFF', fontSize: 12, fontWeight: '700' },
  multimodalCard: {
    backgroundColor: '#111827',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  sectionHeader: { fontSize: 16, fontWeight: '700', color: '#F8FAFC', marginBottom: 4 },
  sectionDesc: { fontSize: 12, color: '#94A3B8', marginBottom: 12 },
  searchRow: { flexDirection: 'row', gap: 8, marginBottom: 14 },
  searchInput: {
    flex: 1,
    backgroundColor: '#0F172A',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: '#F8FAFC',
    fontSize: 13,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  searchBtn: {
    backgroundColor: '#6366F1',
    paddingHorizontal: 14,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  assetCard: { backgroundColor: '#0F172A', borderRadius: 10, padding: 12, marginTop: 8 },
  assetHead: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  modalityBadge: { backgroundColor: '#1E293B', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  modalityText: { color: '#A855F7', fontSize: 10, fontWeight: '700' },
  safetyTag: { color: '#10B981', fontSize: 11, fontWeight: '600' },
  assetTitle: { fontSize: 13, fontWeight: '700', color: '#F1F5F9', marginBottom: 4 },
  assetSummary: { fontSize: 12, color: '#94A3B8', lineHeight: 16 },
});
