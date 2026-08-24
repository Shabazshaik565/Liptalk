import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IntelligenceRelationship } from '../../database/entities/intelligence-relationship.entity';
import { AiGatewayService } from '../ai/gateway/ai-gateway.service';

@Injectable()
export class GraphFabricService {
  constructor(
    @InjectRepository(IntelligenceRelationship)
    private readonly relationshipRepo: Repository<IntelligenceRelationship>,
    private readonly aiGateway: AiGatewayService,
  ) {}

  async getGraphOverview(entityId?: string, depth = 2) {
    // Return sample seeded cross-domain subgraph
    return {
      centerNodeId: entityId || 'usr_curr_01',
      nodes: [
        { id: 'usr_curr_01', type: 'USER', label: 'Alex Morgan (Founder)', domain: 'PEOPLE' },
        { id: 'comm_kirana_01', type: 'COMMUNITY', label: 'Kirana Wholesale Traders', domain: 'SOCIAL' },
        { id: 'proj_supply_01', type: 'PROJECT', label: 'Open FMCG Supply Chain', domain: 'PROJECTS' },
        { id: 'creator_studio_01', type: 'CREATOR', label: 'Nexas Cloud & Architecture', domain: 'CREATORS' },
        { id: 'event_summit_26', type: 'EVENT', label: 'South Asia AgTech Summit 2026', domain: 'EVENTS' },
        { id: 'agent_procure_01', type: 'AI_AGENT', label: 'Autonomous FMCG Procurement Agent', domain: 'AI_AGENTS' },
        { id: 'opp_grain_deal', type: 'OPPORTUNITY', label: '100MT Wheat Procurement Tender', domain: 'COMMERCE' },
      ],
      edges: [
        { source: 'usr_curr_01', target: 'comm_kirana_01', type: 'MEMBER_OF', weight: 1.0 },
        { source: 'usr_curr_01', target: 'proj_supply_01', type: 'CONTRIBUTES_TO', weight: 1.0 },
        { source: 'proj_supply_01', target: 'agent_procure_01', type: 'USES', weight: 0.95 },
        { source: 'comm_kirana_01', target: 'event_summit_26', type: 'ATTENDS', weight: 0.8 },
        { source: 'proj_supply_01', target: 'opp_grain_deal', type: 'RELATED_TO', weight: 0.88 },
        { source: 'usr_curr_01', target: 'creator_studio_01', type: 'CREATED', weight: 1.0 },
      ],
      totalEntitiesCount: 7,
      totalRelationshipsCount: 6,
      permissionScope: 'AUTHORIZED_ACTIVE_VIEW',
    };
  }

  async traverseGraphContext(sourceEntityId: string, question: string) {
    const graphData = await this.getGraphOverview(sourceEntityId);
    
    // Non-binding AI graph context reasoner
    let synthesis = `Graph traversal shows direct link between ${sourceEntityId} and ${graphData.nodes.length} connected entities across Social, Projects, Commerce, and AI Agents.`;
    try {
      const aiRes = await this.aiGateway.executeText({
        feature: 'graph_context_reasoning',
        rawPrompt: `Based on graph nodes: ${JSON.stringify(graphData.nodes)} and edges: ${JSON.stringify(graphData.edges)}, answer: "${question}". Be concise and factual.`,
        scope: 'ai.summarize',
      });
      if (aiRes?.text) {
        synthesis = aiRes.text;
      }
    } catch {
      // Fallback
    }

    return {
      sourceEntityId,
      question,
      connectedNodesCount: graphData.nodes.length,
      aiGraphReasoningSummary: synthesis,
    };
  }
}
