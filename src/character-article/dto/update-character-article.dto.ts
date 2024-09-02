import { PartialType } from '@nestjs/swagger';
import { CreateCharacterArticleDto } from './create-character-article.dto';

export class UpdateCharacterArticleDto extends PartialType(
  CreateCharacterArticleDto,
) {}
