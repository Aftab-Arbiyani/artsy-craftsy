import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserAddressService } from './user-address.service';
import { UUIDValidationPipe } from '@/shared/pipe/uuid.validation.pipe';
import { AuthGuard } from '@nestjs/passport';
import response from '@/shared/helpers/response';
import { CONSTANT } from '@/shared/constants/message';
import { UpdateUserAddressDto } from './dto/update-user-address.dto';
import { CreateUserAddressDto } from './dto/create-user-address.dto';
import { IRequest } from '@/shared/constants/types';

@Controller('user-address')
export class UserAddressController {
  constructor(private readonly userAddressService: UserAddressService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async getAllAddresses(@Req() req: IRequest) {
    try {
      const userId = req.user.id;
      const addresses = await this.userAddressService.findAll({
        where: { user: { id: userId } },
      });
      return response.successResponse({
        message: CONSTANT.SUCCESS.RECORD_FOUND('Address'),
        data: addresses,
      });
    } catch (error) {
      return response.failureResponse(error);
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async createAddress(
    @Body() createUserAddressDto: CreateUserAddressDto,
    @Req() req: IRequest,
  ) {
    try {
      createUserAddressDto.user = req.user.id;
      const newAddress =
        await this.userAddressService.createAddress(createUserAddressDto);
      return response.successResponse({
        message: CONSTANT.SUCCESS.RECORD_CREATED('Address'),
        data: newAddress,
      });
    } catch (error) {
      return response.failureResponse(error);
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  async updateAddress(
    @Param('id', UUIDValidationPipe) id: string,
    @Body() updateUserAddressDto: UpdateUserAddressDto,
  ) {
    try {
      const address = await this.userAddressService.findOneWhere({
        where: { id },
      });

      if (!address) {
        return response.badRequest({
          message: CONSTANT.ERROR.RECORD_NOT_FOUND('Address'),
          data: {},
        });
      }

      const updatedAddress = await this.userAddressService.updateAddress(
        id,
        updateUserAddressDto,
      );
      return response.successResponse({
        message: CONSTANT.SUCCESS.RECORD_UPDATED('Address'),
        data: updatedAddress,
      });
    } catch (error) {
      return response.failureResponse(error);
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async deleteAddress(@Param('id', UUIDValidationPipe) id: string) {
    try {
      const address = await this.userAddressService.findOneWhere({
        where: { id },
      });

      if (!address) {
        return response.badRequest({
          message: CONSTANT.ERROR.RECORD_NOT_FOUND('Address'),
          data: {},
        });
      }

      await this.userAddressService.deleteAddress(id);
      return response.successResponse({
        message: CONSTANT.SUCCESS.RECORD_DELETED('Address'),
        data: {},
      });
    } catch (error) {
      return response.failureResponse(error);
    }
  }
}
