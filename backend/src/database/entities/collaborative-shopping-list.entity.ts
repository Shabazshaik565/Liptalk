import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('collaborative_shopping_lists')
export class CollaborativeShoppingList {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  ownerId: string;

  @Column({ nullable: true })
  targetProjectId: string;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'simple-json' })
  items: Array<{
    id: string;
    name: string;
    estimatedPrice: number;
    currency: string;
    vendorName?: string;
    votes: number;
    addedBy: string;
    status: 'PROPOSED' | 'APPROVED' | 'PURCHASED';
  }>;

  @Column({ type: 'simple-json', nullable: true })
  collaboratorUserIds: string[];

  @Column({ type: 'int', default: 0 })
  totalEstimatedAmount: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
