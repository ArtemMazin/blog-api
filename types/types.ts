import { Request } from 'express';

export interface IArticle {
  title: string;
  content: string;
  image: string;
}

export interface IUser {
  _id: string;
  email: string;
}

export interface IAuthRequest extends Request {
  user: IUser;
}
