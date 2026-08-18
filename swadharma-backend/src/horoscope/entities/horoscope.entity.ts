import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
} from 'typeorm';

@Entity('horoscope')
export class Horoscope {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column({ type: 'date' })
  dateOfBirth: string;

  @Column({ type: 'time' })
  timeOfBirth: string;

  @Column()
  placeOfBirth: string;

  @Column({
    nullable: true,
  })
  horoscopeImage: string;

  @Column({
    default: 'PENDING',
  })
  horoscopeStatus: string;

  @Column({
    type: 'jsonb',
    nullable: true,
  })
  horoscopeData: any;
}