import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  MessageSquare,
  Plus,
  Clock,
  Phone,
} from 'lucide-react-native';
import { leadsApi } from '../../src/api/domain.api';
import { LeadStatus } from '../../src/types';
import { Header } from '../../src/components/common/Header';
import { Button } from '../../src/components/common/Button';
import { Input } from '../../src/components/common/Input';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../../src/constants/theme';

export default function LeadDetailScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [newNote, setNewNote] = useState('');

  const { data: leads } = useQuery({
    queryKey: ['leads'],
    queryFn: () => leadsApi.getLeads(),
  });

  const lead = (leads || []).find((l) => l.id === id) || leads?.[0];

  const [currentStatus, setCurrentStatus] = useState<LeadStatus>(lead?.status || 'QUALIFIED');

  const [notesList, setNotesList] = useState<Array<{ id: string; text: string; date: string }>>([
    {
      id: '1',
      text: 'Initial technical scope shared. Architecture matches requirements with offline sync & background tracking.',
      date: 'Today, 2:30 PM',
    },
    {
      id: '2',
      text: 'Discovery call completed. Confirmed timeline for Sept delivery with 3 milestone sign-offs.',
      date: 'Yesterday, 5:00 PM',
    },
  ]);

  if (!lead) return null;

  const stages: LeadStatus[] = ['NEW', 'CONTACTED', 'IN_DISCUSSION', 'QUALIFIED', 'CONVERTED', 'LOST'];

  const handleStageChange = async (st: LeadStatus) => {
    setCurrentStatus(st);
    await leadsApi.updateLeadStatus(lead.id, st);
    queryClient.invalidateQueries({ queryKey: ['leads'] });
  };

  const handleAddNote = () => {
    if (!newNote.trim()) return;
    setNotesList([
      { id: Date.now().toString(), text: newNote.trim(), date: 'Just now' },
      ...notesList,
    ]);
    setNewNote('');
  };

  return (
    <View style={styles.container}>
      <Header
        title="LEAD ACTIVITY & CRM"
        subtitle="DEAL CONVERSION TRACKING"
        showBack
        onBack={() => router.back()}
      />

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Lead Info Card */}
        <View style={styles.leadHeaderCard}>
          <Image
            source={{
              uri:
                lead.contactAvatar ||
                'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
            }}
            style={styles.avatar}
          />
          <View style={styles.leadHeaderCol}>
            <Text style={styles.leadTitle}>{lead.title}</Text>
            <Text style={styles.contactName}>{lead.contactName}</Text>
            <View style={styles.sourceRow}>
              <Text style={styles.sourceBadge}>SOURCE: {lead.source}</Text>
            </View>
            <TouchableOpacity
              style={styles.leadPhonePill}
              onPress={() =>
                router.push({
                  pathname: '/call/active' as any,
                  params: {
                    callId: 'call_' + Date.now(),
                    peerName: lead.contactName || 'Vikram Singh',
                    peerAvatar:
                      lead.contactAvatar ||
                      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
                    callType: 'VOICE',
                    peerId: lead.contactUserId || 'usr_vikram_singh',
                    peerPhone: '+91 7200317219',
                    isIncoming: 'false',
                  },
                })
              }
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel="Call Vikram Singh directly at +91 7200317219"
            >
              <Phone size={11} color={COLORS.accent} />
              <Text style={styles.leadPhoneText}>+91 7200317219</Text>
              <View style={styles.leadPhoneBadge}>
                <Text style={styles.leadPhoneBadgeText}>IN-APP</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Estimated Value Card */}
        <View style={styles.valueCard}>
          <View>
            <Text style={styles.valueLabel}>ESTIMATED DEAL REVENUE</Text>
            <Text style={styles.valueText}>
              ₹{lead.estimatedValue ? lead.estimatedValue.toLocaleString('en-IN') : '100,000'}
            </Text>
          </View>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <Button
              title="Call Lead"
              variant="primary"
              size="sm"
              icon={<Phone size={14} color="#FFF" />}
              onPress={() =>
                router.push({
                  pathname: '/call/active' as any,
                  params: {
                    callId: 'call_' + Date.now(),
                    peerName: lead.contactName || 'Vikram Singh',
                    peerAvatar:
                      lead.contactAvatar ||
                      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
                    callType: 'VOICE',
                    peerId: lead.contactUserId || 'usr_vikram_singh',
                    peerPhone: '+91 7200317219',
                    isIncoming: 'false',
                  },
                })
              }
            />
            <Button
              title="Open Chat"
              variant="glass"
              size="sm"
              icon={<MessageSquare size={14} color={COLORS.primaryLight} />}
              onPress={() => router.push('/chat/conv_01' as any)}
            />
          </View>
        </View>

        {/* Pipeline Stage Transition Stepper */}
        <Text style={styles.sectionHeading}>Pipeline Stage Transition</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.stageScroll}
        >
          {stages.map((st) => {
            const isActive = currentStatus === st;
            const isWon = st === 'CONVERTED';
            return (
              <TouchableOpacity
                key={st}
                style={[
                  styles.stageChip,
                  isActive && (isWon ? styles.stageChipWon : styles.stageChipActive),
                ]}
                onPress={() => handleStageChange(st)}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.stageChipText,
                    isActive && styles.stageChipTextActive,
                  ]}
                >
                  {st.replace('_', ' ')}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Activity & Timeline Notes */}
        <Text style={styles.sectionHeading}>Activity Log & Deal Notes</Text>

        <View style={styles.noteInputRow}>
          <Input
            value={newNote}
            onChangeText={setNewNote}
            placeholder="Log call summary, client feedback, quote terms..."
            containerStyle={{ flex: 1, marginBottom: 0 }}
          />
          <Button
            title="Log"
            variant="primary"
            size="md"
            icon={<Plus size={14} color="#FFF" />}
            onPress={handleAddNote}
          />
        </View>

        <View style={styles.notesTimeline}>
          {notesList.map((n) => (
            <View key={n.id} style={styles.noteCard}>
              <Text style={styles.noteText}>{n.text}</Text>
              <View style={styles.noteFooter}>
                <Clock size={11} color={COLORS.textDim} />
                <Text style={styles.noteDate}>{n.date} • Logged by You</Text>
              </View>
            </View>
          ))}
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
  leadHeaderCard: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    marginBottom: SPACING.md,
    ...SHADOWS.sm,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.bgElevated,
    borderWidth: 1.5,
    borderColor: COLORS.borderLight,
  },
  leadHeaderCol: {
    flex: 1,
  },
  leadTitle: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: '800',
  },
  contactName: {
    color: COLORS.textSecondary,
    fontSize: 13,
    marginTop: 2,
  },
  sourceRow: {
    marginTop: 4,
  },
  sourceBadge: {
    color: COLORS.primaryLight,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  valueCard: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
    ...SHADOWS.sm,
  },
  valueLabel: {
    color: COLORS.primaryLight,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  valueText: {
    color: COLORS.accent,
    fontSize: 22,
    fontWeight: '900',
    marginTop: 2,
  },
  sectionHeading: {
    color: COLORS.textPrimary,
    fontSize: 14,
    fontWeight: '800',
    marginBottom: SPACING.sm,
    marginTop: SPACING.xs,
  },
  stageScroll: {
    flexDirection: 'row',
    marginBottom: SPACING.xl,
  },
  stageChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.bgCard,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginRight: SPACING.xs,
  },
  stageChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primaryLight,
  },
  stageChipWon: {
    backgroundColor: COLORS.accent,
    borderColor: COLORS.accentLight,
  },
  stageChipText: {
    color: COLORS.textMuted,
    fontSize: 12,
    fontWeight: '700',
  },
  stageChipTextActive: {
    color: '#FFF',
  },
  noteInputRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginBottom: SPACING.md,
    alignItems: 'center',
  },
  notesTimeline: {
    gap: SPACING.sm,
  },
  noteCard: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  noteText: {
    color: COLORS.textPrimary,
    fontSize: 13,
    lineHeight: 19,
  },
  noteFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 6,
  },
  noteDate: {
    color: COLORS.textDim,
    fontSize: 11,
  },
  leadPhonePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 4.5,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
    marginTop: 6,
    alignSelf: 'flex-start',
  },
  leadPhoneText: {
    color: COLORS.accent,
    fontSize: 11,
    fontWeight: '800',
  },
  leadPhoneBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.25)',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 3,
  },
  leadPhoneBadgeText: {
    color: COLORS.accent,
    fontSize: 7.5,
    fontWeight: '900',
    letterSpacing: 0.3,
  },
});
