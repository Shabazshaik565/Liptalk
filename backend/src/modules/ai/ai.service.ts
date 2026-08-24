import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../database/entities/user.entity';
import { Need } from '../../database/entities/need.entity';
import { Offer } from '../../database/entities/offer.entity';
import { Opportunity } from '../../database/entities/opportunity.entity';
import { Community } from '../../database/entities/community.entity';
import { MarketplaceListing } from '../../database/entities/marketplace-listing.entity';
import { AiGatewayService } from './gateway/ai-gateway.service';
import { AiPrivacyService } from './privacy/ai-privacy.service';
import { PromptRegistryService } from './prompts/prompt-registry.service';
import { AiMemoryService } from './memory/ai-memory.service';
import { HeuristicFallbackProvider } from './providers/heuristic-fallback.provider';

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private embeddingCache = new Map<string, number[]>();
  private heuristicProvider = new HeuristicFallbackProvider();

  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Need)
    private readonly needRepo: Repository<Need>,
    @InjectRepository(Offer)
    private readonly offerRepo: Repository<Offer>,
    @InjectRepository(Opportunity)
    private readonly oppRepo: Repository<Opportunity>,
    @InjectRepository(Community)
    private readonly commRepo: Repository<Community>,
    @InjectRepository(MarketplaceListing)
    private readonly listingRepo: Repository<MarketplaceListing>,
    private readonly gatewayService: AiGatewayService,
    private readonly privacyService: AiPrivacyService,
    private readonly promptRegistry: PromptRegistryService,
    private readonly memoryService: AiMemoryService,
  ) {}

  /**
   * Sanitizes untrusted user text against prompt injection & credential leaks
   */
  private sanitizeInput(input: string): string {
    return this.privacyService.sanitizeContext(input);
  }

  /**
   * Cached text embedding generation
   */
  async getEmbedding(text: string): Promise<number[]> {
    const clean = this.sanitizeInput(text);
    if (!clean) return [];

    if (this.embeddingCache.has(clean)) {
      return this.embeddingCache.get(clean)!;
    }

    const vector = await this.heuristicProvider.generateEmbedding(clean);
    this.embeddingCache.set(clean, vector);
    return vector;
  }

  /**
   * Compute semantic cosine similarity between two texts
   */
  async computeSemanticSimilarity(textA: string, textB: string): Promise<number> {
    const vecA = await this.getEmbedding(textA);
    const vecB = await this.getEmbedding(textB);
    return this.heuristicProvider.computeSimilarity(vecA, vecB);
  }

  /**
   * Natural-language Unified Search across People, Services, Opportunities, Communities
   */
  async searchSemantic(query: string, userId?: string) {
    const cleanQuery = this.sanitizeInput(query);
    const queryVector = await this.getEmbedding(cleanQuery);

    const [people, listings, opportunities, communities] = await Promise.all([
      this.userRepo.find({ relations: ['profile', 'businesses'] }),
      this.listingRepo.find({ relations: ['provider', 'provider.profile', 'provider.businesses'] }),
      this.oppRepo.find({ relations: ['creator', 'creator.profile', 'creator.businesses'] }),
      this.commRepo.find(),
    ]);

    // Rank People
    const rankedPeople = await Promise.all(
      people.map(async (u) => {
        const fullName = `${u.profile?.firstName || ''} ${u.profile?.lastName || ''}`.trim();
        const fullText = `${fullName} ${u.profile?.headline || ''} ${u.profile?.skills?.join(' ') || ''} ${u.businesses?.[0]?.businessName || ''} ${u.businesses?.[0]?.services?.join(' ') || ''}`;
        const vec = await this.getEmbedding(fullText);
        const score = this.heuristicProvider.computeSimilarity(queryVector, vec);
        return { user: u, score: Math.round(score * 100) };
      }),
    );

    // Rank Listings
    const rankedListings = await Promise.all(
      listings.map(async (l) => {
        const fullText = `${l.title} ${l.description} ${l.category} ${l.tags?.join(' ') || ''}`;
        const vec = await this.getEmbedding(fullText);
        const score = this.heuristicProvider.computeSimilarity(queryVector, vec);
        return { listing: l, score: Math.round(score * 100) };
      }),
    );

    // Rank Opportunities
    const rankedOpps = await Promise.all(
      opportunities.map(async (o) => {
        const fullText = `${o.title} ${o.description} ${o.categoryName} ${o.tags?.join(' ') || ''}`;
        const vec = await this.getEmbedding(fullText);
        const score = this.heuristicProvider.computeSimilarity(queryVector, vec);
        return { opportunity: o, score: Math.round(score * 100) };
      }),
    );

    // Rank Communities
    const rankedComms = await Promise.all(
      communities.map(async (c) => {
        const fullText = `${c.name} ${c.description} ${c.category}`;
        const vec = await this.getEmbedding(fullText);
        const score = this.heuristicProvider.computeSimilarity(queryVector, vec);
        return { community: c, score: Math.round(score * 100) };
      }),
    );

    return {
      query: cleanQuery,
      people: rankedPeople
        .filter((p) => p.score > 20)
        .sort((a, b) => b.score - a.score)
        .slice(0, 10),
      services: rankedListings
        .filter((l) => l.score > 20)
        .sort((a, b) => b.score - a.score)
        .slice(0, 10),
      opportunities: rankedOpps
        .filter((o) => o.score > 20)
        .sort((a, b) => b.score - a.score)
        .slice(0, 10),
      communities: rankedComms
        .filter((c) => c.score > 20)
        .sort((a, b) => b.score - a.score)
        .slice(0, 10),
    };
  }

  /**
   * Smart Need Creation Assistant via AI Gateway
   */
  async assistNeedCreation(draftText: string, userId = 'usr_curr_01') {
    const clean = this.sanitizeInput(draftText);
    return this.gatewayService.executeStructuredJson({
      userId,
      feature: 'SMART_NEED',
      scope: 'ai.draft',
      promptSlug: 'smart_need.v1',
      promptVariables: { draftText: clean },
    });
  }

  /**
   * Smart Offer Creation Assistant via AI Gateway
   */
  async assistOfferCreation(draftText: string, userId = 'usr_curr_01') {
    const clean = this.sanitizeInput(draftText);
    return this.gatewayService.executeStructuredJson({
      userId,
      feature: 'SMART_OFFER',
      scope: 'ai.draft',
      promptSlug: 'smart_offer.v1',
      promptVariables: { draftText: clean },
    });
  }

  /**
   * Smart Opportunity Creation Assistant via AI Gateway
   */
  async assistOpportunityCreation(draftText: string, userId = 'usr_curr_01') {
    const clean = this.sanitizeInput(draftText);
    const schema = `{"title": string, "category": string, "tags": string[], "description": string, "suggestedMilestones": string[]}`;
    return this.gatewayService.executeStructuredJson({
      userId,
      feature: 'SMART_OPPORTUNITY',
      scope: 'ai.draft',
      rawPrompt: `Analyze this business opportunity scope: "${clean}". Generate a structured project brief and key milestone stages.`,
      schemaDescription: schema,
    });
  }

  /**
   * Profile Intelligence & Actionable Completeness Audit
   */
  async getProfileIntelligence(userId: string) {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: ['profile', 'businesses'],
    });

    if (!user) {
      return { score: 75, suggestions: [], missingFields: [] };
    }

    const missing: string[] = [];
    let score = 0;

    if (user.profile?.avatarUrl) score += 20;
    else missing.push('Profile Avatar');

    if (user.profile?.headline && user.profile.headline.length > 10) score += 20;
    else missing.push('Professional Headline');

    if (user.profile?.bio && user.profile.bio.length > 20) score += 15;
    else missing.push('Detailed Bio');

    if (user.profile?.skills && user.profile.skills.length >= 3) score += 20;
    else missing.push('Add at least 3 skills');

    if (user.businesses && user.businesses.length > 0) score += 15;
    else missing.push('Verified Business Profile');

    if (user.profile?.city) score += 10;
    else missing.push('Location Hub');

    const suggestions: string[] = [];
    if (!user.profile?.skills || user.profile.skills.length < 4) {
      suggestions.push('Add specialized capabilities (e.g. React Native, Cloud Architecture) to increase synergy match score by up to 25%.');
    }
    if (!user.profile?.headline || user.profile.headline.length < 25) {
      suggestions.push('Enhance your headline with your core value proposition to attract enterprise opportunity creators.');
    }
    if (!user.businesses || user.businesses.length === 0) {
      suggestions.push('Register your business profile to publish high-ticket service offerings on the B2B Marketplace.');
    }

    return {
      completenessScore: Math.min(100, score),
      missingFields: missing,
      suggestions,
      status: score >= 85 ? 'OPTIMIZED' : score >= 60 ? 'GOOD' : 'NEEDS_ATTENTION',
    };
  }

  /**
   * Smart Chat Message Assistance & Rephrasing via AI Gateway
   */
  async assistChatMessage(mode: 'PROFESSIONAL' | 'SHORTEN' | 'PROPOSAL_PITCH', originalText: string, userId = 'usr_curr_01') {
    const clean = this.sanitizeInput(originalText);
    const result = await this.gatewayService.executeText({
      userId,
      feature: 'CHAT_ASSIST',
      scope: 'ai.draft',
      promptSlug: 'chat_refine.v1',
      promptVariables: { mode, originalText: clean },
    });

    return { original: clean, suggested: result.text.trim() };
  }

  /**
   * Multilingual Translation via AI Gateway
   */
  async translateText(text: string, targetLanguage: string, locale = 'en', userId = 'usr_curr_01') {
    const clean = this.sanitizeInput(text);
    const result = await this.gatewayService.executeText({
      userId,
      feature: 'TRANSLATION',
      scope: 'ai.translate',
      promptSlug: 'translation.multilingual.v1',
      promptVariables: { text: clean, targetLanguage, locale },
    });

    return { original: clean, targetLanguage, translated: result.text.trim() };
  }

  /**
   * LipTalk Assistant Handler ("Ask LipTalk") with Memory Context
   */
  async executeAssistantQuery(query: string, userId = 'usr_curr_01') {
    const clean = this.sanitizeInput(query);
    const lower = clean.toLowerCase();

    // Intent routing
    if (lower.includes('opportunity') || lower.includes('contract') || lower.includes('demand')) {
      const opps = await this.oppRepo.find({ take: 3, order: { createdAt: 'DESC' } });
      return {
        reply: `Here are active business demands matching your profile capabilities:`,
        action: 'SHOW_OPPORTUNITIES',
        data: opps,
      };
    }

    if (lower.includes('community') || lower.includes('guild') || lower.includes('group')) {
      const comms = await this.commRepo.find({ take: 3, order: { memberCount: 'DESC' } });
      return {
        reply: `Here are popular ecosystem guilds aligned with tech founders & growth:`,
        action: 'SHOW_COMMUNITIES',
        data: comms,
      };
    }

    if (lower.includes('service') || lower.includes('marketplace') || lower.includes('hire') || lower.includes('agency')) {
      const listings = await this.listingRepo.find({ take: 3, relations: ['provider', 'provider.profile'] });
      return {
        reply: `Here are top-rated verified service offerings from the B2B directory:`,
        action: 'SHOW_MARKETPLACE',
        data: listings,
      };
    }

    // Retrieve user memories for context
    const memories = await this.memoryService.getUserMemories(userId);
    const memoryContext = memories.map((m) => `${m.key}: ${m.value}`).join('; ');

    const gatewayResult = await this.gatewayService.executeText({
      userId,
      feature: 'ASSISTANT',
      scope: 'ai.read',
      promptSlug: 'assistant.v1',
      promptVariables: { query: clean, context: memoryContext || 'Standard LipTalk ecosystem user' },
    });

    return {
      reply: gatewayResult.text.trim(),
      action: 'GENERAL_REPLY',
      data: null,
    };
  }
}
