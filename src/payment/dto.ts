import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreatePaymentDto {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ example: 300, description: 'Сумма платежа' })
  readonly amount: number;
}

export class GetPaymentDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: '2e3205eb-000f-5000-9000-1e9b60aa75bc',
    description: 'ID платежа',
  })
  readonly id: string;
}

export class AmountDto {
  @ApiProperty({ example: '100.00' })
  value: string;

  @ApiProperty({ example: 'RUB' })
  currency: string;
}

export class ConfirmationDto {
  @ApiProperty({ example: 'redirect' })
  type: string;

  @ApiProperty({
    example:
      'https://yoomoney.ru/api-pages/v2/payment-confirm/epl?orderId=2419a771-000f-5000-9000-1edaf29243f2',
  })
  confirmation_url: string;
}

export class MetadataDto {
  @ApiProperty({ example: '37' })
  order_id: string;
}

export class RecipientDto {
  @ApiProperty({ example: '100500' })
  account_id: string;

  @ApiProperty({ example: '100700' })
  gateway_id: string;
}

export class ResponsePaymentDto {
  @ApiProperty({ example: '2419a771-000f-5000-9000-1edaf29243f2' })
  id: string;

  @ApiProperty({ example: 'pending' })
  status: string;

  @ApiProperty({ example: false })
  paid: boolean;

  @ApiProperty({ type: AmountDto })
  amount: AmountDto;

  @ApiProperty({ type: ConfirmationDto })
  confirmation: ConfirmationDto;

  @ApiProperty({ example: '2019-03-12T11:10:41.802Z' })
  created_at: string;

  @ApiProperty({ example: 'Заказ №37' })
  description: string;

  @ApiProperty({ type: MetadataDto })
  metadata: MetadataDto;

  @ApiProperty({ type: RecipientDto })
  recipient: RecipientDto;

  @ApiProperty({ example: false })
  refundable: boolean;

  @ApiProperty({ example: false })
  test: boolean;
}
