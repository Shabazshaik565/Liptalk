import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useQueryClient } from '@tanstack/react-query';
import { Sparkles, Layers, Send } from 'lucide-react-native';
import { Header } from '../../src/components/common/Header';
import { Input } from '../../src/components/common/Input';
import { Button } from '../../src/components/common/Button';
import { creatorApi } from '../../src/api/domain.api';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../../src/constants/theme';

export default function PublishBroadcastScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [tags, setTags] = useState('React Native, Mobile Architecture, Offline Sync');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!title.trim() || !body.trim()) return;
    setLoading(true);
    try {
      await creatorApi.publish({
        title: title.trim(),
        body: body.trim(),
        tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
        mediaUrls: ['https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600'],
      });
      queryClient.invalidateQueries({ queryKey: ['creator-feed'] });
      router.back();
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Header
        title="PUBLISH BROADCAST"
        subtitle="VERIFIED PROFESSIONAL POST"
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
            <Sparkles size={22} color={COLORS.primaryLight} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.bannerTitle}>Share High-Impact Insights</Text>
            <Text style={styles.bannerSub}>
              Broadcast engineering case studies, founder teardowns, and announcements to your verified network.
            </Text>
          </View>
        </View>

        <View style={styles.formCard}>
          <Input
            label="Broadcast Title *"
            value={title}
            onChangeText={setTitle}
            placeholder="e.g. How we achieved 60fps offline sync in React Native"
            icon={<Sparkles size={16} color={COLORS.primaryLight} />}
          />

          <Input
            label="Insights & Teardown Body *"
            value={body}
            onChangeText={setBody}
            placeholder="Explain methodology, architectural trade-offs, results, and recommendations..."
            multiline
            numberOfLines={5}
            containerStyle={{ height: 130 }}
          />

          <Input
            label="Topic Taxonomy Tags"
            value={tags}
            onChangeText={setTags}
            placeholder="React Native, Offline Sync, Cloud"
            icon={<Layers size={16} color={COLORS.primaryLight} />}
          />

          <View style={styles.actionContainer}>
            <Button
              title="Publish to Broadcast Feed"
              onPress={handleSubmit}
              loading={loading}
              disabled={!title.trim() || !body.trim()}
              icon={<Send size={16} color="#FFF" />}
              style={{ width: '100%' }}
            />
          </View>
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
    gap: SPACING.lg,
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    backgroundColor: COLORS.bgCard,
    padding: SPACING.lg,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.primaryDark,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(124, 58, 237, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerTitle: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 2,
  },
  bannerSub: {
    color: COLORS.textDim,
    fontSize: 12,
    lineHeight: 17,
  },
  formCard: {
    backgroundColor: COLORS.bgCard,
    padding: SPACING.lg,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: SPACING.md,
  },
  actionContainer: {
    marginTop: SPACING.sm,
  },
});
