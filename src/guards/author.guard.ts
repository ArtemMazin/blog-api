import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { ArticleService } from 'src/article/articles.service';

@Injectable()
export class AuthorGuard implements CanActivate {
  constructor(private readonly articleService: ArticleService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = request.user._id;
    const articleId = request.params.id;

    const authorId = await this.articleService.getArticleAuthor(articleId);

    if (userId !== authorId) {
      throw new ForbiddenException('You are not the author of this article');
    }

    return true;
  }
}
