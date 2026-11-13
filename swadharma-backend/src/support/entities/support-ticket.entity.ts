import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('support_tickets')
@Index(['userId', 'createdAt'])
export class SupportTicket {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    type: 'varchar',
    length: 40,
    unique: true,
  })
  ticketNumber!: string;

  @Column({type: 'int'})
  userId!: number;

  @Column({type: 'varchar', length: 160})
  requesterName!: string;

  @Column({type: 'varchar', length: 254})
  requesterEmail!: string;

  @Column({type: 'varchar', length: 160})
  subject!: string;

  @Column({type: 'varchar', length: 60})
  category!: string;

  @Column({type: 'text'})
  description!: string;

  @Column({
    type: 'varchar',
    length: 24,
    default: 'OPEN',
  })
  status!: string;

  @Column({
    type: 'varchar',
    length: 24,
    default: 'NORMAL',
  })
  priority!: string;

  @Column({
    type: 'boolean',
    default: false,
  })
  adminNotified!: boolean;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  adminNotifiedAt!: Date | null;

  @CreateDateColumn({type: 'timestamp'})
  createdAt!: Date;

  @UpdateDateColumn({type: 'timestamp'})
  updatedAt!: Date;
}