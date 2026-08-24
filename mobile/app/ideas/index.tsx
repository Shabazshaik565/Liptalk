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
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { creationApi } from '../../src/api/domain.api';
import { IdeaItem } from '../../src/types';

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
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Idea Discovery Network</Text>
          <Text style={styles.headerSubtitle}>Idea-to-Project Pipeline • Collective Creation</Text>
        </View>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => setShowCreate(!showCreate)}
        >
          <Ionicons name={showCreate ? 'close' : 'add'} size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Create Modal Drawer */}
      {showCreate && (
        <View style={styles.createBox}>
          <Text style={styles.createHead}>Publish a Concept to Collective Discovery</Text>
          <TextInput
            style={styles.input}
            placeholder="Idea Title..."
            placeholderTextColor="#64748B"
            value={title}
            onChangeText={setTitle}
          />
          <TextInput
            style={[styles.input, { height: 60 }]}
            placeholder="Problem Statement..."
            placeholderTextColor="#64748B"
            multiline
            value={problem}
            onChangeText={setProblem}
          />
          <TextInput
            style={[styles.input, { height: 60 }]}
            placeholder="Proposed Solution..."
            placeholderTextColor="#64748B"
            multiline
            value={solution}
            onChangeText={setSolution}
          />
          <TouchableOpacity
            style={styles.submitBtn}
            onPress={handleCreateIdea}
            disabled={creating}
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
          <ActivityIndicator size="large" color="#6366F1" />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {ideas.map((idea) => (
            <View key={idea.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.catBadge}>
                  <Text style={styles.catBadgeText}>{idea.category.replace(/_/g, ' ')}</Text>
                </View>
                <Text
                  style={[
                    styles.statusTag,
                    { color: idea.status === 'CONVERTED_TO_PROJECT' ? '#10B981' : '#38BDF8' },
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
                    <Ionicons name="sparkles" size={14} color="#A855F7" />
                    <Text style={styles.valHeadText}>
                      AI Validation Analysis (Score: {idea.aiValidationReport.validationScore}/100)
                    </Text>
                  </View>
                  <Text style={styles.valSub}>
                    <Text style={{ fontWeight: '700', color: '#CBD5E1' }}>Factual Precedents: </Text>
                    {idea.aiValidationReport.factualPrecedents?.join(', ')}
                  </Text>
                  <Text style={styles.valSub}>
                    <Text style={{ fontWeight: '700', color: '#CBD5E1' }}>Feasibility Inference: </Text>
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
                >
                  <Ionicons name="rocket-outline" size={14} color="#FFFFFF" />
                  <Text style={styles.convertBtnText}>Convert to Project & Form Team</Text>
                </TouchableOpacity>
              ) : (
                <View style={styles.convertedNotice}>
                  <Ionicons name="checkmark-done" size={14} color="#10B981" />
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
  addBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#6366F1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  createBox: {
    backgroundColor: '#111827',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
    gap: 8,
  },
  createHead: { fontSize: 13, fontWeight: '700', color: '#F8FAFC', marginBottom: 2 },
  input: {
    backgroundColor: '#0F172A',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: '#F8FAFC',
    fontSize: 12,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  submitBtn: {
    backgroundColor: '#6366F1',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 4,
  },
  submitBtnText: { color: '#FFFFFF', fontSize: 12, fontWeight: '700' },
  loadingBox: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scrollContent: { padding: 16, paddingBottom: 40 },
  card: {
    backgroundColor: '#111827',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  catBadge: { backgroundColor: 'rgba(99, 102, 241, 0.15)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  catBadgeText: { color: '#6366F1', fontSize: 10, fontWeight: '700' },
  statusTag: { fontSize: 11, fontWeight: '700' },
  cardTitle: { fontSize: 16, fontWeight: '700', color: '#F8FAFC', marginBottom: 6 },
  cardDesc: { fontSize: 13, color: '#94A3B8', lineHeight: 18, marginBottom: 12 },
  validationBox: {
    backgroundColor: '#0F172A',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(168, 85, 247, 0.2)',
  },
  valHeadRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 },
  valHeadText: { fontSize: 11, fontWeight: '700', color: '#A855F7' },
  valSub: { fontSize: 11, color: '#94A3B8', lineHeight: 16, marginBottom: 4 },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 14 },
  skillChip: { backgroundColor: '#1E293B', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  skillChipText: { fontSize: 10, color: '#38BDF8' },
  convertBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#6366F1',
    paddingVertical: 10,
    borderRadius: 8,
  },
  convertBtnText: { color: '#FFFFFF', fontSize: 12, fontWeight: '700' },
  convertedNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  convertedNoticeText: { color: '#10B981', fontSize: 11, fontWeight: '600' },
});
