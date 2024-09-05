import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEnum } from 'class-validator';

enum Premium {
  True = 'true',
  False = 'false',
}

export class CreateBaseArticleDto {
  @ApiProperty({ description: 'Заголовок статьи' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ description: 'Содержание статьи' })
  @IsNotEmpty()
  @IsString()
  content: string;

  @ApiProperty({
    description: 'Является ли статья премиум-контентом',
    enum: Premium,
  })
  @IsEnum(Premium)
  isPremium: Premium;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Изображение статьи',
  })
  image: any;
}
