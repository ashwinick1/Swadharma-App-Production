import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SendOtpDto } from './dto/send-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('send-otp')
  sendOtp(@Body() dto: SendOtpDto) {
    return this.authService.sendOtp(dto.identifier);
  }

  @Post('verify-otp')
verifyOtp(@Body() dto: VerifyOtpDto) {
  console.log('Verify OTP Body:', dto);

  if (!dto) {
    return {
      success: false,
      message: 'Request body is missing',
    };
  }

  return this.authService.verifyOtp(dto.identifier, dto.otp);
}
}