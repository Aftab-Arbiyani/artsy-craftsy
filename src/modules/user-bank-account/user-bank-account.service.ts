import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { UserBankAccount } from './entities/user-bank-account.entity';

@Injectable()
export class UserBankAccountService {
  constructor(
    @InjectRepository(UserBankAccount)
    private bankAccountRepository: Repository<UserBankAccount>,
  ) {}

  async findAll(
    options: FindManyOptions<UserBankAccount>,
  ): Promise<UserBankAccount[]> {
    return this.bankAccountRepository.find(options);
  }

  async findOneWhere(
    options: FindOneOptions<UserBankAccount>,
  ): Promise<UserBankAccount> {
    return this.bankAccountRepository.findOne(options);
  }

  async create(
    userId: string,
    razorpayContactId: string,
    razorpayFundAccountId: string,
    isDefault: boolean,
  ): Promise<UserBankAccount> {
    if (isDefault) {
      await this.bankAccountRepository.update(
        { user: { id: userId }, is_default: true },
        { is_default: false },
      );
    }

    const account = this.bankAccountRepository.create({
      user: plainToInstance(UserBankAccount, { id: userId }),
      razorpay_contact_id: razorpayContactId,
      razorpay_fund_account_id: razorpayFundAccountId,
      is_default: isDefault ?? false,
    });

    return this.bankAccountRepository.save(account);
  }

  async setDefault(id: string, userId: string): Promise<void> {
    await this.bankAccountRepository.update(
      { user: { id: userId }, is_default: true },
      { is_default: false },
    );
    await this.bankAccountRepository.update(id, { is_default: true });
  }

  async updateAccount(
    id: string,
    razorpayContactId: string,
    razorpayFundAccountId: string,
  ): Promise<void> {
    await this.bankAccountRepository.update(id, {
      razorpay_contact_id: razorpayContactId,
      razorpay_fund_account_id: razorpayFundAccountId,
    });
  }

  async delete(id: string): Promise<void> {
    await this.bankAccountRepository.softRemove({ id });
  }
}
