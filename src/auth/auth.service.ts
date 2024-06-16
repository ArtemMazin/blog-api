import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { SignUpDto, SignInDto } from './dto';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { Response } from 'express';
import { User } from 'src/schemas/user.schema';
import { IUserWithoutPassword } from 'types/types';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signUp(user: SignUpDto) {
    const userExists = await this.usersService.findByEmail(user.email);

    if (userExists) {
      throw new BadRequestException({ type: 'User already exists' });
    }

    const newUser = await this.usersService.createUser({
      name: user.name,
      email: user.email,
      password: await argon2.hash(user.password),
    });

    const token = this.jwtService.sign({
      email: newUser.email,
      sub: newUser._id,
    });

    return { newUser, token };
  }

  async validateUser(
    signInDto: SignInDto,
  ): Promise<IUserWithoutPassword | null> {
    const { email, password } = signInDto;

    const userExists = await this.usersService.findByEmailWithPassword(email);
    if (!userExists) {
      return null;
    }
    const isMatch = await argon2.verify(userExists.password, password);

    if (isMatch) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = userExists;
      return result as IUserWithoutPassword;
    }
    return null;
  }

  async login(
    user: User | null,
    res: Response,
  ): Promise<{ user: User; access_token: string }> {
    if (!user) {
      throw new BadRequestException({ type: 'Invalid credentials' });
    }
    const payload = { email: user.email, sub: user._id };
    const accessToken = this.jwtService.sign(payload);

    res.cookie('access_token', accessToken, {
      httpOnly: true,
      sameSite: 'none',
      maxAge: 3600000, // 1 час
    });

    return {
      user,
      access_token: accessToken,
    };
  }
}
