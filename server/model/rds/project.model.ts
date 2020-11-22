import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseModel } from './base.model';
import { UserModel } from './user.model';

@Entity({ name: 'project', orderBy: { id: 'ASC' } })
export class ProjectModel extends BaseModel {
  @Column({ length: 64 })
  name!: string;

  @Column({ length: 256, nullable: true })
  description!: string;

  @Column()
  createdById!: number;

  @Column()
  updatedById!: number;

  @ManyToOne(() => UserModel)
  createdBy!: UserModel;

  @ManyToOne(() => UserModel)
  updatedBy!: UserModel;
}
