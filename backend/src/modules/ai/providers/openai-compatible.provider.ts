import {
  AIProvider,
  AICompletionOptions,
  AIGenerateResult,
  AIModerationResult,
  AIClassificationResult,
} from '../interfaces/ai-provider.interface';
import { HeuristicFallbackProvider } from './heuristic-fallback.provider';

export class OpenAICompatibleProvider implements AIProvider {
  readonly name = 'openai-compatible';
  readonly providerType = 'OPENAI' as const;
  private fallbackProvider = new HeuristicFallbackProvider();
  private apiKey = process.env.OPENAI_API_KEY || '';
  private baseUrl = process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1';

  async isAvailable(): Promise<boolean> {
    return Boolean(this.apiKey && this.apiKey.trim().length > 0);
  }

  async generateText(prompt: string, options?: AICompletionOptions): Promise<AIGenerateResult> {
    if (!this.apiKey) {
      return this.fallbackProvider.generateText(prompt, options);
    }

    const startTime = Date.now();
    try {
      const model = options?.model || 'gpt-4o-mini';
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), options?.timeoutMs || 10000);

      const messages: any[] = [];
      if (options?.systemInstruction) {
        messages.push({ role: 'system', content: options.systemInstruction });
      }
      messages.push({ role: 'user', content: prompt });

      const res = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`,
        },
        signal: controller.signal,
        body: JSON.stringify({
          model,
          messages,
          temperature: options?.temperature ?? 0.4,
          max_tokens: options?.maxTokens ?? 500,
        }),
      });
      clearTimeout(timeout);

      if (!res.ok) {
        return this.fallbackProvider.generateText(prompt, options);
      }

      const data = await res.json();
      const text = data?.choices?.[0]?.message?.content || '';
      const inputTokens = data?.usage?.prompt_tokens || Math.ceil(prompt.length / 4);
      const outputTokens = data?.usage?.completion_tokens || Math.ceil(text.length / 4);
      const latencyMs = Date.now() - startTime;
      const estimatedCostUsd = (inputTokens * 0.00015 + outputTokens * 0.0006) / 1000;

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
      const model = options?.model || 'gpt-4o-mini';
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), options?.timeoutMs || 10000);

      const res = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`,
        },
        signal: controller.signal,
        body: JSON.stringify({
          model,
          messages: [
            {
              role: 'system',
              content: `You are an expert LipTalk business assistant. Return valid JSON adhering to: ${schemaDescription}`,
            },
            { role: 'user', content: prompt },
          ],
          response_format: { type: 'json_object' },
          temperature: 0.2,
        }),
      });
      clearTimeout(timeout);

      if (!res.ok) {
        return this.fallbackProvider.generateStructuredJson<T>(prompt, schemaDescription, options);
      }

      const data = await res.json();
      const rawJson = data?.choices?.[0]?.message?.content;
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
      const res = await fetch(`${this.baseUrl}/embeddings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: 'text-embedding-3-small',
          input: text,
        }),
      });

      if (!res.ok) {
        return this.fallbackProvider.generateEmbedding(text);
      }

      const data = await res.json();
      return data?.data?.[0]?.embedding || this.fallbackProvider.generateEmbedding(text);
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
