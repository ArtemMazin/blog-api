import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { SignUpDto } from './dto';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async signUp(user: SignUpDto): Promise<SignUpDto> {
    const userExists = await this.usersService.findByEmail(user.email);

    if (userExists) {
      throw new BadRequestException({ type: 'User already exists' });
    }
    return await this.usersService.createUser(user);
  }

  async signIn(email: string, pass: string): Promise<any> {
    const userExists = await this.usersService.findByEmail(email);
    if (!userExists) {
      throw new BadRequestException({ type: 'User does not exist' });
    }
    if (userExists.password !== pass) {
      throw new UnauthorizedException({ type: 'Invalid password' });
    }
    const user = {
      id: userExists._id,
      name: userExists.name,
      email: userExists.email,
    };
    return user;
  }
}
