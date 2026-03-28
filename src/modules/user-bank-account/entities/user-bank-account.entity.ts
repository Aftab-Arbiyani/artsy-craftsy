import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '@/shared/base.entity';
import { User } from '@/modules/user/entities/user.entity';

@Entity('user_bank_accounts')
export class UserBankAccount extends BaseEntity {
  @Column({ type: 'character varying' })
  razorpay_contact_id: string;

  @Column({ type: 'character varying' })
  razorpay_fund_account_id: string;

  @Column({ type: 'boolean', default: false })
  is_default: boolean;

  @ManyToOne(() => User, (user) => user.bank_accounts, {
    onDelete: 'CASCADE',
    cascade: true,
  })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
