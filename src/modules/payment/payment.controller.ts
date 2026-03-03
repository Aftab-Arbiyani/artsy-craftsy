import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { VerifyPaymentDto } from './dto/verify-payment.dto';
import response from '@/shared/helpers/response';
import { PaymentService } from './payment.service';
import { PAYMENT_STATUS } from '@/shared/constants/enum';
import { CONSTANT } from '@/shared/constants/message';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('verify-payment')
  async verifyPayment(@Body() verifyPaymentDto: VerifyPaymentDto) {
    try {
      const payment = await this.paymentService.findOneWhere({
        where: {
          razorpay_payment_id: verifyPaymentDto.razorpay_payment_id,
          status: PAYMENT_STATUS.SUCCESS,
        },
      });

      if (!payment) {
        return response.badRequest({
          message: CONSTANT.ERROR.PAYMENT_FAILED,
          data: { success: false },
        });
      }

      return response.successResponse({
        message: CONSTANT.SUCCESS.SUCCESSFULLY('Payment'),
        data: { success: true },
      });
    } catch (error) {
      return response.failureResponse(error);
    }
  }
}
