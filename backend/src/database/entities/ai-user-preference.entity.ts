import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity('ai_user_preferences')
export class AiUserPreference {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 100 })
  userId: string;

  @Column({ type: 'boolean', default: true })
  aiPersonalizationEnabled: boolean;

  @Column({ type: 'boolean', default: true })
  aiMemoryEnabled: boolean;

  @Column({ type: 'boolean', default: true })
  aiContentAssistanceEnabled: boolean;

  @Column({ type: 'boolean', default: true })
  aiRecommendationsEnabled: boolean;

  @Column({ type: 'boolean', default: true })
  aiTranslationEnabled: boolean;

  @Column({ type: 'boolean', default: true })
  aiAutonomousReadEnabled: boolean;

  @Column({ type: 'boolean', default: false })
  aiAutonomousWriteEnabled: boolean;

  @Column({ type: 'boolean', default: true })
  aiHighImpactConfirmEnabled: boolean;

  @Column({ type: 'varchar', length: 30, default: 'STANDARD' })
  dataClassificationLevel: 'STANDARD' | 'MINIMAL' | 'STRICT_ANONYMIZED';

  @Column({ type: 'simple-array', default: 'ai.read,ai.search,ai.recommend,ai.summarize,ai.translate,ai.draft' })
  allowedScopes: string[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
