import { create } from 'zustand';
import {
  AiUserPreference,
  AiUserMemoryItem,
  AiUsageSummary,
  AiGatewayConfig,
  AiActionItem,
  GlobalTrendItem,
} from '../types';
import { aiGatewayApi, aiPreferencesApi } from '../api/domain.api';

interface AiState {
  preferences: AiUserPreference;
  memories: AiUserMemoryItem[];
  actions: AiActionItem[];
  trends: GlobalTrendItem[];
  usage: AiUsageSummary | null;
  config: AiGatewayConfig | null;
  loading: boolean;
  initialized: boolean;
  init: () => Promise<void>;
  updatePreferences: (data: Partial<AiUserPreference>) => Promise<void>;
  toggleScope: (scope: string) => Promise<void>;
  addMemory: (key: string, value: string, category?: any, isPinned?: boolean) => Promise<void>;
  deleteMemory: (id: string) => Promise<void>;
  clearAllMemories: () => Promise<void>;
  refreshUsage: () => Promise<void>;
  planAction: (actionType: any, targetEntity: string, payload: Record<string, any>) => Promise<AiActionItem>;
  confirmAction: (id: string) => Promise<void>;
  rejectAction: (id: string) => Promise<void>;
  fetchTrends: (params?: { scope?: string; country?: string; language?: string }) => Promise<void>;
}

export const useAiStore = create<AiState>((set, get) => ({
  preferences: {
    userId: 'usr_curr_01',
    aiPersonalizationEnabled: true,
    aiMemoryEnabled: true,
    aiContentAssistanceEnabled: true,
    aiRecommendationsEnabled: true,
    aiTranslationEnabled: true,
    aiAutonomousReadEnabled: true,
    aiAutonomousWriteEnabled: false,
    aiHighImpactConfirmEnabled: true,
    dataClassificationLevel: 'STANDARD',
    allowedScopes: ['ai.read', 'ai.search', 'ai.recommend', 'ai.summarize', 'ai.translate', 'ai.draft'],
  },
  memories: [],
  actions: [],
  trends: [],
  usage: null,
  config: null,
  loading: false,
  initialized: false,

  init: async () => {
    if (get().initialized) return;
    set({ loading: true });
    try {
      const [pref, mems, acts, trnds, usage, cfg] = await Promise.all([
        aiPreferencesApi.getPreferences(),
        aiGatewayApi.getMemories(),
        aiGatewayApi.getActions(),
        aiGatewayApi.getTrends(),
        aiGatewayApi.getUsage(),
        aiGatewayApi.getConfig(),
      ]);
      set({
        preferences: pref,
        memories: mems,
        actions: acts,
        trends: trnds,
        usage,
        config: cfg,
        initialized: true,
        loading: false,
      });
    } catch {
      set({ loading: false, initialized: true });
    }
  },

  updatePreferences: async (data: Partial<AiUserPreference>) => {
    const current = get().preferences;
    const optimistic = { ...current, ...data };
    set({ preferences: optimistic });
    try {
      const updated = await aiPreferencesApi.updatePreferences(data);
      set({ preferences: updated });
    } catch {
      set({ preferences: current });
    }
  },

  toggleScope: async (scope: string) => {
    const current = get().preferences;
    const currentScopes = current.allowedScopes || [];
    const newScopes = currentScopes.includes(scope)
      ? currentScopes.filter((s) => s !== scope)
      : [...currentScopes, scope];

    await get().updatePreferences({ allowedScopes: newScopes });
  },

  addMemory: async (key: string, value: string, category: any = 'PREFERENCE', isPinned = false) => {
    try {
      const newMem = await aiGatewayApi.saveMemory(key, value, category, isPinned);
      set((state) => ({
        memories: [newMem, ...state.memories.filter((m) => m.key !== key)],
      }));
    } catch {
      // Ignore
    }
  },

  deleteMemory: async (id: string) => {
    set((state) => ({
      memories: state.memories.filter((m) => m.id !== id),
    }));
    await aiGatewayApi.deleteMemory(id);
  },

  clearAllMemories: async () => {
    set({ memories: [] });
    await aiGatewayApi.clearAllMemories();
  },

  refreshUsage: async () => {
    try {
      const usage = await aiGatewayApi.getUsage();
      set({ usage });
    } catch {
      // Ignore
    }
  },

  planAction: async (actionType: any, targetEntity: string, payload: Record<string, any>) => {
    const action = await aiGatewayApi.planAction({ actionType, targetEntity, payload });
    set((state) => ({
      actions: [action, ...state.actions.filter((a) => a.id !== action.id)],
    }));
    return action;
  },

  confirmAction: async (id: string) => {
    try {
      const confirmed = await aiGatewayApi.confirmAction(id);
      set((state) => ({
        actions: state.actions.map((a) => (a.id === id ? confirmed : a)),
      }));
    } catch {
      // Ignore
    }
  },

  rejectAction: async (id: string) => {
    try {
      const rejected = await aiGatewayApi.rejectAction(id);
      set((state) => ({
        actions: state.actions.map((a) => (a.id === id ? rejected : a)),
      }));
    } catch {
      // Ignore
    }
  },

  fetchTrends: async (params?: { scope?: string; country?: string; language?: string }) => {
    try {
      const trends = await aiGatewayApi.getTrends(params);
      set({ trends });
    } catch {
      // Ignore
    }
  },
}));
