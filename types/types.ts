export interface IArticle {
  title: string;
  content: string;
  author: string;
  image: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUser {
  _id: string;
  email: string;
}
