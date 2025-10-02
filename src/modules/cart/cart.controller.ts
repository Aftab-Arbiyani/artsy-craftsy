import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Get,
  Delete,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import response from '@/shared/helpers/response';
import { AuthGuard } from '@nestjs/passport';
import { IRequest } from '@/shared/constants/types';
import { CONSTANT } from '@/shared/constants/message';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('add-item')
  async addItemToCart(
    @Body() createCartDto: CreateCartDto,
    @Req() req: IRequest,
  ) {
    try {
      const { user } = req;
      const cart = await this.cartService.addItemToCart(createCartDto, user.id);
      return response.successResponse({
        message: CONSTANT.SUCCESS.RECORD_ADDED('Item'),
        data: cart,
      });
    } catch (error) {
      return response.failureResponse(error);
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('remove-item')
  async removeItemFromCart(
    @Body() createCartDto: CreateCartDto,
    @Req() req: IRequest,
  ) {
    try {
      const { user } = req;
      const cart = await this.cartService.removeItemFromCart(
        createCartDto,
        user.id,
      );
      return response.successResponse({
        message: CONSTANT.SUCCESS.RECORD_DELETED('Item'),
        data: cart,
      });
    } catch (error) {
      return response.failureResponse(error);
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('items')
  async getCartByUserId(@Req() req: IRequest) {
    try {
      const userId = req.user.id;
      const cart = await this.cartService.getCartItems(userId);
      return response.successResponse({
        message: CONSTANT.SUCCESS.RECORD_FOUND('Cart'),
        data: cart,
      });
    } catch (error) {
      return response.failureResponse(error);
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('items')
  async deleteItemsFromCart(
    @Body() createCartDto: CreateCartDto,
    @Req() req: IRequest,
  ) {
    try {
      const userId = req.user.id;
      const cart = await this.cartService.deleteItemsFromCart(
        createCartDto,
        userId,
      );
      return response.successResponse({
        message: CONSTANT.SUCCESS.RECORD_DELETED('Cart Items'),
        data: cart,
      });
    } catch (error) {
      return response.failureResponse(error);
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('clear')
  async clearCart(@Req() req: IRequest) {
    try {
      const userId = req.user.id;
      await this.cartService.clearCart(userId);
      return response.successResponse({
        message: CONSTANT.SUCCESS.RECORD_DELETED('Cart Items'),
        data: {},
      });
    } catch (error) {
      return response.failureResponse(error);
    }
  }
}
