import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { DataSource, In, MoreThan, Not, Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { plainToInstance } from 'class-transformer';
import { RazorPayService } from '../razor-pay/razor-pay.service';
import {
  CUSTOM_REQUEST_STATUS,
  ORDER_STATUS,
  PAYMENT_STATUS,
  PRODUCT_STATUS,
} from '@/shared/constants/enum';
import { CartItem } from '../cart/entities/cart-item.entity';
import { Product } from '../products/entities/product.entity';
import { Cart } from '../cart/entities/cart.entity';
import { User } from '../user/entities/user.entity';
import { CreateCustomOrderDto } from './dto/create-custom-order.dto';
import { CustomArt } from '../custom-art/entities/custom-art.entity';
import { QueryParamsDto } from '@/shared/dto/query-params.dto';
import { MarkOrderShippedDto } from './dto/mark-order-shipped.dto';
import { OrderItem } from './entities/order-item.entity';
import { renderFile } from 'ejs';
import { resolve } from 'path';
import { EmailService } from '@/shared/helpers/send-mail';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
    private readonly razorPayService: RazorPayService,
    private readonly dataSource: DataSource,
    private readonly emailService: EmailService,
  ) {}

  async createOrder(createOrderDto: CreateOrderDto, user: any): Promise<Order> {
    const { items } = createOrderDto;
    const productIds = items.map((item) => item.product);

    const products = await this.productRepository.find({
      where: { id: In(productIds), quantity: MoreThan(0) },
    });

    if (!products?.length)
      throw new Error('Insufficient stock for the requested products');

    const cart = await this.cartRepository.findOne({
      where: { user: { id: user.id } },
    });

    createOrderDto.tax_amount = createOrderDto.total_amount * 0.12;

    return await this.dataSource.transaction(async (manager) => {
      const order = plainToInstance(Order, {
        ...createOrderDto,
        user: { id: user.id },
        status: ORDER_STATUS.PENDING,
      });

      const savedOrder = await manager.save(order);

      await manager.update(
        CartItem,
        { product: { id: In(productIds) }, cart: { id: cart.id } },
        { deleted_at: new Date().toISOString() },
      );

      for (const product of products) {
        const orderedItem = items.find((item) => item.product === product.id);
        if (orderedItem) {
          product.quantity = product.quantity - orderedItem.quantity;
          if (product.quantity === 0) product.status = PRODUCT_STATUS.SOLD;
          await manager.save(product);
        }
      }

      const razorpayOrder = await this.razorPayService.createOrder(savedOrder);

      await manager.update(Order, savedOrder.id, {
        razorpay_order_id: razorpayOrder.id,
        razorpay_order: JSON.stringify(razorpayOrder),
      });

      // Return the updated order with razorpay info
      const updatedOrder = await manager.findOne(Order, {
        where: { id: savedOrder.id },
      });

      return plainToInstance(Order, updatedOrder);
    });
  }

  async createCustomOrder(
    createCustomOrderDto: CreateCustomOrderDto,
    user: any,
  ): Promise<Order> {
    createCustomOrderDto.tax_amount = createCustomOrderDto.total_amount * 0.12;

    return await this.dataSource.transaction(async (manager) => {
      const order = plainToInstance(Order, {
        ...createCustomOrderDto,
        user: { id: user.id },
        status: ORDER_STATUS.PENDING,
      });

      const savedOrder = await manager.save(order);

      const razorpayOrder = await this.razorPayService.createOrder(savedOrder);

      await manager.update(Order, savedOrder.id, {
        razorpay_order_id: razorpayOrder.id,
        razorpay_order: JSON.stringify(razorpayOrder),
      });

      await manager.update(CustomArt, createCustomOrderDto.custom_request, {
        status: CUSTOM_REQUEST_STATUS.ORDERED,
      });

      // Return the updated order with razorpay info
      const updatedOrder = await manager.findOne(Order, {
        where: { id: savedOrder.id },
      });

      return plainToInstance(Order, updatedOrder);
    });
  }

  async cancelOrder<
    TOrderId extends string,
    TCancelReason extends string,
    TUser extends User,
  >(
    orderId: TOrderId,
    cancelReason: TCancelReason,
    user: TUser,
  ): Promise<Order> {
    const order = await this.orderRepository.findOne({
      relations: { payment: true },
      where: {
        id: orderId,
        user: { id: user.id },
        payment: { status: PAYMENT_STATUS.SUCCESS },
      },
    });

    if (!order) {
      throw new Error('Order not found');
    }

    const now = new Date();
    const orderCreatedAt = new Date(order.created_at);
    const hoursSinceOrder =
      (now.getTime() - orderCreatedAt.getTime()) / (1000 * 60 * 60);

    if (hoursSinceOrder > 24) {
      throw new Error('Only pending orders can be cancelled within 24 hours');
    }

    return await this.dataSource.transaction(async (manager) => {
      await manager.update(Order, order.id, {
        status: ORDER_STATUS.CANCELLED,
        cancelled_at: new Date().toISOString(),
        cancel_reason: cancelReason,
        refund_amount: order.total_amount * 0.9, // Assuming a 10% cancellation fee
      });

      await this.razorPayService.createRefund(order);

      const updatedOrder = await manager.findOne(Order, {
        relations: { user: true },
        where: { id: order.id },
      });

      await this.sendCancelOrderEmail(updatedOrder);

      return plainToInstance(Order, updatedOrder);
    });
  }

  async getMyOrders(
    queryParamsDto: QueryParamsDto,
    user: User,
  ): Promise<[Order[], number]> {
    const { take, skip, order } = queryParamsDto;

    const [orders, count] = await this.orderRepository.findAndCount({
      relations: { custom_request: true },
      select: {
        id: true,
        order_number: true,
        status: true,
        total_amount: true,
        tracking_number: true,
        created_at: true,
      },
      where: { user: { id: user.id }, status: Not(ORDER_STATUS.PENDING) },
      take: +take,
      skip: +skip,
      order,
    });

    return [orders, count];
  }

  async getOrderDetails(id: string, user: User): Promise<Order> {
    const order = await this.orderRepository.findOne({
      relations: {
        items: { product: { media: true } },
        custom_request: true,
      },
      where: {
        id,
        user: { id: user.id },
      },
    });

    if (!order) {
      throw new Error('Order not found');
    }

    return plainToInstance(Order, order);
  }

  async getAssignedOrders(
    queryParamsDto: QueryParamsDto,
    user: User,
  ): Promise<[Order[], number]> {
    const { take, skip, order } = queryParamsDto;

    const [orders, count] = await this.orderRepository.findAndCount({
      relations: { items: { product: { user: true } }, custom_request: true },
      select: {
        id: true,
        order_number: true,
        status: true,
        total_amount: true,
        tracking_number: true,
        shipped_at: true,
        created_at: true,
        custom_request: {
          id: true,
        },
        items: { product: { id: true, user: { id: true } } },
      },
      where: [
        {
          items: { product: { user: { id: user.id } } },
          status: Not(ORDER_STATUS.PENDING),
        },
        {
          custom_request: { artist: { id: user.id } },
          status: Not(ORDER_STATUS.PENDING),
        },
      ],
      take: +take,
      skip: +skip,
      order,
    });

    return [plainToInstance(Order, orders), count];
  }

  async getAssignedOrderDetails(id: string, user: User): Promise<Order> {
    const order = await this.orderRepository.findOne({
      relations: {
        items: { product: { user: true, media: true } },
        custom_request: { artist: true },
      },
      where: [
        {
          id,
          items: { product: { user: { id: user.id } } },
        },
        {
          id,
          custom_request: { artist: { id: user.id } },
        },
      ],
    });

    if (!order) {
      throw new Error('Order not found');
    }

    let amountReceivable = 0;

    if (
      [
        ORDER_STATUS.CONFIRMED,
        ORDER_STATUS.DELIVERED,
        ORDER_STATUS.SHIPPED,
        ORDER_STATUS.PROCESSING,
      ].includes(order.status)
    ) {
      if (order?.items?.length) {
        amountReceivable = order.items.reduce((total, item) => {
          const product = item.product;
          const itemAmount =
            (product.amount_receivable || product.listing_price) *
            item.quantity;
          return total + itemAmount;
        }, 0);
      } else if (
        order.custom_request &&
        order.custom_request.status === CUSTOM_REQUEST_STATUS.ORDERED
      ) {
        amountReceivable = Number(order.custom_request.amount_receivable);
      }
    }

    Object.assign(order, { amount_receivable: amountReceivable });
    return plainToInstance(Order, order);
  }

  async markOrderShipped(markOrderShippedDto: MarkOrderShippedDto) {
    const {
      order,
      courier_reciept,
      tracking_number,
      courier_name,
      items = [],
    } = markOrderShippedDto;

    const orderData = await this.orderRepository.findOne({
      where: { id: order },
    });

    if (!orderData) {
      throw new Error('Order not found');
    }

    await this.orderRepository.update(order, {
      status: ORDER_STATUS.SHIPPED,
    });

    if (items.length) {
      await this.orderItemRepository.update(
        { id: In(items) },
        {
          status: ORDER_STATUS.SHIPPED,
          courier_reciept,
          tracking_number,
          courier_name,
          shipped_at: new Date().toISOString(),
        },
      );
    }
  }

  async markCustomOrderShipped(markOrderShippedDto: MarkOrderShippedDto) {
    const { order, courier_reciept, tracking_number, courier_name } =
      markOrderShippedDto;

    const orderData = await this.orderRepository.findOne({
      where: { id: order },
    });

    if (!orderData) {
      throw new Error('Order not found');
    }

    await this.orderRepository.update(order, {
      status: ORDER_STATUS.SHIPPED,
      shipped_at: new Date().toISOString(),
      courier_reciept: courier_reciept,
      tracking_number: tracking_number,
      courier_name: courier_name,
    });
  }

  async sendCancelOrderEmail(order: Order) {
    const ejsTemplate = await renderFile(
      resolve(
        __dirname,
        `../../../src/shared/ejs-templates/order-cancelled.ejs`,
      ),
      {
        name: order.user.name,
        orderId: order.order_number,
        refundAmount: order.refund_amount,
      },
    );

    await this.emailService.sendMail({
      to: order.user.email,
      subject: 'Order Cancelled - Art & Craft Studio',
      html: ejsTemplate,
    });
  }
}
