import { Entity, Column, Index, ManyToOne, JoinColumn } from 'typeorm';
import { SubscriptionPlan } from './subscription-plan.entity';
import { User } from '@/modules/user/entities/user.entity';
import { BaseEntity } from '@/shared/base.entity';
import { SUBSCRIPTION_STATUS } from '@/shared/constants/enum';

@Entity('subscriptions')
export class Subscription extends BaseEntity {
  @Index()
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Index({ unique: true })
  @Column({ type: 'character varying', length: 100 })
  razorpay_subscription_id: string;

  @Index()
  @Column({ type: 'character varying', length: 100, nullable: true })
  razorpay_payment_id: string;

  @Index()
  @Column({ type: 'character varying', length: 100, nullable: true })
  razorpay_invoice_id: string;

  @Column({ type: 'character varying', length: 100, nullable: true })
  email: string;

  @Column({ type: 'character varying', length: 15, nullable: true })
  phone_number: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  amount: number;

  @Index()
  @ManyToOne(() => SubscriptionPlan, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'plan_id' })
  plan: SubscriptionPlan;

  @Column({
    type: 'enum',
    enum: SUBSCRIPTION_STATUS,
    default: SUBSCRIPTION_STATUS.PENDING,
  })
  status: SUBSCRIPTION_STATUS;

  @Column({ type: 'character varying', nullable: true })
  payment_method: string;

  @Column({ type: 'bigint', nullable: true })
  cancelled_at: string;

  @Column({ type: 'bigint', nullable: true })
  start_date: string;

  @Column({ type: 'bigint', nullable: true })
  end_date: string;

  @Column({ type: 'text', nullable: true })
  error_description: string;

  @Column({ type: 'text', nullable: true })
  error_step: string;

  @Column({ type: 'json', nullable: true })
  razorpay_response: string;
}
