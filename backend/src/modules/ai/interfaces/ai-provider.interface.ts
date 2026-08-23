export interface AICompletionOptions {
  temperature?: number;
  maxTokens?: number;
  systemInstruction?: string;
  responseFormat?: 'text' | 'json';
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
  generateText(prompt: string, options?: AICompletionOptions): Promise<string>;
  generateStructuredJson<T = any>(prompt: string, schemaDescription: string, options?: AICompletionOptions): Promise<T>;
  generateEmbedding(text: string): Promise<number[]>;
  computeSimilarity(vectorA: number[], vectorB: number[]): number;
}
