import { User } from '@/modules/user/entities/user.entity';
import { BaseEntity } from '@/shared/base.entity';
import { DEFAULT_STATUS, OTP_TYPE } from '@/shared/constants/enum';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity()
export class Otp extends BaseEntity {
  @Column({
    type: 'enum',
    enum: DEFAULT_STATUS,
    default: DEFAULT_STATUS.ACTIVE,
  })
  status: DEFAULT_STATUS;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'integer' })
  otp: number;

  @Column({ type: 'character varying', nullable: true })
  email: string;

  @Column({ type: 'character varying', length: 5, nullable: true })
  country_code: string;

  @Column({ type: 'character varying', length: 15, nullable: true })
  contact_number: string;

  @Column({ type: 'enum', enum: OTP_TYPE })
  type: OTP_TYPE;

  @Column({ type: 'boolean', default: false })
  is_verified: boolean;

  @Column({ type: 'integer' })
  expire_at: number;
}
