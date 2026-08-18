import { IsNotEmpty, IsString } from 'class-validator';

export class ViewHoroscopeDto {
  @IsString()
  @IsNotEmpty()
  dateOfBirth: string;

  @IsString()
  @IsNotEmpty()
  timeOfBirth: string;

  @IsString()
  @IsNotEmpty()
  placeOfBirth: string;
}