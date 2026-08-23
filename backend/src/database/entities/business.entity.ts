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
import { Opportunity } from './opportunity.entity';
import { Lead } from './lead.entity';

@Entity('businesses')
export class Business {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.businesses, { onDelete: 'CASCADE' })
  owner: User;

  @Column()
  businessName: string;

  @Column({ nullable: true })
  logoUrl: string;

  @Column({ nullable: true })
  categoryId: string;

  @Column({ nullable: true })
  categoryName: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: true })
  websiteUrl: string;

  @Column({ default: 'Bangalore' })
  city: string;

  @Column({ default: 'India' })
  country: string;

  @Column({ default: true })
  isVerified: boolean;

  @Column({ nullable: true })
  employeeCountRange: string;

  @Column('simple-array', { nullable: true })
  services: string[];

  @Column('simple-array', { nullable: true })
  products: string[];

  @OneToMany(() => Opportunity, (opp) => opp.business)
  opportunities: Opportunity[];

  @OneToMany(() => Lead, (lead) => lead.business)
  leads: Lead[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
