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
import { MaterialService } from './material.service';
import { CreateMaterialDto } from './dto/create-material.dto';
import { UpdateMaterialDto } from './dto/update-material.dto';
import response from '@/shared/helpers/response';
import { CONSTANT } from '@/shared/constants/message';

@Controller('material')
export class MaterialController {
  constructor(private readonly materialService: MaterialService) {}

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

  @Get()
  async findAll(@Query() query: any) {
    try {
      const [data, count] = await this.materialService.findAll({ where: {} });
      return response.successResponseWithPagination({
        message: CONSTANT.SUCCESS.RECORD_FOUND('Materials'),
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
