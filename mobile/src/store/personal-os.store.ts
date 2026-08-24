import { create } from 'zustand';
import {
  PersonalGoalItem,
  PersonalTaskItem,
  LearningPathItem,
  UniversalCommandResult,
} from '../types';
import { universalApi } from '../api/domain.api';

interface PersonalOsState {
  goals: PersonalGoalItem[];
  tasks: PersonalTaskItem[];
  learningPaths: LearningPathItem[];
  aiSummary: string;
  commandResult: UniversalCommandResult | null;
  ambientAnswer: string | null;
  loading: boolean;
  initialized: boolean;
  init: () => Promise<void>;
  createGoal: (data: Partial<PersonalGoalItem>) => Promise<void>;
  createTask: (data: Partial<PersonalTaskItem>) => Promise<void>;
  toggleTask: (id: string) => Promise<void>;
  executeCommand: (input: string) => Promise<UniversalCommandResult>;
  queryAmbient: (screenContext: string, query: string) => Promise<string>;
  simulateWorkflow: (workflow: { title: string; trigger: string; steps: string[] }) => Promise<any>;
}

export const usePersonalOsStore = create<PersonalOsState>((set, get) => ({
  goals: [],
  tasks: [],
  learningPaths: [],
  aiSummary: '',
  commandResult: null,
  ambientAnswer: null,
  loading: false,
  initialized: false,

  init: async () => {
    if (get().initialized) return;
    set({ loading: true });
    try {
      const data = await universalApi.getDashboard();
      set({
        goals: data.goals,
        tasks: data.tasks,
        learningPaths: data.learningPaths,
        aiSummary: data.aiSummary,
        initialized: true,
        loading: false,
      });
    } catch {
      set({ loading: false, initialized: true });
    }
  },

  createGoal: async (data) => {
    const goal = await universalApi.createGoal(data);
    set((state) => ({ goals: [...state.goals, goal] }));
  },

  createTask: async (data) => {
    const task = await universalApi.createTask(data);
    set((state) => ({ tasks: [task, ...state.tasks] }));
  },

  toggleTask: async (id: string) => {
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === id ? { ...t, status: t.status === 'DONE' ? 'TODO' : 'DONE' } : t,
      ),
    }));
    await universalApi.toggleTask(id);
  },

  executeCommand: async (input: string) => {
    const res = await universalApi.executeCommand(input);
    set({ commandResult: res });
    return res;
  },

  queryAmbient: async (screenContext: string, query: string) => {
    const res = await universalApi.queryAmbientContext(screenContext, query);
    set({ ambientAnswer: res.answer });
    return res.answer;
  },

  simulateWorkflow: async (workflow) => {
    return universalApi.simulateWorkflow(workflow);
  },
}));
