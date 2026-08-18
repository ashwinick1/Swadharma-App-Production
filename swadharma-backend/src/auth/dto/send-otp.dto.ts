import { IsNotEmpty, IsString } from 'class-validator';

export class SendOtpDto {
  @IsNotEmpty()
  @IsString()
  identifier: string;
}