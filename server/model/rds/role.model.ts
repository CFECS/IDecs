import { Column, Entity } from 'typeorm';
import { BaseModel } from './base.model';

@Entity({ name: 'role', orderBy: { id: 'ASC' } })
export class RoleModel extends BaseModel {
  @Column({ length: 64 })
  name!: string;

  @Column({ length: 256, nullable: true })
  description!: string;
}
