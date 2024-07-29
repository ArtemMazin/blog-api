import { Injectable } from '@nestjs/common';
import { CreatePaymentDto, GetPaymentDto } from './dto';
import { UsersService } from 'src/users/users.service';
import { ResponseUserDto } from 'src/users/dto';

@Injectable()
export class PaymentService {
  constructor(private usersService: UsersService) {}

  async createPayment(createPaymentDto: CreatePaymentDto) {
    try {
      const data = fetch(process.env.YOOKASSA_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Idempotence-Key': Date.now().toString(),
          Authorization: `Basic ${Buffer.from(
            `${process.env.YOOKASSA_SHOP_ID}:${process.env.YOOKASSA_SECRET_KEY}`,
          ).toString('base64')}`,
        },

        body: JSON.stringify({
          amount: {
            value: createPaymentDto.amount,
            currency: 'RUB',
          },
          capture: true,
          description: 'Оплата заказа',
          confirmation: {
            type: 'redirect',
            return_url: process.env.YOOKASSA_RETURN_URL,
          },
          test: true,
        }),
      }).then((response) => response.json());

      return data;
    } catch (error) {
      throw new Error('Ошибка при создании платежа');
    }
  }

  async getPayment(getPaymentDto: GetPaymentDto, user: ResponseUserDto) {
    try {
      const data: { status: string } = await fetch(
        `https://api.yookassa.ru/v3/payments/${getPaymentDto.id}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Basic ${Buffer.from(
              `${process.env.YOOKASSA_SHOP_ID}:${process.env.YOOKASSA_SECRET_KEY}`,
            ).toString('base64')}`,
          },
        },
      ).then((response) => response.json());

      if (data?.status === 'succeeded') {
        this.usersService.updateProfile(user._id, {
          isPremium: true,
        });

        return data;
      }
    } catch (error) {
      throw new Error('Ошибка при получении платежа');
    }
  }
}
