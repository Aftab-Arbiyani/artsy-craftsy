import { Category } from '@/modules/category/entities/category.entity';
import { BaseEntity } from '@/shared/base.entity';
import { ORIENTATION, PRODUCT_STATUS } from '@/shared/constants/enum';
import { Material } from '@/modules/material/entities/material.entity';
import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { ProductMedia } from './product-media.entity';
import { User } from '@/modules/user/entities/user.entity';

@Entity()
export class Product extends BaseEntity {
  @Column({ type: 'character varying', length: 255 })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'enum', enum: ORIENTATION })
  orientation: ORIENTATION;

  @Column({ type: 'int', default: 1 })
  quantity: number;

  @Column({ type: 'float' })
  height: number;

  @Column({ type: 'float' })
  width: number;

  @Column({ type: 'float', nullable: true })
  depth: number;

  @Column({ type: 'float', nullable: true })
  weight: number;

  @Column({ type: 'float' })
  tax: number;

  @Column('decimal', { precision: 10, scale: 2 })
  listing_price: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  discount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount_receivable: number;

  @Column({ type: 'boolean', default: false })
  is_copyright_owner: boolean;

  @Column({ type: 'character varying', default: () => 'generate_product_id()' })
  @Index()
  product_number: string;

  @Column({ type: 'character varying' })
  year_of_artwork: string;

  @Index()
  @ManyToOne(() => Category, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @Index()
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Index()
  @ManyToOne(() => Material, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'material_id' })
  materials: Material;

  @OneToMany(() => ProductMedia, (productMedia) => productMedia.product, {
    cascade: true,
  })
  media: ProductMedia[];

  @Column({
    type: 'enum',
    enum: PRODUCT_STATUS,
    default: PRODUCT_STATUS.ACTIVE,
  })
  status: PRODUCT_STATUS;
}
