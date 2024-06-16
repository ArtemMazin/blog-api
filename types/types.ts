import { Request } from 'express';
import { User } from 'src/schemas/user.schema';

export interface IArticle {
  title: string;
  content: string;
  image: string;
}

export interface IUserWithoutPassword extends Omit<User, 'password'> {}

export interface IAuthRequest extends Request {
  user: User;
}
