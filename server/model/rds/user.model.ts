import { Column, Entity } from 'typeorm';
import { BaseModel } from './base.model';

@Entity('user')
export class UserModel extends BaseModel {
  @Column({ length: 64, nullable: true })
  username!: string;

  @Column({ length: 128, nullable: true })
  email!: string;

  @Column({ length: 16, nullable: true })
  phone!: string;

  @Column({ length: 128, nullable: true })
  password!: string;
}
