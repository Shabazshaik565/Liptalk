import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { PartnerOffer } from './partner-offer.entity';

@Entity('partners')
export class Partner {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { onDelete: 'SET NULL', nullable: true })
  user: User;

  @Column()
  name: string;

  @Column({ nullable: true })
  logoUrl: string;

  @Column({ default: 'Business Logistics & Services' })
  categoryName: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ default: 'Pan-India' })
  coverageArea: string;

  @Column({ nullable: true })
  websiteUrl: string;

  @Column({ nullable: true })
  exclusiveBadge: string;

  @OneToMany(() => PartnerOffer, (offer) => offer.partner)
  offers: PartnerOffer[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
