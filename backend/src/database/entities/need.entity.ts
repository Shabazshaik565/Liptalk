import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

export enum NeedPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

export enum NeedStatus {
  ACTIVE = 'ACTIVE',
  FULFILLED = 'FULFILLED',
  PAUSED = 'PAUSED',
}

@Entity('needs')
export class Need {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.needs, { onDelete: 'CASCADE' })
  user: User;

  @Column({ default: 'USER' })
  ownerType: 'USER' | 'BUSINESS';

  @Column({ nullable: true })
  ownerId: string;

  @Column({ nullable: true })
  categoryId: string;

  @Column({ default: 'General' })
  categoryName: string;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column('simple-array', { nullable: true })
  tags: string[];

  @Column({
    type: 'simple-enum',
    enum: NeedPriority,
    default: NeedPriority.MEDIUM,
  })
  priority: NeedPriority;

  @Column({ default: 'Bangalore' })
  city: string;

  @Column({ type: 'numeric', nullable: true })
  budgetMin: number;

  @Column({ type: 'numeric', nullable: true })
  budgetMax: number;

  @Column({ default: 'INR' })
  currency: string;

  @Column({
    type: 'simple-enum',
    enum: NeedStatus,
    default: NeedStatus.ACTIVE,
  })
  status: NeedStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
