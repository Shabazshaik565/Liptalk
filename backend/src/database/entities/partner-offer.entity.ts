import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Partner } from './partner.entity';

@Entity('partner_offers')
export class PartnerOffer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Partner, (partner) => partner.offers, { onDelete: 'CASCADE' })
  partner: Partner;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ nullable: true })
  bannerUrl: string;

  @Column({ nullable: true })
  discountCode: string;

  @Column({ nullable: true })
  discountValue: string;

  @Column({ nullable: true })
  validUntil: string;

  @Column({ default: 'https://liptalk.io' })
  ctaUrl: string;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
