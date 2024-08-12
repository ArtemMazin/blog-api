import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEnum, IsNumber, IsOptional } from 'class-validator';
import { CreateArticleDto } from 'src/base-article/dto/create-article.dto';

export class CreateCharacterArticleDto extends CreateArticleDto {
  @ApiProperty({ example: 'Дарт Вейдер' })
  @IsString()
  characterName: string;

  @ApiProperty({ example: '41.9 BBY', required: false })
  @IsOptional()
  @IsString()
  birthDate?: string;

  @ApiProperty({ example: '4 ABY', required: false })
  @IsOptional()
  @IsString()
  deathDate?: string;

  @ApiProperty({ example: 'Человек' })
  @IsString()
  race: string;

  @ApiProperty({ enum: ['Мужской', 'Женский', 'Другое'], example: 'Мужской' })
  @IsEnum(['Мужской', 'Женский', 'Другое'])
  gender: string;

  @ApiProperty({ example: 202, required: false })
  @IsOptional()
  @IsNumber()
  height?: number;

  @ApiProperty({ example: 'Татуин' })
  @IsString()
  homeWorld: string;
}
