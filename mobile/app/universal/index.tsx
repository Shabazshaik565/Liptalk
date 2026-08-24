import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  Search,
  Sparkles,
  Layers,
  ArrowRight,
  Briefcase,
  Users,
  ShoppingBag,
  BookOpen,
  Bot,
} from 'lucide-react-native';
import { usePersonalOsStore } from '../../src/store/personal-os.store';
import { Button } from '../../src/components/common/Button';
import { Badge } from '../../src/components/common/Badge';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../../src/constants/theme';

export default function UniversalSearchCommandScreen() {
  const router = useRouter();
  const { executeCommand, commandResult } = usePersonalOsStore();

  const [inputQuery, setInputQuery] = useState('');
  const [executing, setExecuting] = useState(false);

  const sampleCommands = [
    'Find wholesale FMCG commodity opportunities',
    'Open my autonomous agent platform',
    'Task: Audit OAuth API security rate limits',
    'Show GT vs MT supermarket arena',
  ];

  const handleRunCommand = async (cmd?: string) => {
    const target = cmd || inputQuery;
    if (!target.trim()) return;
    setExecuting(true);
    try {
      await executeCommand(target.trim());
    } finally {
      setExecuting(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Top Navigation */}
      <View style={styles.topNav}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={20} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.topNavTitle}>UNIVERSAL COMMAND & SEARCH</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Command Bar */}
        <View style={styles.commandBox}>
          <Search size={18} color={COLORS.primaryLight} />
          <TextInput
            style={styles.commandInput}
            placeholder="Type anything (search, navigate, task, agent)..."
            placeholderTextColor={COLORS.textDim}
            value={inputQuery}
            onChangeText={setInputQuery}
            onSubmitEditing={() => handleRunCommand()}
            autoFocus
          />
          <Button
            title={executing ? '...' : 'Run'}
            variant="primary"
            size="sm"
            onPress={() => handleRunCommand()}
          />
        </View>

        {/* Quick Sample Prompts */}
        <View style={styles.sampleWrap}>
          <Text style={styles.sampleHeading}>TRY NATURAL LANGUAGE COMMANDS:</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 4 }}>
            {sampleCommands.map((sc, i) => (
              <TouchableOpacity
                key={i}
                style={styles.sampleChip}
                onPress={() => {
                  setInputQuery(sc);
                  handleRunCommand(sc);
                }}
              >
                <Sparkles size={11} color={COLORS.primaryLight} />
                <Text style={styles.sampleText}>{sc}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Command Result & Routing */}
        {commandResult && (
          <View style={{ marginTop: SPACING.md }}>
            <View style={styles.intentCard}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Badge label={`INTENT: ${commandResult.intent}`} variant="purple" size="sm" />
                {commandResult.suggestedRoute && (
                  <TouchableOpacity
                    style={styles.routeBtn}
                    onPress={() => router.push(commandResult.suggestedRoute as any)}
                  >
                    <Text style={styles.routeBtnText}>Open {commandResult.suggestedRoute}</Text>
                    <ArrowRight size={12} color="#10B981" />
                  </TouchableOpacity>
                )}
              </View>
              {commandResult.message ? (
                <Text style={styles.messageText}>{commandResult.message}</Text>
              ) : null}
            </View>

            {/* Cross-Subsystem Unified Results */}
            {commandResult.results && (
              <View style={{ marginTop: SPACING.sm }}>
                <Text style={styles.sectionTitle}>Cross-Subsystem Unified Results</Text>

                {/* Opportunities */}
                {commandResult.results.opportunities && commandResult.results.opportunities.length > 0 && (
                  <View style={styles.resultGroup}>
                    <View style={styles.groupHeader}>
                      <Briefcase size={14} color="#60A5FA" />
                      <Text style={styles.groupTitle}>Commercial Opportunities</Text>
                    </View>
                    {commandResult.results.opportunities.map((opp: any) => (
                      <TouchableOpacity
                        key={opp.id}
                        style={styles.resultItem}
                        onPress={() => router.push('/opportunities' as any)}
                      >
                        <Text style={styles.resultItemTitle}>{opp.title}</Text>
                        <Text style={styles.resultItemSub}>B2B Wholesale Trade • Verified Brief</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}

                {/* Communities */}
                {commandResult.results.communities && commandResult.results.communities.length > 0 && (
                  <View style={styles.resultGroup}>
                    <View style={styles.groupHeader}>
                      <Users size={14} color="#EC4899" />
                      <Text style={styles.groupTitle}>Community Guilds</Text>
                    </View>
                    {commandResult.results.communities.map((comm: any) => (
                      <TouchableOpacity
                        key={comm.id}
                        style={styles.resultItem}
                        onPress={() => router.push('/(tabs)/communities' as any)}
                      >
                        <Text style={styles.resultItemTitle}>{comm.name || 'Trade Guild'}</Text>
                        <Text style={styles.resultItemSub}>Discussions & Shared Knowledge</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}

                {/* Marketplace */}
                {commandResult.results.marketplace && commandResult.results.marketplace.length > 0 && (
                  <View style={styles.resultGroup}>
                    <View style={styles.groupHeader}>
                      <ShoppingBag size={14} color="#10B981" />
                      <Text style={styles.groupTitle}>Marketplace Listings</Text>
                    </View>
                    {commandResult.results.marketplace.map((mkt: any) => (
                      <TouchableOpacity
                        key={mkt.id}
                        style={styles.resultItem}
                        onPress={() => router.push('/marketplace' as any)}
                      >
                        <Text style={styles.resultItemTitle}>{mkt.title}</Text>
                        <Text style={styles.resultItemSub}>Escrow Protected • Verified Supplier</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgDark,
  },
  topNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xl + 10,
    paddingBottom: SPACING.sm,
    backgroundColor: COLORS.bgDark,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.bgCard,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topNavTitle: {
    color: COLORS.textPrimary,
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.lg,
    paddingBottom: SPACING.tabBarClearance,
  },
  commandBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.xl,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.4)',
    gap: SPACING.xs,
    ...SHADOWS.md,
  },
  commandInput: {
    flex: 1,
    color: COLORS.textPrimary,
    fontSize: 13,
    paddingVertical: SPACING.xs,
  },
  sampleWrap: {
    marginTop: SPACING.md,
  },
  sampleHeading: {
    color: COLORS.textDim,
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  sampleChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.bgCard,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 5,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  sampleText: {
    color: COLORS.textMuted,
    fontSize: 11,
  },
  intentCard: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.sm,
  },
  routeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: RADIUS.sm,
  },
  routeBtnText: {
    color: '#10B981',
    fontSize: 11,
    fontWeight: '700',
  },
  messageText: {
    color: COLORS.textPrimary,
    fontSize: 12,
    marginTop: SPACING.xs,
    lineHeight: 16,
  },
  sectionTitle: {
    color: COLORS.textPrimary,
    fontSize: 13.5,
    fontWeight: '800',
    marginBottom: SPACING.xs,
  },
  resultGroup: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.sm,
  },
  groupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: SPACING.xs,
  },
  groupTitle: {
    color: COLORS.textPrimary,
    fontSize: 12.5,
    fontWeight: '800',
  },
  resultItem: {
    paddingVertical: SPACING.xs,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
  },
  resultItemTitle: {
    color: COLORS.textPrimary,
    fontSize: 12,
    fontWeight: '700',
  },
  resultItemSub: {
    color: COLORS.textDim,
    fontSize: 10.5,
    marginTop: 1,
  },
});
