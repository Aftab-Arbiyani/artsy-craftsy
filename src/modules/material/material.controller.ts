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
import { MaterialService } from './material.service';
import { CreateMaterialDto } from './dto/create-material.dto';
import { UpdateMaterialDto } from './dto/update-material.dto';
import response from '@/shared/helpers/response';
import { CONSTANT } from '@/shared/constants/message';
import { QueryParamsDto } from '@/shared/dto/query-params.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('material')
export class MaterialController {
  constructor(private readonly materialService: MaterialService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(@Body() createMaterialDto: CreateMaterialDto) {
    try {
      const material = await this.materialService.create(createMaterialDto);
      return response.successResponse({
        message: CONSTANT.SUCCESS.RECORD_CREATED('Material'),
        data: material,
      });
    } catch (error) {
      return response.failureResponse(error);
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('dropdown/:id')
  async getDropdown(@Param('id') id: string) {
    try {
      const [materials] = await this.materialService.findAll({
        where: { category: { id } },
        select: {
          id: true,
          name: true,
        },
      });

      return response.successResponse({
        message: CONSTANT.SUCCESS.RECORD_FOUND('Materials'),
        data: materials,
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
      const [data, count] = await this.materialService.findAll({
        where: {},
        take: +take,
        skip: +skip,
        order,
      });

      return response.successResponseWithPagination({
        message: CONSTANT.SUCCESS.RECORD_FOUND('Materials'),
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
      const material = await this.materialService.findOne({ where: { id } });
      if (!material) {
        return response.badRequest({
          message: CONSTANT.ERROR.RECORD_NOT_FOUND('Material'),
          data: {},
        });
      }
      return response.successResponse({
        message: CONSTANT.SUCCESS.RECORD_FOUND('Material'),
        data: material,
      });
    } catch (error) {
      return response.failureResponse(error);
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateMaterialDto: UpdateMaterialDto,
  ) {
    try {
      const material = await this.materialService.findOne({ where: { id } });
      if (!material) {
        return response.badRequest({
          message: CONSTANT.ERROR.RECORD_NOT_FOUND('Material'),
          data: {},
        });
      }
      const updated = await this.materialService.update(id, updateMaterialDto);
      return response.successResponse({
        message: CONSTANT.SUCCESS.RECORD_UPDATED('Material'),
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
      const material = await this.materialService.findOne({ where: { id } });
      if (!material) {
        return response.badRequest({
          message: CONSTANT.ERROR.RECORD_NOT_FOUND('Material'),
          data: {},
        });
      }
      await this.materialService.remove(id);
      return response.successResponse({
        message: CONSTANT.SUCCESS.RECORD_DELETED('Material'),
        data: {},
      });
    } catch (error) {
      return response.failureResponse(error);
    }
  }
}
