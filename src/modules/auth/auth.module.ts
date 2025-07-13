import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { EmailService } from '@/shared/helpers/send-mail';
import { EncryptDecryptService } from '@/shared/helpers/encrypt-decrypt';
import { Otp } from '../otp/entities/otp.entity';
import { Token } from '../token/entities/token.entity';
import { JwtStrategy } from '@/shared/helpers/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { Product } from '../products/entities/product.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Otp, Token, Product]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '12h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, EmailService, EncryptDecryptService, JwtStrategy],
})
export class AuthModule {}
