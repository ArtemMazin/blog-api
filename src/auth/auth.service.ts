import {
  Injectable,
  Logger,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { Response } from 'express';
import { MailerService } from '@nestjs-modules/mailer';
import { ResponseUserDto } from 'src/users/dto';
import { LoginDto, RegisterDto } from './dto';
import { plainToClass } from 'class-transformer';
import { User } from 'src/schemas/user.schema';
import { AUTH_CONSTANTS } from 'src/common/auth-constants';
import { JwtPayload } from 'types/types';
import { EmailService } from 'src/email/email.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private readonly mailerService: MailerService,
    private readonly emailService: EmailService,
  ) {}

  private toUserResponse(user: User): ResponseUserDto {
    return plainToClass(ResponseUserDto, user.toObject(), {
      excludeExtraneousValues: true,
    });
  }

  async registerUser(
    userData: RegisterDto,
    res: Response,
  ): Promise<ResponseUserDto> {
    this.logger.log(`Попытка регистрации пользователя: ${userData.email}`);
    try {
      const hashedPassword = await this.hashPassword(userData.password);
      const newUser = await this.usersService.createUser({
        ...userData,
        password: hashedPassword,
      });

      const accessToken = this.generateAccessToken(newUser);
      this.setAccessTokenCookie(res, accessToken);

      this.logger.log(`Пользователь успешно зарегистрирован: ${newUser.email}`);
      return newUser;
    } catch (error) {
      this.logger.error(
        `Ошибка при регистрации пользователя: ${error.message}`,
      );
      throw error;
    }
  }

  async validateUser(signInDto: LoginDto): Promise<ResponseUserDto | null> {
    this.logger.log(`Попытка валидации пользователя: ${signInDto.email}`);
    if (!signInDto.email || !signInDto.password) {
      throw new BadRequestException('Некорректные данные для входа');
    }
    try {
      const user = await this.usersService.findByEmailWithPassword(
        signInDto.email,
      );
      if (!user) {
        return null;
      }
      const isMatch = await this.verifyPassword(
        user.password,
        signInDto.password,
      );
      if (isMatch) {
        this.logger.log(`Пользователь успешно валидирован: ${user.email}`);
        return this.toUserResponse(user);
      }
      this.logger.warn(
        `Неудачная попытка входа для пользователя: ${signInDto.email}`,
      );
      return null;
    } catch (error) {
      this.logger.error(`Ошибка при валидации пользователя: ${error.message}`);
      throw error;
    }
  }

  async authenticateUser(
    user: ResponseUserDto,
    res: Response,
  ): Promise<ResponseUserDto> {
    this.logger.log(`Попытка входа пользователя: ${user.email}`);
    if (!user) {
      throw new UnauthorizedException('Пользователь не авторизован');
    }
    try {
      const accessToken = this.generateAccessToken(user);
      this.setAccessTokenCookie(res, accessToken);

      this.logger.log(`Пользователь успешно вошел в систему: ${user.email}`);
      return user;
    } catch (error) {
      this.logger.error(`Ошибка при входе пользователя: ${error.message}`);
      throw error;
    }
  }

  async logoutUser(res: Response): Promise<{ success: boolean }> {
    this.logger.log('Попытка выхода пользователя');
    try {
      res.clearCookie('access_token');
      this.logger.log('Пользователь успешно вышел из системы');
      return { success: true };
    } catch (error) {
      this.logger.error(`Ошибка при выходе пользователя: ${error.message}`);
      throw new Error('Не удалось выйти из аккаунта');
    }
  }

  async resetPassword(email: string): Promise<{ success: boolean }> {
    this.logger.log(`Попытка сброса пароля для пользователя: ${email}`);
    if (!email) {
      throw new BadRequestException('Email не предоставлен');
    }
    try {
      const user = await this.usersService.findByEmail(email);
      if (!user) {
        throw new BadRequestException('Пользователь не найден');
      }
      const resetToken = this.generateResetToken(email);
      const expiresIn = new Date(Date.now() + 3600000); // 1 час

      await this.usersService.updateProfile(String(user._id), {
        resetPasswordToken: resetToken,
        resetPasswordExpires: expiresIn,
      });

      await this.emailService.sendPasswordResetEmail(email, resetToken);

      this.logger.log(`Ссылка для сброса пароля отправлена: ${email}`);
      return { success: true };
    } catch (error) {
      this.logger.error(`Ошибка при сбросе пароля: ${error.message}`);
      throw new Error('Не удалось отправить письмо для сброса пароля');
    }
  }

  async updatePassword(
    resetToken: string,
    newPassword: string,
  ): Promise<ResponseUserDto> {
    this.logger.log('Попытка обновления пароля');
    if (!resetToken || !newPassword) {
      throw new BadRequestException(
        'Некорректные данные для обновления пароля',
      );
    }

    try {
      const payload = this.jwtService.verify(resetToken);
      const email = payload.email;

      if (!email) {
        throw new BadRequestException('Некорректный токен сброса пароля');
      }
      const user = await this.usersService.findByEmailWithPassword(email);

      if (!user || user.resetPasswordToken !== resetToken) {
        throw new BadRequestException('Некорректный токен сброса пароля');
      }
      if (user.resetPasswordExpires < new Date()) {
        throw new BadRequestException(
          'Срок действия токена сброса пароля истек',
        );
      }
      const hashedPassword = await this.hashPassword(newPassword);

      const updatedUser = await this.usersService.updateProfile(
        String(user._id),
        {
          password: hashedPassword,
          resetPasswordToken: null,
          resetPasswordExpires: null,
        },
      );

      this.logger.log(`Пароль успешно обновлен для пользователя: ${email}`);
      return updatedUser;
    } catch (error) {
      this.logger.error(`Ошибка при обновлении пароля: ${error.message}`);
      throw new BadRequestException('Не удалось изменить пароль');
    }
  }

  private generateAccessToken(user: User | ResponseUserDto): string {
    const payload: JwtPayload = {
      email: user.email,
      sub: user._id.toString(),
    };
    return this.jwtService.sign(payload);
  }

  private setAccessTokenCookie(res: Response, accessToken: string): void {
    res.cookie(AUTH_CONSTANTS.COOKIE_NAME, accessToken, {
      httpOnly: true,
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000, // 1 день в миллисекундах
    });
  }

  private generateResetToken(email: string): string {
    return this.jwtService.sign(
      { email },
      { expiresIn: AUTH_CONSTANTS.RESET_TOKEN_EXPIRATION },
    );
  }

  private async hashPassword(password: string): Promise<string> {
    return argon2.hash(password);
  }

  private async verifyPassword(
    hashedPassword: string,
    plainPassword: string,
  ): Promise<boolean> {
    return argon2.verify(hashedPassword, plainPassword);
  }
}
