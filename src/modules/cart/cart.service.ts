import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOneOptions, MoreThanOrEqual } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cart-item.entity';
import { CreateCartDto } from './dto/create-cart.dto';
import { PRODUCT_STATUS } from '@/shared/constants/enum';
import { Product } from '../products/entities/product.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart) private readonly cartRepository: Repository<Cart>,
    @InjectRepository(CartItem)
    private readonly cartItemRepository: Repository<CartItem>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async findOneWhere(options: FindOneOptions<Cart>): Promise<Cart> {
    const cart = await this.cartRepository.findOne(options);
    return plainToInstance(Cart, cart);
  }

  async getCartItem(cartId: string, productId: string): Promise<CartItem> {
    const item = await this.cartItemRepository.findOne({
      where: { cart: { id: cartId }, product: { id: productId } },
    });
    return plainToInstance(CartItem, item);
  }

  async findOneProduct(options: FindOneOptions<Product>): Promise<Product> {
    const product = await this.productRepository.findOne(options);
    return plainToInstance(Product, product);
  }

  async addItemToCart(
    createCartDto: CreateCartDto,
    userId: string,
  ): Promise<Cart> {
    const { product } = createCartDto;
    let cart = await this.findOneWhere({ where: { user: { id: userId } } });

    if (!cart) {
      cart = await this.cartRepository.save(
        this.cartRepository.create({
          user: { id: userId },
        }),
      );
    }

    let item = await this.getCartItem(cart.id, product);
    const productDetails = await this.findOneProduct({
      where: {
        id: product,
        status: PRODUCT_STATUS.ACTIVE,
        quantity: MoreThanOrEqual(1),
      },
    });

    if (item) {
      item.quantity += 1;
    } else {
      item = this.cartItemRepository.create({
        cart: { id: cart.id },
        product: { id: product },
        quantity: 1,
        price: productDetails.listing_price,
      });
    }

    if (
      !productDetails ||
      (productDetails && productDetails.quantity < item.quantity)
    ) {
      throw new BadRequestException(
        `Insufficient stock. Only ${productDetails.quantity} left.`,
      );
    }

    await this.cartItemRepository.save(item);
    return cart;
  }

  async removeItemFromCart(
    createCartDto: CreateCartDto,
    userId: string,
  ): Promise<Cart> {
    const { product } = createCartDto;
    const cart = await this.findOneWhere({ where: { user: { id: userId } } });

    if (!cart) {
      throw new BadRequestException('Item not found in cart');
    }

    const item = await this.getCartItem(cart.id, product);

    if (!item) {
      throw new BadRequestException('Item not found in cart');
    }

    if (item.quantity > 1) {
      item.quantity -= 1;
      await this.cartItemRepository.save(item);
    } else {
      await this.cartItemRepository.remove(item);
    }

    return cart;
  }

  async getCartItems(userId: string): Promise<CartItem[]> {
    const cart = await this.cartRepository.findOne({
      where: { user: { id: userId } },
      select: {
        id: true,
      },
    });

    if (!cart) {
      throw new BadRequestException('Item not found in cart');
    }

    const cartItems = await this.cartItemRepository.find({
      where: { cart: { id: cart.id } },
      relations: {
        product: {
          category: true,
          materials: true,
          media: true,
          user: true,
        },
      },
      select: {
        id: true,
        quantity: true,
        price: true,
        product: {
          id: true,
          title: true,
          orientation: true,
          discount: true,
          width: true,
          height: true,
          category: {
            id: true,
            name: true,
          },
          materials: {
            id: true,
            name: true,
          },
          user: {
            id: true,
            name: true,
          },
        },
      },
    });

    return plainToInstance(CartItem, cartItems);
  }

  async deleteItemsFromCart(
    createCartDto: CreateCartDto,
    userId: string,
  ): Promise<Cart> {
    const cart = await this.findOneWhere({ where: { user: { id: userId } } });

    if (!cart) {
      throw new BadRequestException('Item not found in cart');
    }

    await this.cartItemRepository.delete({
      cart: { id: cart.id },
      product: { id: createCartDto.product },
    });
    return cart;
  }

  async clearCart(userId: string): Promise<void> {
    const cart = await this.findOneWhere({ where: { user: { id: userId } } });

    if (!cart) {
      throw new BadRequestException('Cart is already empty');
    }

    await this.cartItemRepository.delete({ cart: { id: cart.id } });
  }
}
