import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsBoolean } from 'class-validator';
import { ResponseCharacterArticleDto } from 'src/modules/article/character-article/dto/response-character-article.dto';

export class ResponseRollCharacterDto {
  @Expose()
  @ApiProperty({
    description: 'Полученный персонаж',
    type: ResponseCharacterArticleDto,
  })
  @Type(() => ResponseCharacterArticleDto)
  character: ResponseCharacterArticleDto;

  @Expose()
  @ApiProperty({
    description: 'Флаг, указывающий, является ли персонаж новым в коллекции',
    example: true,
  })
  @IsBoolean()
  isNew: boolean;

  @Expose()
  @ApiProperty({
    description: 'Оставшееся количество бросков на сегодня',
    example: 4,
  })
  remainingRolls: number;
}
