import React, { useState, useEffect } from 'react';
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
import { ArrowLeft, Plus, X, Sparkles, Rocket, CheckCheck } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { creationApi } from '../../src/api/domain.api';
import { IdeaItem } from '../../src/types';
import { COLORS, RADIUS, SPACING, SHADOWS } from '../../src/constants/theme';

export default function IdeasScreen() {
  const router = useRouter();
  const [ideas, setIdeas] = useState<IdeaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [title, setTitle] = useState('');
  const [problem, setProblem] = useState('');
  const [solution, setSolution] = useState('');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    loadIdeas();
  }, []);

  const loadIdeas = async () => {
    setLoading(true);
    try {
      const list = await creationApi.getIdeas();
      setIdeas(list);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateIdea = async () => {
    if (!title.trim() || !problem.trim() || !solution.trim()) {
      Alert.alert('Please fill all fields');
      return;
    }
    setCreating(true);
    try {
      const newIdea = await creationApi.createIdea({
        title: title.trim(),
        problemStatement: problem.trim(),
        proposedSolution: solution.trim(),
        description: solution.trim(),
        category: 'AGRICULTURAL_FINTECH',
        visibility: 'PUBLIC',
      });
      setIdeas([newIdea, ...ideas]);
      setTitle('');
      setProblem('');
      setSolution('');
      setShowCreate(false);
      Alert.alert('Idea Published', 'AI validation completed with factual precedents and feasibility analysis.');
    } catch (e) {
      console.error(e);
    } finally {
      setCreating(false);
    }
  };

  const handleConvertToProject = async (idea: IdeaItem) => {
    Alert.alert(
      'Convert to Project?',
      `This will initialize a dedicated project workspace, team formation pipeline, and AI Project Manager for "${idea.title}".`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Convert to Project',
          onPress: async () => {
            const res = await creationApi.convertIdeaToProject(idea.id);
            Alert.alert('Project Created', `Project initialized. Workspace ID: ${res.projectId}`);
            loadIdeas();
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} activeOpacity={0.8}>
          <ArrowLeft size={20} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Idea Discovery Network</Text>
          <Text style={styles.headerSubtitle}>Idea-to-Project Pipeline • Collective Creation</Text>
        </View>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => setShowCreate(!showCreate)}
          activeOpacity={0.8}
        >
          {showCreate ? <X size={18} color="#FFFFFF" /> : <Plus size={18} color="#FFFFFF" />}
        </TouchableOpacity>
      </View>

      {/* Create Modal Drawer */}
      {showCreate && (
        <View style={styles.createBox}>
          <Text style={styles.createHead}>Publish a Concept to Collective Discovery</Text>
          <TextInput
            style={styles.input}
            placeholder="Idea Title..."
            placeholderTextColor={COLORS.textDim}
            value={title}
            onChangeText={setTitle}
          />
          <TextInput
            style={[styles.input, { height: 60 }]}
            placeholder="Problem Statement..."
            placeholderTextColor={COLORS.textDim}
            multiline
            value={problem}
            onChangeText={setProblem}
          />
          <TextInput
            style={[styles.input, { height: 60 }]}
            placeholder="Proposed Solution..."
            placeholderTextColor={COLORS.textDim}
            multiline
            value={solution}
            onChangeText={setSolution}
          />
          <TouchableOpacity
            style={styles.submitBtn}
            onPress={handleCreateIdea}
            disabled={creating}
            activeOpacity={0.85}
          >
            {creating ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.submitBtnText}>Run AI Validation & Publish</Text>
            )}
          </TouchableOpacity>
        </View>
      )}

      {loading ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {ideas.map((idea) => (
            <View key={idea.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.catBadge}>
                  <Text style={styles.catBadgeText}>{idea.category.replace(/_/g, ' ')}</Text>
                </View>
                <Text
                  style={[
                    styles.statusTag,
                    { color: idea.status === 'CONVERTED_TO_PROJECT' ? COLORS.accent : COLORS.info },
                  ]}
                >
                  ● {idea.status.replace(/_/g, ' ')}
                </Text>
              </View>

              <Text style={styles.cardTitle}>{idea.title}</Text>
              <Text style={styles.cardDesc}>{idea.description}</Text>

              {/* AI Validation Report Box */}
              {idea.aiValidationReport && (
                <View style={styles.validationBox}>
                  <View style={styles.valHeadRow}>
                    <Sparkles size={14} color={COLORS.primaryLight} />
                    <Text style={styles.valHeadText}>
                      AI Validation Analysis (Score: {idea.aiValidationReport.validationScore}/100)
                    </Text>
                  </View>
                  <Text style={styles.valSub}>
                    <Text style={{ fontWeight: '800', color: COLORS.textPrimary }}>Factual Precedents: </Text>
                    {idea.aiValidationReport.factualPrecedents?.join(', ')}
                  </Text>
                  <Text style={styles.valSub}>
                    <Text style={{ fontWeight: '800', color: COLORS.textPrimary }}>Feasibility Inference: </Text>
                    {idea.aiValidationReport.feasibilityInferences?.join(' • ')}
                  </Text>
                </View>
              )}

              {/* Skills & Resources */}
              <View style={styles.tagRow}>
                {idea.skillsRequired?.map((sk, sIdx) => (
                  <View key={sIdx} style={styles.skillChip}>
                    <Text style={styles.skillChipText}>{sk}</Text>
                  </View>
                ))}
              </View>

              {/* Actions */}
              {idea.status !== 'CONVERTED_TO_PROJECT' ? (
                <TouchableOpacity
                  style={styles.convertBtn}
                  onPress={() => handleConvertToProject(idea)}
                  activeOpacity={0.85}
                >
                  <Rocket size={14} color="#FFFFFF" />
                  <Text style={styles.convertBtnText}>Convert to Project & Form Team</Text>
                </TouchableOpacity>
              ) : (
                <View style={styles.convertedNotice}>
                  <CheckCheck size={14} color={COLORS.accent} />
                  <Text style={styles.convertedNoticeText}>Active Project Workspace Initialized</Text>
                </View>
              )}
            </View>
          ))}
        </ScrollView>
      )}
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
  addBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.glowPrimary,
  },
  createBox: {
    backgroundColor: COLORS.bgCard,
    padding: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    gap: 8,
  },
  createHead: { fontSize: 13, fontWeight: '800', color: COLORS.textPrimary, marginBottom: 2 },
  input: {
    backgroundColor: COLORS.bgInput,
    borderRadius: RADIUS.md,
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: COLORS.textPrimary,
    fontSize: 12.5,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  submitBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.md,
    paddingVertical: 11,
    alignItems: 'center',
    marginTop: 4,
    ...SHADOWS.glowPrimary,
  },
  submitBtnText: { color: '#FFFFFF', fontSize: 12.5, fontWeight: '800' },
  loadingBox: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scrollContent: { padding: SPACING.lg, paddingBottom: 40 },
  card: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  catBadge: {
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
  },
  catBadgeText: { color: COLORS.primaryLight, fontSize: 10, fontWeight: '800' },
  statusTag: { fontSize: 11, fontWeight: '800' },
  cardTitle: { fontSize: 16, fontWeight: '800', color: COLORS.textPrimary, marginBottom: 6 },
  cardDesc: { fontSize: 13, color: COLORS.textSecondary, lineHeight: 18, marginBottom: 12 },
  validationBox: {
    backgroundColor: COLORS.bgInput,
    borderRadius: RADIUS.md,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.25)',
  },
  valHeadRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 },
  valHeadText: { fontSize: 11.5, fontWeight: '800', color: COLORS.primaryLight },
  valSub: { fontSize: 11, color: COLORS.textMuted, lineHeight: 16, marginBottom: 4 },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 14 },
  skillChip: {
    backgroundColor: COLORS.bgElevated,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  skillChipText: { fontSize: 10.5, color: COLORS.info, fontWeight: '700' },
  convertBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.primary,
    paddingVertical: 11,
    borderRadius: RADIUS.md,
    ...SHADOWS.glowPrimary,
  },
  convertBtnText: { color: '#FFFFFF', fontSize: 12.5, fontWeight: '800' },
  convertedNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    paddingVertical: 9,
    paddingHorizontal: 11,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.25)',
  },
  convertedNoticeText: { color: COLORS.accent, fontSize: 11.5, fontWeight: '700' },
});
