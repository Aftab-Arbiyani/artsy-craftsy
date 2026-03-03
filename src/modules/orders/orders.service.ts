import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { DataSource, In, Not, Repository } from 'typeorm';
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

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
    private readonly razorPayService: RazorPayService,
    private readonly dataSource: DataSource,
  ) {}

  async createOrder(createOrderDto: CreateOrderDto, user: any): Promise<Order> {
    const { items } = createOrderDto;
    const productIds = items.map((item) => item.product);

    const products = await this.productRepository.find({
      where: { id: In(productIds) },
    });

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
      });

      await this.razorPayService.createRefund(order);

      const updatedOrder = await manager.findOne(Order, {
        where: { id: order.id },
      });

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
}
