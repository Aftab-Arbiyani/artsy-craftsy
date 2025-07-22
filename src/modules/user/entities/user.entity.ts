import { BaseEntity } from '@/shared/base.entity';
import { Entity, Column } from 'typeorm';
import { OneToMany } from 'typeorm';
import { UserAddress } from '../../user-address/entities/user-address.entity';
import { Exclude } from 'class-transformer';
import { USER_TYPE } from '@/shared/constants/enum';
import { Token } from '@/modules/token/entities/token.entity';
import { Product } from '@/modules/products/entities/product.entity';
import { CustomArt } from '@/modules/custom-art/entities/custom-art.entity';

@Entity()
export class User extends BaseEntity {
  @Column({ type: 'character varying', length: 100 })
  name: string;

  @Column({ type: 'character varying', unique: true })
  email: string;

  @Exclude()
  @Column({ type: 'character varying' })
  password: string;

  @Column({ type: 'character varying', nullable: true })
  phone_number: string;

  @Column({ type: 'character varying', nullable: true })
  profile_picture: string;

  @Column({ type: 'date', nullable: true })
  date_of_birth: string;

  @Column({ type: 'boolean', default: false })
  is_email_verified: boolean;

  @Column({ type: 'enum', enum: USER_TYPE })
  type: USER_TYPE;

  @Column({ type: 'text', nullable: true })
  bio: string;

  @OneToMany(() => UserAddress, (userAddress) => userAddress.user)
  addresses: UserAddress[];

  @OneToMany(() => Token, (token) => token.user)
  tokens: Token[];

  @OneToMany(() => Product, (product) => product.user)
  products: Product[];

  @OneToMany(() => CustomArt, (customArt) => customArt.user)
  custom_arts: CustomArt[];
}
