
import {
  Body,
  Controller,
  Post,
  BadRequestException,
} from '@nestjs/common';

import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @Post('send-otp')
  async sendOtp(
    @Body() dto: { identifier: string },
  ) {
    if (!dto || !dto.identifier) {
      throw new BadRequestException(
        'Email or mobile number is required',
      );
    }

    return this.authService.sendOtp(
      dto.identifier.trim(),
    );
  }

  @Post('verify-otp')
  async verifyOtp(
    @Body() dto: {
      identifier: string;
      otp: string;
    },
  ) {
    if (!dto?.identifier || !dto?.otp) {
      throw new BadRequestException(
        'Identifier and OTP are required',
      );
    }

    return this.authService.verifyOtp(
      dto.identifier.trim(),
      dto.otp.trim(),
    );
  }
}
