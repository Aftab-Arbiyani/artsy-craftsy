import { Injectable } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { plainToInstance } from 'class-transformer';
import { Payment } from './entities/payment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, FindOptionsWhere, Repository } from 'typeorm';
import { UpdatePaymentDto } from './dto/update-payment.dto';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment) private paymentRepository: Repository<Payment>,
  ) {}

  async createPayment(createPaymentDto: CreatePaymentDto) {
    const data = await this.paymentRepository.save(
      plainToInstance(Payment, createPaymentDto),
    );
    return plainToInstance(Payment, data);
  }

  async findOneWhere(options: FindOneOptions<Payment>) {
    const data = await this.paymentRepository.findOne(options);
    return plainToInstance(Payment, data);
  }

  async updateWhere(
    options: FindOptionsWhere<Payment>,
    updatePaymentDto: UpdatePaymentDto,
  ) {
    const result = await this.paymentRepository.update(
      options,
      plainToInstance(Payment, updatePaymentDto),
    );

    return result;
  }
}
