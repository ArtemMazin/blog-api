import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ArticleDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Title',
  })
  title: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Content',
  })
  content: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example:
      'https://unsplash.com/photos/a-man-wearing-a-white-hat-mjdBHLjOEMY',
  })
  image: string;
}

export class UpdateArticleDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  content?: string;

  @IsString()
  @IsOptional()
  image?: string;
}
