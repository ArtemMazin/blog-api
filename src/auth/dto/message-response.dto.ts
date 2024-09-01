import { ApiProperty } from '@nestjs/swagger';

export class MessageResponseDto {
  @ApiProperty({
    description: 'Сообщение о результате операции',
    example: 'Операция успешно выполнена',
  })
  message: string;
}
