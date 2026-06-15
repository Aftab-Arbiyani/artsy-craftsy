import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { Follow } from './entities/follow.entity';
import { User } from '@/modules/user/entities/user.entity';
import { USER_TYPE } from '@/shared/constants/enum';

@Injectable()
export class FollowService {
  constructor(
    @InjectRepository(Follow)
    private readonly followRepository: Repository<Follow>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findArtist(id: string): Promise<User | null> {
    const data = await this.userRepository.findOne({
      where: { id, type: USER_TYPE.ARTIST },
      select: { id: true, name: true, type: true },
    });
    return plainToInstance(User, data);
  }

  async followArtist(followerId: string, artistId: string): Promise<void> {
    const existing = await this.followRepository.findOne({
      where: { follower: { id: followerId }, following: { id: artistId } },
      withDeleted: true,
    });

    if (existing) {
      // Restore a previously unfollowed (soft-deleted) record; otherwise no-op.
      if (existing.deleted_at) {
        await this.followRepository.restore(existing.id);
      }
      return;
    }

    await this.followRepository.save({
      follower: { id: followerId },
      following: { id: artistId },
    });
  }

  async unfollowArtist(followerId: string, artistId: string): Promise<void> {
    const existing = await this.followRepository.findOne({
      where: { follower: { id: followerId }, following: { id: artistId } },
    });

    if (existing) {
      await this.followRepository.softDelete(existing.id);
    }
  }

  async isFollowing(followerId: string, artistId: string): Promise<boolean> {
    return this.followRepository.exists({
      where: { follower: { id: followerId }, following: { id: artistId } },
    });
  }

  async getFollowerCount(artistId: string): Promise<number> {
    return this.followRepository.count({
      where: { following: { id: artistId } },
    });
  }
}
