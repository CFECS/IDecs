import { Column, Entity } from 'typeorm';
import { BaseModel } from './base.model';

@Entity({ name: 'service', orderBy: { id: 'ASC' } })
export class ServiceModel extends BaseModel {
  @Column({ length: 64 })
  name!: string;

  @Column({ length: 256, nullable: true })
  description!: string;

  @Column()
  navId!: number;

  @Column()
  navRootId!: number;
}
