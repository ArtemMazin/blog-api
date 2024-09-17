import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { ResponseBaseArticleDto } from 'src/modules/base-article/dto/response-article.dto';

class RaceInfo {
  @ApiProperty({ description: 'ID расы' })
  @Expose()
  _id: string;

  @ApiProperty({ description: 'Название расы' })
  @Expose()
  raceName: string;
}

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

  @ApiProperty({ description: 'Информация о расе персонажа' })
  @Expose()
  @Type(() => RaceInfo)
  race: RaceInfo;

  @ApiProperty({ description: 'Пол персонажа' })
  @Expose()
  gender: string;

  @ApiProperty({ description: 'Рост персонажа', required: false })
  @Expose()
  height?: string;

  @ApiProperty({ description: 'Родной мир персонажа' })
  @Expose()
  homeWorld: string;
}
