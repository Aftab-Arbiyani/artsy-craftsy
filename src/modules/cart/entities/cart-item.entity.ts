import { BaseEntity } from '@/shared/base.entity';
import { Column, Entity, Index, JoinColumn, ManyToOne, Unique } from 'typeorm';
import { Cart } from './cart.entity';
import { Product } from '@/modules/products/entities/product.entity';

@Entity('cart_items')
@Unique(['cart', 'product'])
export class CartItem extends BaseEntity {
  @Index()
  @ManyToOne(() => Cart, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'cart_id' })
  cart: Cart;

  @Index()
  @ManyToOne(() => Product)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column({ type: 'int', nullable: false })
  quantity: number;

  @Column({ type: 'numeric', precision: 10, scale: 2, nullable: false })
  price: number;
}
