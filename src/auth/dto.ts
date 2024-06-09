import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEmail } from 'class-validator';

export class SignUpDto {
  @IsNotEmpty()
  @ApiProperty({
    example: 'John',
    description: 'User name',
  })
  name: string;

  @IsEmail()
  @ApiProperty({
    example: 'test@gmail.com',
    description: 'User email',
  })
  email: string;

  @IsNotEmpty()
  @ApiProperty({
    example: '123456',
    description: 'User password',
  })
  password: string;
}

export class SignInDto {
  @IsEmail()
  @ApiProperty({
    example: 'test@gmail.com',
    description: 'User email',
  })
  email: string;

  @IsNotEmpty()
  @ApiProperty({
    example: '123456',
    description: 'User password',
  })
  password: string;
}
