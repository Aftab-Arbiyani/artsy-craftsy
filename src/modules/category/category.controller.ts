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
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import response from '@/shared/helpers/response';
import { CONSTANT } from '@/shared/constants/message';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    try {
      const category = await this.categoryService.create(createCategoryDto);

      return response.successResponse({
        message: CONSTANT.SUCCESS.RECORD_CREATED('Category'),
        data: category,
      });
    } catch (error) {
      return response.failureResponse(error);
    }
  }

  @Get()
  async findAll(@Query() query: any) {
    try {
      const [data, count] = await this.categoryService.findAll({ where: {} });

      return response.successResponseWithPagination({
        message: CONSTANT.SUCCESS.RECORD_FOUND('Categories'),
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
      const category = await this.categoryService.findOne({ where: { id } });
      if (!category) {
        return response.badRequest({
          message: CONSTANT.ERROR.RECORD_NOT_FOUND('Category'),
          data: {},
        });
      }

      return response.successResponse({
        message: CONSTANT.SUCCESS.RECORD_FOUND('Category'),
        data: category,
      });
    } catch (error) {
      return response.failureResponse(error);
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    try {
      const category = await this.categoryService.findOne({ where: { id } });

      if (!category) {
        return response.badRequest({
          message: CONSTANT.ERROR.RECORD_NOT_FOUND('Category'),
          data: {},
        });
      }
      const updated = await this.categoryService.update(id, updateCategoryDto);

      return response.successResponse({
        message: CONSTANT.SUCCESS.RECORD_UPDATED('Category'),
        data: updated,
      });
    } catch (error) {
      return response.failureResponse(error);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      const category = await this.categoryService.findOne({ where: { id } });

      if (!category) {
        return response.badRequest({
          message: CONSTANT.ERROR.RECORD_NOT_FOUND('Category'),
          data: {},
        });
      }

      await this.categoryService.remove(id);
      return response.successResponse({
        message: CONSTANT.SUCCESS.RECORD_DELETED('Category'),
        data: {},
      });
    } catch (error) {
      return response.failureResponse(error);
    }
  }
}
