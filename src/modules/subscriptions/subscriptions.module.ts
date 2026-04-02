import { Module } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { SubscriptionsController } from './subscriptions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubscriptionPlan } from './entities/subscription-plan.entity';
import { Subscription } from './entities/subscription.entity';
import { RazorPayService } from '../razor-pay/razor-pay.service';
import { AiSuggestion } from '../ai-suggestion/entities/ai-suggestion.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Subscription, SubscriptionPlan, AiSuggestion]),
  ],
  controllers: [SubscriptionsController],
  providers: [SubscriptionsService, RazorPayService],
})
export class SubscriptionsModule {}
