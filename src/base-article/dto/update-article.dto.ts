import { PartialType } from '@nestjs/swagger';
import { CreateBaseArticleDto } from './create-article.dto';

export class UpdateBaseArticleDto extends PartialType(CreateBaseArticleDto) {}
