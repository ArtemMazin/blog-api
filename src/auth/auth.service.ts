import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { SignUpDto } from './dto';
import { JwtService } from '@nestjs/jwt';
import { IUser } from 'types/types';
import * as argon2 from 'argon2';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signUp(user: SignUpDto): Promise<SignUpDto> {
    const userExists = await this.usersService.findByEmail(user.email);

    if (userExists) {
      throw new BadRequestException({ type: 'User already exists' });
    }

    const newUser = {
      name: user.name,
      email: user.email,
      password: await argon2.hash(user.password),
    };

    return await this.usersService.createUser(newUser);
  }

  async validateUser(email: string, pass: string): Promise<any> {
    const userExists = await this.usersService.findByEmail(email);
    const isMatch = await argon2.verify(userExists.password, pass);

    if (userExists && isMatch) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = userExists.toJSON();

      return result;
    }
    return null;
  }

  async login(user: IUser) {
    const payload = { email: user.email, sub: user._id };

    return {
      id: user._id,
      email: user.email,
      access_token: this.jwtService.sign(payload),
    };
  }
}
