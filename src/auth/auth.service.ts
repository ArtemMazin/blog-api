import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { SignUpDto, SignInDto } from './dto';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { Response } from 'express';
import { User } from 'src/schemas/user.schema';
import { IUserWithoutPassword } from 'types/types';
import { IncorrectDataException } from 'src/errors/IncorrectDataException';
import { UserExistException } from 'src/errors/UserExistException';
import { UserCreationFailedException } from 'src/errors/UserCreationFailedException';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signUp(user: SignUpDto) {
    if (
      !user.email ||
      !user.password ||
      !user.name ||
      user.password.length < 6
    ) {
      throw new IncorrectDataException();
    }

    try {
      const UserExistExceptions = await this.usersService.findByEmail(
        user.email,
      );

      if (UserExistExceptions) {
        throw new UserExistException();
      }

      const newUser = await this.usersService.createUser({
        name: user.name,
        email: user.email,
        password: await argon2.hash(user.password),
      });

      if (newUser === null) {
        throw new UserCreationFailedException();
      }

      const token = this.jwtService.sign({
        email: newUser.email,
        sub: newUser._id,
      });

      return { newUser, token };
    } catch (error) {
      throw error;
    }
  }

  async validateUser(
    signInDto: SignInDto,
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

  async login(
    user: User | null,
    res: Response,
  ): Promise<{ user: User; access_token: string }> {
    if (!user) {
      throw new IncorrectDataException();
    }
    try {
      const payload = { email: user.email, sub: user._id };
      const accessToken = this.jwtService.sign(payload);

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
}
