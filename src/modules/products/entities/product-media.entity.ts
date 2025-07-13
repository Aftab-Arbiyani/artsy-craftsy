import { BaseEntity } from '@/shared/base.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Product } from './product.entity';

@Entity()
export class ProductMedia extends BaseEntity {
  @Column({ type: 'character varying' })
  file_path: string;

  @ManyToOne(() => Product, (product) => product.media, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product_id' })
  product: Product;
}
