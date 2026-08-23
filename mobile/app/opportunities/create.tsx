import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useQueryClient } from '@tanstack/react-query';
import {
  Briefcase,
  IndianRupee,
  Calendar,
  Sparkles,
  MapPin,
  Send,
  Layers,
} from 'lucide-react-native';
import { Header } from '../../src/components/common/Header';
import { Input } from '../../src/components/common/Input';
import { Button } from '../../src/components/common/Button';
import { opportunitiesApi, aiApi } from '../../src/api/domain.api';
import { SmartAssistButton } from '../../src/components/ai/SmartAssistButton';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../../src/constants/theme';

export default function CreateOpportunityScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [title, setTitle] = useState('');
  const [categoryName, setCategoryName] = useState('IT & Software Development');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [budgetAmount, setBudgetAmount] = useState('');
  const [deadline, setDeadline] = useState('2026-10-31');
  const [city, setCity] = useState('Bangalore');
  const [loading, setLoading] = useState(false);
  const [aiDrafting, setAiDrafting] = useState(false);

  const handleAiDraft = async () => {
    const draftInput = title || description || 'Need mobile app development with React Native and cloud backend';
    setAiDrafting(true);
    try {
      const suggestion = await aiApi.smartOpportunity(draftInput);
      if (suggestion.title) setTitle(suggestion.title);
      if (suggestion.category) setCategoryName(suggestion.category);
      if (suggestion.tags) setTags(suggestion.tags.join(', '));
      if (suggestion.description) setDescription(suggestion.description);
    } finally {
      setAiDrafting(false);
    }
  };

  const handleSubmit = async () => {
    if (!title.trim()) return;
    setLoading(true);
    try {
      await opportunitiesApi.createOpportunity({
        title: title.trim(),
        categoryName,
        description: description.trim(),
        tags: tags ? tags.split(',').map((t) => t.trim()).filter(Boolean) : ['General'],
        budgetAmount: budgetAmount ? parseInt(budgetAmount, 10) : undefined,
        deadline,
        city,
      });
      queryClient.invalidateQueries({ queryKey: ['opportunities'] });
      router.back();
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Header
        title="POST REQUIREMENT"
        subtitle="BROADCAST TO VERIFIED NETWORK"
        showBack
        onBack={() => router.back()}
      />

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.banner}>
          <View style={styles.iconCircle}>
            <Briefcase size={22} color={COLORS.primaryLight} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.bannerTitle}>Broadcast Demand to Network</Text>
            <Text style={styles.bannerSub}>
              Reach verified agencies and independent specialists with automated matching.
            </Text>
          </View>
        </View>

        <View style={styles.formCard}>
          <SmartAssistButton
            title="Auto-Fill Scope with AI"
            loading={aiDrafting}
            onPress={handleAiDraft}
            variant="purple"
          />

          <Input
            label="Requirement Title *"
            value={title}
            onChangeText={setTitle}
            placeholder="e.g. Flutter Developer for E-Commerce App"
            icon={<Sparkles size={16} color={COLORS.primaryLight} />}
          />

          <Input
            label="Industry / Domain Category"
            value={categoryName}
            onChangeText={setCategoryName}
            placeholder="e.g. IT & Software Development"
            icon={<Layers size={16} color={COLORS.primaryLight} />}
          />

          <Input
            label="Detailed Scope / Description"
            value={description}
            onChangeText={setDescription}
            placeholder="Describe deliverables, required tech stack, timeline..."
            multiline
            numberOfLines={4}
            containerStyle={{ height: 110 }}
          />

          <Input
            label="Key Skills / Tags (comma-separated)"
            value={tags}
            onChangeText={setTags}
            placeholder="Flutter, Firebase, Stripe, Node.js"
          />

          <View style={styles.twoCol}>
            <View style={{ flex: 1 }}>
              <Input
                label="Estimated Budget (₹)"
                value={budgetAmount}
                onChangeText={setBudgetAmount}
                placeholder="75000"
                keyboardType="numeric"
                icon={<IndianRupee size={16} color={COLORS.accent} />}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Input
                label="City / Hub"
                value={city}
                onChangeText={setCity}
                placeholder="Bangalore"
                icon={<MapPin size={16} color={COLORS.textDim} />}
              />
            </View>
          </View>

          <Input
            label="Target Deadline (YYYY-MM-DD)"
            value={deadline}
            onChangeText={setDeadline}
            placeholder="2026-10-31"
            icon={<Calendar size={16} color={COLORS.textDim} />}
          />

          <Button
            title={loading ? 'Broadcasting...' : 'Publish Requirement'}
            variant="primary"
            size="lg"
            icon={<Send size={18} color="#FFF" />}
            onPress={handleSubmit}
            disabled={loading || !title.trim()}
            style={{ marginTop: SPACING.md }}
          />
        </View>
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.purpleSoft,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
  },
  bannerTitle: {
    color: COLORS.textPrimary,
    fontSize: 15,
    fontWeight: '800',
  },
  bannerSub: {
    color: COLORS.textMuted,
    fontSize: 12,
    lineHeight: 16,
    marginTop: 2,
  },
  formCard: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: SPACING.xs,
    ...SHADOWS.sm,
  },
  twoCol: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
});
