import response from '@/shared/helpers/response';
import { Body, Controller, Headers, Post, Req } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import { WebhookService } from './webhook.service';
import logger from '@/shared/helpers/logger';
import { WEBHOOK_EVENTS } from '@/shared/constants/constants';
import { RawBodyRequest } from '@nestjs/common';
import { Request } from 'express';

@Controller('webhook')
export class WebhookController {
  constructor(
    private readonly configService: ConfigService,
    private readonly webhookService: WebhookService,
  ) {}

  @Post('razorpay')
  async handleRazorpayWebhook(
    @Req() req: RawBodyRequest<Request>,
    @Body() payload: any,
    @Headers('x-razorpay-signature') razorpaySignature: string,
  ) {
    try {
      const secret = this.configService.get<string>('RAZORPAY_WEBHOOK_SECRET');

      // Verify signature using raw body to match what Razorpay signed
      const shasum = crypto.createHmac('sha256', secret);
      shasum.update(req.rawBody);
      const digest = shasum.digest('hex');

      if (digest !== razorpaySignature) {
        throw new Error('Invalid signature');
      }
      logger.info('Razorpay webhook received:', payload);

      // handle event
      switch (payload.event) {
        case WEBHOOK_EVENTS.PAYMENT_AUTHORIZED:
          await this.webhookService.handleRazorpayPaymentAuthorized(
            payload,
            razorpaySignature,
          );
          break;
        case WEBHOOK_EVENTS.PAYMENT_CAPTURED:
          await this.webhookService.handleRazorpayPaymentCaptured(payload);
          break;
        case WEBHOOK_EVENTS.ORDER_PAID:
          await this.webhookService.handleRazorpayOrderPaid(payload);
          break;
        case WEBHOOK_EVENTS.PAYMENT_FAILED:
          await this.webhookService.handleRazorpayPaymentFailed(payload);
          break;
        case WEBHOOK_EVENTS.PAYMENT_VOIDED:
          await this.webhookService.handleRazorpayPaymentVoided(payload);
          break;
        case WEBHOOK_EVENTS.REFUND_CREATED:
          await this.webhookService.handleRazorpayRefundCreated(payload);
          break;
        case WEBHOOK_EVENTS.REFUND_PROCESSED:
          await this.webhookService.handleRazorpayRefundProcessed(payload);
          break;
        case WEBHOOK_EVENTS.REFUND_FAILED:
          await this.webhookService.handleRazorpayRefundFailed(payload);
          break;
        case WEBHOOK_EVENTS.SUBSCRIPTION_ACTIVATED:
          await this.webhookService.handleSubscriptionActivated(payload);
          break;
        case WEBHOOK_EVENTS.SUBSCRIPTION_CHARGED:
          await this.webhookService.handleSubscriptionCharged(payload);
          break;
        case WEBHOOK_EVENTS.SUBSCRIPTION_CANCELLED:
          await this.webhookService.handleSubscriptionCancelled(payload);
          break;
        case WEBHOOK_EVENTS.SUBSCRIPTION_COMPLETED:
          await this.webhookService.handleSubscriptionCompleted(payload);
          break;
        case WEBHOOK_EVENTS.PAYMENT_FAILED:
          await this.webhookService.handlePaymentFailed(payload);
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
