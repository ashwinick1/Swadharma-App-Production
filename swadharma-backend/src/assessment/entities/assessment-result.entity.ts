import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('assessment_results')
export class AssessmentResult {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  assessmentType: string;

  @Column({
    default: 'NOT_STARTED',
  })
  status: string;

  @Column({
    type: 'jsonb',
    nullable: true,
  })
  answers: any;

  @Column({
    type: 'jsonb',
    nullable: true,
  })
  result: any;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  startedAt: Date;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  completedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}