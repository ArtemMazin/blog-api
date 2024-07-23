import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto, GetPaymentDto } from './dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  createPayment(@Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentService.createPayment(createPaymentDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('get-payment')
  getPayment(@Body() getPaymentDto: GetPaymentDto) {
    return this.paymentService.getPayment(getPaymentDto);
  }
}
