import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { KnowledgeCollection } from '../../database/entities/knowledge-collection.entity';
import { KnowledgeVersion } from '../../database/entities/knowledge-version.entity';
import { KnowledgeConflict } from '../../database/entities/knowledge-conflict.entity';
import { ResearchProject } from '../../database/entities/research-project.entity';
import { AiGatewayService } from '../ai/gateway/ai-gateway.service';

@Injectable()
export class KnowledgeNetworkService {
  private readonly logger = new Logger(KnowledgeNetworkService.name);

  constructor(
    @InjectRepository(KnowledgeCollection)
    private readonly collectionRepo: Repository<KnowledgeCollection>,
    @InjectRepository(KnowledgeVersion)
    private readonly versionRepo: Repository<KnowledgeVersion>,
    @InjectRepository(KnowledgeConflict)
    private readonly conflictRepo: Repository<KnowledgeConflict>,
    @InjectRepository(ResearchProject)
    private readonly researchRepo: Repository<ResearchProject>,
    private readonly aiGateway: AiGatewayService,
  ) {}

  async getKnowledgeGraph(query?: string) {
    const collections = await this.collectionRepo.find({ take: 10, order: { createdAt: 'DESC' } });
    return {
      nodes: collections.map((c) => ({
        id: c.id,
        label: c.title,
        category: c.category,
        itemsCount: c.items?.length || 0,
      })),
      edges: [
        { source: collections[0]?.id || 'k1', target: collections[1]?.id || 'k2', relationship: 'extends' },
        { source: collections[0]?.id || 'k1', target: 'comm_kirana_01', relationship: 'belongs_to' },
      ],
      queryApplied: query || null,
    };
  }

  async getVersionHistory(collectionId: string): Promise<KnowledgeVersion[]> {
    let versions = await this.versionRepo.find({
      where: { collectionId },
      order: { versionNumber: 'DESC' },
    });

    if (versions.length === 0) {
      const v1 = this.versionRepo.create({
        collectionId,
        editorId: 'usr_curr_01',
        versionNumber: 1,
        title: 'Initial FMCG Supply Architecture Baseline',
        contentSummary: 'Established core data models and regional trade protocol references.',
        deltaChanges: ['Added Initial Kirana Wholesale spec', 'Linked ISO escrow references'],
        commitMessage: 'Initial publication to collective knowledge registry',
      });
      versions = [await this.versionRepo.save(v1)];
    }
    return versions;
  }

  async createVersion(collectionId: string, editorId: string, data: Partial<KnowledgeVersion>): Promise<KnowledgeVersion> {
    const prev = await this.versionRepo.findOne({
      where: { collectionId },
      order: { versionNumber: 'DESC' },
    });
    const nextVersionNum = prev ? prev.versionNumber + 1 : 1;

    const version = this.versionRepo.create({
      ...data,
      collectionId,
      editorId,
      versionNumber: nextVersionNum,
    });
    return this.versionRepo.save(version);
  }

  async getConflicts(): Promise<KnowledgeConflict[]> {
    let conflicts = await this.conflictRepo.find({ order: { detectedAt: 'DESC' } });
    if (conflicts.length === 0) {
      const seedConflict = this.conflictRepo.create({
        topic: 'Optimal Grain Moisture Tolerance for Long-Distance Bulk Rail Transit',
        conflictingSources: [
          {
            sourceName: 'Punjab Agricultural Logistics Working Paper 2026',
            claim: 'Recommend max 12.0% moisture content to prevent fungal spore proliferation in non-AC boxcars.',
            publishedDate: '2026-03-10',
            authorOrCommunity: 'North India Grain Alliance',
            confidenceScore: 0.92,
          },
          {
            sourceName: 'South India Warehouse Consortium Standard v3',
            claim: 'Permits up to 13.5% moisture when combined with silica desiccant tarping in transit.',
            publishedDate: '2026-06-22',
            authorOrCommunity: 'Deccan Logistics Hub',
            confidenceScore: 0.89,
          },
        ],
        aiConflictExplanation: 'Discrepancy originates from regional humidity differentials. North India transit recommendations assume dry northern plains rail routes, whereas southern protocols account for monsoon humidity protection measures.',
        status: 'CONSENSUS_NOTE_ADDED',
      });
      conflicts = [await this.conflictRepo.save(seedConflict)];
    }
    return conflicts;
  }

  async getResearchProjects(): Promise<ResearchProject[]> {
    let projects = await this.researchRepo.find({ order: { createdAt: 'DESC' } });
    if (projects.length === 0) {
      const seedProj = this.researchRepo.create({
        leadUserId: 'usr_curr_01',
        title: 'Micro-Escrow Latency Optimization on Edge Hubs',
        researchQuestion: 'How can offline Kirana nodes securely validate trade commitments without constant 5G connectivity?',
        hypotheses: [
          'Cryptographic time-lock commitments can ensure fraud-proof offline settlement buffers for up to 48 hours.',
        ],
        evidenceSources: [
          { title: 'Zero-Knowledge Trade Receipts on BLE', summary: 'Field tests prove 99.8% verification accuracy across 200 pilot stores.', verified: true },
        ],
        findingsNotes: [
          'Offline peer sync achieves sub-50ms token validation over local Wi-Fi / Bluetooth LE beacons.',
        ],
        aiSynthesizedReport: 'Research confirms edge-based cryptographic commitments allow reliable micro-trade settlement with deferred reconciliation once connectivity restores.',
        status: 'IN_PROGRESS',
      });
      projects = [await this.researchRepo.save(seedProj)];
    }
    return projects;
  }

  async createResearchProject(leadUserId: string, data: Partial<ResearchProject>): Promise<ResearchProject> {
    const proj = this.researchRepo.create({ ...data, leadUserId });
    return this.researchRepo.save(proj);
  }

  async synthesizeResearch(researchId: string): Promise<ResearchProject> {
    const proj = await this.researchRepo.findOne({ where: { id: researchId } });
    if (!proj) throw new NotFoundException('Research project not found');

    const prompt = `Synthesize findings for this research question: "${proj.researchQuestion}". Notes: ${JSON.stringify(proj.findingsNotes)}. Evidence: ${JSON.stringify(proj.evidenceSources)}. Provide a grounded, objective summary with cited sources.`;
    const aiRes = await this.aiGateway.executeText({
      feature: 'RESEARCH_SYNTHESIS',
      scope: 'ai.summarize',
      rawPrompt: prompt,
      userId: proj.leadUserId,
    });

    proj.aiSynthesizedReport = aiRes.text;
    return this.researchRepo.save(proj);
  }
}
