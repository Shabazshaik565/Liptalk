import { create } from 'zustand';
import {
  AgentItem,
  AgentWorkflowItem,
  KnowledgeCollectionItem,
  DeveloperAppItem,
  WebhookItem,
  AiTrustCenterInfo,
  AgentExecutionItem,
} from '../types';
import { agentApi, developerApi } from '../api/domain.api';

interface AgentsState {
  personalAgent: AgentItem | null;
  workflows: AgentWorkflowItem[];
  knowledge: KnowledgeCollectionItem[];
  apps: DeveloperAppItem[];
  webhooks: WebhookItem[];
  trustCenter: AiTrustCenterInfo | null;
  executions: AgentExecutionItem[];
  loading: boolean;
  initialized: boolean;
  init: () => Promise<void>;
  updateAgent: (data: Partial<AgentItem>) => Promise<void>;
  executeTask: (prompt: string) => Promise<AgentExecutionItem>;
  toggleWorkflow: (id: string, isActive: boolean) => Promise<void>;
  addKnowledgeItem: (collectionId: string, item: { title: string; content: string; itemType: any }) => Promise<void>;
  synthesizeKnowledge: (query: string) => Promise<{ synthesis: string; sources: string[] }>;
  createApp: (data: { name: string; description?: string; redirectUri?: string; scopes?: string[] }) => Promise<void>;
  rollApiKey: (id: string) => Promise<string>;
  createWebhook: (appId: string, targetUrl: string, subscribedEvents: string[]) => Promise<void>;
}

export const useAgentsStore = create<AgentsState>((set, get) => ({
  personalAgent: null,
  workflows: [],
  knowledge: [],
  apps: [],
  webhooks: [],
  trustCenter: null,
  executions: [],
  loading: false,
  initialized: false,

  init: async () => {
    if (get().initialized) return;
    set({ loading: true });
    try {
      const [ag, wfs, kn, apps, trust] = await Promise.all([
        agentApi.getPersonalAgent(),
        agentApi.getWorkflows(),
        agentApi.getKnowledge(),
        developerApi.getApps(),
        agentApi.getTrustCenter(),
      ]);

      let whs: WebhookItem[] = [];
      if (apps.length > 0) {
        whs = await developerApi.getWebhooks(apps[0].id);
      }

      set({
        personalAgent: ag,
        workflows: wfs,
        knowledge: kn,
        apps,
        webhooks: whs,
        trustCenter: trust,
        initialized: true,
        loading: false,
      });
    } catch {
      set({ loading: false, initialized: true });
    }
  },

  updateAgent: async (data: Partial<AgentItem>) => {
    const ag = get().personalAgent;
    if (!ag) return;
    try {
      const updated = await agentApi.updateAgent(ag.id, data);
      set({ personalAgent: updated });
    } catch {
      // Ignore
    }
  },

  executeTask: async (prompt: string) => {
    const ag = get().personalAgent;
    const agId = ag ? ag.id : 'agent_pers_01';
    const execution = await agentApi.executeTask(agId, prompt);
    set((state) => ({ executions: [execution, ...state.executions] }));
    return execution;
  },

  toggleWorkflow: async (id: string, isActive: boolean) => {
    set((state) => ({
      workflows: state.workflows.map((w) => (w.id === id ? { ...w, isActive } : w)),
    }));
    await agentApi.toggleWorkflow(id, isActive);
  },

  addKnowledgeItem: async (collectionId: string, item: { title: string; content: string; itemType: any }) => {
    await agentApi.addKnowledgeItem(collectionId, item);
    const updated = await agentApi.getKnowledge();
    set({ knowledge: updated });
  },

  synthesizeKnowledge: async (query: string) => {
    return agentApi.synthesizeKnowledge(query);
  },

  createApp: async (data) => {
    const newApp = await developerApi.createApp(data);
    set((state) => ({ apps: [newApp, ...state.apps] }));
  },

  rollApiKey: async (id: string) => {
    const res = await developerApi.rollApiKey(id);
    set((state) => ({
      apps: state.apps.map((a) => (a.id === id ? { ...a, apiKey: res.apiKey } : a)),
    }));
    return res.apiKey;
  },

  createWebhook: async (appId: string, targetUrl: string, subscribedEvents: string[]) => {
    const newWh = await developerApi.createWebhook(appId, targetUrl, subscribedEvents);
    set((state) => ({ webhooks: [newWh, ...state.webhooks] }));
  },
}));
