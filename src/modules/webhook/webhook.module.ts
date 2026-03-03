import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WebhookController } from './webhook.controller';
import { WebhookService } from './webhook.service';
import { PaymentService } from '../payment/payment.service';
import { Order } from '../orders/entities/order.entity';
import { Payment } from '../payment/entities/payment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Order, Payment])],
  controllers: [WebhookController],
  providers: [WebhookService, PaymentService],
})
export class WebhookModule {}
