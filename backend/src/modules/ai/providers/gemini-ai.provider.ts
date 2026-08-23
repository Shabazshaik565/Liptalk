import { AIProvider, AICompletionOptions } from '../interfaces/ai-provider.interface';
import { HeuristicFallbackProvider } from './heuristic-fallback.provider';

export class GeminiAIProvider implements AIProvider {
  readonly name = 'gemini-ai';
  private fallbackProvider = new HeuristicFallbackProvider();
  private apiKey = process.env.GEMINI_API_KEY || '';

  async generateText(prompt: string, options?: AICompletionOptions): Promise<string> {
    if (!this.apiKey) {
      return this.fallbackProvider.generateText(prompt, options);
    }

    try {
      // In production with live API key, execute HTTPS request to Gemini API
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `${options?.systemInstruction ? options.systemInstruction + '\n\n' : ''}${prompt}` }] }],
          generationConfig: {
            temperature: options?.temperature ?? 0.4,
            maxOutputTokens: options?.maxTokens ?? 500,
          },
        }),
      });

      if (!res.ok) {
        return this.fallbackProvider.generateText(prompt, options);
      }

      const data = await res.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      return text || this.fallbackProvider.generateText(prompt, options);
    } catch {
      return this.fallbackProvider.generateText(prompt, options);
    }
  }

  async generateStructuredJson<T = any>(prompt: string, schemaDescription: string, options?: AICompletionOptions): Promise<T> {
    if (!this.apiKey) {
      return this.fallbackProvider.generateStructuredJson<T>(prompt, schemaDescription, options);
    }

    try {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
      });

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
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key=${this.apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'models/text-embedding-004',
          content: { parts: [{ text }] },
        }),
      });

      if (!res.ok) {
        return this.fallbackProvider.generateEmbedding(text);
      }

      const data = await res.json();
      return data?.embedding?.values || this.fallbackProvider.generateEmbedding(text);
    } catch {
      return this.fallbackProvider.generateEmbedding(text);
    }
  }

  computeSimilarity(vectorA: number[], vectorB: number[]): number {
    return this.fallbackProvider.computeSimilarity(vectorA, vectorB);
  }
}
