import response from '@/shared/helpers/response';
import { Body, Controller, Headers, Post } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import { WebhookService } from './webhook.service';
import logger from '@/shared/helpers/logger';

@Controller('webhook')
export class WebhookController {
  constructor(
    private readonly configService: ConfigService,
    private readonly webhookService: WebhookService,
  ) {}

  @Post('razorpay')
  async handleRazorpayWebhook(
    @Body() payload: any,
    @Headers('x-razorpay-signature') razorpaySignature: string,
  ) {
    try {
      const secret = this.configService.get<string>('RAZORPAY_WEBHOOK_SECRET');

      // Verify signature
      const shasum = crypto.createHmac('sha256', secret);
      shasum.update(JSON.stringify(payload));
      const digest = shasum.digest('hex');

      if (digest !== razorpaySignature) {
        throw new Error('Invalid signature');
      }
      logger.info('Razorpay webhook received:', payload);

      // handle event
      switch (payload.event) {
        case 'payment.authorized':
          await this.webhookService.handleRazorpayPaymentAuthorized(
            payload,
            razorpaySignature,
          );
          break;
        case 'payment.captured':
          await this.webhookService.handleRazorpayPaymentCaptured(payload);
          break;
        case 'order.paid':
          await this.webhookService.handleRazorpayOrderPaid(payload);
          break;
        case 'payment.failed':
          await this.webhookService.handleRazorpayPaymentFailed(payload);
          break;
        case 'payment.voided':
          await this.webhookService.handleRazorpayPaymentVoided(payload);
          break;
        case 'refund.created':
          await this.webhookService.handleRazorpayRefundCreated(payload);
          break;
        case 'refund.processed':
          await this.webhookService.handleRazorpayRefundProcessed(payload);
          break;
        case 'refund.failed':
          await this.webhookService.handleRazorpayRefundFailed(payload);
          break;
        default:
          logger.error(`Unhandled event type:`, JSON.stringify(payload));

          return response.successResponse({
            message: 'Webhook handled successfully',
            data: {},
          });
      }

      return response.successResponse({
        message: 'Webhook handled successfully',
        data: {},
      });
    } catch (error) {
      return response.failureResponse(error);
    }
  }
}
