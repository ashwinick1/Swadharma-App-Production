import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import axios from 'axios';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
  ) {}

  // Email OTP storage
  private otpStore = new Map<string, string>();

  // MessageCentral verificationId storage
  private mobileVerificationStore = new Map<string, string>();

  async sendOtp(identifier: string) {
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier);

    // =========================
    // EMAIL OTP
    // =========================
    if (isEmail) {
      const otp = Math.floor(
        100000 + Math.random() * 900000,
      ).toString();

      this.otpStore.set(identifier, otp);

      // Keep your existing email OTP sending logic here
      console.log(`Email OTP for ${identifier}: ${otp}`);

      return {
        success: true,
        message: 'OTP sent successfully',
      };
    }

    // =========================
    // MOBILE OTP - MESSAGE CENTRAL
    // =========================

    const phoneNumber = identifier.startsWith('+')
      ? identifier.substring(1)
      : identifier;

    try {
      const response = await axios.post(
        'https://cpaas.messagecentral.com/verification/v3/send',
        null,
        {
          params: {
            countryCode: '91',
            customerId:
              process.env.MESSAGE_CENTRAL_CUSTOMER_ID,
            flowType: 'SMS',
            mobileNumber: phoneNumber,

            // Request 6-digit OTP
            otpLength: 6,
          },
          headers: {
            authToken:
              process.env.MESSAGE_CENTRAL_AUTH_TOKEN,
            accept: '*/*',
          },
        },
      );

      const data = response.data;

      console.log(
        'MessageCentral response:',
        data,
      );

      if (
        data?.responseCode !== 200 ||
        !data?.data?.verificationId
      ) {
        return {
          success: false,
          message: 'Unable to send OTP SMS',
        };
      }

      const verificationId =
        data.data.verificationId;

      // Store verificationId against mobile number
      this.mobileVerificationStore.set(
        phoneNumber,
        verificationId,
      );

      console.log(
        `MessageCentral verificationId for ${phoneNumber}: ${verificationId}`,
      );

      return {
        success: true,
        message: 'OTP sent successfully',
      };
    } catch (error: any) {
      console.error(
        'MessageCentral SMS error:',
        error?.response?.data ||
          error.message,
      );

      return {
        success: false,
        message: 'Unable to send OTP SMS',
      };
    }
  }

  async verifyOtp(
    identifier: string,
    otp: string,
  ) {
    const isEmail =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        identifier,
      );

    // =========================
    // EMAIL OTP
    // =========================
    if (isEmail) {
      const storedOtp =
        this.otpStore.get(identifier);

      if (storedOtp !== otp) {
        return {
          success: false,
          message: 'Invalid OTP',
        };
      }

      this.otpStore.delete(identifier);

      const user =
        await this.usersService.findByIdentifier(
          identifier,
        );

      return {
        success: true,
        message: 'OTP verified successfully',
        isRegistered: !!user,
        userId: user?.id ?? null,
        firstName: user?.firstName ?? null,
        profileImage: user?.profileImage ?? null,
      };
    }

    // =========================
    // MOBILE OTP
    // =========================

    const phoneNumber = identifier.startsWith('+')
      ? identifier.substring(1)
      : identifier;

    const verificationId =
      this.mobileVerificationStore.get(
        phoneNumber,
      );

    if (!verificationId) {
      return {
        success: false,
        message:
          'OTP session expired. Please request a new OTP.',
      };
    }

    try {
      const response = await axios.get(
        'https://cpaas.messagecentral.com/verification/v3/validateOtp',
        {
          params: {
            verificationId,
            code: otp,
          },
          headers: {
            authToken:
              process.env.MESSAGE_CENTRAL_AUTH_TOKEN,
            accept: 'application/json',
          },
        },
      );

      const data = response.data;

      console.log(
        'MessageCentral verification response:',
        data,
      );

      if (
        data?.responseCode !== 200 ||
        data?.data?.verificationStatus !==
          'VERIFICATION_COMPLETED'
      ) {
        return {
          success: false,
          message: 'Invalid OTP',
        };
      }

      // OTP successfully verified
      this.mobileVerificationStore.delete(
        phoneNumber,
      );

      const user =
        await this.usersService.findByIdentifier(
          identifier,
        );

      return {
        success: true,
        message: 'OTP verified successfully',
        isRegistered: !!user,
        userId: user?.id ?? null,
        firstName: user?.firstName ?? null,
        profileImage: user?.profileImage ?? null,
      };
    } catch (error: any) {
      console.error(
        'MessageCentral verification error:',
        error?.response?.data ||
          error.message,
      );

      return {
        success: false,
        message: 'Invalid OTP',
      };
    }
  }
}