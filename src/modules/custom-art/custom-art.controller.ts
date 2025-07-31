import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CustomArtService } from './custom-art.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateCustomArtDto } from './dto/create-custom-art.dto';
import response from '@/shared/helpers/response';
import { CONSTANT } from '@/shared/constants/message';
import { UUIDValidationPipe } from '@/shared/pipe/uuid.validation.pipe';
import { QueryParamsDto } from '@/shared/dto/query-params.dto';
import { IRequest } from '@/shared/constants/types';

@Controller('custom-art')
export class CustomArtController {
  constructor(private readonly customArtService: CustomArtService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(@Body() createCustomArtDto: CreateCustomArtDto) {
    try {
      const data = await this.customArtService.create(createCustomArtDto);

      return response.successResponse({
        message: CONSTANT.SUCCESS.CUSTOM_REQUEST_ADDED,
        data: data,
      });
    } catch (error) {
      return response.failureResponse(error);
    }
  }

  @Get()
  async findAll(@Query() queryParamsDto: QueryParamsDto, @Req() req: IRequest) {
    try {
      const { take, skip, order } = queryParamsDto;
      const [data, count] = await this.customArtService.findAll({
        where: { user: { id: req.user.id } },
        take: +take,
        skip: +skip,
        order,
      });

      //send email

      return response.successResponseWithPagination({
        message: CONSTANT.SUCCESS.RECORD_FOUND('Requests'),
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
      const request = await this.customArtService.findOne({ where: { id } });

      if (!request) {
        return response.badRequest({
          message: CONSTANT.ERROR.RECORD_NOT_FOUND('Request'),
          data: {},
        });
      }

      return response.successResponse({
        message: CONSTANT.SUCCESS.RECORD_FOUND('Request'),
        data: request,
      });
    } catch (error) {
      return response.failureResponse(error);
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async remove(@Param('id', UUIDValidationPipe) id: string) {
    try {
      const request = await this.customArtService.findOne({ where: { id } });

      if (!request) {
        return response.badRequest({
          message: CONSTANT.ERROR.RECORD_NOT_FOUND('Request'),
          data: {},
        });
      }

      await this.customArtService.remove(id);

      return response.successResponse({
        message: CONSTANT.SUCCESS.RECORD_DELETED('Request'),
        data: {},
      });
    } catch (error) {
      return response.failureResponse(error);
    }
  }
}
