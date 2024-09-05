import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { PaymentService } from './payment.service';
import { CreatePaymentDto, GetPaymentDto, ResponsePaymentDto } from './dto';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { ResponseUserDto } from '../users/dto';

@ApiTags('Платежи')
@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Создать платеж' })
  @ApiResponse({ status: 201, type: ResponsePaymentDto })
  async createPayment(
    @Body() createPaymentDto: CreatePaymentDto,
  ): Promise<ResponsePaymentDto> {
    return this.paymentService.createPayment(createPaymentDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('get-payment')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Получить информацию о платеже' })
  @ApiResponse({ status: 200, type: ResponsePaymentDto })
  async getPayment(
    @Body() getPaymentDto: GetPaymentDto,
    @Req() req: Request & { user: ResponseUserDto },
  ): Promise<ResponsePaymentDto> {
    return this.paymentService.getPayment(getPaymentDto, req.user);
  }
}
