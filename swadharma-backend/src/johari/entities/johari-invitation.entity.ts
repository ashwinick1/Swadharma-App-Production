
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';

@Entity('johari_invitations')
export class JohariInvitationEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Index()
  @Column({ type: 'int' })
  participantId!: number;

  @Column({ type: 'varchar', length: 150 })
  name!: string;

  @Column({ type: 'varchar', length: 254 })
  email!: string;

  @Column({ type: 'varchar', length: 50 })
  feedbackType!: string;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 64 })
  token!: string;

  @Column({ type: 'boolean', default: false })
  submitted!: boolean;

  @Column({ type: 'jsonb', nullable: true })
  answers!: {
    ratings: Record<string, number>;
    strengths: string;
    naturalAbilities: string;
    blindSpot: string;
  } | null;

  @CreateDateColumn()
  createdAt!: Date;

  @Column({ type: 'timestamp', nullable: true })
  submittedAt!: Date | null;
}
