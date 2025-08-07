import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Repository,
  FindManyOptions,
  FindOneOptions,
  IsNull,
  In,
} from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { plainToInstance } from 'class-transformer';
import { ProductMedia } from './entities/product-media.entity';
import { UploadService } from '../upload/upload.service';

@Injectable()
export class ProductsService {
  constructor(
    private readonly uploadService: UploadService,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(ProductMedia)
    private readonly productMediaRepository: Repository<ProductMedia>,
  ) {}

  async create(createProductDto: CreateProductDto) {
    const result = await this.productRepository.save(
      plainToInstance(Product, createProductDto),
    );

    await this.productMediaRepository.save(
      createProductDto.images.map((media) => ({
        file_path: media,
        product: { id: result.id },
      })),
    );
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

  async update(id: string, updateProductDto: UpdateProductDto) {
    const { deleted_images = [], images = [] } = updateProductDto;

    if (deleted_images.length > 0) {
      delete updateProductDto.deleted_images;
      await this.deleteProductMedia(id, deleted_images);
    }

    if (images.length > 0) {
      delete updateProductDto.images;
      await this.productMediaRepository.save(
        images.map((media) => ({
          file_path: media,
          product: { id: id },
        })),
      );
    }

    await this.productRepository.update(
      id,
      plainToInstance(Product, {
        ...updateProductDto,
        updated_at: new Date().toISOString(),
      }),
    );
    const updatedProduct = await this.productRepository.findOne({
      where: { id },
    });
    return plainToInstance(Product, updatedProduct);
  }

  async deleteProductMedia(id: string, deleted_images: string[]) {
    await this.productMediaRepository.delete({
      file_path: In(deleted_images),
      product: { id },
    });

    deleted_images.forEach((image) => {
      this.uploadService.unlinkIfExist(`${image}`);
    });
  }

  async remove(id: string) {
    const record = await this.productRepository.update(
      { id: id, deleted_at: IsNull() },
      { deleted_at: new Date().toISOString() },
    );
    return record;
  }
}
