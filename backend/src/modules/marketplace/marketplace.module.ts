import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MarketplaceListing } from '../../database/entities/marketplace-listing.entity';
import { User } from '../../database/entities/user.entity';
import { SavedItem } from '../../database/entities/saved-item.entity';
import { Need } from '../../database/entities/need.entity';
import { Offer } from '../../database/entities/offer.entity';
import { Conversation } from '../../database/entities/conversation.entity';
import { Message } from '../../database/entities/message.entity';
import { Lead } from '../../database/entities/lead.entity';
import { LeadNote } from '../../database/entities/lead-note.entity';
import { MarketplaceService } from './marketplace.service';
import { MarketplaceController } from './marketplace.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      MarketplaceListing,
      User,
      SavedItem,
      Need,
      Offer,
      Conversation,
      Message,
      Lead,
      LeadNote,
    ]),
    AuthModule,
  ],
  controllers: [MarketplaceController],
  providers: [MarketplaceService],
  exports: [MarketplaceService],
})
export class MarketplaceModule {}
