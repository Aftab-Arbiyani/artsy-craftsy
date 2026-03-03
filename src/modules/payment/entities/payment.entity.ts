import { Order } from '@/modules/orders/entities/order.entity';
import { BaseEntity } from '@/shared/base.entity';
import { PAYMENT_METHOD, PAYMENT_STATUS } from '@/shared/constants/enum';
import { Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { Column } from 'typeorm';

@Entity('payments')
export class Payment extends BaseEntity {
  @ManyToOne(() => Order, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'boolean', default: false })
  international: boolean;

  @Column({ type: 'enum', enum: PAYMENT_METHOD, nullable: false })
  payment_method: PAYMENT_METHOD;

  @Column({ type: 'character varying', length: 100, unique: true })
  upi_transaction_id: string;

  @Column({ type: 'character varying', length: 100, nullable: true })
  bank_transaction_id: string;

  @Index()
  @Column({ type: 'character varying', unique: true })
  razorpay_payment_id: string;

  @Column({ type: 'character varying', nullable: true })
  razorpay_signature: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  razorpay_fees: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  razorpay_tax: number;

  @Column({ type: 'character varying', length: 100, nullable: true })
  bank_rrn: string;

  @Column({ type: 'character varying', length: 100, nullable: true })
  vpa: string;

  @Column({ type: 'character varying', length: 100, nullable: true })
  card_id: string;

  @Column({ type: 'character varying', length: 100, nullable: true })
  card_name: string;

  @Column({ type: 'character varying', length: 4, nullable: true })
  card_last4: string;

  @Column({ type: 'character varying', nullable: true })
  network: string;

  @Column({ type: 'character varying', nullable: true })
  issuer: string;

  @Column({ type: 'boolean', default: false })
  emi: boolean;

  @Column({ type: 'character varying', length: 100, nullable: true })
  bank: string;

  @Column({
    type: 'enum',
    enum: PAYMENT_STATUS,
    default: PAYMENT_STATUS.PROCESSING,
  })
  status: PAYMENT_STATUS;

  @Column({ type: 'json' })
  razorpay_response: string;

  @Column({ type: 'text', nullable: true })
  error_description: string;

  @Column({ type: 'text', nullable: true })
  error_step: string;

  @Column({ type: 'bigint', nullable: true })
  created_timestamp: number;

  @Column({ type: 'bigint', nullable: true })
  captured_at: number;

  @Column({ type: 'bigint', nullable: true })
  failed_at: number;
}
