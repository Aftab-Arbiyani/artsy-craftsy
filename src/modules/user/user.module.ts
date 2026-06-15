import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserAddress } from '../user-address/entities/user-address.entity';
import { FollowModule } from '../follow/follow.module';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserAddress]), FollowModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
