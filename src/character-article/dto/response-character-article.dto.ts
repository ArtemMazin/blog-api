import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { ResponseBaseArticleDto } from 'src/base-article/dto/response-article.dto';

export class ResponseCharacterArticleDto extends ResponseBaseArticleDto {
  @ApiProperty({ description: 'Имя персонажа' })
  @Expose()
  characterName: string;

  @ApiProperty({ description: 'Дата рождения персонажа', required: false })
  @Expose()
  birthDate?: string;

  @ApiProperty({ description: 'Дата смерти персонажа', required: false })
  @Expose()
  deathDate?: string;

  @ApiProperty({ description: 'Раса персонажа' })
  @Expose()
  race: string;

  @ApiProperty({ description: 'Пол персонажа' })
  @Expose()
  gender: string;

  @ApiProperty({ description: 'Рост персонажа', required: false })
  @Expose()
  height?: number;

  @ApiProperty({ description: 'Родной мир персонажа' })
  @Expose()
  homeWorld: string;
}
