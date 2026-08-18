import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  firstName!: string;

  @Column()
  lastName!: string;

  @Column({ unique: true })
  email!: string;

  @Column({ unique: true })
  mobileNumber!: string;

  @Column()
  gender!: string;

  @Column()
  country!: string;

  @Column()
  state!: string;

  @Column()
  city!: string;

  @Column()
  zipCode!: string;

  @Column()
  dateOfBirth!: string;

  @Column({ nullable: true })
  profileImage!: string;
}