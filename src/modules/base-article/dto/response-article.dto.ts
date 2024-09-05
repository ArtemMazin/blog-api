import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { ResponseUserDto } from 'src/modules/users/dto';

export class ResponseBaseArticleDto {
  @ApiProperty({ example: '60d5ecb54e7d5a001f5d4f2c' })
  @Expose()
  _id: string;

  @ApiProperty({ example: 'Заголовок статьи' })
  @Expose()
  title: string;

  @ApiProperty({ example: 'Содержание статьи...' })
  @Expose()
  content: string;

  @ApiProperty({ example: 'path/to/image.jpg' })
  @Expose()
  image: string;

  @ApiProperty({ type: () => ResponseUserDto })
  @Type(() => ResponseUserDto)
  @Expose()
  author: ResponseUserDto;

  @ApiProperty({ example: false })
  @Expose()
  isPremium: boolean;

  @ApiProperty({ example: 5 })
  @Expose()
  readingTime: number;

  @ApiProperty({ example: '2023-06-15T10:00:00.000Z' })
  @Expose()
  @Type(() => Date)
  createdAt: Date;

  @ApiProperty({ example: '2023-06-15T10:00:00.000Z' })
  @Expose()
  @Type(() => Date)
  updatedAt: Date;
}
