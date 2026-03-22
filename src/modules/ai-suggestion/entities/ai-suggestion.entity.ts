import { User } from '@/modules/user/entities/user.entity';
import { BaseEntity } from '@/shared/base.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity()
export class AiSuggestion extends BaseEntity {
  @Column({ type: 'text', nullable: false })
  prompt: string;

  @Column({ type: 'character varying', nullable: true })
  reference_image: string;

  @Column({ type: 'character varying', nullable: true })
  response_image: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
