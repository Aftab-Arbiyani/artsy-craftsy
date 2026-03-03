import { Injectable } from '@nestjs/common';
import { Order } from '../orders/entities/order.entity';
import { ConfigService } from '@nestjs/config';
import Razorpay from 'razorpay';

@Injectable()
export class RazorPayService {
  private razorpay: Razorpay;

  constructor(private readonly configService: ConfigService) {
    this.razorpay = new Razorpay({
      key_id: this.configService.get<string>('RAZORPAY_KEY_ID'),
      key_secret: this.configService.get<string>('RAZORPAY_KEY_SECRET'),
    });
  }

  async createOrder(order: Order, currency = 'INR') {
    const options = {
      amount: order.total_amount * 100, // Razorpay uses paise
      currency,
      receipt: order.id,
    };

    const razorpayOrder = await this.razorpay.orders.create(options);
    return razorpayOrder;
  }

  async createRefund(order: Order, currency = 'INR') {
    const payment = order?.payment[0] || null;
    const options = {
      amount: order.total_amount * 100 * 0.9, // Refund 90% of total amount in paise
      speed: 'normal',
      currency,
      receipt: order.order_number,
      notes: {
        notes_key_1: order.cancel_reason || 'No reason provided',
      },
    };

    const razorpayRefund = await this.razorpay.payments.refund(
      payment.razorpay_payment_id,
      options,
    );
    return razorpayRefund;
  }
}
