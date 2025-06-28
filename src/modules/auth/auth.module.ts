import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { EmailService } from '@/shared/helpers/send-mail';
import { EncryptDecryptService } from '@/shared/helpers/encrypt-decrypt';
import { Otp } from '../otp/entities/otp.entity';
import { Token } from '../token/entities/token.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Otp, Token])],
  controllers: [AuthController],
  providers: [AuthService, EmailService, EncryptDecryptService],
})
export class AuthModule {}
