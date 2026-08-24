import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('data_access_logs')
export class DataAccessLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  accessorId: string; // e.g. 'App_X', 'Agent_Y', 'Service_Z'

  @Column()
  accessorType: 'DEVELOPER_APP' | 'AI_AGENT' | 'INTERNAL_SERVICE' | 'ORGANIZATION';

  @Column()
  dataScopeAccessed: string; // e.g. 'profile.read', 'projects.read', 'knowledge.search'

  @Column({ type: 'text', nullable: true })
  purpose: string;

  @Column({ default: 'AUTHORIZED' })
  status: 'AUTHORIZED' | 'DENIED' | 'REVOKED';

  @Column({ default: true })
  canRevoke: boolean;

  @CreateDateColumn()
  accessedAt: Date;
}
