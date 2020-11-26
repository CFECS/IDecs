import { Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'ass_user_policy' })
export class UserPolicy {
  @PrimaryColumn()
  userId!: number;

  @PrimaryColumn()
  policyId!: number;
}
