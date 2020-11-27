import { Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'ass_user_role' })
export class UserRole {
  @PrimaryColumn()
  userId!: string;

  @PrimaryColumn()
  roleId!: string;
}
