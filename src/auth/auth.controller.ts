import {
  Controller,
  Post,
  Body,
  Res,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { type Response } from 'express';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { MobileAuthDto } from '@/auth/dto/auth.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('send-otp')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Send OTP to mobile number' })
  @ApiResponse({ status: 200, description: 'OTP sent successfully' })
  sendOtp(@Body() sendOtpDto: MobileAuthDto): Promise<{ message: string }> {
    return this.authService.sendOtp(sendOtpDto.mobile);
  }

  @Post('sign-in')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Sign in with mobile and OTP' })
  @ApiResponse({ status: 200, description: 'Signed in successfully' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async signIn(
    @Body() mobileAuthDto: MobileAuthDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ message: string }> {
    const { access_token, refresh_token } =
      await this.authService.signIn(mobileAuthDto);

    res.cookie('access_token', access_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 90 * 24 * 60 * 60 * 1000,
    });

    return { message: 'Signed in successfully' };
  }

  @Post('sign-out')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Sign out' })
  @ApiResponse({ status: 200, description: 'Signed out successfully' })
  signOut(@Res({ passthrough: true }) res: Response): { message: string } {
    res.clearCookie('access_token', {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });

    res.clearCookie('refresh_token', {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });

    return { message: 'Signed out successfully' };
  }
}
