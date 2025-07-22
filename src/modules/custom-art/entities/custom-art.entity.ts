import { User } from '@/modules/user/entities/user.entity';
import { BaseEntity } from '@/shared/base.entity';
import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';

@Entity()
export class CustomArt extends BaseEntity {
  @Column({ type: 'character varying', length: 50 })
  full_name: string;

  @Column({ type: 'character varying', length: 50 })
  email_address: string;

  @Column({ type: 'character varying', default: () => 'generate_request_id()' })
  request_id: string;

  @Column({ type: 'text', nullable: false })
  description: string;

  @Column({ type: 'character varying', nullable: true, length: 50 })
  budget_range: string;

  @Column({ type: 'character varying', nullable: false })
  reference_image_url: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  @Index()
  user: User;
}
