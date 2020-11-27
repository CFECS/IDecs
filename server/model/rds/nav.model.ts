import { Column, Entity } from 'typeorm';
import { BaseModel } from './base.model';

@Entity({ name: 'nav', orderBy: { createdAt: 'DESC' } })
export class NavModel extends BaseModel {
  @Column({ length: 64 })
  name!: string;

  @Column({ length: 256, nullable: true })
  description!: string;

  @Column()
  parentId!: string;

  @Column({ length: 1024, nullable: true })
  page!: string;
}
