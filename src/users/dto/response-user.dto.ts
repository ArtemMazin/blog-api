import { ApiProperty } from '@nestjs/swagger';

export class ResponseUserDto {
  @ApiProperty({ example: '60d5ecb54e7d5a001f5d4f2b' })
  _id: string;

  @ApiProperty({ example: 'John Doe' })
  name: string;

  @ApiProperty({ example: 'john@example.com' })
  email: string;

  @ApiProperty({ example: 'path/to/avatar.jpg' })
  avatar?: string;

  @ApiProperty({ example: 'About me...' })
  about?: string;

  @ApiProperty({ example: '2023-06-15T10:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: false })
  isPremium: boolean;
}
