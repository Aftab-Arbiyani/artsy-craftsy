import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { Product } from './entities/product.entity';
import { ProductMedia } from './entities/product-media.entity';
import { UploadService } from '../upload/upload.service';
import { Category } from '../category/entities/category.entity';
import { User } from '../user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product, ProductMedia, Category, User])],
  controllers: [ProductsController],
  providers: [ProductsService, UploadService],
})
export class ProductsModule {}
