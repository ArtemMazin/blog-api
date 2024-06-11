import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class ArticleDto {
  @IsNotEmpty()
  @ApiProperty({
    example: 'Title',
  })
  title: string;

  @IsNotEmpty()
  @ApiProperty({
    example: 'Content',
  })
  content: string;

  @IsNotEmpty()
  @ApiProperty({
    example: 'Name',
  })
  author: string;

  @IsNotEmpty()
  @ApiProperty({
    example:
      'https://unsplash.com/photos/a-man-wearing-a-white-hat-mjdBHLjOEMY',
  })
  image: string;
}
