import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

export type ModalityType = 'IMAGE' | 'AUDIO' | 'VIDEO' | 'DOCUMENT';

@Entity('multimodal_assets')
export class MultimodalAsset {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  title: string;

  @Column({ default: 'IMAGE' })
  modality: ModalityType;

  @Column()
  mediaUrl: string;

  @Column({ type: 'text', nullable: true })
  transcriptionOrOcrText: string;

  @Column({ type: 'text', nullable: true })
  aiVisualSummary: string;

  @Column({ type: 'simple-json', nullable: true })
  detectedTags: string[];

  @Column({ type: 'float', default: 0.98 })
  safetyScore: number;

  @Column({ default: 'PASSED' })
  moderationStatus: 'PASSED' | 'FLAGGED_HUMAN_REVIEW' | 'REJECTED';

  @CreateDateColumn()
  createdAt: Date;
}
