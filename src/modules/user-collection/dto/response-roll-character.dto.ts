import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsBoolean } from 'class-validator';

export class ResponseRollCharacterDto {
  @Expose()
  @ApiProperty({
    description: 'id полученного персонажа',
    example: '60d5ecb54e7d5a001f5d4f2c',
  })
  character: string;

  @Expose()
  @ApiProperty({
    description: 'Флаг, указывающий, является ли персонаж новым в коллекции',
    example: true,
  })
  @IsBoolean()
  isNew: boolean;

  @Expose()
  @ApiProperty({
    description: 'Оставшееся количество бросков на сегодня',
    example: 4,
  })
  remainingRolls: number;
}
