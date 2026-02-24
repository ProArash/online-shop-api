import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request, Response } from 'express';
import { Strategy, ExtractJwt, JwtFromRequestFunction } from 'passport-jwt';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '@/auth/auth.service';
import { UserPayload } from '@/lib/user.payload';
import { AuthCookie } from '@/lib/auth.cookie';

export interface RequestWithCookie extends Request {
  cookies: AuthCookie;
  res: Response;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly authService: AuthService,
  ) {
    const cookieExtractor: JwtFromRequestFunction = (
      req: RequestWithCookie,
    ): string | null => {
      return req?.cookies?.access_token ?? null;
    };

    super({
      jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
      ignoreExpiration: true,
      secretOrKey: configService.get<string>('JWT_SECRET') ?? '',
      passReqToCallback: true,
    });
  }

  async validate(
    req: RequestWithCookie,
    payload: UserPayload,
  ): Promise<UserPayload> {
    const accessToken = req.cookies?.access_token;
    const refreshToken = req.cookies?.refresh_token;

    if (!accessToken && !refreshToken) {
      throw new UnauthorizedException('No tokens provided');
    }

    try {
      this.jwtService.verify<UserPayload>(accessToken, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });

      return {
        sub: payload.sub,
        mobile: payload.mobile,
        name: payload.name,
        role: payload.role,
      };
    } catch {
      if (!refreshToken) {
        throw new UnauthorizedException('Access token expired');
      }

      try {
        const { access_token, refresh_token } =
          await this.authService.refreshTokens(refreshToken);

        req.res.cookie('access_token', access_token, {
          httpOnly: true,
          secure: true,
          sameSite: 'strict',
          maxAge: 24 * 60 * 60 * 1000,
        });

        req.res.cookie('refresh_token', refresh_token, {
          httpOnly: true,
          secure: true,
          sameSite: 'strict',
          maxAge: 90 * 24 * 60 * 60 * 1000,
        });

        const newPayload = this.jwtService.verify<UserPayload>(access_token, {
          secret: this.configService.get<string>('JWT_SECRET'),
        });

        return {
          sub: newPayload.sub,
          mobile: newPayload.mobile,
          name: newPayload.name,
          role: newPayload.role,
        };
      } catch {
        throw new UnauthorizedException('Invalid refresh token');
      }
    }
  }
}
