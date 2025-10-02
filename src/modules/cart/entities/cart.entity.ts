import { User } from '@/modules/user/entities/user.entity';
import { BaseEntity } from '@/shared/base.entity';
import { DEFAULT_STATUS } from '@/shared/constants/enum';
import { Entity, Index, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { Column } from 'typeorm';
import { CartItem } from './cart-item.entity';

@Entity('carts')
export class Cart extends BaseEntity {
  @Column({
    type: 'enum',
    enum: DEFAULT_STATUS,
    default: DEFAULT_STATUS.INACTIVE,
  })
  status: DEFAULT_STATUS;

  @Index()
  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => CartItem, (cartItem) => cartItem.cart)
  items: CartItem[];
}
