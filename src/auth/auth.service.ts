import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { User } from '@/user/entities/user.entity';
import { MobileAuthDto } from '@/auth/dto/auth.dto';
import { UserPayload } from '@/lib/user.payload';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async sendOtp(mobile: string): Promise<{ message: string }> {
    let user = await this.userRepository.findOne({ where: { mobile } });

    if (!user) {
      user = this.userRepository.create({ mobile });
    }

    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    user.otp = otp;

    await this.userRepository.save(user);

    return { message: 'OTP sent successfully' };
  }

  async signIn(mobileAuthDto: MobileAuthDto): Promise<{
    access_token: string;
    refresh_token: string;
  }> {
    const { mobile, otp, device_id, last_ip_address, client_id } =
      mobileAuthDto;

    const user = await this.userRepository.findOne({ where: { mobile } });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    if (user.otp !== otp) {
      throw new UnauthorizedException('Invalid OTP');
    }

    if (device_id) user.device_id = device_id;
    if (last_ip_address) user.last_ip_address = last_ip_address;
    if (client_id) user.client_id = client_id;

    await this.userRepository.update(user.id, { otp: undefined });

    const payload: UserPayload = {
      sub: user.id,
      mobile: user.mobile,
      name: user.name ?? null,
      role: user.role,
    };

    const access_token = this.generateAccessToken(payload);
    const refresh_token = this.generateRefreshToken(payload);

    return { access_token, refresh_token };
  }

  generateAccessToken(payload: UserPayload): string {
    return this.jwtService.sign(payload);
  }

  generateRefreshToken(payload: UserPayload): string {
    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: '90d',
    });
  }

  async refreshTokens(refreshToken: string): Promise<{
    access_token: string;
    refresh_token: string;
  }> {
    try {
      const payload = this.jwtService.verify<UserPayload>(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });

      const user = await this.userRepository.findOne({
        where: { id: payload.sub },
      });

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      const newPayload: UserPayload = {
        sub: user.id,
        mobile: user.mobile,
        name: user.name ?? null,
        role: user.role,
      };

      const access_token = this.generateAccessToken(newPayload);
      const refresh_token = this.generateRefreshToken(newPayload);

      return { access_token, refresh_token };
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async validateUser(userId: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return user;
  }
}
