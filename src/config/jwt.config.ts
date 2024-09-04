import { JwtModuleOptions } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AUTH_CONSTANTS } from 'src/common/auth-constants';

export const jwtConfig = (configService: ConfigService): JwtModuleOptions => ({
  secret: configService.get('JWT_SECRET'),
  signOptions: { expiresIn: AUTH_CONSTANTS.TOKEN_EXPIRATION },
});
