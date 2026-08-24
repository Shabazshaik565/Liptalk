import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AiUserMemory } from '../../../database/entities/ai-user-memory.entity';
import { AiUserPreference } from '../../../database/entities/ai-user-preference.entity';

@Injectable()
export class AiMemoryService {
  private readonly logger = new Logger(AiMemoryService.name);

  constructor(
    @InjectRepository(AiUserMemory)
    private readonly memoryRepo: Repository<AiUserMemory>,
    @InjectRepository(AiUserPreference)
    private readonly userPrefRepo: Repository<AiUserPreference>,
  ) {}

  /**
   * Retrieves active memories for user respecting user AI memory opt-out
   */
  async getUserMemories(userId: string): Promise<AiUserMemory[]> {
    const pref = await this.userPrefRepo.findOne({ where: { userId } });
    if (pref && !pref.aiMemoryEnabled) {
      return [];
    }

    return this.memoryRepo.find({
      where: { userId },
      order: { isPinned: 'DESC', updatedAt: 'DESC' },
    });
  }

  /**
   * Adds or updates a user AI memory
   */
  async saveMemory(
    userId: string,
    key: string,
    value: string,
    category: 'PREFERENCE' | 'INTEREST' | 'INTERACTION' | 'SAVED_CONTEXT' | 'EXPLICIT_MEMORY' = 'PREFERENCE',
    isPinned = false,
  ): Promise<AiUserMemory> {
    const pref = await this.userPrefRepo.findOne({ where: { userId } });
    if (pref && !pref.aiMemoryEnabled) {
      this.logger.log(`Skipping memory save for user ${userId} (AI Memory opted out)`);
      return null as any;
    }

    let memory = await this.memoryRepo.findOne({ where: { userId, key } });
    if (memory) {
      memory.value = value;
      memory.category = category;
      memory.isPinned = isPinned;
      memory.updatedAt = new Date();
    } else {
      memory = this.memoryRepo.create({
        userId,
        key,
        value,
        category,
        isPinned,
        confidence: 1.0,
      });
    }

    return this.memoryRepo.save(memory);
  }

  /**
   * Deletes a specific memory
   */
  async deleteMemory(userId: string, memoryId: string): Promise<{ success: boolean }> {
    await this.memoryRepo.delete({ id: memoryId, userId });
    return { success: true };
  }

  /**
   * Clears all AI memories for a user (Privacy Purge)
   */
  async clearAllMemories(userId: string): Promise<{ success: boolean; clearedCount: number }> {
    const memories = await this.memoryRepo.find({ where: { userId } });
    const count = memories.length;
    await this.memoryRepo.delete({ userId });
    return { success: true, clearedCount: count };
  }
}
