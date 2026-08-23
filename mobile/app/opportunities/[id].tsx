import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Modal,
  TouchableOpacity,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Calendar,
  IndianRupee,
  MapPin,
  Sparkles,
  Send,
  X,
  CheckCircle2,
} from 'lucide-react-native';
import { opportunitiesApi, leadsApi } from '../../src/api/domain.api';
import { Header } from '../../src/components/common/Header';
import { Badge } from '../../src/components/common/Badge';
import { Button } from '../../src/components/common/Button';
import { Input } from '../../src/components/common/Input';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../../src/constants/theme';

export default function OpportunityDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const queryClient = useQueryClient();
  const [pitchModalOpen, setPitchModalOpen] = useState(false);
  const [pitchText, setPitchText] = useState('');
  const [pitchAmount, setPitchAmount] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const { data: opp } = useQuery({
    queryKey: ['opportunity', id],
    queryFn: () => opportunitiesApi.getOpportunityById(id || 'opp_01'),
  });

  if (!opp) return null;

  const handleSendPitch = async () => {
    if (!pitchText) return;
    await opportunitiesApi.expressInterest(opp.id, pitchText);
    await leadsApi.createLead({
      businessId: 'biz_01',
      contactUserId: opp.creatorId,
      contactName: opp.creatorName,
      opportunityId: opp.id,
      title: `${opp.creatorName} - ${opp.title.slice(0, 30)}...`,
      estimatedValue: pitchAmount ? parseInt(pitchAmount, 10) : opp.budgetAmount,
      source: 'OPPORTUNITY',
    });
    queryClient.invalidateQueries({ queryKey: ['leads'] });
    queryClient.invalidateQueries({ queryKey: ['opportunity', id] });
    setSubmitted(true);
    setPitchModalOpen(false);
  };

  return (
    <View style={styles.container}>
      <Header
        title="OPPORTUNITY SCOPE"
        subtitle="REQUIREMENT SPECIFICATION"
        showBack
        onBack={() => router.back()}
      />

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Match Highlight Banner */}
        {opp.matchScore && (
          <View style={styles.matchBanner}>
            <Sparkles size={16} color={COLORS.accent} />
            <Text style={styles.matchBannerText}>
              <Text style={{ fontWeight: '900' }}>{opp.matchScore}% Synergy Match:</Text>{' '}
              Your active engineering offerings directly match this requirement.
            </Text>
          </View>
        )}

        {/* Creator Info Card */}
        <View style={styles.creatorCard}>
          <Image
            source={{
              uri:
                opp.creatorAvatar ||
                'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
            }}
            style={styles.avatar}
          />
          <View style={styles.creatorCol}>
            <View style={styles.creatorNameRow}>
              <Text style={styles.creatorName}>{opp.creatorName}</Text>
              <Badge label={opp.status} variant="accent" size="sm" />
            </View>
            <Text style={styles.bizName}>
              {opp.businessName || 'Verified Organization'}
            </Text>
            <View style={styles.locRow}>
              <MapPin size={11} color={COLORS.textDim} />
              <Text style={styles.locText}>{opp.city}</Text>
            </View>
          </View>
        </View>

        {/* Opportunity Title & Category */}
        <Text style={styles.title}>{opp.title}</Text>
        <Text style={styles.categoryLabel}>{opp.categoryName}</Text>

        {/* Scope and Deliverables */}
        <Text style={styles.sectionHeading}>Project Scope & Objectives</Text>
        <Text style={styles.description}>{opp.description}</Text>

        {/* Required Skills & Technologies */}
        <Text style={styles.sectionHeading}>Required Skills & Technologies</Text>
        <View style={styles.tagsRow}>
          {opp.tags.map((tag, idx) => (
            <Badge key={idx} label={tag} variant="purple" size="md" />
          ))}
        </View>

        {/* Budget and Project Timeline */}
        <View style={styles.metaCard}>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>ESTIMATED BUDGET</Text>
            <View style={styles.budgetRow}>
              <Text style={styles.budgetText}>
                {opp.budgetAmount ? `₹${opp.budgetAmount.toLocaleString('en-IN')}` : 'Negotiable'}
              </Text>
            </View>
          </View>

          <View style={styles.metaDivider} />

          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>TARGET COMPLETION</Text>
            <View style={styles.budgetRow}>
              <Calendar size={14} color={COLORS.textSecondary} />
              <Text style={styles.deadlineText}>{opp.deadline || 'Flexible'}</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Floating Bottom Proposal Action */}
      <View style={styles.bottomBar}>
        <Button
          title={
            submitted || opp.hasExpressedInterest
              ? 'Proposal Submitted'
              : 'Submit Pitch & Quote'
          }
          variant={submitted || opp.hasExpressedInterest ? 'glass' : 'primary'}
          size="lg"
          disabled={submitted || opp.hasExpressedInterest}
          icon={
            submitted || opp.hasExpressedInterest ? (
              <CheckCircle2 size={18} color={COLORS.accent} />
            ) : (
              <Send size={18} color="#FFF" />
            )
          }
          onPress={() => setPitchModalOpen(true)}
        />
      </View>

      {/* Pitch / Proposal Submission Modal */}
      <Modal visible={pitchModalOpen} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.sheetHandle} />

            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Submit Your Proposal</Text>
              <TouchableOpacity onPress={() => setPitchModalOpen(false)}>
                <X size={20} color={COLORS.textMuted} />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalSub}>
              Pitch your team's relevant portfolio, architecture capabilities, and estimated budget to {opp.creatorName}.
            </Text>

            <Input
              label="Proposal Pitch & Relevant Track Record"
              value={pitchText}
              onChangeText={setPitchText}
              placeholder="Hi Vikram, our engineering team has built production apps with background sync..."
              multiline
              numberOfLines={4}
              style={{ height: 95, textAlignVertical: 'top' }}
            />

            <Input
              label="Your Estimated Quote (₹ INR)"
              value={pitchAmount}
              onChangeText={setPitchAmount}
              placeholder={opp.budgetAmount?.toString() || '350000'}
              keyboardType="numeric"
              icon={<IndianRupee size={16} color={COLORS.textDim} />}
            />

            <Button
              title="Submit Proposal & Open Chat"
              variant="primary"
              size="lg"
              icon={<Send size={18} color="#FFF" />}
              onPress={handleSendPitch}
              style={{ marginTop: SPACING.sm }}
            />
          </View>
        </View>
      </Modal>
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
    paddingBottom: 110,
  },
  matchBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  matchBannerText: {
    color: '#34D399',
    fontSize: 12,
    flex: 1,
    lineHeight: 17,
  },
  creatorCard: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.xl,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    marginBottom: SPACING.lg,
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
  creatorCol: {
    flex: 1,
  },
  creatorNameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  creatorName: {
    color: COLORS.textPrimary,
    fontSize: 15,
    fontWeight: '800',
  },
  bizName: {
    color: COLORS.textDim,
    fontSize: 12,
    marginTop: 1,
  },
  locRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  locText: {
    color: COLORS.textDim,
    fontSize: 11,
  },
  title: {
    color: COLORS.textPrimary,
    fontSize: 20,
    fontWeight: '900',
    lineHeight: 26,
    marginBottom: 4,
  },
  categoryLabel: {
    color: COLORS.primaryLight,
    fontSize: 13,
    fontWeight: '700',
    marginBottom: SPACING.lg,
  },
  sectionHeading: {
    color: COLORS.textPrimary,
    fontSize: 14,
    fontWeight: '800',
    marginTop: SPACING.md,
    marginBottom: SPACING.xs,
  },
  description: {
    color: COLORS.textSecondary,
    fontSize: 13.5,
    lineHeight: 21,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  metaCard: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.xl,
    ...SHADOWS.sm,
  },
  metaItem: {
    flex: 1,
  },
  metaDivider: {
    width: 1,
    height: 32,
    backgroundColor: COLORS.borderLight,
    marginHorizontal: SPACING.md,
  },
  metaLabel: {
    color: COLORS.primaryLight,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  budgetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  budgetText: {
    color: COLORS.accent,
    fontSize: 16,
    fontWeight: '900',
  },
  deadlineText: {
    color: COLORS.textPrimary,
    fontSize: 13,
    fontWeight: '700',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.bgGlass,
    padding: SPACING.lg,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    ...SHADOWS.md,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: COLORS.bgCard,
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    padding: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  sheetHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.borderLight,
    alignSelf: 'center',
    marginBottom: SPACING.md,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  modalTitle: {
    color: COLORS.textPrimary,
    fontSize: 18,
    fontWeight: '800',
  },
  modalSub: {
    color: COLORS.textMuted,
    fontSize: 13,
    marginBottom: SPACING.lg,
    lineHeight: 18,
  },
});
