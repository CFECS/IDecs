import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseModel } from './base.model';
import { UserModel } from './user.model';

@Entity({ name: 'project', orderBy: { createdAt: 'DESC' } })
export class ProjectModel extends BaseModel {
  @Column({ length: 64 })
  name!: string;

  @Column({ length: 256, nullable: true })
  description!: string;

  @Column()
  createdById!: string;

  @Column()
  updatedById!: string;

  @ManyToOne(() => UserModel)
  createdBy!: UserModel;

  @ManyToOne(() => UserModel)
  updatedBy!: UserModel;
}
