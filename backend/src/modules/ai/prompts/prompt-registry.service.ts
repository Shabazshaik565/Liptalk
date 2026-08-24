import { Injectable, Logger } from '@nestjs/common';

export interface PromptDefinition {
  slug: string;
  version: string;
  systemInstruction: string;
  template: string;
  defaultParams: {
    temperature: number;
    maxTokens: number;
    responseFormat: 'text' | 'json';
  };
}

@Injectable()
export class PromptRegistryService {
  private readonly logger = new Logger(PromptRegistryService.name);

  private readonly registry = new Map<string, PromptDefinition>([
    [
      'assistant.v1',
      {
        slug: 'assistant.v1',
        version: '1.0.0',
        systemInstruction:
          'You are LipTalk AI, the intelligent verified business synergy assistant. Assist users with partnership discovery, opportunity creation, community guidance, and platform navigation with professional clarity and zero spam.',
        template: 'User Query: {{query}}\n\nUser Context:\n{{context}}',
        defaultParams: { temperature: 0.3, maxTokens: 600, responseFormat: 'text' },
      },
    ],
    [
      'search.intent.v1',
      {
        slug: 'search.intent.v1',
        version: '1.0.0',
        systemInstruction:
          'Extract structured semantic search intent and entity filters from natural language search queries across LipTalk people, services, opportunities, and communities.',
        template:
          'Analyze query: "{{query}}". Return JSON: {"action":"FIND_PEOPLE"|"FIND_SERVICES"|"FIND_OPPORTUNITIES"|"FIND_COMMUNITIES"|"GENERAL_ASSIST", "keywords":string[], "category"?:string, "skills"?:string[], "location"?:string}',
        defaultParams: { temperature: 0.1, maxTokens: 300, responseFormat: 'json' },
      },
    ],
    [
      'smart_need.v1',
      {
        slug: 'smart_need.v1',
        version: '1.0.0',
        systemInstruction:
          'Structure raw unformatted business requirements into high-conversion LipTalk verified Need specifications.',
        template:
          'Draft requirement: "{{draftText}}". Return JSON: {"title":string, "category":string, "tags":string[], "suggestedSkills":string[], "descriptionOutline":string, "suggestedPriority":"NORMAL"|"HIGH"|"URGENT"}',
        defaultParams: { temperature: 0.2, maxTokens: 400, responseFormat: 'json' },
      },
    ],
    [
      'smart_offer.v1',
      {
        slug: 'smart_offer.v1',
        version: '1.0.0',
        systemInstruction:
          'Structure capability drafts into compelling LipTalk verified Service Offerings.',
        template:
          'Draft offering: "{{draftText}}". Return JSON: {"title":string, "category":string, "tags":string[], "deliverables":string[], "suggestedPricingType":"FIXED"|"HOURLY"|"NEGOTIABLE", "suggestedPrice":number}',
        defaultParams: { temperature: 0.2, maxTokens: 400, responseFormat: 'json' },
      },
    ],
    [
      'chat_refine.v1',
      {
        slug: 'chat_refine.v1',
        version: '1.0.0',
        systemInstruction:
          'Refine informal chat drafts into executive-ready, professional B2B deal communications.',
        template: 'Mode: {{mode}}\nOriginal Text: "{{originalText}}"\nRefine this message:',
        defaultParams: { temperature: 0.3, maxTokens: 300, responseFormat: 'text' },
      },
    ],
    [
      'translation.multilingual.v1',
      {
        slug: 'translation.multilingual.v1',
        version: '1.0.0',
        systemInstruction:
          'Translate business communications accurately preserving regional terminology, business formality, and cultural context.',
        template: 'Translate to {{targetLanguage}} (Locale: {{locale}}):\n\n"{{text}}"',
        defaultParams: { temperature: 0.2, maxTokens: 500, responseFormat: 'text' },
      },
    ],
  ]);

  /**
   * Retrieves prompt definition with fallback
   */
  getPrompt(slug: string): PromptDefinition {
    const prompt = this.registry.get(slug);
    if (!prompt) {
      this.logger.warn(`Prompt slug '${slug}' not found, falling back to assistant.v1`);
      return this.registry.get('assistant.v1')!;
    }
    return prompt;
  }

  /**
   * Interpolates variables into template
   */
  render(slug: string, variables: Record<string, string>): { promptText: string; definition: PromptDefinition } {
    const def = this.getPrompt(slug);
    let text = def.template;
    for (const [k, v] of Object.entries(variables)) {
      text = text.replace(new RegExp(`{{${k}}}`, 'g'), v || '');
    }
    return { promptText: text, definition: def };
  }
}
