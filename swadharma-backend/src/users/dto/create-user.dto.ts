export class CreateUserDto {
  firstName!: string;
  lastName!: string;
  email!: string;
  mobileNumber!: string;
  gender!: string;
  country!: string;
  state!: string;
  city!: string;
  zipCode!: string;
  dateOfBirth!: string;
  profileImage?: string;
}