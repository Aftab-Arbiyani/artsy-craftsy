import { Admin } from '@/modules/admin/entities/admin.entity';
import { User } from '@/modules/user/entities/user.entity';
import { BaseEntity } from '@/shared/base.entity';
import { DEVICE_TYPE } from '@/shared/constants/enum';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity()
export class Token extends BaseEntity {
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Admin, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'admin_id' })
  admin: Admin;

  @Column({ type: 'text' })
  jwt: string;

  @Column({ type: 'character varying', nullable: true })
  device_id: string;

  @Column({ type: 'character varying', nullable: true })
  device_name: string;

  @Column({ type: 'enum', enum: DEVICE_TYPE, nullable: true })
  device_type: DEVICE_TYPE;

  @Column({ type: 'timestamp with time zone', nullable: true })
  login_at: string;

  @Column({ type: 'timestamp with time zone', nullable: true })
  logout_at: string;
}
