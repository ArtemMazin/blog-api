import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEnum, IsNumber, IsOptional } from 'class-validator';
import { UpdateArticleDto } from 'src/base-article/dto/update-article.dto';

export class UpdateCharacterArticleDto extends UpdateArticleDto {
  @ApiProperty({ example: 'Дарт Вейдер', required: false })
  @IsOptional()
  @IsString()
  characterName?: string;

  @ApiProperty({ example: '41.9 BBY', required: false })
  @IsOptional()
  @IsString()
  birthDate?: string;

  @ApiProperty({ example: '4 ABY', required: false })
  @IsOptional()
  @IsString()
  deathDate?: string;

  @ApiProperty({ example: 'Человек', required: false })
  @IsOptional()
  @IsString()
  race?: string;

  @ApiProperty({
    enum: ['Мужской', 'Женский', 'Другое'],
    example: 'Мужской',
    required: false,
  })
  @IsOptional()
  @IsEnum(['Мужской', 'Женский', 'Другое'])
  gender?: string;

  @ApiProperty({ example: 202, required: false })
  @IsOptional()
  @IsNumber()
  height?: number;

  @ApiProperty({ example: 'Татуин', required: false })
  @IsOptional()
  @IsString()
  homeWorld?: string;
}
