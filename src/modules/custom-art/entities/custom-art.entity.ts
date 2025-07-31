import { User } from '@/modules/user/entities/user.entity';
import { BaseEntity } from '@/shared/base.entity';
import { CUSTOM_REQUEST_STATUS } from '@/shared/constants/enum';
import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';

@Entity()
export class CustomArt extends BaseEntity {
  @Column({ type: 'character varying', length: 50 })
  dimensions: string;

  @Column({ type: 'character varying', default: () => 'generate_request_id()' })
  request_id: string;

  @Column({ type: 'text', nullable: false })
  description: string;

  @Column({ type: 'character varying', nullable: true, length: 50 })
  budget_range: string;

  @Column({ type: 'character varying', nullable: false })
  reference_image: string;

  @Column({ type: 'text', nullable: true })
  reply: string;

  @Column({
    type: 'enum',
    enum: CUSTOM_REQUEST_STATUS,
    default: CUSTOM_REQUEST_STATUS.REQUESTED,
  })
  status: CUSTOM_REQUEST_STATUS;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Index()
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Index()
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'artist_id' })
  artist: User;
}
