import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WebhookController } from './webhook.controller';
import { WebhookService } from './webhook.service';
import { PaymentService } from '../payment/payment.service';
import { Order } from '../orders/entities/order.entity';
import { Payment } from '../payment/entities/payment.entity';
import { OrderItem } from '../orders/entities/order-item.entity';
import { EmailService } from '@/shared/helpers/send-mail';

@Module({
  imports: [TypeOrmModule.forFeature([Order, Payment, OrderItem])],
  controllers: [WebhookController],
  providers: [WebhookService, PaymentService, EmailService],
})
export class WebhookModule {}
