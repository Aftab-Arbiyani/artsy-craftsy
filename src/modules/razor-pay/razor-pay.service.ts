import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Order } from '../orders/entities/order.entity';
import { ConfigService } from '@nestjs/config';
import Razorpay from 'razorpay';
import axios from 'axios';

@Injectable()
export class RazorPayService {
  private razorpay: Razorpay;

  constructor(private readonly configService: ConfigService) {
    this.razorpay = new Razorpay({
      key_id: this.configService.get<string>('RAZORPAY_KEY_ID'),
      key_secret: this.configService.get<string>('RAZORPAY_KEY_SECRET'),
    });
  }

  private get authHeader() {
    const key = this.configService.get('RAZORPAY_KEY_ID');
    const secret = this.configService.get('RAZORPAY_KEY_SECRET');
    // Razorpay uses Basic Auth: 'key_id:key_secret' encoded in base64
    const auth = Buffer.from(`${key}:${secret}`).toString('base64');
    return {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/json',
    };
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

  async createContact(data: {
    name: string;
    email?: string;
    type?: string;
  }): Promise<any> {
    try {
      const response = await axios.post(
        'https://api.razorpay.com/v1/contacts',
        {
          name: data.name,
          email: data.email,
          type: data.type || 'employee',
          reference_id: `ref_${Date.now()}`, // Optional but recommended
        },
        { headers: this.authHeader },
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data?.error?.description ||
          'Razorpay Contact Creation Failed',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async createFundAccount(data: {
    contact_id: string;
    account_type: string;
    bank_account: {
      name: string;
      ifsc: string;
      account_number: string;
    };
  }): Promise<any> {
    try {
      const response = await axios.post(
        'https://api.razorpay.com/v1/fund_accounts',
        {
          contact_id: data.contact_id,
          account_type: 'bank_account',
          bank_account: {
            name: data.bank_account.name,
            ifsc: data.bank_account.ifsc,
            account_number: data.bank_account.account_number,
          },
        },
        { headers: this.authHeader },
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data?.error?.description ||
          'Razorpay Fund Account Failed',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getFundAccount(fundAccountId: string): Promise<any> {
    try {
      const response = await axios.get(
        `https://api.razorpay.com/v1/fund_accounts/${fundAccountId}`,
        { headers: this.authHeader },
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data?.error?.description || 'Account Retrieval Failed',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async createRefund(order: Order, currency = 'INR') {
    const payment = order?.payment || null;
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
