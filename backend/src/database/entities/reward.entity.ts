import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Partner } from './partner.entity';

@Entity('rewards')
export class Reward {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Partner, { nullable: true, onDelete: 'SET NULL' })
  partner: Partner;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'int', default: 500 })
  pointsCost: number;

  @Column({ default: 'Partner Perks' })
  category: string;

  @Column({ nullable: true })
  discountValue: string;

  @Column({ default: 'LIPREWARD' })
  promoCodeTemplate: string;

  @Column({ nullable: true })
  bannerUrl: string;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
