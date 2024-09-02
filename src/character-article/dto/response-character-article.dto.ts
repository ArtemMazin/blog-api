import { ApiProperty } from '@nestjs/swagger';
import { ResponseBaseArticleDto } from 'src/base-article/dto/response-article.dto';

export class ResponseCharacterArticleDto extends ResponseBaseArticleDto {
  @ApiProperty()
  characterName: string;

  @ApiProperty({ required: false })
  birthDate?: string;

  @ApiProperty({ required: false })
  deathDate?: string;

  @ApiProperty()
  race: string;

  @ApiProperty()
  gender: string;

  @ApiProperty({ required: false })
  height?: number;

  @ApiProperty()
  homeWorld: string;
}
