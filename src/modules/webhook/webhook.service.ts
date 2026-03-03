import { Injectable } from '@nestjs/common';
import { PaymentService } from '../payment/payment.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from '../orders/entities/order.entity';
import { Repository } from 'typeorm';
import {
  ORDER_STATUS,
  PAYMENT_METHOD,
  PAYMENT_STATUS,
  REFUND_STATUS,
} from '@/shared/constants/enum';

@Injectable()
export class WebhookService {
  constructor(
    private readonly paymentService: PaymentService,
    @InjectRepository(Order) private orderRepository: Repository<Order>,
  ) {}

  async handleRazorpayPaymentAuthorized(data: any, razorpaySignature: string) {
    const paymentData = data.payload.payment.entity;

    const order = await this.orderRepository.findOne({
      where: { razorpay_order_id: paymentData.order_id },
    });

    if (!order) {
      throw new Error('Order not found.');
    }

    const createPaymentData = {
      order: { id: order.id },
      amount: paymentData.amount / 100, // Convert from paise to rupees
      payment_method: paymentData.method,
      razorpay_payment_id: paymentData.id,
      created_timestamp: paymentData.created_at,
      razorpay_fees: paymentData.fee / 100,
      razorpay_tax: paymentData.tax / 100,
      status: PAYMENT_STATUS.PROCESSING,
      razorpay_response: JSON.stringify(paymentData),
      razorpay_signature: razorpaySignature,
    };

    if (paymentData.method == PAYMENT_METHOD.CARD) {
      Object.assign(createPaymentData, {
        card_id: paymentData.card_id,
        card_name: paymentData.card.name,
        card_last4: paymentData.card.last4,
        network: paymentData.card.network,
        issuer: paymentData.card.issuer,
        emi: paymentData.card.emi,
      });
    }

    if (paymentData.method == PAYMENT_METHOD.UPI) {
      Object.assign(createPaymentData, {
        vpa: paymentData.vpa,
        bank_rrn: paymentData.acquirer_data.rrn,
        upi_transaction_id: paymentData.acquirer_data.upi_transaction_id,
      });
    }

    if (paymentData.method == PAYMENT_METHOD.NETBANKING) {
      Object.assign(createPaymentData, {
        bank: paymentData.bank,
        bank_transaction_id: paymentData.acquirer_data.bank_transaction_id,
      });
    }

    await this.paymentService.createPayment(createPaymentData);
  }

  async handleRazorpayPaymentCaptured(data: any) {
    const paymentData = data.payload.payment.entity;

    const order = await this.orderRepository.findOne({
      where: { razorpay_order_id: paymentData.order_id },
    });

    if (!order) {
      throw new Error('Order not found.');
    }

    const payment = await this.paymentService.findOneWhere({
      where: { order: { id: order.id }, razorpay_payment_id: paymentData.id },
    });

    await this.paymentService.updateWhere(
      { id: payment.id },
      { status: PAYMENT_STATUS.SUCCESS, captured_at: paymentData.created_at },
    );
  }

  async handleRazorpayPaymentFailed(data: any) {
    const paymentData = data.payload.payment.entity;

    const order = await this.orderRepository.findOne({
      where: { razorpay_order_id: paymentData.order_id },
    });

    if (!order) {
      throw new Error('Order not found.');
    }

    const payment = await this.paymentService.findOneWhere({
      where: { order: { id: order.id }, razorpay_payment_id: paymentData.id },
    });

    //order cancel email
    await this.orderRepository.update(order.id, {
      status: ORDER_STATUS.CANCELLED,
      cancel_reason: 'Payment Failed',
      cancelled_at: new Date().toISOString(),
      updated_at: new Date(),
    });

    await this.paymentService.updateWhere(
      { id: payment.id },
      {
        status: PAYMENT_STATUS.FAILED,
        error_description: paymentData.error_description,
        error_step: paymentData.error_step,
        failed_at: paymentData.created_at,
      },
    );
  }

  async handleRazorpayPaymentVoided(data: any) {
    const paymentData = data.payload.payment.entity;

    const order = await this.orderRepository.findOne({
      where: { razorpay_order_id: paymentData.order_id },
    });

    if (!order) {
      throw new Error('Order not found.');
    }

    const payment = await this.paymentService.findOneWhere({
      where: { order: { id: order.id }, razorpay_payment_id: paymentData.id },
    });

    //order cancel email
    await this.orderRepository.update(order.id, {
      status: ORDER_STATUS.CANCELLED,
      cancel_reason: 'Payment Voided',
      cancelled_at: new Date().toISOString(),
      updated_at: new Date(),
    });

    await this.paymentService.updateWhere(
      { id: payment.id },
      {
        status: PAYMENT_STATUS.VOIDED,
        error_description: paymentData.error_description,
        error_step: paymentData.error_step,
        failed_at: paymentData.created_at,
      },
    );
  }

  async handleRazorpayOrderPaid(data: any) {
    const orderData = data.payload.order.entity;
    const paymentData = data.payload.payment.entity;

    const order = await this.orderRepository.findOne({
      where: { razorpay_order_id: orderData.id },
    });

    if (!order) {
      throw new Error('Order not found.');
    }

    //send email for order confirmed
    await this.orderRepository.update(order.id, {
      status: ORDER_STATUS.CONFIRMED,
      updated_at: new Date(),
    });

    await this.paymentService.updateWhere(
      { order: { id: order.id } },
      {
        razorpay_fees: paymentData.fees / 100,
        razorpay_tax: paymentData.tax / 100,
      },
    );
  }

  async handleRazorpayRefundCreated(data: any) {
    const refundData = data.payload.refund.entity;

    const payment = await this.paymentService.findOneWhere({
      relations: { order: true },
      where: { razorpay_payment_id: refundData.payment_id },
    });

    if (!payment) {
      throw new Error('Payment not found.');
    }

    //send email for refund initiated
    await this.orderRepository.update(
      { id: payment.order.id },
      {
        razorpay_refund_id: refundData.id,
        refund_amount: refundData.amount / 100,
        refunded_at: refundData.created_at,
        refund_status: REFUND_STATUS.INITIATED,
        refund_response: JSON.stringify(refundData),
      },
    );
  }

  async handleRazorpayRefundProcessed(data: any) {
    const refundData = data.payload.refund.entity;

    const payment = await this.paymentService.findOneWhere({
      relations: { order: true },
      where: { razorpay_payment_id: refundData.payment_id },
    });

    if (!payment) {
      throw new Error('Payment not found.');
    }

    //send email for refund processed
    await this.orderRepository.update(
      { id: payment.order.id },
      {
        refund_status: REFUND_STATUS.PROCESSED,
      },
    );
  }

  async handleRazorpayRefundFailed(data: any) {
    const refundData = data.payload.refund.entity;

    const payment = await this.paymentService.findOneWhere({
      relations: { order: true },
      where: { razorpay_payment_id: refundData.payment_id },
    });

    if (!payment) {
      throw new Error('Payment not found.');
    }

    //send email for refund failed
    await this.orderRepository.update(
      { id: payment.order.id },
      {
        refund_status: REFUND_STATUS.FAILED,
      },
    );
  }
}
