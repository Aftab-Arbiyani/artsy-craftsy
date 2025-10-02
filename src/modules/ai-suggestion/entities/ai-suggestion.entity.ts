import { BaseEntity } from '@/shared/base.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class AiSuggestion extends BaseEntity {
  @Column({ type: 'text', nullable: false })
  prompt: string;

  @Column({ type: 'character varying', nullable: true })
  reference_image: string;

  @Column({ type: 'character varying', nullable: true })
  response_image: string;
}
