import {
  Controller,
  Body,
  Patch,
  UseGuards,
  Req,
  Get,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CompleteProfileDto } from './dto/complete-profile.dto';
import response from '@/shared/helpers/response';
import { AuthGuard } from '@nestjs/passport';
import { IRequest } from '@/shared/constants/types';
import { CONSTANT } from '@/shared/constants/message';
import { USER_TYPE } from '@/shared/constants/enum';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard('jwt'))
  @Patch('complete-profile')
  async completeProfile(
    @Body() completeProfileDto: CompleteProfileDto,
    @Req() req: IRequest,
  ) {
    try {
      const user = await this.userService.findOneWhere({
        where: { id: req.user.id },
      });

      if (!user) {
        return response.badRequest({
          message: CONSTANT.ERROR.RECORD_NOT_FOUND('User'),
          data: {},
        });
      }

      req.user = await this.userService.findOneWhere({
        where: { id: req.user.id },
      });

      await this.userService.completeProfile<
        typeof user,
        typeof completeProfileDto
      >(user, completeProfileDto);

      return response.successResponse({
        message: CONSTANT.SUCCESS.RECORD_UPDATED('User'),
        data: {},
      });
    } catch (error) {
      return response.failureResponse(error);
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async getUserProfile(@Req() req: IRequest) {
    try {
      const user = await this.userService.findOneWhere({
        where: { id: req.user.id },
      });

      if (!user) {
        return response.badRequest({
          message: CONSTANT.ERROR.RECORD_NOT_FOUND('User'),
          data: {},
        });
      }
      const userAddress = await this.userService.findOneAddress({
        where: { user: { id: req.user.id } },
      });

      if (userAddress) {
        Object.assign(user, {
          address: userAddress,
        });
      }

      return response.successResponse({
        message: CONSTANT.SUCCESS.RECORD_FOUND('User'),
        data: user,
      });
    } catch (error) {
      return response.failureResponse(error);
    }
  }

  @Get('artists-dropdown')
  async getArtistsDropdown(
    @Query('take') take: string,
    @Query('skip') skip: string,
  ) {
    try {
      const [artists, count] = await this.userService.findAll({
        where: { type: USER_TYPE.ARTIST },
        select: { id: true, name: true },
        take: +take,
        skip: +skip,
      });

      return response.successResponseWithPagination({
        message: CONSTANT.SUCCESS.RECORD_FOUND('Artists'),
        total: count,
        limit: +take,
        offset: +skip,
        data: artists,
      });
    } catch (error) {
      return response.failureResponse(error);
    }
  }
}
