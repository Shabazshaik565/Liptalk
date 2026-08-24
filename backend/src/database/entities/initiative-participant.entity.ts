import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('initiative_participants')
export class InitiativeParticipant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  initiativeId: string;

  @Column()
  participantType: 'USER' | 'COMMUNITY' | 'ORGANIZATION';

  @Column()
  participantId: string;

  @Column({ default: 'MEMBER' })
  role: string;

  @Column({ type: 'int', default: 0 })
  pledgedAmount: number;

  @CreateDateColumn()
  joinedAt: Date;
}
