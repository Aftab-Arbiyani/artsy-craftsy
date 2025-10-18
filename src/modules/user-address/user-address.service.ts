import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { UserAddress } from './entities/user-address.entity';
import { plainToInstance } from 'class-transformer';
import { UpdateUserAddressDto } from './dto/update-user-address.dto';
import { CreateUserAddressDto } from './dto/create-user-address.dto';

@Injectable()
export class UserAddressService {
  constructor(
    @InjectRepository(UserAddress)
    private userAddressRepository: Repository<UserAddress>,
  ) {}

  async findAll(options: FindManyOptions<UserAddress>): Promise<UserAddress[]> {
    const addresses = await this.userAddressRepository.find(options);
    return plainToInstance(UserAddress, addresses);
  }

  async createAddress(createData: CreateUserAddressDto): Promise<UserAddress> {
    const address = await this.userAddressRepository.save(
      plainToInstance(UserAddress, createData),
    );
    return plainToInstance(UserAddress, address);
  }

  async findOneWhere(
    options: FindOneOptions<UserAddress>,
  ): Promise<UserAddress> {
    const address = await this.userAddressRepository.findOne(options);
    return plainToInstance(UserAddress, address);
  }

  async updateAddress(id: string, updateData: UpdateUserAddressDto) {
    const result = await this.userAddressRepository.update(
      id,
      plainToInstance(UserAddress, updateData),
    );
    return result;
  }

  async deleteAddress(id: string) {
    const result = await this.userAddressRepository.softRemove({ id });
    return result;
  }
}
