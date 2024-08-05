import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BaseArticleController } from '../base-article/base-article.controller';
import { CharacterArticleService } from './character-article.service';
import { CharacterArticle } from '../schemas/character.schema';
import { CreateCharacterArticleDto, ResponseCharacterArticleDto } from './dto';

@ApiTags('Character Articles')
@Controller('character-articles')
export class CharacterArticleController extends BaseArticleController<
  CharacterArticle,
  CreateCharacterArticleDto,
  ResponseCharacterArticleDto
> {
  constructor(private characterArticleService: CharacterArticleService) {
    super(characterArticleService);
  }
}
