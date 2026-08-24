import { create } from 'zustand';
import {
  ReputationProfileItem,
  ProjectWorkspaceItem,
  CreatorServiceItem,
  RevenueSplitItem,
  SubscriptionItem,
  AgentStoreListingItem,
  MentorProfileItem,
} from '../types';
import { ecosystemApi } from '../api/domain.api';

interface EcosystemState {
  reputation: ReputationProfileItem | null;
  projects: ProjectWorkspaceItem[];
  creatorServices: CreatorServiceItem[];
  subscriptions: SubscriptionItem[];
  agentStore: AgentStoreListingItem[];
  mentors: MentorProfileItem[];
  matchedOpportunities: Array<{ opportunity: any; matchScore: number; matchReason: string }>;
  loading: boolean;
  initialized: boolean;
  init: () => Promise<void>;
  calculateSplit: (amount: number, currency?: string, hasCollaborator?: boolean, hasCommunity?: boolean) => Promise<RevenueSplitItem>;
}

export const useEcosystemStore = create<EcosystemState>((set, get) => ({
  reputation: null,
  projects: [],
  creatorServices: [],
  subscriptions: [],
  agentStore: [],
  mentors: [],
  matchedOpportunities: [],
  loading: false,
  initialized: false,

  init: async () => {
    if (get().initialized) return;
    set({ loading: true });
    try {
      const [rep, projs, cservs, subs, store, mtrs, opps] = await Promise.all([
        ecosystemApi.getReputation(),
        ecosystemApi.getProjects(),
        ecosystemApi.getCreatorServices(),
        ecosystemApi.getSubscriptions(),
        ecosystemApi.getAgentStore(),
        ecosystemApi.getMentors(),
        ecosystemApi.matchOpportunities(),
      ]);

      set({
        reputation: rep,
        projects: projs,
        creatorServices: cservs,
        subscriptions: subs,
        agentStore: store,
        mentors: mtrs,
        matchedOpportunities: opps,
        initialized: true,
        loading: false,
      });
    } catch {
      set({ loading: false, initialized: true });
    }
  },

  calculateSplit: async (amount: number, currency = 'INR', hasCollaborator = false, hasCommunity = false) => {
    return ecosystemApi.calculateRevenueSplit(amount, currency, hasCollaborator, hasCommunity);
  },
}));
