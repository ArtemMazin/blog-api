import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEmail } from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty({
    description: 'Email пользователя',
    example: 'luke@rebellion.com',
  })
  @IsNotEmpty({ message: 'Email не может быть пустым' })
  @IsEmail({}, { message: 'Некорректный формат email' })
  readonly email: string;
}
