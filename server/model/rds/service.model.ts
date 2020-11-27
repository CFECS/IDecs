import { Column, Entity } from 'typeorm';
import { BaseModel } from './base.model';

@Entity({ name: 'service', orderBy: { createdAt: 'DESC' } })
export class ServiceModel extends BaseModel {
  @Column({ length: 64 })
  name!: string;

  @Column({ length: 256, nullable: true })
  description!: string;

  @Column()
  navId!: string;

  @Column()
  navRootId!: string;
}
