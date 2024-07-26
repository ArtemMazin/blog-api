import { Request } from 'express';
import { User } from 'src/schemas/user.schema';

export interface IArticle {
  title: string;
  content: string;
  image: string;
  author: User;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreatedUser {
  _id: string;
  name: string;
  email: string;
  favorite_articles: string[];
  avatar: string | null;
  about: string | null;
  createdAt: Date;
  resetPasswordToken: string | null;
  resetPasswordExpires: Date | null;
}

export interface IUserWithoutPassword extends Omit<User, 'password'> {}

export interface IAuthRequest extends Request {
  user: User;
}
