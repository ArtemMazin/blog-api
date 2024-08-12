import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateArticleDto {
  @ApiProperty({ example: 'Заголовок статьи' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'Содержание статьи...' })
  @IsString()
  content: string;

  @ApiProperty({ type: 'string', format: 'binary' })
  image: any;

  @ApiProperty({ example: 'false' })
  @IsString()
  isPremium: 'true' | 'false';
}
