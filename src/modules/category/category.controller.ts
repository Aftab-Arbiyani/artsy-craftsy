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
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import response from '@/shared/helpers/response';
import { CONSTANT } from '@/shared/constants/message';
import { QueryParamsDto } from '@/shared/dto/query-params.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @UseGuards(AuthGuard('jwt'))
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

  @UseGuards(AuthGuard('jwt'))
  @Get('dropdown')
  async getDropdown() {
    try {
      const [categories] = await this.categoryService.findAll({
        where: {},
        select: {
          id: true,
          name: true,
        },
      });
      return response.successResponse({
        message: CONSTANT.SUCCESS.RECORD_FOUND('Categories'),
        data: categories,
      });
    } catch (error) {
      return response.failureResponse(error);
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async findAll(@Query() queryParamsDto: QueryParamsDto) {
    try {
      const { take, skip, order } = queryParamsDto;
      const [data, count] = await this.categoryService.findAll({
        where: {},
        take: +take,
        skip: +skip,
        order,
      });

      return response.successResponseWithPagination({
        message: CONSTANT.SUCCESS.RECORD_FOUND('Categories'),
        total: count,
        limit: +take,
        offset: +skip,
        data: data,
      });
    } catch (error) {
      return response.failureResponse(error);
    }
  }

  @UseGuards(AuthGuard('jwt'))
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

  @UseGuards(AuthGuard('jwt'))
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

  @UseGuards(AuthGuard('jwt'))
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
