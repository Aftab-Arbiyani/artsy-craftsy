import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import response from '@/shared/helpers/response';
import { CONSTANT } from '@/shared/constants/message';
import { AuthGuard } from '@nestjs/passport';
import { DEFAULT_STATUS } from '@/shared/constants/enum';

@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Get('plans')
  async getPlans() {
    try {
      const plans = await this.subscriptionsService.getPlans();

      return response.successResponse({
        message: CONSTANT.SUCCESS.RECORD_FOUND('Subscription Plans'),
        data: plans,
      });
    } catch (error) {
      return response.failureResponse(error);
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('create-order')
  async createSubscription(@Req() req, @Body() body: { plan_id: string }) {
    try {
      const plan = await this.subscriptionsService.findOne({
        where: { id: body.plan_id, status: DEFAULT_STATUS.ACTIVE },
      });

      if (!plan) {
        return response.recordNotFound({
          message: CONSTANT.ERROR.RECORD_NOT_FOUND('Subscription Plan'),
          data: {},
        });
      }

      const order = await this.subscriptionsService.createSubscription(
        plan,
        req.user,
      );

      return response.successResponse({
        message: CONSTANT.SUCCESS.RECORD_CREATED('Subscription Order'),
        data: order,
      });
    } catch (error) {
      return response.failureResponse(error);
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('verify')
  async verifySubscription(@Req() req, @Body() body) {
    try {
      const subscription =
        await this.subscriptionsService.verifySubscription(body);

      if (!subscription) {
        return response.recordNotFound({
          message: CONSTANT.ERROR.RECORD_NOT_FOUND('Subscription'),
          data: {},
        });
      }

      return response.successResponse({
        message: CONSTANT.SUCCESS.RECORD_FOUND('Subscription'),
        data: subscription,
      });
    } catch (error) {
      return response.failureResponse(error);
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('status')
  async getSubscriptionStatus(@Req() req) {
    try {
      const subscription =
        await this.subscriptionsService.getSubscriptionStatus(req.user.id);

      if (!subscription) {
        return response.recordNotFound({
          message: CONSTANT.ERROR.RECORD_NOT_FOUND('Subscription'),
          data: {},
        });
      }

      return response.successResponse({
        message: CONSTANT.SUCCESS.RECORD_FOUND('Subscription'),
        data: subscription,
      });
    } catch (error) {
      return response.failureResponse(error);
    }
  }
}
