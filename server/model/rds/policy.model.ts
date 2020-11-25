import { Column, Entity } from 'typeorm';
import { BaseModel } from './base.model';

@Entity({ name: 'policy', orderBy: { id: 'ASC' } })
export class PolicyModel extends BaseModel {
  @Column({ length: 128 })
  name!: string;

  @Column({ length: 128 })
  code!: string;

  @Column({ length: 256, nullable: true })
  description!: string;

  @Column()
  serviceId!: number;
}
