import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions, FindOneOptions, IsNull } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const result = await this.productRepository.save(createProductDto);
    return plainToInstance(Product, result);
  }

  async findAll(
    options: FindManyOptions<Product> = {},
  ): Promise<[Product[], number]> {
    const [list, count] = await this.productRepository.findAndCount(options);
    return [plainToInstance(Product, list), count];
  }

  async findOne(options: FindOneOptions<Product>): Promise<Product> {
    const result = await this.productRepository.findOne(options);
    return plainToInstance(Product, result);
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    await this.productRepository.update(id, {
      ...updateProductDto,
      updated_at: new Date().toISOString(),
    });
    const updatedProduct = await this.productRepository.findOne({
      where: { id },
    });
    return plainToInstance(Product, updatedProduct);
  }

  async remove(id: string) {
    const record = await this.productRepository.update(
      { id: id, deleted_at: IsNull() },
      { deleted_at: new Date().toISOString() },
    );
    return record;
  }
}
