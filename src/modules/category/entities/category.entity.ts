import { Product } from '@/modules/products/entities/product.entity';
import { BaseEntity } from '@/shared/base.entity';
import { Material } from '@/modules/material/entities/material.entity';
import { Entity, Column, OneToMany } from 'typeorm';

@Entity()
export class Category extends BaseEntity {
  @Column({ type: 'character varying', unique: true })
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'text', nullable: true })
  image?: string;

  @OneToMany(() => Product, (product) => product.category)
  products: Product[];

  @OneToMany(() => Material, (material) => material.category)
  materials: Material[];
}
