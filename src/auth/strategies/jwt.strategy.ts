import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IUserWithoutPassword } from 'types/types';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        JwtStrategy.extractJWT,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  private static extractJWT(req: {
    cookies: { access_token: string | null };
  }): string | null {
    if (req?.cookies?.access_token) {
      return req.cookies.access_token;
    }
    return null;
  }

  validate(payload: any): Pick<IUserWithoutPassword, '_id' | 'email'> {
    return { _id: payload.sub, email: payload.email };
  }
}
