import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { BaseEntity } from '@/shared/base.entity';
import { ADDRESSTYPE } from '@/shared/constants/enum';

@Entity()
export class UserAddress extends BaseEntity {
  @Column({ type: 'character varying', length: 100 })
  name: string;

  @Column({ type: 'character varying', length: 15 })
  phone_number: string;

  @Column({ type: 'character varying' })
  street: string;

  @Column({ type: 'character varying' })
  city: string;

  @Column({ type: 'character varying' })
  state: string;

  @Column({ type: 'character varying' })
  zip_code: string;

  @Column({ type: 'enum', default: ADDRESSTYPE.HOME, enum: ADDRESSTYPE })
  type: ADDRESSTYPE;

  @ManyToOne(() => User, (user) => user.addresses, {
    onDelete: 'CASCADE',
    cascade: true,
  })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
