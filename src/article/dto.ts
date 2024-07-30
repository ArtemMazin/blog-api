import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ResponseUserDto } from 'src/users/dto';

export class ArticleDto {
  @ApiProperty({
    example: 'Title',
    description: 'Title of article',
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    example: 'Content',
    description: 'Content of article',
  })
  @IsNotEmpty()
  @IsString()
  content: string;

  @ApiProperty({
    type: 'file',
    format: 'binary',
    description: 'Image of article',
  })
  @IsOptional()
  image?: Express.Multer.File;

  @ApiProperty({
    example: 'false',
    description: 'Is premium',
  })
  @IsNotEmpty()
  isPremium: 'true' | 'false';
}

export class ResponseArticleDto {
  @ApiProperty({
    example: '66a21266a717fabd74624735',
    description: 'Id of article',
  })
  @IsString()
  @IsNotEmpty()
  _id: string;

  @ApiProperty({
    example: 'Title',
    description: 'Title of article',
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    example: 'Content',
    description: 'Content of article',
  })
  @IsNotEmpty()
  @IsString()
  content: string;

  @ApiProperty({
    example: 'uploads/articles/1721896594725.png',
    description: 'Image of article',
  })
  @IsString()
  @IsNotEmpty()
  image: string;

  @ApiProperty({
    example: ResponseUserDto,
    description: 'Author of article',
  })
  @IsNotEmpty()
  @IsString()
  author: ResponseUserDto;

  @ApiProperty({
    example: '2022-01-01T00:00:00.000Z',
    description: 'Created at',
  })
  @IsNotEmpty()
  @IsString()
  createdAt: Date;

  @ApiProperty({
    example: '2022-01-01T00:00:00.000Z',
    description: 'Updated at',
  })
  @IsNotEmpty()
  @IsString()
  updatedAt: Date;

  @ApiProperty({
    example: 'false',
    description: 'Is premium',
  })
  @IsNotEmpty()
  isPremium: boolean;
}
