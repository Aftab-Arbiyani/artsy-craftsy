import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import response from '@/shared/helpers/response';
import { CONSTANT } from '@/shared/constants/message';
import { AuthGuard } from '@nestjs/passport';
import { IRequest } from '@/shared/constants/types';
import { In, LessThanOrEqual, MoreThanOrEqual, Not } from 'typeorm';
import { FilterProductsDto } from './dto/filter-products.dto';
import { UUIDValidationPipe } from '@/shared/pipe/uuid.validation.pipe';
import { PRODUCT_STATUS } from '@/shared/constants/enum';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(
    @Body() createProductDto: CreateProductDto,
    @Req() req: IRequest,
  ) {
    try {
      createProductDto.user = req.user.id;
      const product = await this.productsService.create(createProductDto);

      return response.successResponse({
        message: CONSTANT.SUCCESS.RECORD_CREATED('Product'),
        data: product,
      });
    } catch (error) {
      return response.failureResponse(error);
    }
  }

  @UseGuards(AuthGuard('jwt'))
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

  @Get('all-products')
  async getAllProducts(@Query() queryParams: FilterProductsDto) {
    const {
      category_id = [],
      orientation = [],
      artist_id = [],
      price_from = 0,
      price_to = 0,
    } = queryParams;
    const where = { status: PRODUCT_STATUS.ACTIVE };

    if (category_id.length) {
      Object.assign(where, { category: { id: In(category_id) } });
    }

    if (orientation.length) {
      Object.assign(where, { orientation: In(orientation) });
    }

    if (artist_id.length) {
      Object.assign(where, { user: { id: In(artist_id) } });
    }

    if (price_from) {
      Object.assign(where, {
        listing_price: MoreThanOrEqual(price_from),
      });
    }

    if (price_to) {
      Object.assign(where, {
        listing_price: LessThanOrEqual(price_to),
      });
    }

    const [data, count] = await this.productsService.findAll({
      relations: { category: true, materials: true, user: true, media: true },
      where: where,
      select: {
        id: true,
        title: true,
        category: { id: true, name: true },
        materials: { id: true, name: true },
        user: { id: true, name: true },
        media: { id: true, file_path: true },
        created_at: true,
        listing_price: true,
        discount: true,
        status: true,
      },
      order: { created_at: 'DESC' },
      take: +queryParams.take,
      skip: +queryParams.skip,
    });

    return response.successResponseWithPagination({
      message: CONSTANT.SUCCESS.RECORD_FOUND('Products'),
      total: count,
      limit: +queryParams.take,
      offset: +queryParams.skip,
      data: data,
    });
  }

  @Get('dashboard')
  async getDashboardProducts() {
    try {
      const [data] = await this.productsService.findAll({
        relations: { category: true, materials: true, user: true, media: true },
        where: {},
        take: 10,
        select: {
          id: true,
          title: true,
          category: { id: true, name: true },
          materials: { id: true, name: true },
          user: { id: true, name: true },
          media: { id: true, file_path: true },
          created_at: true,
          listing_price: true,
          discount: true,
          status: true,
        },
        order: { created_at: 'DESC' },
      });
      return response.successResponse({
        message: CONSTANT.SUCCESS.RECORD_FOUND('Products'),
        data: data,
      });
    } catch (error) {
      return response.failureResponse(error);
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('my-products')
  async getMyProducts(@Req() req: IRequest) {
    try {
      const [data, count] = await this.productsService.findAll({
        relations: { category: true, materials: true, user: true, media: true },
        where: { user: { id: req.user.id } },
        select: {
          id: true,
          title: true,
          category: { id: true, name: true },
          materials: { id: true, name: true },
          user: { id: true, name: true },
          media: { id: true, file_path: true },
          created_at: true,
          listing_price: true,
          discount: true,
          quantity: true,
          height: true,
          width: true,
          depth: true,
          weight: true,
          amount_receivable: true,
          status: true,
        },
        order: { created_at: 'DESC' },
      });

      return response.successResponseWithPagination({
        message: CONSTANT.SUCCESS.RECORD_FOUND('My Products'),
        total: count,
        limit: 10,
        offset: 0,
        data: data,
      });
    } catch (error) {
      return response.failureResponse(error);
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('product-details/:id')
  async getProductDetails(
    @Param('id', UUIDValidationPipe) id: string,
    @Req() req: IRequest,
  ) {
    try {
      const product = await this.productsService.findOne({
        relations: { category: true, materials: true, user: true, media: true },
        where: { id, user: { id: req.user.id } },
      });

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

  @Get(':id')
  async findOne(@Param('id', UUIDValidationPipe) id: string) {
    try {
      const product = await this.productsService.findOne({
        relations: { category: true, materials: true, media: true, user: true },
        where: { id },
      });

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

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  async update(
    @Param('id', UUIDValidationPipe) id: string,
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

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async remove(@Param('id', UUIDValidationPipe) id: string) {
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

  @Get('related-products/:id')
  async getRelatedProducts(@Param('id', UUIDValidationPipe) id: string) {
    try {
      const product = await this.productsService.findOne({
        relations: { category: true, user: true },
        where: { id },
      });

      if (!product) {
        return response.badRequest({
          message: CONSTANT.ERROR.RECORD_NOT_FOUND('Product'),
          data: {},
        });
      }

      const [relatedProducts] = await this.productsService.findAll({
        relations: { user: true, media: true },
        where: { category: { id: product.category.id }, id: Not(id) },
        select: {
          id: true,
          title: true,
          created_at: true,
          user: { id: true, name: true },
          media: { id: true, file_path: true },
        },
        order: { created_at: 'DESC' },
        take: 5,
      });

      const [relatedArtistProducts] = await this.productsService.findAll({
        relations: { user: true, media: true },
        where: { user: { id: product.user.id }, id: Not(id) },
        select: {
          id: true,
          title: true,
          created_at: true,
          user: { id: true, name: true },
          media: { id: true, file_path: true },
        },
        order: { created_at: 'DESC' },
        take: 5,
      });

      return response.successResponse({
        message: CONSTANT.SUCCESS.RECORD_FOUND('Related Products'),
        data: {
          related_products: relatedProducts,
          related_artist_products: relatedArtistProducts,
        },
      });
    } catch (error) {
      return response.failureResponse(error);
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('edit/:id')
  async editProduct(
    @Param('id', UUIDValidationPipe) id: string,
    @Body() updateProductDto: UpdateProductDto,
    @Req() req: IRequest,
  ) {
    try {
      const product = await this.productsService.findOne({
        where: { id, user: { id: req.user.id } },
      });

      if (!product) {
        return response.badRequest({
          message: CONSTANT.ERROR.RECORD_NOT_FOUND('Product'),
          data: {},
        });
      }

      await this.productsService.update(id, updateProductDto);
      return response.successResponse({
        message: CONSTANT.SUCCESS.RECORD_UPDATED('Product'),
        data: {},
      });
    } catch (error) {
      return response.failureResponse(error);
    }
  }
}
