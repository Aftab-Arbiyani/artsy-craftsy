import { BaseEntity } from '@/shared/base.entity';
import { User } from '@/modules/user/entities/user.entity';
import { Entity, Index, JoinColumn, ManyToOne } from 'typeorm';

@Entity('follows')
@Index(['follower', 'following'], { unique: true })
export class Follow extends BaseEntity {
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'follower_id' })
  follower: User;

  @Index()
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'following_id' })
  following: User;
}
