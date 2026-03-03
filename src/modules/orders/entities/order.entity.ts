import { User } from '@/modules/user/entities/user.entity';
import { BaseEntity } from '@/shared/base.entity';
import { ORDER_STATUS, REFUND_STATUS } from '@/shared/constants/enum';
import { Entity, Index, JoinColumn, OneToOne } from 'typeorm';
import { Column, ManyToOne, OneToMany } from 'typeorm';
import { OrderItem } from './order-item.entity';
import { UserAddress } from '@/modules/user-address/entities/user-address.entity';
import { Payment } from '@/modules/payment/entities/payment.entity';
import { CustomArt } from '@/modules/custom-art/entities/custom-art.entity';
import { Exclude } from 'class-transformer';

@Entity('orders')
export class Order extends BaseEntity {
  @Column({ type: 'character varying', default: () => 'generate_order_id()' })
  order_number: string;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  discount_amount: number;

  @Column({ type: 'enum', enum: ORDER_STATUS, default: ORDER_STATUS.PENDING })
  status: ORDER_STATUS;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  tax_amount: number;

  @Column('decimal', { precision: 10, scale: 2 })
  total_amount: number;

  @Column({ type: 'character varying', nullable: true })
  tracking_number: string;

  @Index()
  @ManyToOne(() => User, (user) => user.orders)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => UserAddress, (useraddress) => useraddress.orders)
  @JoinColumn({ name: 'address_id' })
  address: UserAddress;

  @Exclude()
  @Column({ type: 'character varying', nullable: true })
  razorpay_order_id: string;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order, { cascade: true })
  items: OrderItem[];

  @OneToMany(() => Payment, (payment) => payment.order)
  payment: Payment[];

  @Exclude()
  @Column({ type: 'json', nullable: true })
  razorpay_order: string;

  @Exclude()
  @Column({ type: 'json', nullable: true })
  refund_response: string;

  @Column({ type: 'timestamp', nullable: true })
  cancelled_at: string;

  @Column({ type: 'character varying', nullable: true })
  cancel_reason: string;

  @Column({ type: 'timestamp', nullable: true })
  completed_at: string;

  @Column({ type: 'timestamp', nullable: true })
  refunded_at: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  refund_amount: number;

  @Exclude()
  @Column({ type: 'character varying', nullable: true })
  razorpay_refund_id: string;

  @Column({ type: 'enum', enum: REFUND_STATUS, nullable: true })
  refund_status: REFUND_STATUS;

  @Index()
  @OneToOne(() => CustomArt, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'custom_request_id' })
  custom_request: CustomArt;
}
