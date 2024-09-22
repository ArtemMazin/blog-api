import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { ResponseBaseArticleDto } from 'src/modules/base-article/dto/response-article.dto';

class KnownRepresentativeResponseDto {
  @ApiProperty({ description: 'ID персонажа' })
  @Expose()
  _id: string;

  @ApiProperty({ description: 'Имя персонажа' })
  @Expose()
  name: string;
}

export class ResponseRaceArticleDto extends ResponseBaseArticleDto {
  @ApiProperty({ description: 'Название расы' })
  @Expose()
  raceName: string;

  @ApiProperty({ description: 'Тип расы' })
  @Expose()
  type: string;

  @ApiProperty({ description: 'Класс расы' })
  @Expose()
  class: string;

  @ApiProperty({ description: 'Цвет кожи' })
  @Expose()
  skinColor: string;

  @ApiProperty({ description: 'Отличительные признаки', type: [String] })
  @Expose()
  distinctiveFeatures: string[];

  @ApiProperty({ description: 'Планета происхождения' })
  @Expose()
  homeWorld: string;

  @ApiProperty({ description: 'Язык' })
  @Expose()
  language: string;

  @ApiProperty({
    description: 'Известные представители',
    type: [KnownRepresentativeResponseDto],
  })
  @Expose()
  knownRepresentatives: KnownRepresentativeResponseDto[];
}
