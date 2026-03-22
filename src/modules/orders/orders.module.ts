import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { RazorPayService } from '../razor-pay/razor-pay.service';
import { Product } from '../products/entities/product.entity';
import { Cart } from '../cart/entities/cart.entity';
import { OrderItem } from './entities/order-item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Order, Product, Cart, OrderItem])],
  controllers: [OrdersController],
  providers: [OrdersService, RazorPayService],
})
export class OrdersModule {}
