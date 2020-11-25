import { Column, Entity } from 'typeorm';
import { BaseModel } from './base.model';

@Entity({ name: 'nav', orderBy: { id: 'ASC' } })
export class NavModel extends BaseModel {
  @Column({ length: 64 })
  name!: string;

  @Column({ length: 256, nullable: true })
  description!: string;

  @Column()
  parentId!: number;

  @Column({ length: 1024, nullable: true })
  page!: string;
}
