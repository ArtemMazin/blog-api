import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { CreateBaseArticleDto } from 'src/modules/base-article/dto/create-article.dto';

export class CreateRaceArticleDto extends CreateBaseArticleDto {
  @ApiProperty({ description: 'Название расы' })
  @IsNotEmpty()
  @IsString()
  raceName: string;

  @ApiProperty({ description: 'Тип расы' })
  @IsNotEmpty()
  @IsString()
  type: string;

  @ApiProperty({ description: 'Класс расы' })
  @IsNotEmpty()
  @IsString()
  class: string;

  @ApiProperty({ description: 'Цвет кожи' })
  @IsNotEmpty()
  @IsString()
  skinColor: string;

  @ApiProperty({
    description: 'Отличительные признаки (разделенные запятыми)',
    type: String,
  })
  @IsString()
  distinctiveFeatures: string;

  @ApiProperty({ description: 'Планета происхождения' })
  @IsNotEmpty()
  @IsString()
  homeWorld: string;

  @ApiProperty({ description: 'Язык' })
  @IsNotEmpty()
  @IsString()
  language: string;

  @ApiProperty({
    description:
      'Известные представители (ID персонажей, разделенные запятыми)',
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  knownRepresentatives?: string;
}
