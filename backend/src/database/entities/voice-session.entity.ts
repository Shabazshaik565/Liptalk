import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('voice_sessions')
export class VoiceSession {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column({ type: 'text' })
  speechTranscription: string;

  @Column()
  detectedIntent: string;

  @Column({ type: 'text' })
  aiVoiceReplyText: string;

  @Column({ nullable: true })
  synthesizedAudioUrl: string;

  @Column({ type: 'simple-json', nullable: true })
  suggestedActionPayload: Record<string, any>;

  @Column({ type: 'int', default: 220 })
  latencyMs: number;

  @CreateDateColumn()
  createdAt: Date;
}
