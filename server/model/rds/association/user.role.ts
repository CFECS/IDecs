import { Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'ass_user_role' })
export class UserRole {
  @PrimaryColumn()
  userId!: number;

  @PrimaryColumn()
  roleId!: number;
}
