import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FollowService } from './follow.service';
import response from '@/shared/helpers/response';
import { IRequest } from '@/shared/constants/types';
import { CONSTANT } from '@/shared/constants/message';
import { UUIDValidationPipe } from '@/shared/pipe/uuid.validation.pipe';

@Controller('follow')
export class FollowController {
  constructor(private readonly followService: FollowService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post(':id')
  async follow(
    @Param('id', UUIDValidationPipe) id: string,
    @Req() req: IRequest,
  ) {
    try {
      if (req.user.id === id) {
        return response.badRequest({
          message: 'You cannot follow yourself.',
          data: {},
        });
      }

      const artist = await this.followService.findArtist(id);
      if (!artist) {
        return response.badRequest({
          message: CONSTANT.ERROR.RECORD_NOT_FOUND('Artist'),
          data: {},
        });
      }

      await this.followService.followArtist(req.user.id, id);
      const followerCount = await this.followService.getFollowerCount(id);

      return response.successResponse({
        message: CONSTANT.SUCCESS.SUCCESSFULLY('Followed'),
        data: { isFollowing: true, followerCount },
      });
    } catch (error) {
      return response.failureResponse(error);
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async unfollow(
    @Param('id', UUIDValidationPipe) id: string,
    @Req() req: IRequest,
  ) {
    try {
      await this.followService.unfollowArtist(req.user.id, id);
      const followerCount = await this.followService.getFollowerCount(id);

      return response.successResponse({
        message: CONSTANT.SUCCESS.SUCCESSFULLY('Unfollowed'),
        data: { isFollowing: false, followerCount },
      });
    } catch (error) {
      return response.failureResponse(error);
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('status/:id')
  async status(
    @Param('id', UUIDValidationPipe) id: string,
    @Req() req: IRequest,
  ) {
    try {
      const isSelf = req.user.id === id;
      const [isFollowing, followerCount] = await Promise.all([
        isSelf
          ? Promise.resolve(false)
          : this.followService.isFollowing(req.user.id, id),
        this.followService.getFollowerCount(id),
      ]);

      return response.successResponse({
        message: CONSTANT.SUCCESS.RECORD_FOUND('Follow status'),
        data: { isFollowing, followerCount, isSelf },
      });
    } catch (error) {
      return response.failureResponse(error);
    }
  }
}
