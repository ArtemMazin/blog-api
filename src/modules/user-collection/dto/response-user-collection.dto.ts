import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsDate, IsString, IsNumber, IsArray } from 'class-validator';

export class ResponseUserCollectionDto {
  @Expose()
  @ApiProperty({
    description: 'ID коллекции пользователя',
    example: '60d5ecb74f421b2d1c8829fb',
  })
  @IsString()
  _id: string;

  @Expose()
  @ApiProperty({
    description: 'ID пользователя',
    example: '60d5ecb74f421b2d1c8829fc',
  })
  @IsString()
  user: string;

  @Expose()
  @ApiProperty({
    description: 'Список id персонажей в коллекции',
    type: [String],
  })
  @IsArray()
  characters: string[];

  @Expose()
  @ApiProperty({
    description: 'Дата последнего броска',
    example: '2023-06-15T10:00:00.000Z',
  })
  @IsDate()
  lastRollDate: Date;

  @Expose()
  @ApiProperty({
    description: 'Количество бросков сегодня',
    example: 3,
  })
  @IsNumber()
  rollsToday: number;

  @Expose()
  @ApiProperty({ example: '2023-06-15T10:00:00.000Z' })
  @IsDate()
  createdAt: Date;

  @Expose()
  @ApiProperty({ example: '2023-06-15T10:00:00.000Z' })
  @IsDate()
  updatedAt: Date;
}
