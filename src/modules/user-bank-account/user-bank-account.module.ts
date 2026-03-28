import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserBankAccountService } from './user-bank-account.service';
import { UserBankAccountController } from './user-bank-account.controller';
import { UserBankAccount } from './entities/user-bank-account.entity';
import { RazorPayService } from '../razor-pay/razor-pay.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserBankAccount])],
  controllers: [UserBankAccountController],
  providers: [UserBankAccountService, RazorPayService],
})
export class UserBankAccountModule {}
