import { Column, Entity } from 'typeorm';
import { BaseModel } from './base.model';

@Entity({ name: 'policy', orderBy: { createdAt: 'DESC' } })
export class PolicyModel extends BaseModel {
  @Column({ length: 128 })
  name!: string;

  @Column({ length: 128 })
  code!: string;

  @Column({ length: 256, nullable: true })
  description!: string;

  @Column()
  serviceId!: string;
}
