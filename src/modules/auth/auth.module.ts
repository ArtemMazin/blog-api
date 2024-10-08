import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { jwtConfig } from 'src/config/jwt.config';
import { EmailService } from 'src/modules/email/email.service';
import { UsersModule } from '../users/users.module';
import { UserCollectionModule } from '../user-collection/user-collection.module';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: jwtConfig,
      inject: [ConfigService],
    }),
    UserCollectionModule,
  ],
  controllers: [AuthController],
  providers: [
    ConfigService,
    AuthService,
    EmailService,
    LocalStrategy,
    JwtStrategy,
  ],
})
export class AuthModule {}
