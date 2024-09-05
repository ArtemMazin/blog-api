export interface JwtPayload {
  email: string;
  sub: string;
}

export interface IArticleService {
  getArticleAuthor(id: string): Promise<string>;
}
