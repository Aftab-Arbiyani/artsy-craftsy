import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, DataSource, FindOneOptions, In, Repository } from 'typeorm';
import { Subscription } from './entities/subscription.entity';
import { SubscriptionPlan } from './entities/subscription-plan.entity';
import { DEFAULT_STATUS, SUBSCRIPTION_STATUS } from '@/shared/constants/enum';
import { plainToInstance } from 'class-transformer';
import { User } from '../user/entities/user.entity';
import { RazorPayService } from '../razor-pay/razor-pay.service';
import { AiSuggestion } from '../ai-suggestion/entities/ai-suggestion.entity';

@Injectable()
export class SubscriptionsService {
  constructor(
    @InjectRepository(Subscription)
    private readonly subscriptionRepository: Repository<Subscription>,
    @InjectRepository(SubscriptionPlan)
    private readonly subscriptionPlanRepository: Repository<SubscriptionPlan>,
    @InjectRepository(AiSuggestion)
    private readonly aiSuggestionRepository: Repository<AiSuggestion>,
    private readonly razorPayService: RazorPayService,
    private readonly dataSource: DataSource,
  ) {}

  async getPlans() {
    const plans = await this.subscriptionPlanRepository.find({
      where: { status: DEFAULT_STATUS.ACTIVE },
    });

    return plainToInstance(SubscriptionPlan, plans);
  }

  async findOne(options: FindOneOptions<SubscriptionPlan>) {
    const plan = await this.subscriptionPlanRepository.findOne(options);
    return plainToInstance(SubscriptionPlan, plan);
  }

  async verifySubscription(body: {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
  }) {
    const subscription = await this.subscriptionRepository.findOne({
      where: {
        razorpay_subscription_id: body.razorpay_order_id,
        status: In([SUBSCRIPTION_STATUS.PAID, SUBSCRIPTION_STATUS.ACTIVE]),
      },
    });

    if (!subscription) {
      return null;
    }

    return { status: 1 };
  }

  async createSubscription(plan: SubscriptionPlan, user: User) {
    const subscription = await this.dataSource.transaction(async (manager) => {
      const razorpaySubscription =
        await this.razorPayService.createSubscription(plan, user);

      const data = await manager.save(
        Subscription,
        plainToInstance(Subscription, {
          razorpay_subscription_id: razorpaySubscription.id,
          user: { id: user.id },
          plan: { id: plan.id },
          start_date: razorpaySubscription.start_at,
          end_date: razorpaySubscription.end_at,
          status: SUBSCRIPTION_STATUS.PENDING,
        }),
      );

      const newData = await manager.findOne(Subscription, {
        where: { id: data.id },
        relations: ['plan', 'user'],
      });
      return plainToInstance(Subscription, newData);
    });

    return subscription;
  }

  async getSubscriptionStatus(userId: string) {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    const subscription = await this.subscriptionRepository.findOne({
      where: {
        user: { id: userId },
        status: In([SUBSCRIPTION_STATUS.PAID, SUBSCRIPTION_STATUS.ACTIVE]),
      },
      relations: ['plan'],
    });

    const generationCount = await this.aiSuggestionRepository.count({
      where: {
        user: { id: userId },
        created_at: Between(startOfMonth, startOfNextMonth),
      },
    });

    if (!subscription) {
      return { is_active: false, free_generations_used: generationCount };
    }

    const subscriptionStartDate = new Date(
      parseInt(subscription.start_date) * 1000,
    );
    const subscriptionEndDate = new Date(
      parseInt(subscription.end_date) * 1000,
    );

    const subscriptionGenerations = await this.aiSuggestionRepository.count({
      where: {
        user: { id: userId },
        created_at: Between(subscriptionStartDate, subscriptionEndDate),
      },
    });

    return {
      is_active: true,
      generation_limit: subscription.plan.generation_limit,
      generations_used: subscriptionGenerations,
    };
  }
}
