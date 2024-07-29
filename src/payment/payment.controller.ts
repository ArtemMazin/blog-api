import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto, GetPaymentDto } from './dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ResponseUserDto } from 'src/users/dto';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  createPayment(@Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentService.createPayment(createPaymentDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('get-payment')
  getPayment(
    @Body() getPaymentDto: GetPaymentDto,
    @Req() req: { user: ResponseUserDto },
  ) {
    return this.paymentService.getPayment(getPaymentDto, req.user);
  }
}
