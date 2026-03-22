import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { Order } from './order.entity';
import { Product } from '../../products/entities/product.entity';
import { BaseEntity } from '@/shared/base.entity';
import { ORDER_STATUS } from '@/shared/constants/enum';

@Entity('order_items')
export class OrderItem extends BaseEntity {
  @Index()
  @ManyToOne(() => Order, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @Index()
  @ManyToOne(() => Product, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column({ type: 'integer', nullable: false })
  quantity: number;

  @Column({ type: 'enum', enum: ORDER_STATUS, default: ORDER_STATUS.PENDING })
  status: ORDER_STATUS;

  @Column({ type: 'timestamp', nullable: true })
  shipped_at: string;

  @Column({ type: 'character varying', nullable: true })
  courier_name: string;

  @Column({ type: 'character varying', nullable: true })
  tracking_number: string;

  @Column({ type: 'character varying', nullable: true })
  courier_reciept: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  discount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total: number;
}
