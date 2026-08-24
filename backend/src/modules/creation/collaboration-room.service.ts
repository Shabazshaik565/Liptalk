import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CollaborationRoom } from '../../database/entities/collaboration-room.entity';

@Injectable()
export class CollaborationRoomService {
  constructor(
    @InjectRepository(CollaborationRoom)
    private readonly roomRepo: Repository<CollaborationRoom>,
  ) {}

  async listRooms(projectId?: string) {
    const list = await this.roomRepo.find({ where: projectId ? { projectId } : {} });
    if (list.length > 0) return list;

    // Seed active collaboration rooms
    return [
      {
        id: 'room_01',
        projectId: projectId || 'proj_supply_01',
        roomName: 'Gateway Protocol & BLE Mesh Sync Lab',
        topicFocus: 'Evaluating offline batch verification schemas and message serialization overhead.',
        activeParticipantIds: ['usr_curr_01', 'usr_sarah_02'],
        assignedAgentIds: ['agent_procure_01', 'agent_qa_02'],
        realtimeIntelligence: {
          liveMeetingSummary: 'Dr. Sarah Chen confirmed EIP-712 formatted payloads can compress to <180 bytes for Bluetooth beacon broadcast.',
          extractedActionItems: [
            'Alex Morgan: Deploy benchmark test harness to local emulator.',
            'Agent QA: Generate fuzzing test cases for out-of-order packet arrival.',
          ],
          unresolvedQuestions: [
            'What is the maximum hop count allowed in high-density mandi shed mesh?',
          ],
          suggestedKnowledgeResources: [
            'Zero-Knowledge Offline Batch Escrow Specification (v1.2)',
            'Mysore Mill Moisture Standards Research Paper (2026)',
          ],
        },
        status: 'ACTIVE',
      },
    ];
  }

  async getRoomIntelligence(roomId: string) {
    return {
      roomId,
      realtimeSummary: 'Discussion centered on BLE mesh latency bounds. Consensus reached on 3-hop limit.',
      actionItems: ['Alex: Run Android Bluetooth beacon loopback test', 'Sarah: Finalize payload checksum'],
      activeAgentsInRoom: [
        { name: 'Research Specialist AI', status: 'LISTENING', lastContribution: 'Synthesized RFC 8995 mesh constraints.' },
      ],
      updatedAt: new Date().toISOString(),
    };
  }
}
