import { ICreatedUser } from 'types/types';

export const exampleUser: ICreatedUser = {
  _id: '642b8c75b337237e907b1636',
  name: 'John',
  email: 'test@gmail.com',
  favorite_articles: [],
  avatar: null,
  about: null,
  resetPasswordToken: null,
  resetPasswordExpires: null,
  createdAt: new Date('2023-04-04T14:59:33.658Z'),
};

export const exampleToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0MmI4Yzc1YjMzNzIzNzk0N2IxNjM2IiwiaWF0IjoxNjc4MzQ2NjM2LCJleHAiOjE2NzgzNDc2MzZ9.G1nWZeG-Wcw5qv4x637l6hZGQYpVd93WLh0_c0g4vJc';
