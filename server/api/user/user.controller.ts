import { Controller, Delete, Get, Param } from '@nestjs/common';
import { UserModel } from '../../model/rds/user.model';
import { UserService } from './user.service';

@Controller('api/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  getById(@Param('id') id: number): Promise<UserModel | undefined> {
    return this.userService.getById(id);
  }

  @Delete(':id')
  async removeById(@Param('id') id: number): Promise<void> {
    await this.userService.removeById(id);
  }
}
