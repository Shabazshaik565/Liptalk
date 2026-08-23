import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AIProvider, NaturalLanguageIntent } from './interfaces/ai-provider.interface';
import { GeminiAIProvider } from './providers/gemini-ai.provider';
import { User } from '../../database/entities/user.entity';
import { Need } from '../../database/entities/need.entity';
import { Offer } from '../../database/entities/offer.entity';
import { Opportunity } from '../../database/entities/opportunity.entity';
import { Community } from '../../database/entities/community.entity';
import { MarketplaceListing } from '../../database/entities/marketplace-listing.entity';

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private provider: AIProvider = new GeminiAIProvider();
  private embeddingCache = new Map<string, number[]>();

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
  ) {}

  /**
   * Sanitizes untrusted user text against prompt injection
   */
  private sanitizeInput(input: string): string {
    if (!input) return '';
    return input
      .replace(/ignore\s+previous\s+instructions/gi, '[filtered]')
      .replace(/system\s*:\s*/gi, '')
      .replace(/<\/?script>/gi, '')
      .slice(0, 1000)
      .trim();
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

    const vector = await this.provider.generateEmbedding(clean);
    this.embeddingCache.set(clean, vector);
    return vector;
  }

  /**
   * Compute semantic cosine similarity between two texts
   */
  async computeSemanticSimilarity(textA: string, textB: string): Promise<number> {
    const vecA = await this.getEmbedding(textA);
    const vecB = await this.getEmbedding(textB);
    return this.provider.computeSimilarity(vecA, vecB);
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
        const score = this.provider.computeSimilarity(queryVector, vec);
        return { user: u, score: Math.round(score * 100) };
      }),
    );

    // Rank Listings
    const rankedListings = await Promise.all(
      listings.map(async (l) => {
        const fullText = `${l.title} ${l.description} ${l.category} ${l.tags?.join(' ') || ''}`;
        const vec = await this.getEmbedding(fullText);
        const score = this.provider.computeSimilarity(queryVector, vec);
        return { listing: l, score: Math.round(score * 100) };
      }),
    );

    // Rank Opportunities
    const rankedOpps = await Promise.all(
      opportunities.map(async (o) => {
        const fullText = `${o.title} ${o.description} ${o.categoryName} ${o.tags?.join(' ') || ''}`;
        const vec = await this.getEmbedding(fullText);
        const score = this.provider.computeSimilarity(queryVector, vec);
        return { opportunity: o, score: Math.round(score * 100) };
      }),
    );

    // Rank Communities
    const rankedComms = await Promise.all(
      communities.map(async (c) => {
        const fullText = `${c.name} ${c.description} ${c.category}`;
        const vec = await this.getEmbedding(fullText);
        const score = this.provider.computeSimilarity(queryVector, vec);
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
   * Smart Need Creation Assistant
   */
  async assistNeedCreation(draftText: string) {
    const clean = this.sanitizeInput(draftText);
    const schema = `{"title": string, "category": string, "tags": string[], "suggestedSkills": string[], "descriptionOutline": string, "priority": "MEDIUM"|"HIGH"|"URGENT"}`;
    return this.provider.generateStructuredJson(
      `Analyze this business requirement: "${clean}". Suggest category, structured tags, and required skills for LipTalk.`,
      schema,
    );
  }

  /**
   * Smart Offer Creation Assistant
   */
  async assistOfferCreation(draftText: string) {
    const clean = this.sanitizeInput(draftText);
    const schema = `{"title": string, "category": string, "tags": string[], "skills": string[], "pricingModel": "FIXED"|"HOURLY"|"RETAINER", "description": string}`;
    return this.provider.generateStructuredJson(
      `Analyze this service capability offer: "${clean}". Suggest standard category, tags, and deliverable description.`,
      schema,
    );
  }

  /**
   * Smart Opportunity Creation Assistant
   */
  async assistOpportunityCreation(draftText: string) {
    const clean = this.sanitizeInput(draftText);
    const schema = `{"title": string, "category": string, "tags": string[], "description": string, "suggestedMilestones": string[]}`;
    return this.provider.generateStructuredJson(
      `Analyze this business opportunity scope: "${clean}". Generate a structured project brief and key milestone stages.`,
      schema,
    );
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

    // Real mathematical completeness calculation
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
   * Smart Chat Message Assistance & Rephrasing
   */
  async assistChatMessage(mode: 'PROFESSIONAL' | 'SHORTEN' | 'PROPOSAL_PITCH', originalText: string) {
    const clean = this.sanitizeInput(originalText);
    let prompt = `Rephrase this message to be professional and collaborative: "${clean}"`;

    if (mode === 'SHORTEN') {
      prompt = `Make this message concise and clear in 2 sentences: "${clean}"`;
    } else if (mode === 'PROPOSAL_PITCH') {
      prompt = `Draft a high-converting B2B proposal pitch based on: "${clean}"`;
    }

    const rephrased = await this.provider.generateText(prompt, { maxTokens: 200 });
    return { original: clean, suggested: rephrased.trim() };
  }

  /**
   * LipTalk Assistant Handler ("Ask LipTalk")
   */
  async executeAssistantQuery(query: string, userId?: string) {
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

    const naturalText = await this.provider.generateText(
      `You are LipTalk Assistant. Answer this user inquiry concisely: "${clean}". Guide them on matching, communities, opportunities, and marketplace.`,
      { maxTokens: 250 },
    );

    return {
      reply: naturalText.trim(),
      action: 'GENERAL_REPLY',
      data: null,
    };
  }
}
