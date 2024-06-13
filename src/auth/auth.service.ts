import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { SignUpDto } from './dto';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { Response } from 'express';
import { IUser } from 'types/types';

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

  async validateUser(email: string, pass: string): Promise<IUser> {
    const userExists = await this.usersService.findByEmail(email);
    const isMatch = await argon2.verify(userExists.password, pass);

    if (userExists && isMatch) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { _id, email } = userExists.toJSON();

      return { _id, email };
    }
    return null;
  }

  async login(user: IUser, res: Response) {
    const payload = { email: user.email, sub: user._id };
    const accessToken = this.jwtService.sign(payload);

    res.cookie('access_token', accessToken, {
      httpOnly: true,
      sameSite: 'none',
      maxAge: 3600000, // 1 час
    });

    return {
      id: user._id,
      email: user.email,
      access_token: accessToken,
    };
  }

  async getProfile(user: IUser) {
    return await this.usersService.findByEmail(user.email);
  }
}
