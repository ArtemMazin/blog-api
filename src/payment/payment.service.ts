import { Injectable } from '@nestjs/common';
import { CreatePaymentDto, GetPaymentDto } from './dto';

@Injectable()
export class PaymentService {
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

  async getPayment(getPaymentDto: GetPaymentDto) {
    try {
      const data = fetch(
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

      return data;
    } catch (error) {
      throw new Error('Ошибка при получении платежа');
    }
  }
}
