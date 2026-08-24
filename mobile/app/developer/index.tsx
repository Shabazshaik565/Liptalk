import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  Code2,
  Key,
  Webhook as WebhookIcon,
  RefreshCw,
  Plus,
  Copy,
  ExternalLink,
  Shield,
  Layers,
  Terminal,
} from 'lucide-react-native';
import { useAgentsStore } from '../../src/store/agents.store';
import { Button } from '../../src/components/common/Button';
import { Badge } from '../../src/components/common/Badge';
import { PillTabs } from '../../src/components/common/PillTabs';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../../src/constants/theme';

export default function DeveloperPortalScreen() {
  const router = useRouter();
  const { apps, webhooks, init, createApp, rollApiKey, createWebhook } = useAgentsStore();

  const [activeTab, setActiveTab] = useState<'APPS' | 'WEBHOOKS' | 'DOCS'>('APPS');
  const [showCreateApp, setShowCreateApp] = useState(false);
  const [newAppName, setNewAppName] = useState('');
  const [newAppDesc, setNewAppDesc] = useState('');
  const [newAppRedirect, setNewAppRedirect] = useState('');

  const [showCreateWh, setShowCreateWh] = useState(false);
  const [newWhUrl, setNewWhUrl] = useState('');

  useEffect(() => {
    init();
  }, []);

  const handleCreateApp = async () => {
    if (!newAppName.trim()) {
      Alert.alert('Required', 'Please enter an application name.');
      return;
    }
    await createApp({
      name: newAppName.trim(),
      description: newAppDesc.trim(),
      redirectUri: newAppRedirect.trim(),
      scopes: ['read:profile', 'read:marketplace', 'write:opportunities'],
    });
    setNewAppName('');
    setNewAppDesc('');
    setNewAppRedirect('');
    setShowCreateApp(false);
    Alert.alert('App Created', 'Live API Key and OAuth client generated successfully.');
  };

  const handleRollKey = async (appId: string) => {
    Alert.alert(
      'Roll API Key?',
      'Rolling your key will immediately invalidate the old secret. Connected services must be updated.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Roll Key',
          style: 'destructive',
          onPress: async () => {
            const key = await rollApiKey(appId);
            Alert.alert('New API Key Generated', key);
          },
        },
      ],
    );
  };

  const handleCreateWebhook = async () => {
    if (!newWhUrl.trim() || apps.length === 0) {
      Alert.alert('Required', 'Please enter a valid webhook target URL.');
      return;
    }
    await createWebhook(apps[0].id, newWhUrl.trim(), ['user.created', 'opportunity.created', 'order.completed']);
    setNewWhUrl('');
    setShowCreateWh(false);
    Alert.alert('Webhook Registered', 'Signed event deliveries will start automatically.');
  };

  return (
    <View style={styles.container}>
      {/* Top Navigation */}
      <View style={styles.topNav}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={20} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.topNavTitle}>DEVELOPER PLATFORM & APIS</Text>
        <View style={{ width: 36 }} />
      </View>

      {/* Tabs */}
      <View style={styles.tabWrap}>
        <PillTabs
          tabs={[
            { id: 'APPS', label: `My Apps (${apps.length})` },
            { id: 'WEBHOOKS', label: `Webhooks (${webhooks.length})` },
            { id: 'DOCS', label: 'API Reference' },
          ]}
          activeTab={activeTab}
          onTabChange={(t) => setActiveTab(t as any)}
        />
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* TAB 1: MY APPS */}
        {activeTab === 'APPS' && (
          <View>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>Registered Developer Applications</Text>
              <Button
                title="New App"
                variant="primary"
                size="sm"
                icon={<Plus size={13} color="#FFF" />}
                onPress={() => setShowCreateApp(!showCreateApp)}
              />
            </View>

            {showCreateApp && (
              <View style={styles.createBox}>
                <Text style={styles.createBoxTitle}>Register New Developer Application</Text>
                <TextInput
                  style={styles.input}
                  placeholder="App Name (e.g. Acme CRM Sync)"
                  placeholderTextColor={COLORS.textDim}
                  value={newAppName}
                  onChangeText={setNewAppName}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Description"
                  placeholderTextColor={COLORS.textDim}
                  value={newAppDesc}
                  onChangeText={setNewAppDesc}
                />
                <TextInput
                  style={styles.input}
                  placeholder="OAuth Redirect URI (https://...)"
                  placeholderTextColor={COLORS.textDim}
                  value={newAppRedirect}
                  onChangeText={setNewAppRedirect}
                />
                <View style={{ flexDirection: 'row', gap: SPACING.sm, marginTop: SPACING.xs }}>
                  <Button title="Save & Generate Key" variant="primary" size="sm" onPress={handleCreateApp} />
                  <Button title="Cancel" variant="outline" size="sm" onPress={() => setShowCreateApp(false)} />
                </View>
              </View>
            )}

            {apps.map((app) => (
              <View key={app.id} style={styles.appCard}>
                <View style={styles.appHeader}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.appName}>{app.name}</Text>
                    <Text style={styles.appDesc}>{app.description}</Text>
                  </View>
                  <Badge label={app.isActive ? 'ACTIVE' : 'INACTIVE'} variant="success" size="sm" />
                </View>

                {/* API Key Box */}
                <View style={styles.keyBox}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.keyLabel}>LIVE API KEY</Text>
                    <Text style={styles.keyValue}>{app.apiKey}</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.rollBtn}
                    onPress={() => handleRollKey(app.id)}
                  >
                    <RefreshCw size={14} color={COLORS.primaryLight} />
                  </TouchableOpacity>
                </View>

                {/* Scopes */}
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginTop: SPACING.sm }}>
                  {app.scopes?.map((sc, i) => (
                    <Badge key={i} label={sc} variant="neutral" size="sm" />
                  ))}
                </View>

                <View style={styles.appFooter}>
                  <Text style={styles.rateLimitText}>⚡ Rate Limit: {app.rateLimitPerMinute} req/min</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* TAB 2: WEBHOOKS */}
        {activeTab === 'WEBHOOKS' && (
          <View>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>Event-Driven Webhook Endpoints</Text>
              <Button
                title="Add Webhook"
                variant="primary"
                size="sm"
                icon={<Plus size={13} color="#FFF" />}
                onPress={() => setShowCreateWh(!showCreateWh)}
              />
            </View>

            {showCreateWh && (
              <View style={styles.createBox}>
                <Text style={styles.createBoxTitle}>Register Webhook URL</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Target URL (https://api.yourdomain.com/webhooks)"
                  placeholderTextColor={COLORS.textDim}
                  value={newWhUrl}
                  onChangeText={setNewWhUrl}
                />
                <View style={{ flexDirection: 'row', gap: SPACING.sm, marginTop: SPACING.xs }}>
                  <Button title="Save Endpoint" variant="primary" size="sm" onPress={handleCreateWebhook} />
                  <Button title="Cancel" variant="outline" size="sm" onPress={() => setShowCreateWh(false)} />
                </View>
              </View>
            )}

            {webhooks.map((wh) => (
              <View key={wh.id} style={styles.appCard}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: SPACING.xs }}>
                  <WebhookIcon size={16} color="#10B981" />
                  <Text style={styles.whUrl}>{wh.targetUrl}</Text>
                </View>
                <Text style={styles.whSecret}>Secret: {wh.secretToken}</Text>
                <View style={{ flexDirection: 'row', gap: 4, marginTop: SPACING.xs }}>
                  {wh.subscribedEvents?.map((ev, i) => (
                    <Badge key={i} label={ev} variant="purple" size="sm" />
                  ))}
                </View>
                <View style={styles.appFooter}>
                  <Text style={styles.rateLimitText}>✓ Deliveries: {wh.deliveriesCount} • Failures: {wh.failuresCount}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* TAB 3: DOCS */}
        {activeTab === 'DOCS' && (
          <View>
            <Text style={styles.sectionTitle}>Public REST API Reference (v10.0)</Text>

            <View style={styles.card}>
              {[
                { method: 'GET', endpoint: '/api/v1/opportunities', desc: 'Query active commercial contracts' },
                { method: 'POST', endpoint: '/api/v1/opportunities', desc: 'Create business demand scope' },
                { method: 'GET', endpoint: '/api/v1/marketplace', desc: 'Search B2B listings & offerings' },
                { method: 'POST', endpoint: '/api/v1/ai/agents/dispatch', desc: 'Dispatch autonomous agent workflows' },
                { method: 'GET', endpoint: '/api/v1/trends', desc: 'Query regional and global trend velocity' },
              ].map((ep, i) => (
                <View key={i}>
                  <View style={styles.endpointRow}>
                    <Badge label={ep.method} variant={ep.method === 'GET' ? 'neutral' : 'success'} size="sm" />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.endpointPath}>{ep.endpoint}</Text>
                      <Text style={styles.endpointDesc}>{ep.desc}</Text>
                    </View>
                  </View>
                  {i < 4 && <View style={styles.rowDivider} />}
                </View>
              ))}
            </View>

            <View style={styles.authInfoBox}>
              <Terminal size={16} color={COLORS.primaryLight} />
              <Text style={styles.authInfoText}>
                Authenticate via Bearer header:{'\n'}
                <Text style={{ fontFamily: 'monospace', color: '#FFF' }}>
                  Authorization: Bearer ltk_live_...
                </Text>
              </Text>
            </View>
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
  tabWrap: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.xs,
    backgroundColor: COLORS.bgDark,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.lg,
    paddingBottom: SPACING.tabBarClearance,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  sectionTitle: {
    color: COLORS.textPrimary,
    fontSize: 13.5,
    fontWeight: '800',
    marginBottom: SPACING.xs,
  },
  createBox: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.primaryDark,
    marginBottom: SPACING.md,
  },
  createBoxTitle: {
    color: COLORS.textPrimary,
    fontSize: 12.5,
    fontWeight: '800',
    marginBottom: SPACING.xs,
  },
  input: {
    backgroundColor: COLORS.bgInput,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    color: COLORS.textPrimary,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    fontSize: 12,
    marginBottom: SPACING.xs,
  },
  appCard: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.sm,
  },
  appHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  appName: {
    color: COLORS.textPrimary,
    fontSize: 13.5,
    fontWeight: '800',
  },
  appDesc: {
    color: COLORS.textMuted,
    fontSize: 11,
    marginTop: 2,
    lineHeight: 15,
  },
  keyBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.bgDark,
    borderRadius: RADIUS.md,
    padding: SPACING.sm,
    marginTop: SPACING.sm,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  keyLabel: {
    color: COLORS.textDim,
    fontSize: 9,
    fontWeight: '800',
  },
  keyValue: {
    color: COLORS.primaryLight,
    fontSize: 11,
    fontFamily: 'monospace',
    marginTop: 1,
  },
  rollBtn: {
    padding: 6,
  },
  appFooter: {
    marginTop: SPACING.sm,
    paddingTop: SPACING.xs,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
  },
  rateLimitText: {
    color: COLORS.textDim,
    fontSize: 10.5,
  },
  whUrl: {
    color: COLORS.textPrimary,
    fontSize: 12.5,
    fontWeight: '700',
  },
  whSecret: {
    color: COLORS.textDim,
    fontSize: 10,
    fontFamily: 'monospace',
    marginTop: 2,
  },
  card: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
  endpointRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    gap: SPACING.sm,
  },
  endpointPath: {
    color: COLORS.textPrimary,
    fontSize: 12,
    fontFamily: 'monospace',
    fontWeight: '700',
  },
  endpointDesc: {
    color: COLORS.textMuted,
    fontSize: 10.5,
    marginTop: 1,
  },
  rowDivider: {
    height: 1,
    backgroundColor: COLORS.border,
  },
  authInfoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginTop: SPACING.md,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.25)',
  },
  authInfoText: {
    color: COLORS.textMuted,
    fontSize: 11.5,
    lineHeight: 16,
  },
});
