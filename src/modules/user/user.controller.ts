import {
  Controller,
  Body,
  Patch,
  UseGuards,
  Req,
  Get,
  Query,
  Param,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CompleteProfileDto } from './dto/complete-profile.dto';
import response from '@/shared/helpers/response';
import { AuthGuard } from '@nestjs/passport';
import { IRequest } from '@/shared/constants/types';
import { CONSTANT } from '@/shared/constants/message';
import { ADDRESSTYPE, USER_TYPE } from '@/shared/constants/enum';
import { UUIDValidationPipe } from '@/shared/pipe/uuid.validation.pipe';
import { UpdateProfileDto } from './dto/update-profile.dto';

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
        where: { user: { id: req.user.id }, type: ADDRESSTYPE.HOME },
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
    @Query('take') take: string = '10',
    @Query('skip') skip: string = '0',
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

  @Get('artist-profile/:id')
  async getArtistProfile(@Param('id', UUIDValidationPipe) id: string) {
    try {
      const artist = await this.userService.findOneWhere({
        relations: { addresses: true },
        select: {
          id: true,
          name: true,
          date_of_birth: true,
          bio: true,
          profile_picture: true,
        },
        where: { id },
      });

      if (!artist) {
        return response.badRequest({
          message: CONSTANT.ERROR.RECORD_NOT_FOUND('Artist'),
          data: {},
        });
      }

      return response.successResponse({
        message: CONSTANT.SUCCESS.RECORD_FOUND('Artist'),
        data: artist,
      });
    } catch (error) {
      return response.failureResponse(error);
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('update-profile')
  async updateProfile(
    @Body() updateProfileDto: UpdateProfileDto,
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

      await this.userService.updateProfile(user, updateProfileDto);

      return response.successResponse({
        message: CONSTANT.SUCCESS.RECORD_UPDATED('Profile'),
        data: {},
      });
    } catch (error) {
      return response.failureResponse(error);
    }
  }
}
