import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JsonWebTokenError, JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { Response } from 'express';
import { IUserWithoutPassword } from 'types/types';
import { IncorrectDataException } from 'src/errors/IncorrectDataException';
import { UserExistException } from 'src/errors/UserExistException';
import { UserCreationFailedException } from 'src/errors/UserCreationFailedException';
import { MailerService } from '@nestjs-modules/mailer';
import { ResponseUserDto } from 'src/users/dto';
import {
  LoginDto,
  LoginResponseDto,
  MessageResponseDto,
  RegisterDto,
} from './dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private readonly mailerService: MailerService,
  ) {}

  async signUp(userData: RegisterDto, res: Response) {
    try {
      const UserExistExceptions = await this.usersService.findByEmail(
        userData.email,
      );

      if (UserExistExceptions) {
        throw new UserExistException();
      }

      const newUser = await this.usersService.createUser({
        name: userData.name,
        email: userData.email,
        password: await argon2.hash(userData.password),
      });

      if (newUser === null) {
        throw new UserCreationFailedException();
      }

      const accessToken = this.jwtService.sign({
        email: newUser.email,
        sub: newUser._id,
      });

      res.cookie('access_token', accessToken, {
        httpOnly: true,
        sameSite: 'strict',
        maxAge: 3600000, // 1 час
      });

      return { user: newUser.toObject(), access_token: accessToken };
    } catch (error) {
      throw error;
    }
  }

  async validateUser(
    signInDto: LoginDto,
  ): Promise<IUserWithoutPassword | null> {
    if (!signInDto.email || !signInDto.password) {
      throw new IncorrectDataException();
    }
    try {
      const { email, password } = signInDto;

      const UserExistExceptions =
        await this.usersService.findByEmailWithPassword(email);
      if (!UserExistExceptions) {
        return null;
      }
      const isMatch = await argon2.verify(
        UserExistExceptions.password,
        password,
      );

      if (isMatch) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...result } = UserExistExceptions;
        return result as IUserWithoutPassword;
      }
      return null;
    } catch (error) {
      throw error;
    }
  }

  async login(user: ResponseUserDto, res: Response): Promise<LoginResponseDto> {
    if (!user) {
      throw new IncorrectDataException();
    }
    try {
      const accessToken = this.jwtService.sign({
        email: user.email,
        sub: user._id,
      });

      res.cookie('access_token', accessToken, {
        httpOnly: true,
        sameSite: 'strict',
        maxAge: 3600000, // 1 час
      });

      return {
        user,
        access_token: accessToken,
      };
    } catch (error) {
      throw error;
    }
  }

  async logout(res: Response): Promise<MessageResponseDto> {
    try {
      res.clearCookie('access_token');
      return { message: 'Вы вышли из аккаунта' };
    } catch (error) {
      throw new Error('Не удалось выйти из аккаунта');
    }
  }

  async sendPasswordResetEmail(
    email: string,
    resetToken: string,
  ): Promise<MessageResponseDto> {
    try {
      const resetUrl = `${process.env.RESET_PASS_URL}${resetToken}`;

      await this.mailerService.sendMail({
        to: email,
        from: process.env.MAIL_USER,
        subject: 'Сброс пароля',
        template: 'reset-password', // Это имя файла шаблона без расширения
        context: {
          name: email.split('@')[0], // Простой способ получить имя из email
          resetUrl,
        },
      });
      return { message: `Письмо для сброса пароля отправлено на ${email}` };
    } catch (error) {
      throw new Error('Не удалось отправить письмо для сброса пароля');
    }
  }

  async resetPassword(email: string): Promise<MessageResponseDto> {
    if (!email) {
      throw new IncorrectDataException();
    }
    try {
      const findedUser = await this.usersService.findByEmail(email);

      if (!findedUser) {
        throw new IncorrectDataException();
      }
      const payload = { email: email };
      const resetToken = this.jwtService.sign(payload, { expiresIn: '1h' });
      const expiresIn = new Date(Date.now() + 3600000); // 1 час

      await this.usersService.updateProfile(String(findedUser._id), {
        resetPasswordToken: resetToken,
        resetPasswordExpires: expiresIn,
      });

      await this.sendPasswordResetEmail(email, resetToken);

      return { message: 'Ссылка для сброса пароля отправлена на вашу почту' };
    } catch (error) {
      throw new Error('Не удалось отправить письмо для сброса пароля');
    }
  }

  async updatePassword(
    resetToken: string,
    newPassword: string,
  ): Promise<ResponseUserDto> {
    if (!resetToken || !newPassword) {
      throw new IncorrectDataException();
    }
    if (newPassword.length < 6) {
      throw new IncorrectDataException();
    }

    try {
      const payload = this.jwtService.verify(resetToken);
      const email = payload.email;

      if (!email) {
        throw new IncorrectDataException();
      }
      const findedUser = await this.usersService.findByEmailWithPassword(email);

      if (!findedUser || findedUser.resetPasswordToken !== resetToken) {
        throw new IncorrectDataException();
      }
      if (findedUser.resetPasswordExpires < new Date()) {
        throw new IncorrectDataException();
      }
      const hashedPassword = await argon2.hash(newPassword);

      return await this.usersService.updateProfile(String(findedUser._id), {
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordExpires: null,
      });
    } catch (error) {
      if (error instanceof JsonWebTokenError) {
        throw new IncorrectDataException();
      }
      throw new Error('Не удалось изменить пароль');
    }
  }
}
