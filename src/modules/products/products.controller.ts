import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import response from '@/shared/helpers/response';
import { CONSTANT } from '@/shared/constants/message';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  async create(@Body() createProductDto: CreateProductDto) {
    try {
      const product = await this.productsService.create(createProductDto);

      return response.successResponse({
        message: CONSTANT.SUCCESS.RECORD_CREATED('Product'),
        data: product,
      });
    } catch (error) {
      return response.failureResponse(error);
    }
  }

  @Get()
  async findAll(@Query() query: any) {
    try {
      const [data, count] = await this.productsService.findAll({ where: {} });

      return response.successResponseWithPagination({
        message: CONSTANT.SUCCESS.RECORD_FOUND('Products'),
        total: count,
        limit: query.limit,
        offset: query.offset,
        data: data,
      });
    } catch (error) {
      return response.failureResponse(error);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const product = await this.productsService.findOne({ where: { id } });

      if (!product) {
        return response.badRequest({
          message: CONSTANT.ERROR.RECORD_NOT_FOUND('Product'),
          data: {},
        });
      }

      return response.successResponse({
        message: CONSTANT.SUCCESS.RECORD_FOUND('Product'),
        data: product,
      });
    } catch (error) {
      return response.failureResponse(error);
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    try {
      const product = await this.productsService.findOne({ where: { id } });

      if (!product) {
        return response.badRequest({
          message: CONSTANT.ERROR.RECORD_NOT_FOUND('Product'),
          data: {},
        });
      }

      const updated = await this.productsService.update(id, updateProductDto);
      return response.successResponse({
        message: CONSTANT.SUCCESS.RECORD_UPDATED('Product'),
        data: updated,
      });
    } catch (error) {
      return response.failureResponse(error);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      const product = await this.productsService.findOne({ where: { id } });

      if (!product) {
        return response.badRequest({
          message: CONSTANT.ERROR.RECORD_NOT_FOUND('Product'),
          data: {},
        });
      }

      await this.productsService.remove(id);

      return response.successResponse({
        message: CONSTANT.SUCCESS.RECORD_DELETED('Product'),
        data: {},
      });
    } catch (error) {
      return response.failureResponse(error);
    }
  }
}
