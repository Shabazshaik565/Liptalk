import {
  AIProvider,
  AICompletionOptions,
  AIGenerateResult,
  AIModerationResult,
  AIClassificationResult,
} from '../interfaces/ai-provider.interface';
import { HeuristicFallbackProvider } from './heuristic-fallback.provider';

export class GeminiAIProvider implements AIProvider {
  readonly name = 'gemini-ai';
  readonly providerType = 'GEMINI' as const;
  private fallbackProvider = new HeuristicFallbackProvider();
  private apiKey = process.env.GEMINI_API_KEY || '';

  async isAvailable(): Promise<boolean> {
    return Boolean(this.apiKey && this.apiKey.trim().length > 0);
  }

  async generateText(prompt: string, options?: AICompletionOptions): Promise<AIGenerateResult> {
    if (!this.apiKey) {
      return this.fallbackProvider.generateText(prompt, options);
    }

    const startTime = Date.now();
    try {
      const model = options?.model || 'gemini-1.5-flash';
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), options?.timeoutMs || 10000);

      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${this.apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: controller.signal,
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `${options?.systemInstruction ? options.systemInstruction + '\n\n' : ''}${prompt}`,
                  },
                ],
              },
            ],
            generationConfig: {
              temperature: options?.temperature ?? 0.4,
              maxOutputTokens: options?.maxTokens ?? 500,
            },
          }),
        },
      );
      clearTimeout(timeout);

      if (!res.ok) {
        return this.fallbackProvider.generateText(prompt, options);
      }

      const data = await res.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) return this.fallbackProvider.generateText(prompt, options);

      const inputTokens = data?.usageMetadata?.promptTokenCount || Math.ceil(prompt.length / 4);
      const outputTokens = data?.usageMetadata?.candidatesTokenCount || Math.ceil(text.length / 4);
      const latencyMs = Date.now() - startTime;
      const estimatedCostUsd = (inputTokens * 0.000075 + outputTokens * 0.0003) / 1000;

      return {
        text,
        model,
        provider: this.providerType,
        inputTokens,
        outputTokens,
        estimatedCostUsd,
        latencyMs,
      };
    } catch {
      return this.fallbackProvider.generateText(prompt, options);
    }
  }

  async generateStructuredJson<T = any>(prompt: string, schemaDescription: string, options?: AICompletionOptions): Promise<T> {
    if (!this.apiKey) {
      return this.fallbackProvider.generateStructuredJson<T>(prompt, schemaDescription, options);
    }

    try {
      const model = options?.model || 'gemini-1.5-flash';
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), options?.timeoutMs || 10000);

      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${this.apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: controller.signal,
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `System: You are an expert LipTalk business assistant. Return valid JSON adhering to: ${schemaDescription}\n\nUser Request: ${prompt}`,
                  },
                ],
              },
            ],
            generationConfig: {
              temperature: 0.2,
              responseMimeType: 'application/json',
            },
          }),
        },
      );
      clearTimeout(timeout);

      if (!res.ok) {
        return this.fallbackProvider.generateStructuredJson<T>(prompt, schemaDescription, options);
      }

      const data = await res.json();
      const rawJson = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!rawJson) return this.fallbackProvider.generateStructuredJson<T>(prompt, schemaDescription, options);

      return JSON.parse(rawJson);
    } catch {
      return this.fallbackProvider.generateStructuredJson<T>(prompt, schemaDescription, options);
    }
  }

  async generateEmbedding(text: string): Promise<number[]> {
    if (!this.apiKey) {
      return this.fallbackProvider.generateEmbedding(text);
    }

    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key=${this.apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: 'models/text-embedding-004',
            content: { parts: [{ text }] },
          }),
        },
      );

      if (!res.ok) {
        return this.fallbackProvider.generateEmbedding(text);
      }

      const data = await res.json();
      return data?.embedding?.values || this.fallbackProvider.generateEmbedding(text);
    } catch {
      return this.fallbackProvider.generateEmbedding(text);
    }
  }

  async moderate(text: string): Promise<AIModerationResult> {
    return this.fallbackProvider.moderate(text);
  }

  async classify(text: string, categories: string[]): Promise<AIClassificationResult> {
    return this.fallbackProvider.classify(text, categories);
  }

  computeSimilarity(vectorA: number[], vectorB: number[]): number {
    return this.fallbackProvider.computeSimilarity(vectorA, vectorB);
  }
}
