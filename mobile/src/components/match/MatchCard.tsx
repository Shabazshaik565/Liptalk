import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  X,
  Repeat,
  MapPin,
  MessageSquare,
  ShieldCheck,
  Zap,
} from 'lucide-react-native';
import { MatchResult } from '../../types';
import { COLORS, RADIUS, SPACING, SHADOWS } from '../../constants/theme';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';

interface MatchCardProps {
  match: MatchResult;
  onConnect?: () => void;
}

export const MatchCard: React.FC<MatchCardProps> = ({ match, onConnect }) => {
  const router = useRouter();
  const [showExplanation, setShowExplanation] = useState(false);

  const getScoreColor = (score: number) => {
    if (score >= 90) return COLORS.accent;
    if (score >= 75) return COLORS.warning;
    return COLORS.primary;
  };

  const getScoreGlow = (score: number) => {
    if (score >= 90) return 'rgba(16, 185, 129, 0.15)';
    if (score >= 75) return 'rgba(245, 158, 11, 0.15)';
    return 'rgba(139, 92, 246, 0.15)';
  };

  const scoreColor = getScoreColor(match.matchScore);
  const scoreGlow = getScoreGlow(match.matchScore);

  return (
    <>
      <View style={styles.card}>
        {/* Top Entity Bar */}
        <View style={styles.header}>
          <View style={styles.targetInfo}>
            <View style={styles.avatarWrapper}>
              <Image
                source={{
                  uri:
                    match.targetAvatar ||
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
                }}
                style={styles.avatar}
              />
              <View style={styles.onlinePill} />
            </View>
            <View style={styles.nameCol}>
              <View style={styles.nameRow}>
                <Text style={styles.name} numberOfLines={1}>
                  {match.targetName}
                </Text>
                <Badge
                  label={match.targetRole}
                  variant={match.targetRole === 'BUSINESS' ? 'primary' : 'neutral'}
                  size="sm"
                />
              </View>
              <View style={styles.locRow}>
                <MapPin size={11} color={COLORS.textDim} />
                <Text style={styles.city}>
                  {match.targetCity} • Verified Member
                </Text>
              </View>
            </View>
          </View>

          {/* Match Score Badge */}
          <TouchableOpacity
            style={[
              styles.scoreBadge,
              { borderColor: scoreColor, backgroundColor: scoreGlow },
            ]}
            onPress={() => setShowExplanation(true)}
            activeOpacity={0.8}
          >
            <Zap size={13} color={scoreColor} />
            <Text style={[styles.scoreText, { color: scoreColor }]}>
              {match.matchScorePercent}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Headline */}
        {match.targetHeadline && (
          <Text style={styles.headline} numberOfLines={2}>
            {match.targetHeadline}
          </Text>
        )}

        {/* Signature NEED <-> OFFER Synergy Bridge */}
        <View style={styles.synergyBridgeContainer}>
          <View style={styles.synergyHeader}>
            <Text style={styles.synergyHeaderLabel}>EXACT SYNERGY MATCH</Text>
            <Text style={[styles.synergyConfidenceText, { color: scoreColor }]}>
              {match.matchScore}% Confidence
            </Text>
          </View>

          <View style={styles.synergyContentRow}>
            {/* Left: You Need */}
            <View style={styles.synergySide}>
              <Text style={styles.synergySideLabel}>YOU NEED</Text>
              <View style={styles.synergyTagNeed}>
                <Text style={styles.synergyTagText} numberOfLines={2}>
                  {match.matchedNeedTitle || 'Digital Marketing'}
                </Text>
              </View>
            </View>

            {/* Center connector */}
            <View style={styles.connectorCenter}>
              <View style={styles.connectorLine} />
              <View style={[styles.connectorBadge, { backgroundColor: scoreColor }]}>
                <ArrowRight size={12} color="#000" />
              </View>
              <View style={styles.connectorLine} />
            </View>

            {/* Right: They Offer */}
            <View style={styles.synergySide}>
              <Text style={[styles.synergySideLabel, { color: COLORS.accent }]}>
                THEY OFFER
              </Text>
              <View style={styles.synergyTagOffer}>
                <Text style={styles.synergyTagText} numberOfLines={2}>
                  {match.matchedOfferTitle || 'Performance Lead Gen'}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Reciprocal 2-Way Synergy Badge */}
        {match.isReciprocal && (
          <View style={styles.reciprocalBanner}>
            <Repeat size={14} color={COLORS.accent} />
            <Text style={styles.reciprocalText} numberOfLines={1}>
              {match.reciprocalDetail || '2-Way Reciprocal Synergy (Mutual Exchange Possible)'}
            </Text>
          </View>
        )}

        {/* Primary Match Reason */}
        <TouchableOpacity
          style={styles.reasonRow}
          onPress={() => setShowExplanation(true)}
          activeOpacity={0.75}
        >
          <CheckCircle2 size={14} color={COLORS.accent} />
          <Text style={styles.reasonText} numberOfLines={1}>
            {match.primaryReason}
          </Text>
          <ChevronRight size={13} color={COLORS.textDim} />
        </TouchableOpacity>

        {/* Actions */}
        <View style={styles.actionRow}>
          <Button
            title="Why this Match?"
            variant="glass"
            size="sm"
            onPress={() => setShowExplanation(true)}
            style={{ flex: 1 }}
          />
          <Button
            title="Start Conversation"
            variant="primary"
            size="sm"
            icon={<MessageSquare size={14} color="#FFF" />}
            onPress={() => {
              if (onConnect) onConnect();
              else router.push('/chat' as any);
            }}
            style={{ flex: 1.35 }}
          />
        </View>
      </View>

      {/* Match Intelligence Breakdown Bottom Sheet Modal */}
      <Modal
        visible={showExplanation}
        transparent
        animationType="slide"
        onRequestClose={() => setShowExplanation(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.sheetHandle} />

            <View style={styles.modalHeader}>
              <View style={styles.modalTitleRow}>
                <Sparkles size={18} color={COLORS.primaryLight} />
                <Text style={styles.modalTitle}>Match Intelligence Engine</Text>
              </View>
              <TouchableOpacity
                onPress={() => setShowExplanation(false)}
                style={styles.closeBtn}
              >
                <X size={18} color={COLORS.textMuted} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Score Meter Spotlight */}
              <View style={styles.scoreHero}>
                <Text style={[styles.scoreHeroNumber, { color: scoreColor }]}>
                  {match.matchScorePercent}
                </Text>
                <Text style={styles.scoreHeroTitle}>High-Confidence Synergy Match</Text>
                <Text style={styles.scoreHeroDesc}>
                  Calculated deterministically using skill graph overlap, verified need-offer alignment, and regional vicinity.
                </Text>
              </View>

              {/* Factors Breakdown */}
              <Text style={styles.sectionTitle}>Algorithm Breakdown Factors</Text>
              <View style={styles.factorsList}>
                {match.reasons.map((r, i) => (
                  <View key={i} style={styles.factorCard}>
                    <View style={styles.factorLeft}>
                      <Text style={styles.factorName}>{r.factor}</Text>
                      <Text style={styles.factorDesc}>{r.description}</Text>
                    </View>
                    <View style={styles.factorPointBadge}>
                      <Text style={styles.factorPoints}>+{r.scoreContribution}%</Text>
                    </View>
                  </View>
                ))}
              </View>

              {/* Reciprocal Explainer if applicable */}
              {match.isReciprocal && (
                <View style={styles.reciprocalDetailCard}>
                  <Repeat size={16} color={COLORS.accent} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.reciprocalDetailTitle}>2-Way Synergy Opportunity</Text>
                    <Text style={styles.reciprocalDetailDesc}>
                      You have an active service offer that directly matches a published requirement for {match.targetName}.
                    </Text>
                  </View>
                </View>
              )}

              <Button
                title={`Connect with ${match.targetName.split(' ')[0]}`}
                variant="primary"
                size="lg"
                icon={<MessageSquare size={16} color="#FFF" />}
                onPress={() => {
                  setShowExplanation(false);
                  router.push('/chat' as any);
                }}
                style={{ marginTop: SPACING.lg, marginBottom: SPACING.md }}
              />
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.md,
    ...SHADOWS.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  targetInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    flex: 1,
  },
  avatarWrapper: {
    position: 'relative',
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: COLORS.bgElevated,
    borderWidth: 1.5,
    borderColor: COLORS.borderLight,
  },
  onlinePill: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.accent,
    borderWidth: 2,
    borderColor: COLORS.bgCard,
  },
  nameCol: {
    flex: 1,
    paddingRight: SPACING.xs,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  name: {
    color: COLORS.textPrimary,
    fontSize: 15,
    fontWeight: '800',
    flexShrink: 1,
  },
  locRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 2,
  },
  city: {
    color: COLORS.textDim,
    fontSize: 11,
    fontWeight: '500',
  },
  scoreBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: RADIUS.full,
    borderWidth: 1.2,
  },
  scoreText: {
    fontWeight: '900',
    fontSize: 13,
    letterSpacing: 0.2,
  },
  headline: {
    color: COLORS.textSecondary,
    fontSize: 13,
    lineHeight: 18,
    marginVertical: SPACING.xs,
  },
  synergyBridgeContainer: {
    backgroundColor: COLORS.bgInput,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginTop: SPACING.xs,
    marginBottom: SPACING.sm,
  },
  synergyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  synergyHeaderLabel: {
    color: COLORS.primaryLight,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1,
  },
  synergyConfidenceText: {
    fontSize: 10,
    fontWeight: '800',
  },
  synergyContentRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  synergySide: {
    flex: 1,
  },
  synergySideLabel: {
    color: COLORS.purpleLight,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  synergyTagNeed: {
    backgroundColor: COLORS.bgCard,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    minHeight: 38,
    justifyContent: 'center',
  },
  synergyTagOffer: {
    backgroundColor: 'rgba(16, 185, 129, 0.08)',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.25)',
    minHeight: 38,
    justifyContent: 'center',
  },
  synergyTagText: {
    color: COLORS.textPrimary,
    fontSize: 11,
    fontWeight: '700',
  },
  connectorCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  connectorLine: {
    width: 6,
    height: 1,
    backgroundColor: COLORS.borderLight,
  },
  connectorBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reciprocalBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    paddingHorizontal: SPACING.md,
    paddingVertical: 6,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.25)',
    marginBottom: SPACING.sm,
  },
  reciprocalText: {
    color: '#34D399',
    fontSize: 11,
    fontWeight: '800',
    flex: 1,
  },
  reasonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 4,
    marginBottom: SPACING.md,
  },
  reasonText: {
    color: COLORS.textMuted,
    fontSize: 12,
    flex: 1,
  },
  actionRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
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
    maxHeight: '85%',
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
    marginBottom: SPACING.md,
  },
  modalTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  modalTitle: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: '800',
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.bgElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreHero: {
    alignItems: 'center',
    paddingVertical: SPACING.lg,
    backgroundColor: COLORS.bgInput,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.lg,
  },
  scoreHeroNumber: {
    fontSize: 40,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  scoreHeroTitle: {
    color: COLORS.textPrimary,
    fontSize: 14,
    fontWeight: '800',
    marginTop: 2,
  },
  scoreHeroDesc: {
    color: COLORS.textMuted,
    fontSize: 11,
    textAlign: 'center',
    marginTop: 6,
    paddingHorizontal: SPACING.lg,
    lineHeight: 16,
  },
  sectionTitle: {
    color: COLORS.textPrimary,
    fontSize: 14,
    fontWeight: '800',
    marginBottom: SPACING.sm,
  },
  factorsList: {
    gap: SPACING.xs,
    marginBottom: SPACING.md,
  },
  factorCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.bgInput,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  factorLeft: {
    flex: 1,
    paddingRight: SPACING.sm,
  },
  factorName: {
    color: COLORS.textPrimary,
    fontSize: 13,
    fontWeight: '700',
  },
  factorDesc: {
    color: COLORS.textDim,
    fontSize: 11,
    marginTop: 2,
  },
  factorPointBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.xs,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  factorPoints: {
    color: COLORS.accent,
    fontSize: 12,
    fontWeight: '900',
  },
  reciprocalDetailCard: {
    flexDirection: 'row',
    gap: SPACING.sm,
    backgroundColor: 'rgba(16, 185, 129, 0.08)',
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.25)',
    marginVertical: SPACING.xs,
  },
  reciprocalDetailTitle: {
    color: COLORS.accent,
    fontSize: 12,
    fontWeight: '800',
  },
  reciprocalDetailDesc: {
    color: COLORS.textMuted,
    fontSize: 11,
    lineHeight: 15,
    marginTop: 2,
  },
});
