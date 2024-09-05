import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  Inject,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IArticleService } from 'types/types';

@Injectable()
export class AuthorGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @Inject('IArticleService') private readonly articleService: IArticleService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = request.user._id;
    const articleId = request.params.id;

    const authorId = await this.articleService.getArticleAuthor(articleId);

    if (userId !== authorId) {
      throw new ForbiddenException('Вы не являетесь автором этой статьи');
    }

    return true;
  }
}
