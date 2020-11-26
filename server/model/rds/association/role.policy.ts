import { Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'ass_role_policy' })
export class RolePolicy {
  @PrimaryColumn()
  roleId!: number;

  @PrimaryColumn()
  policyId!: number;
}
