import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ResponseUserDto } from 'src/users/dto';

export class ResponseBaseArticleDto {
  @ApiProperty({ example: '60d5ecb54e7d5a001f5d4f2c' })
  _id: string;

  @ApiProperty({ example: 'Заголовок статьи' })
  title: string;

  @ApiProperty({ example: 'Содержание статьи...' })
  content: string;

  @ApiProperty({ example: 'path/to/image.jpg' })
  image: string;

  @ApiProperty({ type: ResponseUserDto })
  @Type(() => ResponseUserDto)
  author: ResponseUserDto;

  @ApiProperty({ example: false })
  isPremium: boolean;

  @ApiProperty({ example: 5 })
  readingTime: number;

  @ApiProperty({ example: '2023-06-15T10:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2023-06-15T10:00:00.000Z' })
  updatedAt: Date;
}
