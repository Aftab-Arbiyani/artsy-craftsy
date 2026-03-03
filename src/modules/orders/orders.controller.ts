import { Controller, Get, Param, Query, Req, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { Post, Body } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { AuthGuard } from '@nestjs/passport';
import response from '@/shared/helpers/response';
import { IRequest } from '@/shared/constants/types';
import { CONSTANT } from '@/shared/constants/message';
import { User } from '../user/entities/user.entity';
import { CreateCustomOrderDto } from './dto/create-custom-order.dto';
import { QueryParamsDto } from '@/shared/dto/query-params.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async createOrder(
    @Body() createOrderDto: CreateOrderDto,
    @Req() req: IRequest,
  ) {
    try {
      const order = await this.ordersService.createOrder(
        createOrderDto,
        req.user,
      );

      return response.successResponse({
        message: CONSTANT.SUCCESS.RECORD_CREATED('Order'),
        data: order,
      });
    } catch (error) {
      return response.failureResponse(error);
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('custom-order')
  async createCustomOrder(
    @Body() createCustomOrderDto: CreateCustomOrderDto,
    @Req() req: IRequest,
  ) {
    try {
      const order = await this.ordersService.createCustomOrder(
        createCustomOrderDto,
        req.user,
      );

      return response.successResponse({
        message: CONSTANT.SUCCESS.RECORD_CREATED('Custom Order'),
        data: order,
      });
    } catch (error) {
      return response.failureResponse(error);
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('cancel-order')
  async cancelOrder(
    @Body('order_id') orderId: string,
    @Body('cancel_reason') cancelReason: string,
    @Req() req: IRequest,
  ) {
    try {
      await this.ordersService.cancelOrder<string, string, User>(
        orderId,
        cancelReason,
        req.user as User,
      );

      return response.successResponse({
        message: CONSTANT.SUCCESS.SUCCESSFULLY('Order cancelled'),
        data: {},
      });
    } catch (error) {
      return response.failureResponse(error);
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('my-orders')
  async getMyOrders(
    @Query() queryParamsDto: QueryParamsDto,
    @Req() req: IRequest,
  ) {
    try {
      const [orders, count] = await this.ordersService.getMyOrders(
        queryParamsDto,
        req.user as User,
      );

      return response.successResponseWithPagination({
        message: CONSTANT.SUCCESS.SUCCESSFULLY('Fetched my orders'),
        total: count,
        limit: +queryParamsDto.take,
        offset: +queryParamsDto.skip,
        data: orders,
      });
    } catch (error) {
      return response.failureResponse(error);
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('details/:id')
  async getOrderDetails(@Param('id') id: string, @Req() req: IRequest) {
    try {
      const order = await this.ordersService.getOrderDetails(
        id,
        req.user as User,
      );

      return response.successResponse({
        message: CONSTANT.SUCCESS.SUCCESSFULLY('Fetched order details'),
        data: order,
      });
    } catch (error) {
      return response.failureResponse(error);
    }
  }
}
