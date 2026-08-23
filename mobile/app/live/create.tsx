import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useQueryClient } from '@tanstack/react-query';
import { Radio, Layers, Sparkles } from 'lucide-react-native';
import { Header } from '../../src/components/common/Header';
import { Input } from '../../src/components/common/Input';
import { Button } from '../../src/components/common/Button';
import { liveRoomsApi } from '../../src/api/domain.api';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../../src/constants/theme';

export default function CreateLiveRoomScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Engineering & Architecture');
  const [roomType, setRoomType] = useState<'NETWORKING' | 'WORKSHOP' | 'AMA'>('WORKSHOP');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!title.trim()) return;
    setLoading(true);
    try {
      const room = await liveRoomsApi.createRoom({
        title: title.trim(),
        description: description.trim(),
        category,
        roomType: roomType as any,
        coverImageUrl: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=600',
      });
      queryClient.invalidateQueries({ queryKey: ['live-rooms'] });
      router.replace(`/live/${room.id}` as any);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Header
        title="HOST LIVE STAGE"
        subtitle="BROADCAST TO NETWORK"
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
            <Radio size={22} color={COLORS.primaryLight} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.bannerTitle}>Start an Interactive Session</Text>
            <Text style={styles.bannerSub}>
              Share insights, answer live Q&A, and network with verified founders & specialists.
            </Text>
          </View>
        </View>

        <View style={styles.formCard}>
          <Input
            label="Stage Title *"
            value={title}
            onChangeText={setTitle}
            placeholder="e.g. Scaling React Native with SQLite Sync"
            icon={<Sparkles size={16} color={COLORS.primaryLight} />}
          />

          <Input
            label="Category / Topic Domain"
            value={category}
            onChangeText={setCategory}
            placeholder="e.g. Engineering & Architecture"
            icon={<Layers size={16} color={COLORS.primaryLight} />}
          />

          <Input
            label="Session Summary / Agenda"
            value={description}
            onChangeText={setDescription}
            placeholder="Outline topics, teardown goals, or Q&A format..."
            multiline
            numberOfLines={3}
            containerStyle={{ height: 90 }}
          />

          <View style={styles.actionContainer}>
            <Button
              title="Launch Stage Live Now"
              onPress={handleSubmit}
              loading={loading}
              disabled={!title.trim()}
              icon={<Radio size={16} color="#FFF" />}
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
