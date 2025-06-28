import { BaseEntity } from '@/shared/base.entity';
import { Entity, Column, OneToMany } from 'typeorm';
import { DEFAULT_STATUS } from '@/shared/constants/enum';
import { Token } from '@/modules/token/entities/token.entity';

@Entity()
export class Admin extends BaseEntity {
  @Column({ type: 'character varying', length: 100 })
  name: string;

  @Column({ type: 'character varying', unique: true })
  email: string;

  @Column({ type: 'character varying' })
  password: string;

  @Column({ type: 'character varying', nullable: true })
  phone_number: string;

  @Column({
    type: 'enum',
    enum: DEFAULT_STATUS,
    default: DEFAULT_STATUS.ACTIVE,
  })
  status: DEFAULT_STATUS;

  @OneToMany(() => Token, (token) => token.admin)
  tokens: Token[];
}
