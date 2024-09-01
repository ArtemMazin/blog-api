import { ApiProperty } from '@nestjs/swagger';
import { ResponseUserDto } from 'src/users/dto';

export class LoginResponseDto {
  @ApiProperty({
    description: 'Информация о пользователе',
    type: ResponseUserDto,
  })
  user: ResponseUserDto;

  @ApiProperty({
    description: 'Токен доступа',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  access_token: string;
}
