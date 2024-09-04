import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CreatePaymentDto, GetPaymentDto, ResponsePaymentDto } from './dto';
import { UsersService } from '../users/users.service';
import { ResponseUserDto } from '../users/dto';

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {}

  private getYookassaHeaders(): Record<string, string> {
    return {
      'Content-Type': 'application/json',
      'Idempotence-Key': Date.now().toString(),
      Authorization: `Basic ${Buffer.from(
        `${this.configService.get('YOOKASSA_SHOP_ID')}:${this.configService.get('YOOKASSA_SECRET_KEY')}`,
      ).toString('base64')}`,
    };
  }

  async createPayment(
    createPaymentDto: CreatePaymentDto,
  ): Promise<ResponsePaymentDto> {
    try {
      const response = await fetch(this.configService.get('YOOKASSA_URL'), {
        method: 'POST',
        headers: this.getYookassaHeaders(),
        body: JSON.stringify({
          amount: {
            value: createPaymentDto.amount,
            currency: 'RUB',
          },
          capture: true,
          description: 'Оплата заказа',
          confirmation: {
            type: 'redirect',
            return_url: this.configService.get('YOOKASSA_RETURN_URL'),
          },
          test: true,
        }),
      });

      if (!response.ok) {
        throw new HttpException(
          'Ошибка при создании платежа',
          HttpStatus.BAD_REQUEST,
        );
      }

      return await response.json();
    } catch (error) {
      this.logger.error(`Ошибка при создании платежа: ${error.message}`);
      throw new HttpException(
        'Ошибка при создании платежа',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getPayment(
    getPaymentDto: GetPaymentDto,
    user: ResponseUserDto,
  ): Promise<ResponsePaymentDto> {
    try {
      const response = await fetch(
        `https://api.yookassa.ru/v3/payments/${getPaymentDto.id}`,
        {
          method: 'GET',
          headers: this.getYookassaHeaders(),
        },
      );

      if (!response.ok) {
        throw new HttpException(
          'Ошибка при получении платежа',
          HttpStatus.BAD_REQUEST,
        );
      }

      const data: ResponsePaymentDto = await response.json();

      if (data?.status === 'succeeded') {
        await this.usersService.updateProfile(user._id, { isPremium: true });
      }

      return data;
    } catch (error) {
      this.logger.error(`Ошибка при получении платежа: ${error.message}`);
      throw new HttpException(
        'Ошибка при получении платежа',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
