import { Column, Entity, Index, OneToMany } from 'typeorm';
import { Subscription } from './subscription.entity';
import { BaseEntity } from '@/shared/base.entity';
import { BILLING_CYCLE, DEFAULT_STATUS } from '@/shared/constants/enum';

@Entity('subscription_plans')
export class SubscriptionPlan extends BaseEntity {
  @Column({ type: 'character varying', nullable: false })
  name: string;

  @Column({ type: 'character varying', nullable: true })
  description: string;

  @Column({ type: 'numeric', nullable: false, default: 0 })
  amount: number;

  @Column({
    type: 'enum',
    enum: BILLING_CYCLE,
    nullable: false,
  })
  billing_cycle: BILLING_CYCLE;

  @Column({ type: 'character varying', nullable: false })
  @Index()
  razorpay_plan_id: string;

  @Column({ type: 'integer', nullable: false })
  generation_limit: number;

  @Column({
    type: 'enum',
    enum: DEFAULT_STATUS,
    default: DEFAULT_STATUS.ACTIVE,
  })
  status: DEFAULT_STATUS;

  @OneToMany(() => Subscription, (subscription) => subscription.plan)
  subscriptions: Subscription[];
}
