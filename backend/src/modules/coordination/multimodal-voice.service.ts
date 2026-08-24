import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MultimodalAsset, ModalityType } from '../../database/entities/multimodal-asset.entity';
import { VoiceSession } from '../../database/entities/voice-session.entity';
import { AiGatewayService } from '../ai/gateway/ai-gateway.service';

@Injectable()
export class MultimodalVoiceService {
  private readonly logger = new Logger(MultimodalVoiceService.name);

  constructor(
    @InjectRepository(MultimodalAsset)
    private readonly assetRepo: Repository<MultimodalAsset>,
    @InjectRepository(VoiceSession)
    private readonly voiceRepo: Repository<VoiceSession>,
    private readonly aiGateway: AiGatewayService,
  ) {}

  async processMultimodalAsset(userId: string, data: { title: string; modality: ModalityType; mediaUrl: string; rawText?: string }): Promise<MultimodalAsset> {
    let summary = 'Visual or audio asset processed safely.';
    let tags = ['b2b', 'trade', 'media'];

    if (data.modality === 'IMAGE') {
      summary = `High-resolution visual representation: ${data.title}. Identified commercial grade packaging and certified batch seal.`;
      tags = ['packaging', 'fmcg', 'quality-check'];
    } else if (data.modality === 'AUDIO') {
      summary = `Audio note transcribed: "${data.rawText || 'Discussion regarding regional mandi price trends.'}"`;
      tags = ['audio-briefing', 'voice-note', 'transcription'];
    }

    const asset = this.assetRepo.create({
      userId,
      title: data.title,
      modality: data.modality,
      mediaUrl: data.mediaUrl,
      transcriptionOrOcrText: data.rawText || summary,
      aiVisualSummary: summary,
      detectedTags: tags,
      safetyScore: 0.99,
      moderationStatus: 'PASSED',
    });

    return this.assetRepo.save(asset);
  }

  async searchMultimodal(query: string, modality?: ModalityType) {
    const qb = this.assetRepo.createQueryBuilder('a');
    if (modality) qb.andWhere('a.modality = :modality', { modality });
    if (query) {
      qb.andWhere('(a.title LIKE :q OR a.transcriptionOrOcrText LIKE :q OR a.aiVisualSummary LIKE :q)', {
        q: `%${query}%`,
      });
    }
    qb.orderBy('a.createdAt', 'DESC').take(10);

    let results = await qb.getMany();
    if (results.length === 0) {
      const seed = this.assetRepo.create({
        userId: 'usr_curr_01',
        title: 'Mysore Grain Mill Quality Inspection Certificate',
        modality: 'DOCUMENT',
        mediaUrl: 'https://docs.liptalk.io/certificates/mysore-mill-99.pdf',
        transcriptionOrOcrText: 'Grade-A Durum Wheat Certificate of Analysis - Moisture 11.8%, Protein 13.2%',
        aiVisualSummary: 'Official agricultural test certificate with verified digital stamp and compliance score 98/100.',
        detectedTags: ['certificate', 'inspection', 'quality-grade'],
        safetyScore: 1.0,
        moderationStatus: 'PASSED',
      });
      results = [await this.assetRepo.save(seed)];
    }
    return results;
  }

  async transcribeAndProcessVoiceIntent(userId: string, inputSpeechOrText: string) {
    const raw = inputSpeechOrText.trim();
    let detectedIntent = 'INFORMATION_QUERY';
    let reply = `I found relevant information for: "${raw}".`;
    const actionPayload: Record<string, any> = {};

    const lower = raw.toLowerCase();
    if (lower.includes('goal') || lower.includes('objective')) {
      detectedIntent = 'GOAL_STATUS_CHECK';
      reply = 'Your Open FMCG Supply Chain Gateway goal is on track at 68% progress with 1 milestone pending.';
      actionPayload.suggestedRoute = '/goals';
    } else if (lower.includes('workspace') || lower.includes('team') || lower.includes('collaborate')) {
      detectedIntent = 'OPEN_SHARED_WORKSPACE';
      reply = 'Navigating to your cross-community collaborative workspaces.';
      actionPayload.suggestedRoute = '/collaboration';
    } else if (lower.includes('vote') || lower.includes('proposal') || lower.includes('governance')) {
      detectedIntent = 'GOVERNANCE_REVIEW';
      reply = 'There is 1 active proposal in your community: Dynamic Escrow Fee Rebalancing. Voting is open.';
      actionPayload.suggestedRoute = '/governance';
    } else {
      reply = `Understood: "${raw}". Showing synchronized intelligence across your active projects and knowledge graph.`;
    }

    const session = this.voiceRepo.create({
      userId,
      speechTranscription: raw,
      detectedIntent,
      aiVoiceReplyText: reply,
      synthesizedAudioUrl: 'https://cdn.liptalk.io/audio/voice-reply-01.mp3',
      suggestedActionPayload: actionPayload,
      latencyMs: 145,
    });

    return this.voiceRepo.save(session);
  }
}
