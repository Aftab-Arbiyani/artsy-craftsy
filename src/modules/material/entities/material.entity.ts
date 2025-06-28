import { Category } from '@/modules/category/entities/category.entity';
import { Product } from '@/modules/products/entities/product.entity';
import { BaseEntity } from '@/shared/base.entity';
import { DEFAULT_STATUS } from '@/shared/constants/enum';
import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';

@Entity()
export class Material extends BaseEntity {
  @ManyToOne(() => Category, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @OneToMany(() => Product, (product) => product.materials)
  products: Product[];

  @Column({ type: 'character varying', length: 100 })
  name: string;

  @Column({
    type: 'enum',
    enum: DEFAULT_STATUS,
    default: DEFAULT_STATUS.ACTIVE,
  })
  status: DEFAULT_STATUS;
}
