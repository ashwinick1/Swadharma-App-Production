import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class VerifyOtpDto {
  @IsNotEmpty()
  @IsString()
  identifier: string;

  @IsNotEmpty()
  @Matches(/^[0-9]{6}$/, {
    message: 'OTP must be 6 digits',
  })
  otp: string;
}