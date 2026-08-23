import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SavedItem, SavedTargetType } from '../../database/entities/saved-item.entity';
import { User } from '../../database/entities/user.entity';

@Injectable()
export class SavedService {
  constructor(
    @InjectRepository(SavedItem)
    private readonly savedRepo: Repository<SavedItem>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async getSavedItems(userId: string, targetType?: SavedTargetType) {
    const qb = this.savedRepo
      .createQueryBuilder('saved')
      .where('saved.userId = :userId', { userId });

    if (targetType) {
      qb.andWhere('saved.targetType = :targetType', { targetType });
    }

    qb.orderBy('saved.createdAt', 'DESC');
    return qb.getMany();
  }

  async toggleSave(userId: string, targetType: SavedTargetType, targetId: string) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const existing = await this.savedRepo.findOne({
      where: { user: { id: userId }, targetType, targetId },
    });

    if (existing) {
      await this.savedRepo.remove(existing);
      return { isSaved: false, message: 'Item removed from bookmarks' };
    }

    await this.savedRepo.save(
      this.savedRepo.create({
        user,
        targetType,
        targetId,
      }),
    );

    return { isSaved: true, message: 'Item saved successfully' };
  }
}
