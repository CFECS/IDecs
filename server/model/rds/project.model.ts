import { Column, Entity } from 'typeorm';
import { BaseModel } from './base.model';

@Entity({ name: 'project', orderBy: { id: 'ASC' } })
export class ProjectModel extends BaseModel {
  @Column({ length: 64 })
  name!: string;

  @Column({ length: 256, nullable: true })
  description!: string;

  @Column()
  createdBy!: number;

  @Column()
  updatedBy!: number;

  @Column({ nullable: true })
  deletedBy!: number;
}
