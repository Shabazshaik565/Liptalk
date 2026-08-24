export interface AICompletionOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  systemInstruction?: string;
  responseFormat?: 'text' | 'json';
  timeoutMs?: number;
  userId?: string;
  feature?: string;
}

export interface AIGenerateResult {
  text: string;
  model: string;
  provider: string;
  inputTokens: number;
  outputTokens: number;
  estimatedCostUsd: number;
  latencyMs: number;
}

export interface AIModerationResult {
  isFlagged: boolean;
  categories: {
    hateSpeech: boolean;
    harassment: boolean;
    sexualContent: boolean;
    dangerousContent: boolean;
    spamOrPhishing: boolean;
  };
  confidenceScore: number;
  reason?: string;
}

export interface AIClassificationResult {
  primaryCategory: string;
  confidence: number;
  allScores: Record<string, number>;
}

export interface StructuredExtractionResult<T = any> {
  success: boolean;
  data?: T;
  rawText?: string;
  error?: string;
}

export interface SemanticEmbedding {
  vector: number[];
  dimensions: number;
}

export interface NaturalLanguageIntent {
  action: 'FIND_PEOPLE' | 'FIND_SERVICES' | 'FIND_OPPORTUNITIES' | 'FIND_COMMUNITIES' | 'CREATE_NEED' | 'CREATE_OFFER' | 'GENERAL_ASSIST';
  category?: string;
  skills?: string[];
  location?: string;
  keywords: string[];
  rawQuery: string;
}

export interface AIProvider {
  readonly name: string;
  readonly providerType: 'GEMINI' | 'OPENAI' | 'ANTHROPIC' | 'HEURISTIC';
  isAvailable(): Promise<boolean>;
  generateText(prompt: string, options?: AICompletionOptions): Promise<AIGenerateResult>;
  generateStructuredJson<T = any>(prompt: string, schemaDescription: string, options?: AICompletionOptions): Promise<T>;
  generateEmbedding(text: string): Promise<number[]>;
  moderate(text: string): Promise<AIModerationResult>;
  classify(text: string, categories: string[]): Promise<AIClassificationResult>;
  computeSimilarity(vectorA: number[], vectorB: number[]): number;
}
