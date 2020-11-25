import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleDao } from '../../dao/role.dao';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';

@Module({
  imports: [TypeOrmModule.forFeature([RoleDao])],
  controllers: [RoleController],
  providers: [RoleService],
})
export class RoleModule {}
