import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './modules/products/products.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { configuration } from './config/configuration';
import { TypeOrmModule } from '@nestjs/typeorm';
import { database } from './config/database';
import { CategoryModule } from './modules/category/category.module';
import { UserModule } from './modules/user/user.module';
import { UserAddressModule } from './modules/user-address/user-address.module';
import { AuthModule } from './modules/auth/auth.module';
import { TokenModule } from './modules/token/token.module';
import { OtpModule } from './modules/otp/otp.module';
import { MaterialModule } from './modules/material/material.module';
import { AdminModule } from './modules/admin/admin.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ResponseInterceptor } from './shared/helpers/response-interceptor';
import { UploadModule } from './modules/upload/upload.module';
import { CustomArtModule } from './modules/custom-art/custom-art.module';
import { CartModule } from './modules/cart/cart.module';
import { AiSuggestionModule } from './modules/ai-suggestion/ai-suggestion.module';
import { OrdersModule } from './modules/orders/orders.module';
import { PaymentModule } from './modules/payment/payment.module';
import { RazorPayService } from './modules/razor-pay/razor-pay.service';
import { WebhookModule } from './modules/webhook/webhook.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env', // Use project root .env file
      load: [configuration],
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => database(configService),
      inject: [ConfigService],
    }),
    ProductsModule,
    CategoryModule,
    UserModule,
    UserAddressModule,
    AuthModule,
    TokenModule,
    OtpModule,
    MaterialModule,
    AdminModule,
    UploadModule,
    CustomArtModule,
    CartModule,
    AiSuggestionModule,
    OrdersModule,
    PaymentModule,
    WebhookModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_INTERCEPTOR, useClass: ResponseInterceptor },
    RazorPayService,
  ],
})
export class AppModule {}
