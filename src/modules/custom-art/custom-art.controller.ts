import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
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
import { ArtRequestReplyDto } from './dto/art-request-reply.dto';
import { CUSTOM_REQUEST_STATUS } from '@/shared/constants/enum';

@Controller('custom-art')
export class CustomArtController {
  constructor(private readonly customArtService: CustomArtService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(
    @Body() createCustomArtDto: CreateCustomArtDto,
    @Req() req: IRequest,
  ) {
    try {
      createCustomArtDto.user = req.user.id;
      const data = await this.customArtService.create(createCustomArtDto);

      return response.successResponse({
        message: CONSTANT.SUCCESS.CUSTOM_REQUEST_ADDED,
        data: data,
      });
    } catch (error) {
      return response.failureResponse(error);
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('my-requests')
  async findAll(@Query() queryParamsDto: QueryParamsDto, @Req() req: IRequest) {
    try {
      const { take, skip, order } = queryParamsDto;
      const [data, count] = await this.customArtService.findAll({
        select: {
          id: true,
          dimensions: true,
          request_id: true,
          description: true,
          budget_range: true,
          reference_image: true,
          reply: true,
          status: true,
          price: true,
          created_at: true,
        },
        where: { user: { id: req.user.id } },
        take: +take,
        skip: +skip,
        order,
      });

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
  @Patch('reply/:id')
  async replyToRequest(
    @Param('id') id: string,
    @Body() replyDto: ArtRequestReplyDto,
  ) {
    try {
      const request = await this.customArtService.findOne({ where: { id } });

      if (!request) {
        return response.badRequest({
          message: CONSTANT.ERROR.RECORD_NOT_FOUND('Request'),
          data: {},
        });
      }

      await this.customArtService.update(id, {
        ...replyDto,
        status: CUSTOM_REQUEST_STATUS.REPLIED,
      });

      return response.successResponse({
        message: CONSTANT.SUCCESS.SUCCESSFULLY('Quotation sent'),
        data: {},
      });
    } catch (error) {
      return response.failureResponse(error);
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('details/:id')
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
  @Get('assigned-requests')
  async getAssignedRequestToArtists(
    @Query() queryParamsDto: QueryParamsDto,
    @Req() req: IRequest,
  ) {
    try {
      const { take, skip, order } = queryParamsDto;
      const [data, count] = await this.customArtService.findAll({
        where: { artist: { id: req.user.id } },
        take: +take,
        skip: +skip,
        order,
      });

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
