import { Injectable } from '@nestjs/common';
import { CompleteProfileDto } from './dto/complete-profile.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { UserAddress } from '../user-address/entities/user-address.entity';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserAddress)
    private readonly userAddressRepository: Repository<UserAddress>,
  ) {}

  async findOneWhere(options: FindOneOptions<User>): Promise<User | null> {
    const data = await this.userRepository.findOne(options);
    return plainToInstance(User, data);
  }

  async findOneAddress(
    options: FindOneOptions<UserAddress>,
  ): Promise<UserAddress | null> {
    const data = await this.userAddressRepository.findOne(options);
    return plainToInstance(UserAddress, data);
  }

  async completeProfile<
    TUser extends User,
    TProfile extends CompleteProfileDto,
  >(user: TUser, updateUserDto: TProfile) {
    const { name, date_of_birth, phone_number, bio, profile_picture } =
      updateUserDto;
    const { address, state, city, zip_code } = updateUserDto;

    const record = await this.userRepository.update(user.id, {
      name,
      date_of_birth,
      phone_number,
      profile_picture,
      bio,
      updated_at: new Date().toISOString(),
    });

    const existingAddress = await this.userAddressRepository.findOne({
      where: { user: { id: user.id } },
    });

    await this.userAddressRepository.save({
      id: existingAddress ? existingAddress.id : undefined,
      user: { id: user.id },
      name,
      phone_number,
      street: address,
      state,
      city,
      zip_code,
      updated_at: new Date().toISOString(),
    });

    return record;
  }

  async findAll(options: FindManyOptions<User>): Promise<[User[], number]> {
    const [users, count] = await this.userRepository.findAndCount(options);
    return [plainToInstance(User, users), count];
  }
}
