import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreatePaymentDto {
  @IsNotEmpty()
  @ApiProperty({
    example: '300',
  })
  readonly amount: number;
}

export class GetPaymentDto {
  @IsNotEmpty()
  @ApiProperty({
    example: '2e3205eb-000f-5000-9000-1e9b60aa75bc',
  })
  readonly id: string;
}
