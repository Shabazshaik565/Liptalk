import {
  AIProvider,
  AICompletionOptions,
  AIGenerateResult,
  AIModerationResult,
  AIClassificationResult,
} from '../interfaces/ai-provider.interface';

const DOMAIN_TAXONOMY: Record<string, string[]> = {
  mobile: ['react native', 'expo', 'ios', 'android', 'flutter', 'swift', 'kotlin', 'mobile app', 'turbomodules'],
  frontend: ['react', 'next.js', 'vue', 'tailwind', 'typescript', 'ui', 'ux', 'web app', 'figma'],
  backend: ['nestjs', 'node.js', 'express', 'python', 'django', 'fastapi', 'database', 'postgresql', 'sqlite', 'api', 'graphql'],
  cloud: ['aws', 'gcp', 'azure', 'docker', 'kubernetes', 'devops', 'serverless', 'microservices'],
  marketing: ['seo', 'growth', 'b2b lead gen', 'abm', 'outbound', 'linkedin', 'ads', 'performance marketing'],
  design: ['ui/ux', 'product design', 'figma', 'design system', 'prototyping', 'user research', 'branding'],
  legal: ['corporate compliance', 'nda', 'contracts', 'incorporation', 'trademark', 'intellectual property'],
  finance: ['accounting', 'gst', 'audit', 'taxation', 'valuation', 'fundraising', 'payroll'],
};

const TOXIC_PATTERNS = [/kill\s+yourself/i, /hate\s+all\s+\w+/i, /scam\s+link/i, /free\s+crypto\s+giveaway/i, /f\*\*k/i];

export class HeuristicFallbackProvider implements AIProvider {
  readonly name = 'heuristic-fallback';
  readonly providerType = 'HEURISTIC' as const;

  async isAvailable(): Promise<boolean> {
    return true;
  }

  async generateText(prompt: string, options?: AICompletionOptions): Promise<AIGenerateResult> {
    const startTime = Date.now();
    const lower = prompt.toLowerCase();
    let text = `LipTalk AI Assistant is ready to help you navigate business synergy, find verified partners, and draft high-impact opportunities.`;

    if (lower.includes('rephrase') || lower.includes('professional') || lower.includes('chat-assist')) {
      text = `Thank you for reaching out. We would be delighted to collaborate on this initiative. Could we schedule a brief discussion to review project scope and alignment?`;
    } else if (lower.includes('summarize')) {
      text = `Key discussion points: Confirmed technical scope, aligned deliverable timelines, and agreed on next steps for proposal review.`;
    } else if (lower.includes('translate')) {
      text = `[Localized translation]: ${prompt.replace(/translate to \w+:/i, '').trim()}`;
    }

    const inputTokens = Math.ceil(prompt.length / 4);
    const outputTokens = Math.ceil(text.length / 4);
    const latencyMs = Date.now() - startTime;

    return {
      text,
      model: 'heuristic-v1',
      provider: this.providerType,
      inputTokens,
      outputTokens,
      estimatedCostUsd: 0.0,
      latencyMs,
    };
  }

  async generateStructuredJson<T = any>(prompt: string, schemaDescription: string, options?: AICompletionOptions): Promise<T> {
    const lower = prompt.toLowerCase();

    if (lower.includes('need') || lower.includes('requirement')) {
      let category = 'IT & Software Development';
      const tags: string[] = ['Verified Provider'];
      const skills: string[] = [];

      for (const [domain, keywords] of Object.entries(DOMAIN_TAXONOMY)) {
        if (keywords.some((k) => lower.includes(k)) || lower.includes(domain)) {
          if (domain === 'mobile') {
            category = 'IT & Software Development';
            tags.push('React Native', 'Mobile App', 'TypeScript');
            skills.push('React Native', 'Mobile Architecture');
          } else if (domain === 'marketing') {
            category = 'Digital Marketing & Growth';
            tags.push('B2B Lead Gen', 'Growth');
            skills.push('Lead Generation', 'Outbound Strategy');
          } else if (domain === 'design') {
            category = 'UI/UX & Product Design';
            tags.push('Figma', 'UI/UX');
            skills.push('Figma', 'Design Systems');
          }
          break;
        }
      }

      return {
        title: prompt.slice(0, 60).replace(/\n/g, ' ').trim(),
        category,
        tags: Array.from(new Set(tags)),
        suggestedSkills: Array.from(new Set(skills)),
        descriptionOutline: prompt.trim(),
        suggestedPriority: 'HIGH',
      } as unknown as T;
    }

    return {
      action: 'GENERAL_ASSIST',
      keywords: ['business', 'synergy', 'verified'],
      summary: 'Processed natural language request',
    } as unknown as T;
  }

  async generateEmbedding(text: string): Promise<number[]> {
    const normalized = text.toLowerCase();
    const vector: number[] = [];

    for (const [domain, keywords] of Object.entries(DOMAIN_TAXONOMY)) {
      let domainScore = 0;
      if (normalized.includes(domain)) domainScore += 3;
      for (const kw of keywords) {
        if (normalized.includes(kw)) domainScore += 2;
      }
      vector.push(domainScore);
    }

    const magnitude = Math.sqrt(vector.reduce((acc, val) => acc + val * val, 0));
    if (magnitude === 0) {
      return vector.map(() => 0);
    }
    return vector.map((v) => v / magnitude);
  }

  async moderate(text: string): Promise<AIModerationResult> {
    const isToxic = TOXIC_PATTERNS.some((pattern) => pattern.test(text));
    return {
      isFlagged: isToxic,
      categories: {
        hateSpeech: isToxic,
        harassment: isToxic,
        sexualContent: false,
        dangerousContent: isToxic,
        spamOrPhishing: /free\s+crypto/i.test(text),
      },
      confidenceScore: isToxic ? 0.95 : 0.05,
      reason: isToxic ? 'Triggered prohibited communication pattern' : undefined,
    };
  }

  async classify(text: string, categories: string[]): Promise<AIClassificationResult> {
    const lower = text.toLowerCase();
    const scores: Record<string, number> = {};
    let bestCat = categories[0] || 'General';
    let maxScore = -1;

    for (const cat of categories) {
      let score = 0.1;
      if (lower.includes(cat.toLowerCase())) score += 0.8;
      scores[cat] = score;
      if (score > maxScore) {
        maxScore = score;
        bestCat = cat;
      }
    }

    return {
      primaryCategory: bestCat,
      confidence: maxScore,
      allScores: scores,
    };
  }

  computeSimilarity(vectorA: number[], vectorB: number[]): number {
    if (!vectorA || !vectorB || vectorA.length === 0 || vectorB.length === 0) return 0;
    const len = Math.min(vectorA.length, vectorB.length);
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < len; i++) {
      dotProduct += vectorA[i] * vectorB[i];
      normA += vectorA[i] * vectorA[i];
      normB += vectorB[i] * vectorB[i];
    }

    if (normA === 0 || normB === 0) return 0;
    const similarity = dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
    return Math.max(0, Math.min(1, similarity));
  }
}
